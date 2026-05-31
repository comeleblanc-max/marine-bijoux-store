'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

interface Tile {
  slug:    string
  name:    string
  eyebrow: string
  span?:   'wide' | 'tall'
}

const TILES: Tile[] = [
  { slug: 'lumiere-dete',      name: 'Lumière d\'été',     eyebrow: 'Collection', span: 'wide' },
  { slug: 'colliers',          name: 'Colliers',           eyebrow: 'Catégorie' },
  { slug: 'bracelets',         name: 'Bracelets',          eyebrow: 'Catégorie' },
  { slug: 'boucles-doreilles', name: 'Boucles d\'oreilles', eyebrow: 'Catégorie' },
  { slug: 'bagues',            name: 'Bagues',             eyebrow: 'Catégorie' },
]

/**
 * Photos fixes de Marine pour chaque tuile (placées dans /public/tiles/).
 * Si tu veux changer une photo : remplace le fichier dans public/tiles/
 * avec le même nom et redéploie.
 */
const TILE_IMAGES: Record<string, string> = {
  'lumiere-dete':      '/tiles/lumiere-dete.webp',
  'colliers':          '/tiles/colliers.webp',
  'bracelets':         '/tiles/bracelets.webp',
  'boucles-doreilles': '/tiles/boucles-doreilles.webp',
  'bagues':            '/tiles/bagues.webp',
}

/**
 * @param images - (déprécié) dictionnaire d'images alternatives.
 *                  Aujourd'hui on utilise TILE_IMAGES (fichiers fixes dans /public/tiles).
 */
export function CategoryShowcase(_props: { images?: Record<string, string | null> } = {}) {
  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="eyebrow mb-3">🌊 Explorer</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#0E4F5E]">
            Nos univers
          </h2>
        </motion.div>

        {/* Grille 2x3 — mainajewels style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 auto-rows-[180px] sm:auto-rows-[260px] lg:auto-rows-[300px]">
          {TILES.map((tile, i) => {
            const img = TILE_IMAGES[tile.slug] ?? null
            return (
              <motion.div
                key={tile.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                className={tile.span === 'wide' ? 'col-span-2 row-span-2 lg:col-span-2 lg:row-span-2' : ''}
              >
                <Link
                  href={`/collections/${tile.slug}`}
                  className="group relative block w-full h-full overflow-hidden bg-[#FAF5EA]"
                >
                  {img ? (
                    <Image
                      src={img}
                      alt={tile.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl text-[#D4AF37]/30">✦</div>
                  )}

                  {/* Voile dégradé */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                  {/* Contenu */}
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white">
                    <p className="text-[9px] tracking-[0.25em] uppercase opacity-80 mb-1">
                      {tile.eyebrow}
                    </p>
                    <h3
                      className={`text-white font-light ${
                        tile.span === 'wide' ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-lg sm:text-xl'
                      }`}
                    >
                      {tile.name}
                    </h3>
                    <span className="inline-block mt-2 text-[10px] tracking-[0.25em] uppercase border-b border-white/50 pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Découvrir →
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
