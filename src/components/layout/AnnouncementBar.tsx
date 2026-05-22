'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Truck, Mail, ExternalLink } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { ANNOUNCEMENTS } from '@/lib/data'

const EASE = [0.22, 1, 0.36, 1] as const
const ROTATE_MS = 4500

export function AnnouncementBar() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const count = ANNOUNCEMENTS.length

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count]
  )

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), ROTATE_MS)
    return () => clearInterval(timer)
  }, [paused, count])

  return (
    <div
      className="bg-gradient-to-r from-[#1A3A52] via-[#2C5A7A] to-[#1A3A52] text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 h-9">
        {/* Gauche — réassurance (desktop) */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px] text-white/70 w-44 flex-shrink-0">
          <Truck className="w-3.5 h-3.5 text-[#4DB8D4]" />
          <span>Livraison offerte dès 60&nbsp;€</span>
        </div>

        {/* Centre — carrousel d'annonces */}
        <div className="flex items-center gap-1 flex-1 justify-center min-w-0">
          <button
            onClick={() => go(-1)}
            aria-label="Annonce précédente"
            className="text-white/50 hover:text-white transition-colors p-1 flex-shrink-0"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="relative h-9 flex items-center overflow-hidden flex-1 max-w-md">
            <AnimatePresence mode="wait">
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="absolute inset-0 flex items-center justify-center text-center text-xs font-medium tracking-wide whitespace-nowrap px-2"
              >
                {ANNOUNCEMENTS[index]}
              </motion.p>
            </AnimatePresence>
          </div>

          <button
            onClick={() => go(1)}
            aria-label="Annonce suivante"
            className="text-white/50 hover:text-white transition-colors p-1 flex-shrink-0"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Droite — points + réseaux (desktop) */}
        <div className="hidden md:flex items-center gap-3 w-44 justify-end flex-shrink-0">
          <div className="flex items-center gap-1.5">
            {ANNOUNCEMENTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Aller à l'annonce ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-4 bg-[#4DB8D4]' : 'w-1.5 bg-white/25 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
          <span className="h-3 w-px bg-white/15" />
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-white/60 hover:text-[#4DB8D4] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="mailto:contact@marineetladouceurdelete.com"
            aria-label="Email"
            className="text-white/60 hover:text-[#4DB8D4] transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
