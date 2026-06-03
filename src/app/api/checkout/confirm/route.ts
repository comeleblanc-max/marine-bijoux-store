import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { fulfillOrder } from '@/lib/orders'

export const dynamic = 'force-dynamic'

/**
 * POST /api/checkout/confirm   body: { sessionId }
 *
 * Filet de sécurité : quand la cliente arrive sur la page de confirmation,
 * on récupère la session Stripe et on crée la commande si le webhook ne l'a
 * pas (encore) fait. Idempotent grâce à fulfillOrder (anti-doublon stripeId).
 */
export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json()
    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'Session manquante.' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    /* On ne crée la commande que si le paiement est bien validé */
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ ok: false, pending: true })
    }

    const { orderId, created } = await fulfillOrder(session)
    return NextResponse.json({ ok: true, orderId, created })
  } catch (err) {
    console.error('[checkout/confirm] erreur :', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
