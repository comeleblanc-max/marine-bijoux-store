'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  FloatingShape,
} from '@/components/ui/motion'

const EASE = [0.22, 1, 0.36, 1] as const

export function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const sunY = useTransform(scrollYProgress, [0, 1], [0, 80])

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
    >
      {/* Ciel — dégradé coucher de soleil */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg,
            #A7D5E6 0%,
            #C9DCDA 22%,
            #F0DCB8 48%,
            #FAF5EA 68%,
            #F2E5CC 100%)`,
        }}
      />

      {/* Soleil radieux */}
      <motion.div
        style={{ y: reduce ? 0 : sunY }}
        className="absolute left-1/2 top-[28%] -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[clamp(220px,40vw,440px)] h-[clamp(220px,40vw,440px)] rounded-full"
          style={{
            background: `radial-gradient(circle,
              rgba(255,232,170,0.95) 0%,
              rgba(212,175,55,0.55) 35%,
              rgba(255,122,69,0.25) 62%,
              transparent 78%)`,
          }}
        />
      </motion.div>

      {/* Reflets / scintillements sur l'eau */}
      <div
        className="absolute inset-x-0 bottom-0 h-[35%]"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 30% 100%, rgba(255,255,255,0.4) 0%, transparent 40%),
            radial-gradient(ellipse at 70% 100%, rgba(212,175,55,0.3) 0%, transparent 45%)`,
        }}
      />

      {/* Formes décoratives flottantes */}
      <FloatingShape
        className="absolute top-[14%] right-[12%] text-4xl opacity-50"
        duration={8}
        delay={0.4}
        distance={22}
      >
        <span>🐚</span>
      </FloatingShape>
      <FloatingShape
        className="absolute bottom-[24%] left-[10%] text-3xl opacity-45"
        duration={9}
        delay={1}
        distance={26}
      >
        <span>⭐</span>
      </FloatingShape>
      <FloatingShape
        className="absolute top-[24%] left-[16%] text-2xl opacity-40"
        duration={7}
        delay={0.7}
        distance={18}
      >
        <span>✨</span>
      </FloatingShape>
      <FloatingShape
        className="absolute bottom-[30%] right-[20%] w-3 h-3 rounded-full bg-[#D4AF37]/50"
        duration={6}
        delay={1.4}
        distance={24}
      />

      {/* Contenu */}
      <motion.div
        style={{ y: reduce ? 0 : contentY, opacity: reduce ? 1 : contentOpacity }}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-[#0E4F5E]/70 text-xs sm:text-sm tracking-[0.35em] uppercase font-medium mb-6"
        >
          Bijoux en ligne
        </motion.p>

        <h1
          className="text-5xl sm:text-6xl lg:text-8xl font-light leading-[1.05] mb-6 text-[#0E4F5E]"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="block"
          >
            La douceur
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
            className="block italic"
            style={{ color: '#D4AF37' }}
          >
            de l&apos;été
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
          className="text-base sm:text-xl text-[#0E4F5E]/75 mb-10 max-w-xl mx-auto leading-relaxed italic"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Des bijoux qui sentent bon le soleil et la mer.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: EASE }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/collections/lumiere-dete">
            <motion.span
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="inline-flex bg-[#24BBD0] hover:bg-[#D4AF37] text-white px-10 py-4 rounded-full font-semibold tracking-wide shadow-xl shadow-[#24BBD0]/20 text-base transition-colors"
            >
              Découvrir la collection
            </motion.span>
          </Link>
          <Link href="/pages/a-propos">
            <motion.span
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="inline-flex text-[#0E4F5E] border border-[#0E4F5E]/30 hover:border-[#D4AF37] hover:text-[#D4AF37] rounded-full px-10 py-4 text-base font-medium transition-colors"
            >
              Notre histoire
            </motion.span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-12 text-[#0E4F5E]/55 text-xs"
        >
          <span>🚚 Livraison offerte dès 60€</span>
          <span className="hidden sm:inline">·</span>
          <span>🔒 Paiement sécurisé</span>
          <span className="hidden sm:inline">·</span>
          <span>↩️ Retours 14 jours</span>
        </motion.div>
      </motion.div>

      {/* Indicateur de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { delay: 1.2, duration: 0.6 },
          y: { delay: 1.2, duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#0E4F5E]/40"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </section>
  )
}
