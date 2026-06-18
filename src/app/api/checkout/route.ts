import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { auth } from '@/auth'
import { getSettings } from '@/lib/settings'
import { shippingCents, allowedCountries, shippingLabel, type ShipMethod } from '@/lib/shipping'
import { normalizeCode, validateWelcomeCode, ensureWelcomeCoupon, WELCOME_CODE } from '@/lib/promo'

const VALID_METHODS: ShipMethod[] = ['laposte-fr', 'laposte-eu', 'relay-fr', 'relay-eu']

/** Type des pays autorisés, dérivé directement de la signature Stripe. */
type CreateParams = NonNullable<Parameters<typeof stripe.checkout.sessions.create>[0]>
type AllowedCountries = NonNullable<CreateParams['shipping_address_collection']>['allowed_countries']

/**
 * Montant minimum facturable par Stripe en EUR : 0,50 €.
 * Si un prix est en dessous (ex. produit mis à 0,10 € pour un test), on le
 * remonte automatiquement à ce plancher pour éviter une erreur Stripe.
 * N'affecte jamais les vrais bijoux (tous > 0,50 €).
 */
const STRIPE_MIN_CENTS = 50

/**
 * POST /api/checkout
 *
 * Crée une session Stripe Checkout à partir du panier reçu.
 * Valide les produits et leurs prix depuis la base (sécurité).
 *
 * Body :
 *   {
 *     items: [{ productId: string, quantity: number }, …]
 *   }
 *
 * Retour : { url: string } → l'URL Stripe où rediriger l'utilisateur.
 */
export async function POST(req: Request) {
  try {
    const body  = await req.json()
    const items = body.items as Array<{ productId: string; quantity: number }>
    /* Compat. : si on reçoit l'ancien "zone", on retombe sur La Poste. */
    const method: ShipMethod =
      VALID_METHODS.includes(body.method)
        ? body.method
        : body.zone === 'europe' ? 'laposte-eu' : 'laposte-fr'
    const relayPoint = typeof body.relayPoint === 'string' ? body.relayPoint.slice(0, 280) : ''
    const promoCode  = normalizeCode(body.promoCode)
    const promoEmail = typeof body.promoEmail === 'string' ? body.promoEmail.trim().toLowerCase() : ''

    if (!items?.length) {
      return NextResponse.json({ error: 'Panier vide.' }, { status: 400 })
    }

    /* Récupère les produits depuis la BDD (jamais faire confiance au prix envoyé par le client) */
    const productIds = items.map((i) => i.productId)
    const products   = await db.product.findMany({
      where: { id: { in: productIds }, inStock: true },
    })

    if (products.length === 0) {
      return NextResponse.json({ error: 'Produits introuvables.' }, { status: 400 })
    }

    /* Vérifie qu'on a assez de stock pour chaque ligne du panier. On ne réserve
       pas (la décrémentation se fait quand le paiement est confirmé), mais on
       refuse au moins de partir en checkout sur un produit déjà épuisé ou en
       quantité insuffisante. */
    for (const item of items) {
      const p = products.find((x) => x.id === item.productId)
      if (!p) continue
      const qty = Math.max(1, Math.floor(item.quantity))
      if (p.stock < qty) {
        return NextResponse.json(
          {
            error: p.stock === 0
              ? `« ${p.name } » est épuisé.`
              : `« ${p.name} » : il ne reste que ${p.stock} en stock (vous en demandez ${qty}).`,
          },
          { status: 409 },
        )
      }
    }

    /* Construit les lignes Stripe en utilisant les VRAIS prix de la base */
    const lineItems: Array<{
      price_data: {
        currency: string
        product_data: {
          name: string
          images?: string[]
          metadata: { productId: string }
        }
        unit_amount: number
      }
      quantity: number
    }> = []
    let subtotalCents = 0
    const orderItems: Array<{ productId: string; name: string; image: string; quantity: number; priceCents: number }> = []

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId)
      if (!product) continue

      const rawCents   = Math.round(Number(product.price) * 100)
      const priceCents = Math.max(rawCents, STRIPE_MIN_CENTS) // plancher Stripe 0,50 €
      const qty        = Math.max(1, Math.min(99, Math.floor(item.quantity)))

      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.name,
            images: product.images.slice(0, 1).map((img) => img.startsWith('http') ? img : `${getBaseUrl(req)}${img}`),
            metadata: { productId: product.id },
          },
          unit_amount: priceCents,
        },
        quantity: qty,
      })

      subtotalCents += priceCents * qty
      orderItems.push({
        productId: product.id,
        name:      product.name,
        image:     product.images[0] ?? '',
        quantity:  qty,
        priceCents,
      })
    }

    /* Frais de port selon la méthode choisie */
    const settings = await getSettings()
    const shipping = shippingCents(method, subtotalCents, {
      freeThreshold:  settings.shipping.freeThreshold,
      standardFee:    settings.shipping.standardFee,
      europeFee:      settings.shipping.europeFee,
      mondialRelayFr: settings.shipping.mondialRelayFr,
      mondialRelayEu: settings.shipping.mondialRelayEu,
    })
    const shipLabel = shippingLabel(method, shipping === 0)

    /* User connecté ? */
    const session = await auth()
    const userId  = session?.user ? (session.user as { id?: string }).id : null
    const email   = session?.user?.email ?? undefined

    /* Code promo de bienvenue : on valide côté serveur que c'est bien la
       première commande de cet email avant d'attacher le coupon Stripe. */
    let appliedCouponId: string | null = null
    let appliedPromoLabel: string | null = null
    if (promoCode) {
      const promoEmailToCheck = promoEmail || email || ''
      const check = await validateWelcomeCode(promoCode, promoEmailToCheck)
      if (!check.ok) {
        return NextResponse.json({ error: check.reason }, { status: 400 })
      }
      appliedCouponId = await ensureWelcomeCoupon()
      appliedPromoLabel = WELCOME_CODE
    }

    const baseUrl = getBaseUrl(req)

    const checkout = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      currency: 'eur',
      customer_email: email,
      shipping_address_collection: {
        allowed_countries: allowedCountries(method) as AllowedCountries,
      },
      phone_number_collection: { enabled: true },
      billing_address_collection: 'auto',
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: shipping, currency: 'eur' },
          display_name:  shipLabel,
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 2 },
            maximum: { unit: 'business_day', value: method.endsWith('-eu') ? 7 : 4 },
          },
        },
      }],
      automatic_tax: { enabled: false },
      locale: 'fr',
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${baseUrl}/checkout`,
      ...(appliedCouponId ? { discounts: [{ coupon: appliedCouponId }] } : {}),
      metadata: {
        userId:      userId ?? '',
        itemsJSON:   JSON.stringify(orderItems),
        shipMethod:  method,
        shipLabel,
        relayPoint:  relayPoint,
        promoCode:   appliedPromoLabel ?? '',
      },
    })

    return NextResponse.json({ url: checkout.url, id: checkout.id })
  } catch (err) {
    console.error('[checkout POST] erreur :', err)
    const msg = err instanceof Error ? err.message : 'Erreur serveur.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

function getBaseUrl(req: Request): string {
  const proto = req.headers.get('x-forwarded-proto') ?? 'https'
  const host  = req.headers.get('host')
  if (host) return `${proto}://${host}`
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://marine-bijoux-store.vercel.app'
}
