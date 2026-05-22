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
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
    >
      {/* Fond animé */}
      <motion.div
        style={{ scale: reduce ? 1 : bgScale }}
        className="absolute inset-0 bg-gradient-to-br from-[#1A3A52] via-[#2a5472] to-[#4DB8D4]"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 20% 50%, rgba(77,184,212,0.35) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.25) 0%, transparent 50%),
              radial-gradient(ellipse at 60% 85%, rgba(240,128,128,0.2) 0%, transparent 45%)
            `,
          }}
        />
      </motion.div>

      {/* Formes flottantes décoratives */}
      <FloatingShape
        className="absolute top-[12%] right-[10%] w-56 h-56 rounded-full border border-white/10"
        duration={9}
        distance={26}
      />
      <FloatingShape
        className="absolute bottom-[16%] left-[8%] w-36 h-36 rounded-full border border-[#C9A84C]/20"
        duration={7}
        delay={1}
        distance={20}
      />
      <FloatingShape
        className="absolute top-[30%] left-[22%] w-4 h-4 rounded-full bg-[#C9A84C]/40"
        duration={5}
        delay={0.5}
        distance={30}
      />
      <FloatingShape
        className="absolute bottom-[30%] right-[26%] w-3 h-3 rounded-full bg-white/40"
        duration={6}
        delay={1.5}
        distance={24}
      />
      <FloatingShape
        className="absolute top-[20%] left-[12%] text-3xl opacity-40"
        duration={8}
        delay={0.8}
        distance={18}
      >
        <span>✨</span>
      </FloatingShape>

      {/* Contenu */}
      <motion.div
        style={{ y: reduce ? 0 : contentY, opacity: reduce ? 1 : contentOpacity }}
        className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-[#C9A84C] text-sm tracking-[0.3em] uppercase font-medium mb-6"
        >
          ✨ Première Collection
        </motion.p>

        <h1
          className="text-5xl sm:text-6xl lg:text-8xl font-light leading-[1.05] mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="block"
          >
            La Lumière
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
            className="block text-[#C9A84C] italic"
          >
            d'été
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
          className="text-lg sm:text-xl text-white/80 mb-10 max-w-xl mx-auto leading-relaxed"
        >
          Des bijoux artisanaux inspirés par la douceur de la mer.
          <br className="hidden sm:block" />
          Porter l'été toujours avec soi.
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
              className="inline-flex bg-[#C9A84C] hover:bg-[#b8963e] text-white px-10 py-4 rounded-full font-semibold tracking-wide shadow-lg shadow-[#C9A84C]/30 text-base"
            >
              Découvrir la collection
            </motion.span>
          </Link>
          <Link href="/pages/a-propos">
            <motion.span
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="inline-flex text-white border border-white/30 hover:border-[#C9A84C] hover:text-[#C9A84C] rounded-full px-10 py-4 text-base font-medium transition-colors"
            >
              Notre histoire
            </motion.span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-12 text-white/60 text-xs"
        >
          <span>🚚 Livraison gratuite dès 60€</span>
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </section>
  )
}
