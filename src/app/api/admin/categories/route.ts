import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { updateSettings, type CategoryEntry } from '@/lib/settings'
import { slugify } from '@/lib/categories'
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
 * PUT /api/admin/categories
 * Body: { categories: CategoryEntry[] }
 * Remplace la liste complète des catégories. Valide + normalise les slugs.
 */
export async function PUT(req: Request) {
  if (!(await ensureAdmin())) return unauthorized()

  try {
    const body = await req.json()
    const raw  = Array.isArray(body?.categories) ? body.categories : null
    if (!raw) return NextResponse.json({ error: 'Format invalide.' }, { status: 400 })

    /* Normalisation + dédoublonnage par slug */
    const seen = new Set<string>()
    const clean: CategoryEntry[] = []
    for (const c of raw) {
      const name = String(c?.name ?? '').trim()
      if (!name) continue
      const slug = slugify(String(c?.slug ?? name))
      if (!slug || seen.has(slug)) continue
      seen.add(slug)
      clean.push({
        slug,
        name,
        image:       c?.image ? String(c.image) : undefined,
        description: c?.description ? String(c.description) : undefined,
      })
    }
    if (clean.length === 0) {
      return NextResponse.json({ error: 'Au moins une catégorie est requise.' }, { status: 400 })
    }

    /* Détection des produits dont la catégorie n'existe plus */
    const removedSlugs = await db.product.findMany({
      where:  { category: { notIn: clean.map((c) => c.slug) } },
      select: { id: true, name: true, category: true },
    })

    const updated = await updateSettings({ categories: clean })
    bustStoreCache()
    return NextResponse.json({ ok: true, categories: updated.categories, orphans: removedSlugs })
  } catch (err) {
    console.error('[admin/categories PUT] erreur :', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
