'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useMediaQuery } from '@/hooks/useMediaQuery'

export function CustomCursor() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [visible, setVisible] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [hovering, setHovering] = useState(false)

  const rawX = useMotionValue(-100)
  const rawY = useMotionValue(-100)

  const x = useSpring(rawX, { stiffness: 500, damping: 35, mass: 0.3 })
  const y = useSpring(rawY, { stiffness: 500, damping: 35, mass: 0.3 })

  useEffect(() => {
    if (isMobile) return

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
      setVisible(true)
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)
    const onDown = () => setClicking(true)
    const onUp = () => setClicking(false)

    const onHoverStart = () => {
      const els = document.querySelectorAll('a, button, [role="button"], input, select, textarea, label')
      els.forEach(el => {
        el.addEventListener('mouseenter', () => setHovering(true))
        el.addEventListener('mouseleave', () => setHovering(false))
      })
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)
    onHoverStart()

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
    }
  }, [isMobile, rawX, rawY])

  // Masquer le curseur natif via CSS
  useEffect(() => {
    if (isMobile) return
    document.body.style.cursor = 'none'
    const links = document.querySelectorAll('a, button')
    links.forEach(el => ((el as HTMLElement).style.cursor = 'none'))
    return () => {
      document.body.style.cursor = ''
    }
  }, [isMobile])

  if (isMobile) return null

  return (
    <>
      {/* Curseur principal — coquillage */}
      <motion.div
        style={{ x, y }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: clicking ? 0.75 : hovering ? 1.4 : 1,
          rotate: clicking ? 20 : 0,
        }}
        transition={{ opacity: { duration: 0.2 }, scale: { type: 'spring', stiffness: 400, damping: 20 } }}
        className="fixed top-0 left-0 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2 select-none"
      >
        <span
          className="block text-2xl drop-shadow-md"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
        >
          🐚
        </span>
      </motion.div>

      {/* Halo autour du curseur */}
      <motion.div
        style={{ x, y }}
        animate={{
          opacity: visible ? (hovering ? 0.5 : 0.25) : 0,
          scale: hovering ? 1.8 : 1,
        }}
        transition={{ opacity: { duration: 0.3 }, scale: { type: 'spring', stiffness: 200, damping: 25 } }}
        className="fixed top-0 left-0 z-[9998] pointer-events-none -translate-x-1/2 -translate-y-1/2"
      >
        <div className="w-10 h-10 rounded-full border border-[#C9A84C]/60 bg-[#C9A84C]/10 backdrop-blur-sm" />
      </motion.div>
    </>
  )
}
