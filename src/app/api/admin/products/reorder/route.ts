import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { bustStoreCache } from '@/lib/revalidate'

export const dynamic = 'force-dynamic'

async function ensureAdmin() {
  const session = await auth()
  if (!session?.user) return false
  return (session.user as { role?: string }).role === 'ADMIN'
}

/**
 * POST /api/admin/products/reorder
 * Body : { ids: string[] }  (du premier au dernier, dans l'ordre voulu)
 * Met à jour le champ sortOrder de chaque produit (incréments de 10 pour
 * laisser de la marge à de futurs ajouts).
 */
export async function POST(req: Request) {
  if (!(await ensureAdmin())) return NextResponse.json({ error: 'Non autorisée.' }, { status: 401 })
  try {
    const { ids } = await req.json()
    if (!Array.isArray(ids) || ids.some((x) => typeof x !== 'string')) {
      return NextResponse.json({ error: 'Liste invalide.' }, { status: 400 })
    }
    await db.$transaction(
      ids.map((id, i) =>
        db.product.update({ where: { id }, data: { sortOrder: (i + 1) * 10 } }),
      ),
    )
    bustStoreCache()
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[admin/products/reorder]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
