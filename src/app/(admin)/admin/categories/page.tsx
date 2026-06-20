import { db } from '@/lib/db'
import { getCategories } from '@/lib/categories'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { CategoriesManager } from '@/components/admin/CategoriesManager'

export const dynamic = 'force-dynamic'

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  /* Compteur de produits par catégorie pour afficher dans le manager */
  const grouped = await db.product.groupBy({
    by:    ['category'],
    _count: { _all: true },
  })
  const counts: Record<string, number> = {}
  for (const g of grouped) counts[g.category] = g._count._all

  return (
    <div className="max-w-3xl">
      <AdminPageHeader
        title="Catégories"
        subtitle="Crée, renomme et réordonne les catégories de bijoux de la boutique."
      />
      <CategoriesManager initial={categories} counts={counts} />
    </div>
  )
}
