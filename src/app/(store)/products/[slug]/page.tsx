import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { serializeProduct, serializeProducts } from '@/lib/serialize'
import { ProductView } from '@/components/product/ProductView'
import { JsonLd } from '@/components/seo/JsonLd'

/* Cache ISR par fiche produit (60 s). L'admin invalide à chaque sauvegarde. */
export const revalidate = 60

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://marineetladouceurdelete.com'
const BRAND = "Marine et la douceur de l'été"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await db.product.findUnique({ where: { slug } })
  if (!product) return { title: 'Produit introuvable' }
  return {
    title:       `${product.name} — ${BRAND}`,
    description: product.description ?? undefined,
    alternates:  { canonical: `${BASE}/products/${slug}` },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params

  const raw = await db.product.findUnique({ where: { slug } })
  if (!raw) notFound()

  const product = serializeProduct(raw)

  /* Produits liés : même catégorie ou même collection */
  const relatedRaw = await db.product.findMany({
    where: {
      id:   { not: raw.id },
      OR: [
        { category:   raw.category },
        { collection: raw.collection ?? undefined },
      ],
    },
    take: 6,
  })
  const related = serializeProducts(relatedRaw)

  /* Avis approuvés — pour le balisage Schema.org (étoiles dans Google) */
  const reviews = await db.review.findMany({
    where:   { productId: raw.id, approved: true },
    orderBy: { createdAt: 'desc' },
    select:  { name: true, rating: true, comment: true, createdAt: true },
    take:    50,
  })
  const reviewCount = reviews.length
  const ratingValue = reviewCount
    ? Number((reviews.reduce((s, r) => s + r.rating, 0) / reviewCount).toFixed(2))
    : 0

  /* JSON-LD Product — déclenche les ⭐ dans les résultats Google */
  const absoluteImages = product.images.map((img: string) =>
    img.startsWith('http') ? img : `${BASE}${img}`,
  )
  const productLd: Record<string, unknown> = {
    '@context':   'https://schema.org/',
    '@type':      'Product',
    name:         product.name,
    image:        absoluteImages,
    description:  product.description ?? `${product.name} — bijou artisanal en acier inoxydable.`,
    sku:          product.id,
    brand:        { '@type': 'Brand', name: BRAND },
    offers: {
      '@type':        'Offer',
      url:            `${BASE}/products/${product.slug}`,
      priceCurrency:  'EUR',
      price:          product.price.toFixed(2),
      availability:   product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition:  'https://schema.org/NewCondition',
    },
  }

  if (reviewCount > 0) {
    productLd.aggregateRating = {
      '@type':      'AggregateRating',
      ratingValue:  ratingValue.toString(),
      reviewCount:  reviewCount.toString(),
      bestRating:   '5',
      worstRating:  '1',
    }
    productLd.review = reviews.slice(0, 10).map((r) => ({
      '@type':         'Review',
      author:          { '@type': 'Person', name: r.name },
      datePublished:   r.createdAt.toISOString().slice(0, 10),
      reviewBody:      r.comment,
      reviewRating: {
        '@type':      'Rating',
        ratingValue:  r.rating.toString(),
        bestRating:   '5',
        worstRating:  '1',
      },
    }))
  }

  return (
    <>
      <JsonLd data={productLd} />
      <ProductView product={product} related={related} />
    </>
  )
}
