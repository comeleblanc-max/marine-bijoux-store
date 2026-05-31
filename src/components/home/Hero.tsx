'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

interface HeroProps {
  eyebrow?:      string
  title?:        string
  titleItalic?:  string
  description?:  string
  ctaPrimary?:   string
  ctaSecondary?: string
}

export function Hero({
  eyebrow      = '🐚 Collection — Été 2026 ✨',
  title        = "La douceur de l'été",
  titleItalic  = 'au creux de la peau.',
  description  = "Bijoux en acier inoxydable, conçus pour durer. Inspirés par le soleil, la mer, et les après-midis d'été qui ne finissent jamais.",
  ctaPrimary   = 'Découvrir la collection',
  ctaSecondary = 'Notre histoire',
}: HeroProps = {}) {
  return (
    <section className="relative w-full h-[75vh] min-h-[520px] max-h-[820px] overflow-hidden bg-[#FAF5EA]">
      {/* Image pleine largeur */}
      <Image
        src="/hero-marine.webp"
        alt="Marine — collection bijoux d'été"
        fill
        priority
        className="object-cover object-[70%_center] sm:object-center"
        sizes="100vw"
      />

      {/* Voile sombre pour lisibilité du texte (gauche + bas) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      {/* Contenu */}
      <div className="absolute inset-0 flex items-end pb-20 sm:pb-24 lg:pb-28">
        <div className="container-x w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="max-w-xl"
          >
            <p className="eyebrow text-white/85 mb-4">{eyebrow}</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] mb-6 text-balance">
              {title}<br />
              <span className="italic text-[#FAF5EA]">{titleItalic}</span>
            </h1>
            <p className="text-white/90 text-sm sm:text-base max-w-md mb-8 leading-relaxed">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link href="/collections/all">
                <motion.span
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="inline-flex bg-white text-[#0E4F5E] hover:bg-[#D4AF37] hover:text-white px-9 py-4 rounded-full font-semibold tracking-wide shadow-xl text-sm transition-colors"
                >
                  {ctaPrimary}
                </motion.span>
              </Link>
              <Link href="/pages/a-propos">
                <motion.span
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  className="inline-flex border border-white/80 text-white hover:bg-white hover:text-[#0E4F5E] px-9 py-4 rounded-full font-medium tracking-wide text-sm transition-colors backdrop-blur-sm"
                >
                  {ctaSecondary}
                </motion.span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
