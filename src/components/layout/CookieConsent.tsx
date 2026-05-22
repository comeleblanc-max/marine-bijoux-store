'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { motion } from '@/components/ui/motion'

const STORAGE_KEY = 'marine-cookie-consent'
const EASE = [0.22, 1, 0.36, 1] as const

type Choice = 'all' | 'essential'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) setVisible(true)

    const openPreferences = () => setVisible(true)
    window.addEventListener('open-cookie-preferences', openPreferences)
    return () =>
      window.removeEventListener('open-cookie-preferences', openPreferences)
  }, [])

  const choose = (choice: Choice) => {
    localStorage.setItem(STORAGE_KEY, choice)
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-[55] bg-white rounded-2xl shadow-2xl border border-gray-100 p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Cookie className="w-5 h-5 text-[#C9A45F]" />
            <h3 className="font-semibold text-[#1A1A1A] text-sm">
              Préférences cookies
            </h3>
          </div>
          <p className="text-gray-500 text-xs leading-relaxed mb-4">
            Nous utilisons des cookies pour améliorer votre expérience, mesurer
            l'audience et personnaliser le contenu. Vous pouvez accepter ou
            limiter aux cookies essentiels.{' '}
            <Link
              href="/pages/cookies"
              className="text-[#C9A45F] hover:underline"
              onClick={() => setVisible(false)}
            >
              En savoir plus
            </Link>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => choose('essential')}
              className="flex-1 py-2.5 text-xs font-medium text-[#1A1A1A] border border-gray-200 rounded-lg hover:bg-[#FAF7F2] transition-colors"
            >
              Essentiels uniquement
            </button>
            <button
              onClick={() => choose('all')}
              className="flex-1 py-2.5 text-xs font-semibold text-white bg-[#C9A45F] rounded-lg hover:bg-[#b8963e] transition-colors"
            >
              Tout accepter
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
