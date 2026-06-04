import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { PREVIEW_CODE, PREVIEW_COOKIE } from '@/lib/launch'

export const dynamic = 'force-dynamic'

/**
 * POST /api/preview-unlock   body: { code }
 * Valide le code d'accès anticipé et pose un cookie qui débloque la boutique.
 */
export async function POST(req: Request) {
  try {
    const { code } = await req.json()
    if (
      typeof code === 'string' &&
      code.trim().toLowerCase() === PREVIEW_CODE.toLowerCase()
    ) {
      const jar = await cookies()
      jar.set(PREVIEW_COOKIE, '1', {
        httpOnly: true,
        secure:   process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path:     '/',
        maxAge:   60 * 60 * 24 * 30, // 30 jours
      })
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ ok: false, error: 'Code incorrect.' }, { status: 401 })
  } catch {
    return NextResponse.json({ ok: false, error: 'Requête invalide.' }, { status: 400 })
  }
}
