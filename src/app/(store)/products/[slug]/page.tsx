import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { serializeProduct, serializeProducts } from '@/lib/serialize'
import { ProductView } from '@/components/product/ProductView'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await db.product.findUnique({ where: { slug } })
  if (!product) return { title: 'Produit introuvable' }
  return {
    title:       `${product.name} — Marine et la douceur de l'été`,
    description: product.description ?? undefined,
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

  return <ProductView product={product} related={related} />
}
