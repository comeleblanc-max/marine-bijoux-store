import Link from 'next/link'
import { ProductCard } from '@/components/product/ProductCard'
import { PRODUCTS } from '@/lib/data'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/motion'

export function FeaturedProducts() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4)
  const newArrivals = PRODUCTS.filter((p) => p.newArrival).slice(0, 4)

  return (
    <>
      {/* ── Meilleures ventes ── */}
      <section className="py-16 sm:py-24 px-4 bg-[#FAF5EA]/50">
        <div className="max-w-7xl mx-auto">
          <Reveal className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase font-medium mb-2">
                Nos coups de cœur
              </p>
              <h2
                className="text-2xl sm:text-3xl text-[#1A1A1A] font-light"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Meilleures ventes
              </h2>
            </div>
            <Link
              href="/collections/all"
              className="hidden sm:inline text-sm text-[#1A1A1A]/60 hover:text-[#D4AF37] transition-colors underline-offset-4 hover:underline"
            >
              Voir tout →
            </Link>
          </Reveal>

          <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {featured.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.15} className="text-center mt-8 sm:hidden">
            <Link
              href="/collections/all"
              className="text-sm text-[#1A1A1A]/60 hover:text-[#D4AF37] transition-colors underline-offset-4 underline"
            >
              Voir toute la collection →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Bannière réassurance (style mainajewels) ── */}
      <section className="border-y border-gray-100 bg-white py-5 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-8 sm:gap-16 text-center">
          {[
            { icon: '🚚', label: 'Livraison offerte', sub: 'dès 60 €' },
            { icon: '🔒', label: 'Paiement sécurisé', sub: '100% protégé' },
            { icon: '↩️', label: 'Retours gratuits', sub: 'sous 14 jours' },
            { icon: '✨', label: 'Qualité artisanale', sub: 'fabriqué avec soin' },
          ].map(({ icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-2xl">{icon}</span>
              <p className="text-xs font-semibold text-[#1A1A1A]">{label}</p>
              <p className="text-[10px] text-gray-400">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Nouveautés ── */}
      {newArrivals.length > 0 && (
        <section className="py-16 sm:py-24 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <Reveal className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase font-medium mb-2">
                  Dernières arrivées
                </p>
                <h2
                  className="text-2xl sm:text-3xl text-[#1A1A1A] font-light"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  Nouveautés
                </h2>
              </div>
              <Link
                href="/collections/all"
                className="hidden sm:inline text-sm text-[#1A1A1A]/60 hover:text-[#D4AF37] transition-colors underline-offset-4 hover:underline"
              >
                Voir tout →
              </Link>
            </Reveal>

            <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {newArrivals.map((product) => (
                <StaggerItem key={product.id}>
                  <ProductCard product={product} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}
    </>
  )
}
