import { NextResponse } from 'next/server'
import { getSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

/**
 * GET /api/shipping  (public)
 * Renvoie la config livraison pour l'afficher dans le panier / checkout.
 */
export async function GET() {
  const s = await getSettings()
  return NextResponse.json({
    freeThreshold:  s.shipping.freeThreshold,
    franceFee:      s.shipping.standardFee,
    europeFee:      s.shipping.europeFee,
    mondialRelayFr: s.shipping.mondialRelayFr,
    mondialRelayEu: s.shipping.mondialRelayEu,
    deliveryDays:   s.shipping.deliveryDays,
  })
}
