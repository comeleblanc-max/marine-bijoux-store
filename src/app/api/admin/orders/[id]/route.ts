import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { Resend } from 'resend'

async function ensureAdmin() {
  const session = await auth()
  if (!session?.user) return false
  return (session.user as { role?: string }).role === 'ADMIN'
}

/* Pour générer un lien de tracking utile à la cliente */
const TRACKING_URLS: Record<string, (n: string) => string> = {
  colissimo:    (n) => `https://www.laposte.fr/outils/suivre-vos-envois?code=${encodeURIComponent(n)}`,
  laposte:      (n) => `https://www.laposte.fr/outils/suivre-vos-envois?code=${encodeURIComponent(n)}`,
  mondialrelay: (n) => `https://www.mondialrelay.fr/suivi-de-colis?numeroExpedition=${encodeURIComponent(n)}`,
  chronopost:   (n) => `https://www.chronopost.fr/tracking-no-cms/suivi-page?listeNumerosLT=${encodeURIComponent(n)}`,
}

const CARRIER_LABEL: Record<string, string> = {
  colissimo:    'Colissimo',
  laposte:      'La Poste',
  mondialrelay: 'Mondial Relay',
  chronopost:   'Chronopost',
  autre:        'Transporteur',
}

/**
 * GET /api/admin/orders/[id] — détail d'une commande
 */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await ensureAdmin())) return NextResponse.json({ error: 'Non autorisée.' }, { status: 401 })
  const { id } = await params
  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: true,
      user:  { select: { id: true, name: true, email: true } },
    },
  })
  if (!order) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  return NextResponse.json({ order })
}

/**
 * PATCH /api/admin/orders/[id] — modifie une commande
 * Body : { status?, trackingNumber?, trackingCarrier?, adminNote? }
 *
 * Si on passe en SHIPPED → envoie un email à la cliente avec le tracking.
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await ensureAdmin())) return NextResponse.json({ error: 'Non autorisée.' }, { status: 401 })
  const { id } = await params

  try {
    const body = await req.json()
    const allowedStatus = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']

    const data: Record<string, unknown> = {}
    if ('status' in body) {
      if (!allowedStatus.includes(body.status)) {
        return NextResponse.json({ error: 'Statut invalide.' }, { status: 400 })
      }
      data.status = body.status
    }
    if ('trackingNumber'  in body) data.trackingNumber  = body.trackingNumber  || null
    if ('trackingCarrier' in body) data.trackingCarrier = body.trackingCarrier || null
    if ('adminNote'       in body) data.adminNote       = body.adminNote       || null

    /* Récupère l'ancienne version pour comparer */
    const before = await db.order.findUnique({ where: { id }, include: { items: true } })
    if (!before) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

    /* Si on passe en SHIPPED maintenant, on marque la date */
    if (data.status === 'SHIPPED' && before.status !== 'SHIPPED') {
      data.shippedAt = new Date()
    }
    if (data.status === 'DELIVERED' && before.status !== 'DELIVERED') {
      data.deliveredAt = new Date()
    }

    const updated = await db.order.update({
      where:  { id },
      data,
      include: { items: true },
    })

    /* Envoi d'email automatique quand on passe en SHIPPED */
    if (data.status === 'SHIPPED' && before.status !== 'SHIPPED') {
      const carrier = updated.trackingCarrier ?? ''
      const number  = updated.trackingNumber  ?? ''
      await sendShippedEmail(updated, carrier, number).catch((err) =>
        console.error('[admin/orders PATCH] email expédition échoué :', err),
      )
    }

    return NextResponse.json({ ok: true, order: updated })
  } catch (err) {
    console.error('[admin/orders PATCH] erreur :', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

type OrderForEmail = {
  id: string
  email: string
  total: { toString(): string } | number | string
  shippingName: string | null
  shippingAddress: string
  shippingCity: string
  shippingZip: string
  items: Array<{ name: string; quantity: number; image: string | null }>
}

async function sendShippedEmail(order: OrderForEmail, carrier: string, trackingNumber: string) {
  const apiKey   = process.env.RESEND_API_KEY
  const fromMail = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev'
  if (!apiKey || !order.email) return

  const resend = new Resend(apiKey)
  const carrierName = CARRIER_LABEL[carrier] ?? CARRIER_LABEL.autre
  const trackingUrl = trackingNumber && TRACKING_URLS[carrier] ? TRACKING_URLS[carrier](trackingNumber) : null

  const orderShortId = order.id.slice(-8).toUpperCase()
  const itemsList = order.items.map((it) =>
    `<tr><td style="padding:6px 0">${escapeHtml(it.name)} × ${it.quantity}</td></tr>`
  ).join('')

  await resend.emails.send({
    from: `Marine et la douceur de l'été <${fromMail}>`,
    to:   [order.email],
    subject: `📦 Votre commande #${orderShortId} a été expédiée !`,
    html: `
      <div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:560px;margin:auto;color:#0E4F5E">
        <div style="background:#24BBD0;color:white;padding:32px 24px;text-align:center">
          <h1 style="margin:0;font-weight:300;font-size:24px">Votre colis est en route 📦</h1>
        </div>
        <div style="padding:28px 24px;background:#FAF5EA">
          <p style="margin:0 0 16px 0">Bonjour ${escapeHtml(order.shippingName || '')},</p>
          <p style="margin:0 0 16px 0">Bonne nouvelle ! Votre commande <strong>#${orderShortId}</strong> vient d'être expédiée 🐚</p>
          ${trackingNumber ? `
            <div style="background:white;padding:16px;border-radius:8px;margin:16px 0;text-align:center">
              <p style="margin:0 0 6px 0;font-size:13px;color:#6B6B6B">Transporteur</p>
              <p style="margin:0 0 12px 0;font-weight:600">${escapeHtml(carrierName)}</p>
              <p style="margin:0 0 6px 0;font-size:13px;color:#6B6B6B">Numéro de suivi</p>
              <p style="margin:0 0 16px 0;font-family:monospace;font-size:15px;letter-spacing:1px">${escapeHtml(trackingNumber)}</p>
              ${trackingUrl ? `<a href="${trackingUrl}" style="display:inline-block;background:#0E4F5E;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:500">Suivre mon colis →</a>` : ''}
            </div>
          ` : ''}
          <p style="margin:0 0 16px 0">Récap de votre commande :</p>
          <table style="width:100%;background:white;padding:12px;border-radius:8px;margin-bottom:16px">
            ${itemsList}
          </table>
          <p style="margin:24px 0 0 0;font-size:13px;color:#6B6B6B">Adresse de livraison :<br>
            ${escapeHtml(order.shippingName || '')}<br>
            ${escapeHtml(order.shippingAddress)}<br>
            ${escapeHtml(order.shippingZip)} ${escapeHtml(order.shippingCity)}
          </p>
          <p style="margin:24px 0 0 0;font-size:13px;color:#6B6B6B">Belle journée,<br>Marine 🐚</p>
        </div>
      </div>
    `,
  })
}

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
