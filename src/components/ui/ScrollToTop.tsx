'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Remet la fenêtre en haut à chaque changement de page (URL).
 * Sans ça, Next.js conserve la position de scroll précédente,
 * ce qui peut donner l'impression d'être resté sur la même page.
 */
export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])

  return null
}
