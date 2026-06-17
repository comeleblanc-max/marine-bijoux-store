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
 * GET /api/admin/products/[id] → récupère un produit
 */
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await ensureAdmin())) return unauthorized()
  const { id } = await params

  const product = await db.product.findUnique({ where: { id } })
  if (!product) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })
  return NextResponse.json({ product })
}

/**
 * PATCH /api/admin/products/[id] → modifie un produit
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await ensureAdmin())) return unauthorized()
  const { id } = await params

  try {
    const body = await req.json()
    const allowed = [
      'name', 'description', 'details', 'price', 'compareAt',
      'images', 'category', 'collection', 'material',
      'inStock', 'featured', 'newArrival',
    ] as const

    const data: Record<string, unknown> = {}
    for (const key of allowed) {
      if (key in body) {
        let val = body[key]
        if (key === 'price' && val != null && val !== '') val = Number(val)
        if (key === 'compareAt') val = val != null && val !== '' ? Number(val) : null
        if ((key === 'description' || key === 'details' || key === 'collection' || key === 'material') && val === '') val = null
        data[key] = val
      }
    }

    const product = await db.product.update({ where: { id }, data })
    bustStoreCache({ productSlug: product.slug })
    return NextResponse.json({ ok: true, product })
  } catch (err) {
    console.error('[admin/products PATCH] erreur :', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/products/[id] → supprime un produit
 */
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await ensureAdmin())) return unauthorized()
  const { id } = await params

  try {
    const before = await db.product.findUnique({ where: { id }, select: { slug: true } })
    await db.product.delete({ where: { id } })
    bustStoreCache({ productSlug: before?.slug })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[admin/products DELETE] erreur :', err)
    return NextResponse.json(
      { error: 'Impossible de supprimer (peut-être lié à des commandes existantes).' },
      { status: 500 }
    )
  }
}
