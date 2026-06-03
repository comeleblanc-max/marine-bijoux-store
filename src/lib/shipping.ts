/**
 * Logique de livraison par zone (France / Europe).
 * Partagé entre l'API publique, le checkout serveur et l'affichage panier.
 */

export type ShipZone = 'france' | 'europe'

/** Pays autorisés par zone (codes ISO Stripe). */
export const FRANCE_COUNTRIES = ['FR', 'MC'] as const
export const EUROPE_COUNTRIES = ['BE', 'LU', 'DE', 'NL', 'ES', 'IT', 'PT', 'AT', 'IE', 'CH'] as const

export interface ShippingConfig {
  freeThreshold: number  // seuil livraison offerte (France), en €
  standardFee:   number  // frais France, en €
  europeFee:     number  // frais Europe, en €
}

/**
 * Calcule les frais de port en centimes pour une zone donnée.
 * - France : gratuit dès le seuil, sinon tarif France.
 * - Europe : tarif fixe (pas de gratuité automatique).
 */
export function shippingCents(zone: ShipZone, subtotalCents: number, cfg: ShippingConfig): number {
  if (zone === 'france') {
    return subtotalCents >= cfg.freeThreshold * 100 ? 0 : Math.round(cfg.standardFee * 100)
  }
  return Math.round(cfg.europeFee * 100)
}

/** Pays autorisés Stripe selon la zone choisie. */
export function allowedCountries(zone: ShipZone): string[] {
  return zone === 'france' ? [...FRANCE_COUNTRIES] : [...EUROPE_COUNTRIES]
}
