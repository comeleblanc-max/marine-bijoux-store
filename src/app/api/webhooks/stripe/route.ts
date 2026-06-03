import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { fulfillOrder } from '@/lib/orders'

export const dynamic = 'force-dynamic'

/**
 * POST /api/webhooks/stripe
 *
 * Reçoit les événements Stripe. Sur "checkout.session.completed", crée la
 * commande + envoie les emails (via fulfillOrder, partagé avec la page succès).
 *
 * À configurer côté Stripe :
 *  Webhooks → URL : https://<domaine>/api/webhooks/stripe
 *  Événement : checkout.session.completed
 *  → Secret de signature dans STRIPE_WEBHOOK_SECRET (Vercel)
 */
export async function POST(req: Request) {
  const body      = await req.text()
  const signature = req.headers.get('stripe-signature')
  const secret    = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature || !secret) {
    console.error('[stripe webhook] STRIPE_WEBHOOK_SECRET manquant')
    return NextResponse.json({ error: 'Webhook secret manquant.' }, { status: 500 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret)
  } catch (err) {
    console.error('[stripe webhook] signature invalide :', err)
    return NextResponse.json({ error: 'Signature invalide.' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    try {
      await fulfillOrder(session)
    } catch (err) {
      console.error('[stripe webhook] erreur traitement :', err)
      return NextResponse.json({ error: 'Erreur traitement commande.' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
