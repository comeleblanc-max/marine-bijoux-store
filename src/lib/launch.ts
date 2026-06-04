/**
 * Verrouillage "Bientôt disponible" avant le lancement.
 *
 * Avant LAUNCH_DATE, la boutique affiche une page de décompte avec un code
 * d'accès anticipé. Après cette date, le site s'ouvre automatiquement.
 *
 * Pour modifier : change LAUNCH_DATE et/ou PREVIEW_CODE ci-dessous
 * (ou via les variables d'environnement NEXT_PUBLIC_LAUNCH_DATE / PREVIEW_CODE).
 */

/** Date/heure d'ouverture officielle (fuseau Paris). */
export const LAUNCH_DATE =
  process.env.NEXT_PUBLIC_LAUNCH_DATE || '2026-06-15T00:00:00+02:00'

export const LAUNCH_TS = new Date(LAUNCH_DATE).getTime()

/** Code secret pour accéder au site en avant-première. */
export const PREVIEW_CODE = process.env.PREVIEW_CODE || 'MARINE2026'

/** Nom du cookie qui mémorise l'accès anticipé. */
export const PREVIEW_COOKIE = 'preview_ok'

/** Le site est-il officiellement lancé ? */
export function isLaunched(now: number = Date.now()): boolean {
  return Number.isFinite(LAUNCH_TS) && now >= LAUNCH_TS
}
