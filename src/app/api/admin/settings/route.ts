import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getSettings, updateSettings } from '@/lib/settings'
import { bustStoreCache } from '@/lib/revalidate'

async function ensureAdmin() {
  const session = await auth()
  if (!session?.user) return false
  return (session.user as { role?: string }).role === 'ADMIN'
}

export async function GET() {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ error: 'Non autorisée.' }, { status: 401 })
  }
  const settings = await getSettings()
  return NextResponse.json({ settings })
}

export async function PATCH(req: Request) {
  if (!(await ensureAdmin())) {
    return NextResponse.json({ error: 'Non autorisée.' }, { status: 401 })
  }
  try {
    const body     = await req.json()
    const settings = await updateSettings(body)
    bustStoreCache()
    return NextResponse.json({ ok: true, settings })
  } catch (err) {
    console.error('[admin/settings PATCH] erreur :', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
