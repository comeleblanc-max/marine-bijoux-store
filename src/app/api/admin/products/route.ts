import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { bustStoreCache } from '@/lib/revalidate'

function unauthorized() {
  return NextResponse.json({ error: 'Non autorisée.' }, { status: 401 })
}

async function ensureAdmin() {
  const session = await auth()
  if (!session?.user) return false
  return (session.user as { role?: string }).role === 'ADMIN'
}

/**
 * GET /api/admin/products → liste tous les produits
 */
export async function GET() {
  if (!(await ensureAdmin())) return unauthorized()

  const products = await db.product.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ products })
}

/**
 * POST /api/admin/products → crée un nouveau produit
 */
export async function POST(req: Request) {
  if (!(await ensureAdmin())) return unauthorized()

  try {
    const body = await req.json()
    const {
      name, slug, description, details, price, compareAt,
      images, category, collection, material,
      stock, featured, newArrival,
    } = body

    if (!name || !slug || !category || price == null) {
      return NextResponse.json(
        { error: 'Nom, slug, catégorie et prix sont requis.' },
        { status: 400 }
      )
    }

    const existing = await db.product.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { error: 'Un produit avec ce slug existe déjà.' },
        { status: 409 }
      )
    }

    const product = await db.product.create({
      data: {
        name,
        slug,
        description: description || null,
        details:     details     || null,
        price:       Number(price),
        compareAt:   compareAt != null && compareAt !== '' ? Number(compareAt) : null,
        images:      Array.isArray(images) ? images : [],
        category,
        collection:  collection || null,
        material:    material   || null,
        stock:       Math.max(0, Math.floor(Number(stock) || 0)),
        inStock:     Math.max(0, Math.floor(Number(stock) || 0)) > 0,
        featured:    !!featured,
        newArrival:  !!newArrival,
      },
    })

    bustStoreCache({ productSlug: product.slug })
    return NextResponse.json({ ok: true, product })
  } catch (err) {
    console.error('[admin/products POST] erreur :', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
