import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { auth } from '@/auth'
import { getSettings } from '@/lib/settings'

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

    /* Frais de port (depuis les paramètres) */
    const settings = await getSettings()
    const free     = subtotalCents >= settings.shipping.freeThreshold * 100
    const shipping = free ? 0 : Math.round(settings.shipping.standardFee * 100)

    /* User connecté ? */
    const session = await auth()
    const userId  = session?.user ? (session.user as { id?: string }).id : null
    const email   = session?.user?.email ?? undefined

    const baseUrl = getBaseUrl(req)

    const checkout = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      currency: 'eur',
      customer_email: email,
      shipping_address_collection: { allowed_countries: ['FR', 'BE', 'CH', 'LU', 'MC', 'DE', 'IT', 'ES', 'NL'] },
      phone_number_collection: { enabled: true },
      billing_address_collection: 'auto',
      shipping_options: shipping > 0
        ? [{
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: { amount: shipping, currency: 'eur' },
              display_name:  'Livraison standard',
              delivery_estimate: {
                minimum: { unit: 'business_day', value: 2 },
                maximum: { unit: 'business_day', value: 4 },
              },
            },
          }]
        : [{
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: { amount: 0, currency: 'eur' },
              display_name:  'Livraison offerte',
              delivery_estimate: {
                minimum: { unit: 'business_day', value: 2 },
                maximum: { unit: 'business_day', value: 4 },
              },
            },
          }],
      automatic_tax: { enabled: false },
      locale: 'fr',
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${baseUrl}/checkout`,
      metadata: {
        userId:   userId ?? '',
        itemsJSON: JSON.stringify(orderItems),
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
