'use client'

import { useSyncExternalStore } from 'react'

/**
 * Hook React 19 friendly pour les media queries.
 * Utilise useSyncExternalStore : pas de setState dans useEffect → pas d'avertissement lint.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', callback)
      return () => mql.removeEventListener('change', callback)
    },
    () => window.matchMedia(query).matches,
    () => false, // valeur côté serveur (SSR) — on suppose desktop
  )
}
