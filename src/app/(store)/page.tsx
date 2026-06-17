import { Hero } from '@/components/home/Hero'
import { CategoryShowcase } from '@/components/home/CategoryShowcase'
import { ReassuranceBar } from '@/components/home/ReassuranceBar'
import { ProductRow } from '@/components/product/ProductRow'
import { NewsletterBanner } from '@/components/home/NewsletterBanner'
import { HomeReviewsBand } from '@/components/home/HomeReviewsBand'
import { JsonLd } from '@/components/seo/JsonLd'
import { db } from '@/lib/db'
import { serializeProducts } from '@/lib/serialize'
import { getSettings } from '@/lib/settings'

/* Cache ISR : la page est régénérée toutes les 60s.
   L'invalidation est forcée depuis l'admin après chaque sauvegarde. */
export const revalidate = 60

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://marineetladouceurdelete.com'

export default async function HomePage() {
  /* Lecture des produits depuis la base de données */
  const settings = await getSettings()
  const [bestsellersRaw, newArrivalsRaw, lumiereDeteRaw, tileSource, reviewAgg] = await Promise.all([
    db.product.findMany({
      where:   { featured: true, inStock: true },
      orderBy: { createdAt: 'desc' },
      take:    8,
    }),
    db.product.findMany({
      where:   { newArrival: true, inStock: true },
      orderBy: { createdAt: 'desc' },
      take:    8,
    }),
    db.product.findMany({
      where:   { collection: 'lumiere-dete' },
      orderBy: { createdAt: 'desc' },
    }),
    db.product.findMany({
      select: { category: true, collection: true, images: true },
      orderBy: { createdAt: 'desc' },
    }),
    db.review.aggregate({
      where:  { approved: true },
      _avg:   { rating: true },
      _count: { _all: true },
    }),
  ])

  const reviewAvg   = reviewAgg._avg.rating   ?? 0
  const reviewCount = reviewAgg._count._all   ?? 0

  const bestsellers = serializeProducts(bestsellersRaw)
  const newArrivals = serializeProducts(newArrivalsRaw)
  const lumiereDete = serializeProducts(lumiereDeteRaw)

  /* Image de fond pour chaque tuile catégorie */
  const tileImages: Record<string, string | null> = {}
  const tileSlugs = ['lumiere-dete', 'colliers', 'bracelets', 'boucles-doreilles', 'bagues']
  for (const slug of tileSlugs) {
    const isCollection = slug === 'lumiere-dete'
    const found = tileSource.find((p) =>
      isCollection ? p.collection === slug && p.images[0] : p.category === slug && p.images[0]
    )
    tileImages[slug] = found?.images[0] ?? null
  }

  /* JSON-LD Organisation — identifie la marque pour Google (knowledge panel
     potentiel, lien renforcé entre nom de marque et site). */
  const igHandle = settings.contact.instagram?.replace(/^@/, '').trim()
  const sameAs   = [
    igHandle ? `https://www.instagram.com/${igHandle}/` : null,
  ].filter(Boolean) as string[]

  const orgLd = {
    '@context':    'https://schema.org/',
    '@type':       'Organization',
    '@id':         `${BASE}/#organization`,
    name:          "Marine et la douceur de l'été",
    url:           BASE,
    logo:          `${BASE}/logo-marine.png`,
    description:   "Bijoux artisanaux en acier inoxydable inspirés par le soleil, la mer et la douceur de l'été.",
    email:         settings.contact.email,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }

  /* JSON-LD WebSite — aide Google à comprendre la structure du site. */
  const websiteLd = {
    '@context':       'https://schema.org/',
    '@type':          'WebSite',
    '@id':            `${BASE}/#website`,
    url:              BASE,
    name:             "Marine et la douceur de l'été",
    inLanguage:       'fr-FR',
    publisher:        { '@id': `${BASE}/#organization` },
  }

  return (
    <>
      <JsonLd data={orgLd} />
      <JsonLd data={websiteLd} />
      <Hero {...settings.hero} />

      <CategoryShowcase images={tileImages} />

      <ProductRow
        eyebrow="✨ Meilleures ventes"
        title="L'essentiel"
        products={bestsellers}
        href="/collections/all"
      />

      <ReassuranceBar />

      <ProductRow
        eyebrow="☀️ Lumière d'été"
        title="La collection"
        products={lumiereDete}
        href="/collections/lumiere-dete"
        hrefLabel="Voir la collection"
      />

      <ProductRow
        eyebrow="🐚 Dernières arrivées"
        title="Nouveautés"
        products={newArrivals}
        href="/collections/all"
      />

      <HomeReviewsBand average={reviewAvg} count={reviewCount} />

      <NewsletterBanner />
    </>
  )
}
