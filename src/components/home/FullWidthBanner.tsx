'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from '@/components/ui/motion'

const EASE = [0.22, 1, 0.36, 1] as const

export function FullWidthBanner() {
  return (
    <section className="relative w-full h-[60vh] sm:h-[75vh] min-h-[420px] overflow-hidden">
      {/* Photo pleine largeur */}
      <Image
        src="/banniere-accueil.jpg"
        alt="Marine et la douceur de l'été — bijoux inspirés du soleil et de la mer"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Voile sombre pour lisibilité des boutons */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

      {/* Boutons */}
      <div className="absolute inset-0 flex items-end sm:items-center justify-center pb-12 sm:pb-0">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/collections/all">
            <motion.span
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="inline-flex bg-white text-[#1F3A56] hover:bg-[#D4AF37] hover:text-white px-9 py-4 rounded-full font-semibold tracking-wide shadow-xl text-sm sm:text-base transition-colors"
            >
              Découvrir la collection
            </motion.span>
          </Link>
          <Link href="/pages/a-propos">
            <motion.span
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="inline-flex border border-white/80 text-white hover:bg-white hover:text-[#1F3A56] px-9 py-4 rounded-full font-medium tracking-wide text-sm sm:text-base transition-colors backdrop-blur-sm"
            >
              Notre histoire
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
