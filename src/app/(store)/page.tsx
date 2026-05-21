import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { CollectionGrid } from '@/components/home/CollectionGrid'
import { BrandStory } from '@/components/home/BrandStory'
import { Testimonials } from '@/components/home/Testimonials'
import { NewsletterBanner } from '@/components/home/NewsletterBanner'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <CollectionGrid />
      <BrandStory />
      <Testimonials />
      <NewsletterBanner />
    </>
  )
}
