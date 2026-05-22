import { HeroSection } from '@/components/home/HeroSection'
import { CollectionGrid } from '@/components/home/CollectionGrid'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { BrandStory } from '@/components/home/BrandStory'
import { Testimonials } from '@/components/home/Testimonials'
import { NewsletterBanner } from '@/components/home/NewsletterBanner'

export default function HomePage() {
  return (
    <>
      {/* 1. Hero plein écran — coucher de soleil */}
      <HeroSection />
      {/* 2. Tuiles catégories — style mainajewels */}
      <CollectionGrid />
      {/* 3. Meilleures ventes + bandeau réassurance + Nouveautés */}
      <FeaturedProducts />
      {/* 4. Histoire de marque */}
      <BrandStory />
      {/* 5. Avis clients */}
      <Testimonials />
      {/* 6. Newsletter */}
      <NewsletterBanner />
    </>
  )
}
