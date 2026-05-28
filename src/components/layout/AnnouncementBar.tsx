'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  enabled?:  boolean
  messages?: string[]
}

export function AnnouncementBar({ enabled = true, messages = [] }: Props) {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (messages.length < 2) return
    const t = setInterval(() => setI((x) => (x + 1) % messages.length), 4500)
    return () => clearInterval(t)
  }, [messages.length])

  if (!enabled || messages.length === 0) return null

  return (
    <div className="bg-[#24BBD0] text-white">
      <div className="container-x h-9 flex items-center justify-center relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-[11px] tracking-[0.2em] uppercase font-medium absolute"
          >
            {messages[i]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
