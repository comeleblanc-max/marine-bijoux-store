/**
 * Code promo BIENVENUE10 — 10 % de réduction pour la première commande.
 *
 * Logique :
 *   - L'utilisatrice saisit son email + le code sur la page checkout.
 *   - Si elle n'a JAMAIS payé de commande avec cet email, on applique
 *     un coupon Stripe « BIENVENUE10 » à la session checkout.
 *   - Le coupon est créé à la volée côté Stripe si nécessaire (idempotent).
 *
 * Statuts de commande considérés comme « déjà passée » :
 *   CONFIRMED, PROCESSING, SHIPPED, DELIVERED, REFUNDED.
 *   On ignore PENDING (panier abandonné) et CANCELLED.
 */
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'

export const WELCOME_CODE    = 'BIENVENUE10'
export const WELCOME_PERCENT = 10
export const WELCOME_COUPON_ID = 'welcome-bienvenue10-10pct'

const COUNTS_AS_PRIOR_ORDER = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'REFUNDED'] as const

/** Normalise un code saisi par l'utilisatrice (case + espaces). */
export function normalizeCode(raw: string | undefined | null): string {
  return String(raw ?? '').trim().toUpperCase()
}

/** L'email est-il syntaxiquement plausible ? Pas de validation stricte. */
function plausibleEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export type WelcomeCheck =
  | { ok: true }
  | { ok: false; reason: string }

/**
 * Vérifie qu'on peut appliquer le code de bienvenue à cet email :
 *   - email plausible
 *   - aucune commande payée n'existe déjà pour cet email
 */
export async function validateWelcomeCode(code: string, email: string): Promise<WelcomeCheck> {
  if (normalizeCode(code) !== WELCOME_CODE) {
    return { ok: false, reason: 'Code promo inconnu.' }
  }
  const e = email.trim().toLowerCase()
  if (!plausibleEmail(e)) {
    return { ok: false, reason: 'Merci d\'indiquer l\'email qui servira à la commande.' }
  }
  const prior = await db.order.count({
    where: {
      email:  { equals: e, mode: 'insensitive' },
      status: { in: [...COUNTS_AS_PRIOR_ORDER] },
    },
  })
  if (prior > 0) {
    return { ok: false, reason: 'Ce code est réservé à la première commande — votre email a déjà commandé.' }
  }
  return { ok: true }
}

/**
 * Crée (ou récupère) le coupon Stripe BIENVENUE10. Idempotent : on tente
 * d'abord un retrieve, on crée seulement si introuvable.
 * Le coupon n'a aucune restriction côté Stripe : c'est notre code serveur
 * qui décide quand l'attacher à une session.
 */
export async function ensureWelcomeCoupon(): Promise<string> {
  try {
    const existing = await stripe.coupons.retrieve(WELCOME_COUPON_ID)
    if (existing && !existing.deleted) return existing.id
  } catch {
    /* not found → on le crée juste après */
  }
  const created = await stripe.coupons.create({
    id:         WELCOME_COUPON_ID,
    percent_off: WELCOME_PERCENT,
    duration:   'once',
    name:       'Bienvenue — 10 % sur la 1ʳᵉ commande',
  })
  return created.id
}
