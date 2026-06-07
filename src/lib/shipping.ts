/**
 * Logique de livraison par transporteur + zone.
 * 4 options : La Poste France, La Poste Europe, Mondial Relay France, Mondial Relay Europe.
 * Partagée entre l'API publique, le checkout serveur et l'affichage panier.
 */

export type ShipMethod = 'laposte-fr' | 'laposte-eu' | 'relay-fr' | 'relay-eu'

/** Pays autorisés par méthode (codes ISO Stripe). */
export const FRANCE_COUNTRIES = ['FR', 'MC'] as const
export const EUROPE_COUNTRIES = ['BE', 'LU', 'DE', 'NL', 'ES', 'IT', 'PT', 'AT', 'IE', 'CH'] as const

export interface ShippingConfig {
  freeThreshold:  number  // seuil livraison offerte (France, La Poste), en €
  standardFee:    number  // La Poste France
  europeFee:      number  // La Poste Europe
  mondialRelayFr: number  // Mondial Relay France
  mondialRelayEu: number  // Mondial Relay hors France
}

const METHOD_LABEL: Record<ShipMethod, string> = {
  'laposte-fr': 'La Poste — France',
  'laposte-eu': 'La Poste — Europe',
  'relay-fr':   'Mondial Relay — France',
  'relay-eu':   'Mondial Relay — Europe',
}

/**
 * Calcule les frais de port en centimes pour une méthode donnée.
 * - laposte-fr : gratuit si subtotal ≥ freeThreshold, sinon tarif fixe.
 * - autres : tarif fixe (pas de gratuité automatique).
 */
export function shippingCents(method: ShipMethod, subtotalCents: number, cfg: ShippingConfig): number {
  switch (method) {
    case 'laposte-fr':
      return subtotalCents >= cfg.freeThreshold * 100 ? 0 : Math.round(cfg.standardFee * 100)
    case 'laposte-eu':
      return Math.round(cfg.europeFee * 100)
    case 'relay-fr':
      return Math.round(cfg.mondialRelayFr * 100)
    case 'relay-eu':
      return Math.round(cfg.mondialRelayEu * 100)
  }
}

/** Pays autorisés Stripe selon la méthode choisie. */
export function allowedCountries(method: ShipMethod): string[] {
  if (method === 'laposte-fr' || method === 'relay-fr') return [...FRANCE_COUNTRIES]
  return [...EUROPE_COUNTRIES]
}

export function shippingLabel(method: ShipMethod, isFree: boolean): string {
  return isFree ? 'Livraison offerte' : METHOD_LABEL[method]
}
