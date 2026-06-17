import Link from 'next/link'
import { COLLECTIONS } from '@/lib/data'
import { Reveal } from '@/components/ui/motion'

const TILES: Record<string, { emoji: string; bg: string }> = {
  'lumiere-dete':       { emoji: '☀️', bg: 'bg-gradient-to-br from-[#FAF5EA] to-[#F2E5CC]' },
  colliers:             { emoji: '📿', bg: 'bg-gradient-to-br from-[#E8F4F8] to-[#c9e8f2]' },
  bracelets:            { emoji: '✨', bg: 'bg-gradient-to-br from-[#F5F0FF] to-[#e8dcff]' },
  'bracelets-cheville': { emoji: '🌊', bg: 'bg-gradient-to-br from-[#E8F7FA] to-[#bfe7ee]' },
  'boucles-doreilles':  { emoji: '🌟', bg: 'bg-gradient-to-br from-[#FFF5E6] to-[#fde8c8]' },
  bagues:               { emoji: '💍', bg: 'bg-gradient-to-br from-[#F0FFF4] to-[#c8f0d8]' },
}

export function CollectionGrid() {
  const collections = COLLECTIONS.slice(0, 5)

  return (
    <section className="py-16 sm:py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">

        <Reveal className="text-center mb-12">
          <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase font-medium mb-3">
            Collections
          </p>
          <h2
            className="text-2xl sm:text-3xl text-[#0E4F5E] font-light"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Explorez nos univers
          </h2>
        </Reveal>

        {/* Tuiles catégories — style mainajewels */}
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 sm:pb-0 sm:grid sm:grid-cols-5 scrollbar-hide">
          {collections.map((col, i) => {
            const tile = TILES[col.slug] ?? { emoji: '💎', bg: 'bg-[#FAF5EA]' }
            return (
              <Link
                key={col.id}
                href={`/collections/${col.slug}`}
                className="group flex-shrink-0 w-36 sm:w-auto flex flex-col items-center gap-3 text-center"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {/* Cercle image */}
                <div
                  className={`w-full aspect-square rounded-2xl sm:rounded-3xl ${tile.bg} flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-lg`}
                >
                  <span className="text-4xl sm:text-5xl">{tile.emoji}</span>
                </div>
                {/* Nom */}
                <span className="text-sm font-medium text-[#0E4F5E] group-hover:text-[#D4AF37] transition-colors">
                  {col.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
