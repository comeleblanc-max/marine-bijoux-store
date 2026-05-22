'use client'

import Link from 'next/link'
import { COLLECTIONS } from '@/lib/data'
import { motion } from '@/components/ui/motion'
import { Reveal } from '@/components/ui/motion'

const EASE = [0.22, 1, 0.36, 1] as const

const EMOJIS: Record<string, string> = {
  colliers: '📿',
  bracelets: '⭕',
  'boucles-doreilles': '🌟',
  bagues: '💍',
  'lumiere-dete': '☀️',
}

export function CollectionGrid() {
  const collections = COLLECTIONS.filter((c) => c.featured).slice(0, 4)

  return (
    <section className="py-20 sm:py-28 px-4 bg-[#F5E9D6]">
      <div className="max-w-7xl mx-auto">
        <Reveal className="text-center mb-14">
          <p className="text-[#D4AF37] text-sm tracking-[0.25em] uppercase font-medium mb-3">
            Explorer
          </p>
          <h2
            className="text-3xl sm:text-4xl text-[#1F3A56] font-light"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Nos collections
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {collections.map((collection, i) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              className={i === 0 ? 'md:col-span-2 md:row-span-2' : ''}
            >
              <Link
                href={`/collections/${collection.slug}`}
                className={`group relative block rounded-2xl overflow-hidden bg-gradient-to-br ${
                  i === 0
                    ? 'from-[#4DB8D4] to-[#1F3A56] md:min-h-[400px] h-full aspect-[3/4] md:aspect-auto'
                    : i === 1
                    ? 'from-[#D4AF37] to-[#D8B98C] aspect-[3/4]'
                    : i === 2
                    ? 'from-[#FF7A45] to-[#c96060] aspect-[3/4]'
                    : 'from-[#1F3A56] to-[#2a5472] aspect-[3/4]'
                }`}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors duration-500" />
                {/* Halo lumineux au survol */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.25),transparent_60%)]" />

                <div className="relative z-10 h-full flex flex-col items-center justify-center text-white text-center p-6">
                  <motion.span
                    className="text-4xl mb-4"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                  >
                    {EMOJIS[collection.slug] || '✨'}
                  </motion.span>
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
                  <span className="mt-4 text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 border-b border-white/60 pb-0.5">
                    Découvrir →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
