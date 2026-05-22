import { Hero } from '@/components/home/Hero'
import { CategoryShowcase } from '@/components/home/CategoryShowcase'
import { ReassuranceBar } from '@/components/home/ReassuranceBar'
import { ProductRow } from '@/components/product/ProductRow'
import { BrandStory } from '@/components/home/BrandStory'
import { Testimonials } from '@/components/home/Testimonials'
import { NewsletterBanner } from '@/components/home/NewsletterBanner'
import { PRODUCTS } from '@/lib/data'

export default function HomePage() {
  const bestsellers = PRODUCTS.filter((p) => p.featured).slice(0, 8)
  const newArrivals = PRODUCTS.filter((p) => p.newArrival).slice(0, 8)
  const lumiereDete = PRODUCTS.filter((p) => p.collection === 'lumiere-dete')

  return (
    <>
      <Hero />

      <CategoryShowcase />

      <ProductRow
        eyebrow="Meilleures ventes"
        title="L'essentiel"
        products={bestsellers}
        href="/collections/all"
      />

      <ReassuranceBar />

      <ProductRow
        eyebrow="Lumière d'été"
        title="La collection"
        products={lumiereDete}
        href="/collections/lumiere-dete"
        hrefLabel="Voir la collection"
      />

      <BrandStory />

      <ProductRow
        eyebrow="Dernières arrivées"
        title="Nouveautés"
        products={newArrivals}
        href="/collections/all"
      />

      <Testimonials />

      <NewsletterBanner />
    </>
  )
}
