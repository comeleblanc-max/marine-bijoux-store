import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'
import { db } from '@/lib/db'

async function ensureAdmin() {
  const session = await auth()
  if (!session?.user) return false
  return (session.user as { role?: string }).role === 'ADMIN'
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await ensureAdmin())) return NextResponse.json({ error: 'Non autorisée.' }, { status: 401 })
  const { id } = await params
  try {
    const { approved } = await req.json()
    const review = await db.review.update({
      where:   { id },
      data:    { approved: !!approved },
      include: { product: { select: { slug: true } } },
    })
    /* Bust tous les caches Next qui pourraient servir une version périmée
       de la fiche produit ou de l'API publique des avis. */
    if (review.product?.slug) {
      revalidatePath(`/products/${review.product.slug}`)
      revalidatePath(`/api/products/${review.product.slug}/reviews`)
    }
    return NextResponse.json({ ok: true, review })
  } catch (err) {
    console.error('[admin/reviews PATCH]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await ensureAdmin())) return NextResponse.json({ error: 'Non autorisée.' }, { status: 401 })
  const { id } = await params
  try {
    const removed = await db.review.delete({
      where:   { id },
      include: { product: { select: { slug: true } } },
    })
    if (removed.product?.slug) {
      revalidatePath(`/products/${removed.product.slug}`)
      revalidatePath(`/api/products/${removed.product.slug}/reviews`)
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[admin/reviews DELETE]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
