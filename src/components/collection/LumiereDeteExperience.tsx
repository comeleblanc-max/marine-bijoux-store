'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/types'
import { formatPrice } from '@/utils/format'

interface Props { products: Product[] }

const EASE = [0.22, 1, 0.36, 1] as const
const MAX_SCENES = 6 // on plafonne les scènes cinéma (perf) ; la grille montre tout

/* Détecte un grand écran APRÈS le montage (évite le mismatch d'hydratation
   et surtout évite de monter la version lourde "cinéma" sur mobile). */
function useIsDesktop() {
  const [d, setD] = useState(false)
  useEffect(() => {
    const m = window.matchMedia('(min-width: 1024px)')
    const on = () => setD(m.matches)
    on()
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return d
}

export function LumiereDeteExperience({ products }: Props) {
  const reduceMotion = useReducedMotion()
  const isDesktop    = useIsDesktop()
  const cinematic    = isDesktop && !reduceMotion && products.length > 0

  return (
    <main className="bg-[#FAF5EA] text-[#0E4F5E] overflow-x-hidden">
      <Hero />
      <Manifesto />
      {products.length > 0 && (
        cinematic
          ? <Cinema products={products.slice(0, MAX_SCENES)} />
          : <SimpleShowcase products={products} />
      )}
      <Grid products={products} />
    </main>
  )
}

/* ────────────────────────── HERO ────────────────────────── */
function Hero() {
  return (
    <section className="relative h-[88vh] min-h-[560px] flex items-center justify-center overflow-hidden">
      <Image
        src="/tiles/lumiere-dete.webp"
        alt="Lumière d'été — la collection capsule"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF5EA]/30 via-[#FAF5EA]/55 to-[#FAF5EA]/85" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE }}
        className="relative z-10 text-center px-6 max-w-2xl"
      >
        <p className="text-[11px] tracking-[0.35em] uppercase text-[#D4AF37] mb-5">
          ✦ Collection capsule
        </p>
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl text-[#0E4F5E] leading-[0.95] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Lumière<br /><span className="italic text-[#D4AF37]">d&apos;été</span>
        </h1>
        <p className="text-sm sm:text-base text-[#6B6B6B] max-w-md mx-auto leading-relaxed mb-9">
          Là où le soleil rencontre la mer. Une collection capsule née d&apos;un été,
          pour celles qui portent la lumière sur la peau.
        </p>
        <a
          href="#collection"
          className="inline-flex items-center gap-2 bg-[#0E4F5E] text-[#FAF5EA] px-7 py-3 text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-[#24BBD0] transition-colors"
        >
          Découvrir la collection
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { duration: 1, delay: 1.2 },
          y:       { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[#0E4F5E]"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase">Faites défiler</span>
        <div className="w-px h-9 bg-[#0E4F5E]/40" />
      </motion.div>
    </section>
  )
}

/* ────────────────────────── MANIFESTO ────────────────────────── */
function Manifesto() {
  return (
    <section className="py-24 sm:py-36 bg-[#FAF5EA] text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: EASE }}
        className="max-w-2xl mx-auto"
      >
        <p className="text-[11px] tracking-[0.3em] uppercase text-[#D4AF37] mb-6">Le manifeste</p>
        <p
          className="text-2xl sm:text-3xl lg:text-4xl text-[#0E4F5E] leading-[1.35]"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          « Chaque bijou capture un instant&nbsp;:
          <span className="italic text-[#D4AF37]"> la chaleur dorée</span> d&apos;un coucher
          de soleil, <span className="italic text-[#D4AF37]">la fraîcheur</span> d&apos;une vague. »
        </p>
      </motion.div>
    </section>
  )
}

/* Fond premium statique (le placeholder de la future vidéo). Pas d'animation
   continue → léger pour le navigateur. */
function backdropStyle(): React.CSSProperties {
  return {
    background:
      'radial-gradient(120% 80% at 25% 18%, rgba(212,175,55,0.5), transparent 55%),' +
      'radial-gradient(110% 80% at 80% 72%, rgba(36,187,208,0.38), transparent 55%),' +
      'linear-gradient(135deg, #1A9AAD 0%, #0E4F5E 60%, #0a3a45 100%)',
  }
}

/* ────────────────────────── CINEMA STICKY (desktop) ────────────────────────── */
function Cinema({ products }: { products: Product[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const n = products.length
  const sectionVh = (n + 0.5) * 100

  return (
    <section ref={ref} style={{ height: `${sectionVh}vh` }} className="relative bg-[#0E4F5E]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0" style={backdropStyle()} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E4F5E]/85 via-[#0E4F5E]/55 to-[#0E4F5E]/30" />
        <div className="absolute top-6 left-6 z-20 text-[11px] tracking-[0.3em] uppercase text-[#D4AF37]">
          ✦ La collection
        </div>
        {products.map((p, i) => (
          <Scene key={p.id} product={p} index={i} total={n} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  )
}

function Scene({
  product, index, total, progress,
}: {
  product: Product
  index: number
  total: number
  progress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  const step  = 1 / total
  const start = index * step
  const end   = start + step
  const pad   = step * 0.15
  const opacity = useTransform(progress, [start - pad, start + pad, end - pad, end + pad], [0, 1, 1, 0])
  const y       = useTransform(progress, [start, end], [50, -50])

  const img = product.images?.[0]

  return (
    <motion.div style={{ opacity }} className="absolute inset-0 flex items-center justify-center px-6 sm:px-10">
      <motion.div style={{ y }} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 max-w-5xl w-full items-center">
        <div className="order-2 lg:order-1 relative aspect-[4/5] bg-white/5 rounded-lg overflow-hidden border border-white/10">
          {img ? (
            <Image src={img} alt={product.name} fill sizes="480px" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl text-[#D4AF37]/30">✦</div>
          )}
        </div>
        <div className="order-1 lg:order-2 text-[#FAF5EA] text-center lg:text-left">
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#D4AF37] mb-3">
            Pièce {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </p>
          <h3 className="text-4xl sm:text-5xl mb-4 leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm sm:text-base text-[#A7D5E6] max-w-md mx-auto lg:mx-0 leading-relaxed mb-7">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-center lg:justify-start gap-5">
            <span className="text-xl sm:text-2xl text-[#D4AF37] font-light tabular-nums">
              {formatPrice(product.price)}
            </span>
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#0E4F5E] px-6 py-2.5 text-[10px] tracking-[0.25em] uppercase font-medium hover:bg-[#FAF5EA] transition-colors"
            >
              Acheter <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ──────────── VERSION SIMPLE (mobile / reduced-motion) ──────────── */
function SimpleShowcase({ products }: { products: Product[] }) {
  return (
    <section className="bg-[#0E4F5E] py-16 px-6" style={backdropStyle()}>
      <div className="max-w-md mx-auto space-y-14">
        {products.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-center text-[#FAF5EA]"
          >
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-white/10 mb-5">
              {p.images?.[0] ? (
                <Image src={p.images[0]} alt={p.name} fill sizes="90vw" className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl text-[#D4AF37]/30">✦</div>
              )}
            </div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-[#D4AF37] mb-2">
              Pièce {String(i + 1).padStart(2, '0')}
            </p>
            <h3 className="text-3xl mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>{p.name}</h3>
            {p.description && (
              <p className="text-sm text-[#A7D5E6] leading-relaxed mb-4">{p.description}</p>
            )}
            <div className="flex items-center justify-center gap-4">
              <span className="text-xl text-[#D4AF37] font-light tabular-nums">{formatPrice(p.price)}</span>
              <Link
                href={`/products/${p.slug}`}
                className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#0E4F5E] px-5 py-2.5 text-[10px] tracking-[0.25em] uppercase font-medium"
              >
                Acheter <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ────────────────────────── GRILLE FINALE ────────────────────────── */
function Grid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <section className="py-24 text-center px-6">
        <p className="text-[#6B6B6B] mb-6">Aucun bijou dans cette collection pour le moment.</p>
        <Link href="/collections/all" className="btn-ghost inline-flex">Voir tous les bijoux</Link>
      </section>
    )
  }

  return (
    <section id="collection" className="py-24 sm:py-32 bg-[#FAF5EA] px-6">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: EASE }}
        className="text-center mb-14 sm:mb-20"
      >
        <p className="text-[11px] tracking-[0.3em] uppercase text-[#D4AF37] mb-4">Toute la collection</p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#0E4F5E]" style={{ fontFamily: 'var(--font-playfair)' }}>
          {products.length} pièce{products.length > 1 ? 's' : ''} à choisir
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
        {products.map((p, i) => (
          <motion.article
            key={p.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
            className="group"
          >
            <Link href={`/products/${p.slug}`} className="block">
              <div className="relative aspect-[4/5] bg-white overflow-hidden mb-4">
                {p.images?.[0] ? (
                  <Image
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl text-[#D4AF37]/30">✦</div>
                )}
              </div>
              <h3 className="text-base font-semibold text-[#0E4F5E] group-hover:text-[#D4AF37] transition-colors text-center">
                {p.name}
              </h3>
              <p className="text-sm text-[#0E4F5E] text-center mt-1 tabular-nums">{formatPrice(p.price)}</p>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
