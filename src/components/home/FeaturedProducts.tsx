import Link from 'next/link'
import { ProductCard } from '@/components/product/ProductCard'
import { PRODUCTS } from '@/lib/data'
import { Button } from '@/components/ui/Button'

export function FeaturedProducts() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4)

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#C9A84C] text-sm tracking-[0.25em] uppercase font-medium mb-3">
            Nos coups de cœur
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl text-[#1A3A52] font-light"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            L'été au bout des doigts ✨
          </h2>
          <p className="text-gray-500 mt-4 max-w-md mx-auto">
            Des pièces choisies avec soin, pour sublimer chaque instant de votre été.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/collections/all">
            <Button variant="outline" size="lg">
              Voir tous les bijoux →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
