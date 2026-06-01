import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

/** Toujours frais — un avis fraîchement approuvé doit apparaître sans délai. */
export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * GET /api/products/[slug]/reviews
 * Retourne les avis approuvés + la moyenne + le nombre total.
 */
export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const product = await db.product.findUnique({ where: { slug } })
  if (!product) return NextResponse.json({ error: 'Produit introuvable.' }, { status: 404 })

  const reviews = await db.review.findMany({
    where:  { productId: product.id, approved: true },
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, rating: true, comment: true, createdAt: true },
  })

  const count   = reviews.length
  const average = count > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0

  return NextResponse.json({ reviews, count, average: Number(average.toFixed(2)) })
}

/**
 * POST /api/products/[slug]/reviews
 * Crée un avis en attente de modération admin.
 * Body : { name, rating (1-5), comment }
 */
export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const { name, rating, comment } = await req.json()

    if (!name || !rating || !comment) {
      return NextResponse.json({ error: 'Tous les champs sont requis.' }, { status: 400 })
    }
    const r = Number(rating)
    if (r < 1 || r > 5) {
      return NextResponse.json({ error: 'Note invalide (1 à 5).' }, { status: 400 })
    }

    const product = await db.product.findUnique({ where: { slug } })
    if (!product) return NextResponse.json({ error: 'Produit introuvable.' }, { status: 404 })

    await db.review.create({
      data: {
        productId: product.id,
        name:      String(name).slice(0, 60).trim(),
        rating:    Math.round(r),
        comment:   String(comment).slice(0, 1000).trim(),
        approved:  false,
      },
    })

    return NextResponse.json({ ok: true, message: 'Merci ! Votre avis sera publié après validation.' })
  } catch (err) {
    console.error('[reviews POST]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
