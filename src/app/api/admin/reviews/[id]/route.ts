import { NextResponse } from 'next/server'
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
    const review = await db.review.update({ where: { id }, data: { approved: !!approved } })
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
    await db.review.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[admin/reviews DELETE]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
