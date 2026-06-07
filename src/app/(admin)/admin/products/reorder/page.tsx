import { db } from '@/lib/db'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { ReorderProducts } from '@/components/admin/ReorderProducts'

export const dynamic = 'force-dynamic'

export default async function ReorderPage() {
  const products = await db.product.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    select:  { id: true, name: true, slug: true, images: true, category: true },
  })

  const items = products.map((p) => ({
    id:       p.id,
    name:     p.name,
    slug:     p.slug,
    image:    p.images[0] ?? null,
    category: p.category,
  }))

  return (
    <div>
      <AdminPageHeader
        title="Ordre d'affichage"
        subtitle="Glisse-dépose les bijoux pour réorganiser la page « Tous les bijoux »."
      />
      <ReorderProducts initial={items} />
    </div>
  )
}
