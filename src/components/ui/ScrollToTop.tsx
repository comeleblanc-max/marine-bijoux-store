'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Remet la fenêtre en haut à chaque changement d'URL.
 *
 * Pourquoi en plusieurs étapes ? Parce que :
 *  - Le scroll immédiat peut être réécrasé par le rendu/l'animation du nouveau contenu
 *  - On scrolle aussi au tick suivant (requestAnimationFrame) après que React a posé le DOM
 *  - On scrolle ENCORE après un court délai pour gérer les animations longues
 */
export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const scrollNow = () => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    // 1) Scroll synchrone immédiat
    scrollNow()

    // 2) Scroll après le prochain rendu (au cas où une animation pousse le contenu)
    const raf = requestAnimationFrame(scrollNow)

    // 3) Scroll final après les transitions Framer Motion (~500 ms)
    const t = setTimeout(scrollNow, 60)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t)
    }
  }, [pathname])

  return null
}
