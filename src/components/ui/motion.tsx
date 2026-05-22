'use client'

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useRef, type ReactNode } from 'react'

/* Courbe d'animation signature — easeOutExpo, très douce */
const EASE = [0.22, 1, 0.36, 1] as const

/* ----------------------------------------------------------------
 * PageTransition — rejoue une animation d'entrée à chaque navigation
 * ---------------------------------------------------------------- */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const reduce = useReducedMotion()

  return (
    <motion.div
      key={pathname}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/* ----------------------------------------------------------------
 * Reveal — fondu + glissé au scroll dans le viewport
 * ---------------------------------------------------------------- */
interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  duration?: number
  once?: boolean
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  duration = 0.7,
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/* ----------------------------------------------------------------
 * Stagger — conteneur qui révèle ses enfants en cascade
 * ---------------------------------------------------------------- */
const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
}

export function Stagger({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  )
}

/* ----------------------------------------------------------------
 * Parallax — déplace un élément à une vitesse différente du scroll
 * ---------------------------------------------------------------- */
export function Parallax({
  children,
  className,
  speed = 60,
}: {
  children: ReactNode
  className?: string
  speed?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed])

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y: reduce ? 0 : y }}>{children}</motion.div>
    </div>
  )
}

/* ----------------------------------------------------------------
 * FloatingShape — formes décoratives en lévitation continue
 * ---------------------------------------------------------------- */
export function FloatingShape({
  className,
  duration = 6,
  delay = 0,
  distance = 20,
  children,
}: {
  className?: string
  duration?: number
  delay?: number
  distance?: number
  children?: ReactNode
}) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      animate={
        reduce
          ? undefined
          : {
              y: [-distance, distance, -distance],
              rotate: [0, 8, 0],
            }
      }
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

/* Re-export pour usage direct */
export { motion, useReducedMotion, useScroll, useTransform }
