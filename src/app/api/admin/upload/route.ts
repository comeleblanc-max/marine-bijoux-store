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
 *
 * - Images normales : déjà redimensionnées en webp côté client → stockées telles quelles.
 * - Photos iPhone HEIC : converties côté serveur (heic-convert → JPEG → sharp → webp).
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
    if (file.size > 12 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image trop lourde (max 12 Mo).' }, { status: 413 })
    }

    const lowerName = (file.name || '').toLowerCase()
    const isHeic =
      file.type.includes('heic') || file.type.includes('heif') || /\.hei[cf]$/.test(lowerName)

    let body: Blob | Buffer = file
    let contentType = file.type
    let ext = EXT[file.type] ?? 'jpg'

    if (isHeic) {
      /* Décode le HEIC en JPEG, puis redimensionne/optimise en webp */
      const input  = Buffer.from(await file.arrayBuffer())
      const heicConvert = (await import('heic-convert')).default
      const jpeg   = await heicConvert({ buffer: input, format: 'JPEG', quality: 0.92 })
      const sharp  = (await import('sharp')).default
      const webp   = await sharp(Buffer.from(jpeg))
        .rotate()
        .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer()
      body        = webp
      contentType = 'image/webp'
      ext         = 'webp'
    } else if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Le fichier doit être une image.' }, { status: 400 })
    }

    const name = `products/${crypto.randomUUID()}.${ext}`
    const blob = await put(name, body, {
      access:          'public',
      contentType,
      addRandomSuffix: false,
    })

    return NextResponse.json({ url: blob.url })
  } catch (err) {
    console.error('[admin/upload]', err)
    return NextResponse.json({ error: "Échec du téléversement de l'image." }, { status: 500 })
  }
}
