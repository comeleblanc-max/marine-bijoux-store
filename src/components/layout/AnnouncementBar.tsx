'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const MESSAGES = [
  'Livraison offerte dès 60 €',
  'Paiement en 3× sans frais à partir de 50 €',
  'Acier inoxydable hypoallergénique — ne ternit pas',
  'Retours gratuits sous 14 jours',
]

export function AnnouncementBar() {
  const [i, setI] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % MESSAGES.length), 4500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="bg-[#1F3A56] text-white">
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
            {MESSAGES[i]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
