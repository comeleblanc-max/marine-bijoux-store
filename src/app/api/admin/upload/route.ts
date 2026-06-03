import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { auth } from '@/auth'

export const runtime = 'nodejs'

async function ensureAdmin() {
  const session = await auth()
  if (!session?.user) return false
  return (session.user as { role?: string }).role === 'ADMIN'
}

const EXT: Record<string, string> = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png':  'png',
}

/**
 * POST /api/admin/upload  (multipart/form-data, champ "file")
 * Téléverse une image produit sur Vercel Blob et renvoie son URL public.
 * Le fichier est déjà redimensionné côté client (≈ webp < 1 Mo).
 */
export async function POST(req: Request) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ error: 'Non autorisée.' }, { status: 401 })
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Le stockage d'images n'est pas encore activé (Vercel Blob). Voir la configuration." },
      { status: 503 },
    )
  }

  try {
    const form = await req.formData()
    const file = form.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Aucun fichier reçu.' }, { status: 400 })
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Le fichier doit être une image.' }, { status: 400 })
    }
    // Garde-fou : le client redimensionne déjà, on plafonne à 8 Mo.
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image trop lourde (max 8 Mo).' }, { status: 413 })
    }

    const ext  = EXT[file.type] ?? 'jpg'
    const name = `products/${crypto.randomUUID()}.${ext}`

    const blob = await put(name, file, {
      access:      'public',
      contentType: file.type,
      addRandomSuffix: false,
    })

    return NextResponse.json({ url: blob.url })
  } catch (err) {
    console.error('[admin/upload]', err)
    return NextResponse.json({ error: "Échec du téléversement de l'image." }, { status: 500 })
  }
}
