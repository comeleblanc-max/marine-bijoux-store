'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

export function Hero() {
  return (
    <section className="relative w-full h-[75vh] min-h-[520px] max-h-[820px] overflow-hidden bg-[#FAF7F2]">
      {/* Image pleine largeur */}
      <Image
        src="/banniere-test.webp"
        alt="Marine — collection bijoux d'été"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Voile sombre subtil pour lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />

      {/* Contenu */}
      <div className="absolute inset-0 flex items-end pb-20 sm:pb-24 lg:pb-28">
        <div className="container-x w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="max-w-xl"
          >
            <p className="eyebrow text-white/85 mb-4">Collection — Été 2026</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] mb-6 text-balance">
              La douceur de l'été<br />
              <span className="italic text-[#F5E9D6]">au creux de la peau.</span>
            </h1>
            <p className="text-white/90 text-sm sm:text-base max-w-md mb-8 leading-relaxed">
              Bijoux en acier inoxydable, conçus pour durer. Inspirés par le soleil,
              la mer, et les après-midis d'été qui ne finissent jamais.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/collections/all" className="btn-gold">
                Découvrir
              </Link>
              <Link
                href="/pages/a-propos"
                className="inline-flex items-center justify-center gap-2 border border-white/70 text-white px-7 py-3.5 text-xs tracking-[0.18em] uppercase font-medium transition-all duration-300 hover:bg-white hover:text-[#1A1A1A]"
              >
                Notre histoire
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
