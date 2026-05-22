// Hero coucher de soleil mis de côté — pour le réactiver, décommenter les
// 2 lignes "HeroSection" ci-dessous. Le composant est conservé dans
// src/components/home/HeroSection.tsx
// import { HeroSection } from '@/components/home/HeroSection'
import { FullWidthBanner } from '@/components/home/FullWidthBanner'
import { CollectionGrid } from '@/components/home/CollectionGrid'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { BrandStory } from '@/components/home/BrandStory'
import { Testimonials } from '@/components/home/Testimonials'
import { NewsletterBanner } from '@/components/home/NewsletterBanner'

export default function HomePage() {
  return (
    <>
      {/* 1. Hero coucher de soleil — désactivé (sauvegardé) */}
      {/* <HeroSection /> */}
      {/* 2. Bannière photo pleine largeur */}
      <FullWidthBanner />
      {/* 3. Tuiles catégories — style mainajewels */}
      <CollectionGrid />
      {/* 4. Meilleures ventes + bandeau réassurance + Nouveautés */}
      <FeaturedProducts />
      {/* 5. Histoire de marque */}
      <BrandStory />
      {/* 6. Avis clients */}
      <Testimonials />
      {/* 7. Newsletter */}
      <NewsletterBanner />
    </>
  )
}
