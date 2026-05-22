import Link from 'next/link'
import { ProductCard } from '@/components/product/ProductCard'
import { PRODUCTS } from '@/lib/data'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/motion'

export function FeaturedProducts() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4)

  return (
    <section className="py-20 sm:py-28 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <Reveal className="text-center mb-14">
          <p className="text-[#D4AF37] text-sm tracking-[0.25em] uppercase font-medium mb-3">
            Nos coups de cœur
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl text-[#1F3A56] font-light"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            L'été au bout des doigts ✨
          </h2>
          <p className="text-gray-500 mt-4 max-w-md mx-auto">
            Des pièces choisies avec soin, pour sublimer chaque instant de votre été.
          </p>
        </Reveal>

        {/* Grille */}
        <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </Stagger>

        {/* CTA */}
        <Reveal delay={0.15} className="text-center mt-12">
          <Link
            href="/collections/all"
            className="inline-flex items-center gap-2 border border-[#1F3A56] text-[#1F3A56] hover:bg-[#1F3A56] hover:text-white transition-colors duration-300 px-8 py-3.5 rounded-full font-medium group"
          >
            Voir tous les bijoux
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
