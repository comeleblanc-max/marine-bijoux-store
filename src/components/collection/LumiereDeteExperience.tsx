'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/types'
import { formatPrice } from '@/utils/format'

interface Props { products: Product[] }

const EASE = [0.22, 1, 0.36, 1] as const

export function LumiereDeteExperience({ products }: Props) {
  const reduceMotion = useReducedMotion()

  return (
    <main className="bg-[#FAF5EA] text-[#0E4F5E] overflow-x-hidden">
      <Hero />
      <Manifesto />
      {products.length > 0 && <Cinema products={products} disabled={!!reduceMotion} />}
      <Grid products={products} />
    </main>
  )
}

/* ────────────────────────── HERO ────────────────────────── */
function Hero() {
  return (
    <section className="relative h-[88vh] min-h-[560px] flex items-center justify-center overflow-hidden">
      {/* Photo de fond cr-ème/doré */}
      <Image
        src="/tiles/lumiere-dete.webp"
        alt="Lumière d'été — la collection capsule"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Voile crème pour lisibilité */}
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

      {/* Indicateur scroll */}
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
    <section className="py-28 sm:py-36 bg-[#FAF5EA] text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: EASE }}
        className="max-w-2xl mx-auto"
      >
        <p className="text-[11px] tracking-[0.3em] uppercase text-[#D4AF37] mb-6">
          Le manifeste
        </p>
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

/* ────────────────────────── CINEMA STICKY ────────────────────────── */
function Cinema({ products, disabled }: { products: Product[]; disabled: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  const n = products.length
  /* Hauteur : 1 fenêtre par produit + 0.5 d'entrée. */
  const sectionVh = (n + 0.5) * 100

  return (
    <section ref={ref} style={{ height: `${sectionVh}vh` }} className="relative bg-[#0E4F5E]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Fond animé (placeholder vidéo) — un dégradé doré→sable qui respire */}
        <BackdropPlaceholder />
        {/* Voile sombre pour le texte */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E4F5E]/85 via-[#0E4F5E]/55 to-[#0E4F5E]/30" />

        {/* Index doré (1 / N) */}
        <div className="absolute top-6 left-6 z-20 text-[11px] tracking-[0.3em] uppercase text-[#D4AF37]">
          ✦ La collection
        </div>

        {/* Scènes empilées : on les fade in/out selon scrollYProgress */}
        {products.map((p, i) => (
          <Scene
            key={p.id}
            product={p}
            index={i}
            total={n}
            progress={scrollYProgress}
            disabled={disabled}
          />
        ))}
      </div>
    </section>
  )
}

function Scene({
  product, index, total, progress, disabled,
}: {
  product: Product
  index: number
  total: number
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  disabled: boolean
}) {
  /* Chaque scène occupe une fraction du scroll. Avec n scènes, on découpe
     [0,1] en n tronçons, et on fait apparaître la scène i autour de i/n. */
  const step  = 1 / total
  const start = index * step
  const end   = start + step
  /* Fenêtre douce : on lisse les entrées/sorties */
  const pad   = step * 0.15
  const opacity = useTransform(
    progress,
    [start - pad, start + pad, end - pad, end + pad],
    [0, 1, 1, 0],
  )
  const y = useTransform(
    progress,
    [start, end],
    disabled ? [0, 0] : [60, -60],
  )

  const price = formatPrice(product.price)
  const img   = product.images?.[0]

  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex items-center justify-center px-6 sm:px-10"
      aria-hidden={false}
    >
      <motion.div
        style={{ y }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 max-w-5xl w-full items-center"
      >
        {/* Photo bijou */}
        <div className="order-2 lg:order-1 relative aspect-[4/5] bg-[#FAF5EA]/10 backdrop-blur rounded-lg overflow-hidden border border-white/10">
          {img ? (
            <Image
              src={img}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 90vw, 480px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl text-[#D4AF37]/30">✦</div>
          )}
        </div>

        {/* Infos bijou */}
        <div className="order-1 lg:order-2 text-[#FAF5EA] text-center lg:text-left">
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#D4AF37] mb-3">
            Pièce {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </p>
          <h3
            className="text-4xl sm:text-5xl mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm sm:text-base text-[#A7D5E6] max-w-md mx-auto lg:mx-0 leading-relaxed mb-7">
              {product.description}
            </p>
          )}
          <div className="flex items-center justify-center lg:justify-start gap-5">
            <span className="text-xl sm:text-2xl text-[#D4AF37] font-light tabular-nums">
              {price}
            </span>
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#0E4F5E] px-6 py-2.5 text-[10px] tracking-[0.25em] uppercase font-medium hover:bg-[#FAF5EA] transition-colors"
            >
              Acheter
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* Fond animé en attendant la vraie vidéo (dégradé qui respire) */
function BackdropPlaceholder() {
  return (
    <div className="absolute inset-0">
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 25% 20%, rgba(212,175,55,0.55), transparent 55%),' +
            'radial-gradient(110% 80% at 80% 70%, rgba(36,187,208,0.40), transparent 55%),' +
            'linear-gradient(135deg, #1A9AAD 0%, #0E4F5E 60%, #0a3a45 100%)',
        }}
      />
      {/* Quand tu auras la vidéo, remplace ce bloc par :
          <video src="/lumiere-dete/video-bg.mp4" autoPlay muted loop playsInline
                 poster="/lumiere-dete/video-bg-poster.webp"
                 className="absolute inset-0 w-full h-full object-cover" /> */}
    </div>
  )
}

/* ────────────────────────── GRILLE FINALE ────────────────────────── */
function Grid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <section className="py-24 text-center px-6">
        <p className="text-[#6B6B6B] mb-6">Aucun bijou dans cette collection pour le moment.</p>
        <Link href="/collections/all" className="btn-ghost inline-flex">
          Voir tous les bijoux
        </Link>
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
        <p className="text-[11px] tracking-[0.3em] uppercase text-[#D4AF37] mb-4">
          Toute la collection
        </p>
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl text-[#0E4F5E]"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
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
              <p className="text-sm text-[#0E4F5E] text-center mt-1 tabular-nums">
                {formatPrice(p.price)}
              </p>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
