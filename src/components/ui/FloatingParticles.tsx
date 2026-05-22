'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const SYMBOLS = ['🐚', '✨', '💎', '🌊', '⭐', '🪸', '🌸', '💫', '🐠', '🌺']

interface Particle {
  id: number
  symbol: string
  x: number       // % horizontal
  size: number    // em
  duration: number // s
  delay: number   // s
  opacity: number
  drift: number   // px horizontal drift
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    x: Math.random() * 95 + 2.5,
    size: 0.7 + Math.random() * 0.9,
    duration: 12 + Math.random() * 18,
    delay: Math.random() * 20,
    opacity: 0.12 + Math.random() * 0.22,
    drift: (Math.random() - 0.5) * 120,
  }))
}

export function FloatingParticles({ count = 18 }: { count?: number }) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    setParticles(generateParticles(isMobile ? Math.floor(count / 2) : count))
  }, [count, isMobile])

  if (particles.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: '105vh', x: `${p.x}vw`, opacity: 0 }}
          animate={{
            y: '-10vh',
            x: [`${p.x}vw`, `calc(${p.x}vw + ${p.drift}px)`, `${p.x}vw`],
            opacity: [0, p.opacity, p.opacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
            x: {
              duration: p.duration,
              ease: 'easeInOut',
              times: [0, 0.5, 1],
            },
            opacity: {
              duration: p.duration,
              times: [0, 0.1, 0.85, 1],
            },
          }}
          style={{ fontSize: `${p.size}rem`, position: 'absolute', top: 0, left: 0 }}
        >
          {p.symbol}
        </motion.div>
      ))}
    </div>
  )
}
