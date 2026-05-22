'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const [visible, setVisible] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [hovering, setHovering] = useState(false)

  const rawX = useMotionValue(-200)
  const rawY = useMotionValue(-200)

  const x = useSpring(rawX, { stiffness: 500, damping: 35, mass: 0.3 })
  const y = useSpring(rawY, { stiffness: 500, damping: 35, mass: 0.3 })

  useEffect(() => {
    // Ne s'active que sur les appareils avec une souris fine (pas tactile)
    if (!window.matchMedia('(pointer: fine)').matches) return

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
      setVisible(true)

      const el = document.elementFromPoint(e.clientX, e.clientY)
      setHovering(!!el?.closest('a, button, input, select, textarea, label, [role="button"]'))
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)
    const onDown  = () => setClicking(true)
    const onUp    = () => setClicking(false)

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
    }
  }, [rawX, rawY])

  return (
    <motion.div
      style={{ x, y }}
      animate={{
        opacity: visible ? 1 : 0,
        scale: clicking ? 0.7 : hovering ? 1.5 : 1,
        rotate: clicking ? 25 : 0,
      }}
      transition={{
        opacity: { duration: 0.15 },
        scale: { type: 'spring', stiffness: 400, damping: 20 },
        rotate: { type: 'spring', stiffness: 400, damping: 20 },
      }}
      className="fixed top-0 left-0 z-[9999] pointer-events-none -translate-x-1/2 -translate-y-1/2 select-none"
    >
      <span className="block text-2xl" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))' }}>
        🐚
      </span>
    </motion.div>
  )
}
