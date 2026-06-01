import { db } from '@/lib/db'
import { ReviewsModeration } from '@/components/admin/ReviewsModeration'

export const dynamic = 'force-dynamic'

export default async function AdminReviewsPage() {
  const reviews = await db.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: { product: { select: { slug: true, name: true, images: true } } },
  })

  /* Sérialise pour le client (Date → string) */
  const data = reviews.map((r) => ({
    id:        r.id,
    name:      r.name,
    rating:    r.rating,
    comment:   r.comment,
    approved:  r.approved,
    createdAt: r.createdAt.toISOString(),
    product:   r.product ? { slug: r.product.slug, name: r.product.name, image: r.product.images[0] ?? null } : null,
  }))

  return <ReviewsModeration initial={data} />
}
