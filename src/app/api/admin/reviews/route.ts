import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'

async function ensureAdmin() {
  const session = await auth()
  if (!session?.user) return false
  return (session.user as { role?: string }).role === 'ADMIN'
}

/**
 * GET /api/admin/reviews?status=pending|approved|all
 */
export async function GET(req: Request) {
  if (!(await ensureAdmin())) return NextResponse.json({ error: 'Non autorisée.' }, { status: 401 })

  const url    = new URL(req.url)
  const status = url.searchParams.get('status') ?? 'all'

  const where =
    status === 'pending'  ? { approved: false } :
    status === 'approved' ? { approved: true }  :
    {}

  const reviews = await db.review.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { product: { select: { slug: true, name: true, images: true } } },
  })

  const counts = await db.review.groupBy({
    by: ['approved'],
    _count: { _all: true },
  })
  const pending  = counts.find((c) => c.approved === false)?._count._all ?? 0
  const approved = counts.find((c) => c.approved === true )?._count._all ?? 0

  return NextResponse.json({ reviews, pending, approved })
}
