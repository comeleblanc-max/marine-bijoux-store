import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

/**
 * POST /api/webhooks/stripe
 *
 * Reçoit les événements Stripe. Sur "checkout.session.completed" :
 *  - Crée la commande dans la base de données
 *  - Envoie un email de confirmation à la cliente
 *  - Envoie une notification à l'admin
 *
 * À configurer côté Stripe :
 *  Dashboard → Développeurs → Webhooks → "Ajouter un endpoint"
 *  URL : https://<ton-domaine>/api/webhooks/stripe
 *  Événement à écouter : checkout.session.completed
 *  → Copier le "Secret de signature" et le mettre dans STRIPE_WEBHOOK_SECRET (Vercel)
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

  /* On ne traite que les paiements complétés */
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      await handleCheckoutComplete(session)
    } catch (err) {
      console.error('[stripe webhook] erreur traitement :', err)
      return NextResponse.json({ error: 'Erreur traitement commande.' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  /* Évite les doublons si Stripe ré-envoie l'événement */
  const existing = await db.order.findFirst({ where: { stripeId: session.id } })
  if (existing) return

  const metadata  = session.metadata ?? {}
  const userId    = metadata.userId || null
  const itemsJSON = metadata.itemsJSON ?? '[]'
  let orderItems: Array<{ productId: string; name: string; image: string; quantity: number; priceCents: number }> = []
  try { orderItems = JSON.parse(itemsJSON) } catch { orderItems = [] }

  const totalCents = session.amount_total ?? 0
  const email      = session.customer_details?.email ?? session.customer_email ?? ''
  const name       = session.customer_details?.name ?? ''
  /* Stripe stocke l'adresse de livraison dans collected_information OU customer_details suivant la version d'API */
  const sessionAny = session as unknown as { collected_information?: { shipping_details?: { address?: Stripe.Address; name?: string } }; shipping_details?: { address?: Stripe.Address; name?: string } }
  const address    =
    sessionAny.collected_information?.shipping_details?.address ??
    sessionAny.shipping_details?.address ??
    session.customer_details?.address ??
    null

  /* Crée la commande + ses items */
  const order = await db.order.create({
    data: {
      userId:          userId || undefined,
      email,
      status:          'CONFIRMED',
      total:           totalCents / 100,
      stripeId:        session.id,
      shippingName:    name || email.split('@')[0],
      shippingAddress: address ? [address.line1, address.line2].filter(Boolean).join(' — ') : '',
      shippingCity:    address?.city  ?? '',
      shippingZip:     address?.postal_code ?? '',
      shippingCountry: address?.country     ?? 'FR',
      items: {
        create: orderItems.map((it) => ({
          productId: it.productId,
          name:      it.name,
          image:     it.image,
          quantity:  it.quantity,
          price:     it.priceCents / 100,
        })),
      },
    },
  })

  /* Emails de notification (best-effort) */
  await Promise.allSettled([
    sendCustomerEmail({ email, name, orderId: order.id, totalCents, items: orderItems }),
    sendAdminEmail({ email, name, orderId: order.id, totalCents, items: orderItems, address }),
  ])
}

/* ─────────── Emails ─────────── */

const resendApiKey = process.env.RESEND_API_KEY || ''
const fromEmail   = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev'
const adminEmail  = process.env.CONTACT_TO_EMAIL || ''

async function sendCustomerEmail({
  email, name, orderId, totalCents, items,
}: { email: string; name: string; orderId: string; totalCents: number; items: Array<{ name: string; quantity: number; priceCents: number }> }) {
  if (!email || !resendApiKey) return
  const resend = new Resend(resendApiKey)

  const itemsHtml = items.map((it) =>
    `<tr><td style="padding:6px 0">${escape(it.name)} × ${it.quantity}</td><td style="text-align:right">${(it.priceCents * it.quantity / 100).toFixed(2)} €</td></tr>`
  ).join('')

  await resend.emails.send({
    from: `Marine et la douceur de l'été <${fromEmail}>`,
    to:   [email],
    subject: `Confirmation de votre commande #${orderId.slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:560px;margin:auto;color:#0E4F5E">
        <div style="background:#24BBD0;color:white;padding:32px 24px;text-align:center">
          <h1 style="margin:0;font-weight:300;font-size:24px">Merci pour votre commande !</h1>
        </div>
        <div style="padding:28px 24px;background:#FAF5EA">
          <p style="margin:0 0 16px 0">Bonjour ${escape(name) || 'à vous'},</p>
          <p style="margin:0 0 16px 0">Votre commande <strong>#${orderId.slice(-8).toUpperCase()}</strong> est bien confirmée 🐚</p>
          <p style="margin:0 0 24px 0">Nous préparons vos bijoux avec soin et vous écrirons dès l'expédition (sous 1-2 jours ouvrés).</p>
          <table style="width:100%;background:white;padding:16px;border-radius:8px">
            ${itemsHtml}
            <tr><td colspan="2" style="border-top:1px solid #E8E2D5;padding-top:8px"></td></tr>
            <tr><td style="padding-top:8px;font-weight:600">Total</td><td style="text-align:right;font-weight:600;color:#D4AF37">${(totalCents/100).toFixed(2)} €</td></tr>
          </table>
          <p style="margin:24px 0 0 0;font-size:13px;color:#6B6B6B">À très vite,<br/>Marine</p>
        </div>
      </div>
    `,
  })
}

async function sendAdminEmail({
  email, name, orderId, totalCents, items, address,
}: { email: string; name: string; orderId: string; totalCents: number; items: Array<{ name: string; quantity: number; priceCents: number }>; address: { line1?: string | null; line2?: string | null; city?: string | null; postal_code?: string | null; country?: string | null } | null }) {
  if (!adminEmail || !resendApiKey) return
  const resend = new Resend(resendApiKey)

  const itemsList = items.map((it) => `• ${it.name} × ${it.quantity} (${(it.priceCents * it.quantity / 100).toFixed(2)} €)`).join('<br>')
  const addressStr = address ? `${address.line1 ?? ''} ${address.line2 ?? ''}<br>${address.postal_code ?? ''} ${address.city ?? ''} — ${address.country ?? ''}` : '—'

  await resend.emails.send({
    from: `Marine — Site <${fromEmail}>`,
    to:   [adminEmail],
    replyTo: email,
    subject: `🎉 Nouvelle commande — ${(totalCents/100).toFixed(2)} € — #${orderId.slice(-8).toUpperCase()}`,
    html: `
      <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:560px;margin:auto;color:#0E4F5E">
        <h1 style="margin:0 0 16px 0">Nouvelle commande</h1>
        <p><strong>Numéro :</strong> #${orderId.slice(-8).toUpperCase()}</p>
        <p><strong>Cliente :</strong> ${escape(name)} &lt;${escape(email)}&gt;</p>
        <p><strong>Adresse :</strong><br>${addressStr}</p>
        <p><strong>Articles :</strong><br>${itemsList}</p>
        <p style="font-size:18px;color:#D4AF37;font-weight:600">Total : ${(totalCents/100).toFixed(2)} €</p>
        <p style="margin-top:24px;font-size:12px;color:#6B6B6B">Voir tous les détails dans ton tableau de bord admin.</p>
      </div>
    `,
  })
}

function escape(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
