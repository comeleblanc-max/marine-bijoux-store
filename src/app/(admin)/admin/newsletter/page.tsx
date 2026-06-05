import { db } from '@/lib/db'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { NewsletterList } from '@/components/admin/NewsletterList'

export const dynamic = 'force-dynamic'

export default async function AdminNewsletterPage() {
  const subs = await db.newsletter.findMany({ orderBy: { createdAt: 'desc' } })
  const data = subs.map((s) => ({ email: s.email, createdAt: s.createdAt.toISOString() }))

  return (
    <div className="max-w-3xl">
      <AdminPageHeader
        title="Newsletter"
        subtitle={`${data.length} inscrite${data.length > 1 ? 's' : ''}`}
      />
      <NewsletterList subscribers={data} />
    </div>
  )
}
