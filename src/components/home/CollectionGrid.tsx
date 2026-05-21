import Link from 'next/link'
import { COLLECTIONS } from '@/lib/data'

const EMOJIS: Record<string, string> = {
  colliers: '📿',
  bracelets: '⭕',
  'boucles-doreilles': '🌟',
  bagues: '💍',
  'lumiere-dete': '☀️',
}

export function CollectionGrid() {
  const collections = COLLECTIONS.filter((c) => c.featured)

  return (
    <section className="py-20 px-4 bg-[#F5F1ED]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[#C9A84C] text-sm tracking-[0.25em] uppercase font-medium mb-3">
            Explorer
          </p>
          <h2
            className="text-3xl sm:text-4xl text-[#1A3A52] font-light"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Nos collections
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {collections.slice(0, 4).map((collection, i) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className={`group relative rounded-2xl overflow-hidden aspect-[3/4] bg-gradient-to-br ${
                i === 0
                  ? 'from-[#4DB8D4] to-[#1A3A52]'
                  : i === 1
                  ? 'from-[#C9A84C] to-[#D4A574]'
                  : i === 2
                  ? 'from-[#F08080] to-[#c96060]'
                  : 'from-[#1A3A52] to-[#2a5472]'
              } ${i === 0 ? 'md:col-span-2 md:row-span-2 aspect-auto md:min-h-[400px]' : ''}`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center p-6">
                <span className="text-4xl mb-4">{EMOJIS[collection.slug] || '✨'}</span>
                <h3
                  className="text-xl font-light"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {collection.name}
                </h3>
                {collection.description && i === 0 && (
                  <p className="text-sm text-white/80 mt-2 max-w-xs">
                    {collection.description}
                  </p>
                )}
                <span className="mt-4 text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-b border-white/60 pb-0.5">
                  Découvrir →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
