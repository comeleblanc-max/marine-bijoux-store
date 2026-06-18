import Link from 'next/link'
import { Plus, ArrowUpDown } from 'lucide-react'
import { db } from '@/lib/db'
import { ProductsTable } from '@/components/admin/ProductsTable'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: 'desc' },
  })

  /* On sérialise les Decimal en number pour les passer au composant client */
  const data = products.map((p) => ({
    id:        p.id,
    name:      p.name,
    slug:      p.slug,
    images:    p.images,
    category:  p.category,
    price:     Number(p.price),
    compareAt: p.compareAt != null ? Number(p.compareAt) : null,
    inStock:   p.inStock,
    stock:     p.stock,
    featured:  p.featured,
    newArrival: p.newArrival,
  }))

  return (
    <div className="max-w-6xl">
      <AdminPageHeader
        title="Produits"
        subtitle={`${data.length} produit${data.length > 1 ? 's' : ''} en boutique`}
      >
        <Link
          href="/admin/products/reorder"
          className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-[#0E4F5E] text-[#0E4F5E] px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
        >
          <ArrowUpDown className="w-4 h-4" />
          Réordonner
        </Link>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-[#24BBD0] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1A9AAD] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter un produit
        </Link>
      </AdminPageHeader>

      <ProductsTable products={data} />
    </div>
  )
}
