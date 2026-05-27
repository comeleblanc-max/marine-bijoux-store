import { Hero } from '@/components/home/Hero'
import { CategoryShowcase } from '@/components/home/CategoryShowcase'
import { ReassuranceBar } from '@/components/home/ReassuranceBar'
import { ProductRow } from '@/components/product/ProductRow'
import { Testimonials } from '@/components/home/Testimonials'
import { NewsletterBanner } from '@/components/home/NewsletterBanner'
import { db } from '@/lib/db'
import { serializeProducts } from '@/lib/serialize'
import { getSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  /* Lecture des produits depuis la base de données */
  const settings = await getSettings()
  const [bestsellersRaw, newArrivalsRaw, lumiereDeteRaw, tileSource] = await Promise.all([
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
  ])

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

  return (
    <>
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

      <Testimonials />

      <NewsletterBanner />
    </>
  )
}
