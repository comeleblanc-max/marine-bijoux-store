/**
 * Création de commande à partir d'une session Stripe — logique partagée
 * entre le webhook Stripe et la page de confirmation (fallback robuste).
 *
 * Idempotent : si une commande existe déjà pour cette session (stripeId),
 * on ne recrée rien et on ne renvoie pas d'email en double.
 */
import type Stripe from 'stripe'
import { db } from '@/lib/db'
import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY || ''
const fromEmail    = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev'
const adminEmail   = process.env.CONTACT_TO_EMAIL || ''

interface OrderItemMeta {
  productId: string
  name: string
  image: string
  quantity: number
  priceCents: number
}

/**
 * Crée la commande (+ items) et envoie les emails, si elle n'existe pas déjà.
 * @returns { orderId, created } — created=false si la commande existait déjà.
 */
export async function fulfillOrder(session: Stripe.Checkout.Session): Promise<{ orderId: string; created: boolean }> {
  /* Anti-doublon : webhook ET page succès peuvent appeler cette fonction */
  const existing = await db.order.findFirst({ where: { stripeId: session.id } })
  if (existing) return { orderId: existing.id, created: false }

  const metadata  = session.metadata ?? {}
  const userId    = metadata.userId || null
  const itemsJSON = metadata.itemsJSON ?? '[]'
  const shipLabel = metadata.shipLabel ?? ''
  const relayPoint = metadata.relayPoint ?? ''
  const promoCode  = metadata.promoCode || null
  /* Stripe expose le total avant remise (amount_subtotal) et après
     (amount_total). La différence inclut aussi les frais de port, donc
     on calcule le discount uniquement à partir de total_details. */
  const discountCents = session.total_details?.amount_discount ?? 0
  let orderItems: OrderItemMeta[] = []
  try { orderItems = JSON.parse(itemsJSON) } catch { orderItems = [] }

  const totalCents = session.amount_total ?? 0
  const email      = session.customer_details?.email ?? session.customer_email ?? ''
  const name       = session.customer_details?.name ?? ''
  const sessionAny = session as unknown as {
    collected_information?: { shipping_details?: { address?: Stripe.Address; name?: string } }
    shipping_details?: { address?: Stripe.Address; name?: string }
  }
  const address =
    sessionAny.collected_information?.shipping_details?.address ??
    sessionAny.shipping_details?.address ??
    session.customer_details?.address ??
    null

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
      promoCode:       promoCode || null,
      discount:        discountCents > 0 ? discountCents / 100 : null,
      adminNote: [
        shipLabel ? `Livraison choisie : ${shipLabel}` : '',
        relayPoint ? `Point relais : ${relayPoint}` : '',
        promoCode ? `Code promo : ${promoCode} (-${(discountCents / 100).toFixed(2)} €)` : '',
      ].filter(Boolean).join('\n') || null,
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

  /* Décrémente le stock pour chaque ligne. Si on tombe à 0, on bascule
     automatiquement inStock=false (le filet en checkout ne laissera plus
     personne ajouter ce produit au panier). On agrège les quantités par
     produit au cas où la même réf apparaît plusieurs fois dans la commande. */
  const decrementByProduct = new Map<string, number>()
  for (const it of orderItems) {
    decrementByProduct.set(it.productId, (decrementByProduct.get(it.productId) ?? 0) + it.quantity)
  }
  await Promise.allSettled(
    Array.from(decrementByProduct.entries()).map(async ([productId, qty]) => {
      const p = await db.product.findUnique({ where: { id: productId }, select: { stock: true } })
      if (!p) return
      const newStock = Math.max(0, p.stock - qty)
      await db.product.update({
        where: { id: productId },
        data:  { stock: newStock, inStock: newStock > 0 },
      })
    }),
  )

  await Promise.allSettled([
    sendCustomerEmail({ email, name, orderId: order.id, totalCents, items: orderItems }),
    sendAdminEmail({ email, name, orderId: order.id, totalCents, items: orderItems, address }),
  ])

  return { orderId: order.id, created: true }
}

/* ─────────── Emails ─────────── */

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

  const itemsList = items.map((it) => `• ${escape(it.name)} × ${it.quantity} (${(it.priceCents * it.quantity / 100).toFixed(2)} €)`).join('<br>')
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
