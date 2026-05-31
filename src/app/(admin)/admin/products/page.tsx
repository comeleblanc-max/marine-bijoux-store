import Link from 'next/link'
import { Plus } from 'lucide-react'
import { db } from '@/lib/db'
import { ProductsTable } from '@/components/admin/ProductsTable'

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
    featured:  p.featured,
    newArrival: p.newArrival,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
            Produits
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {data.length} produit{data.length > 1 ? 's' : ''} en boutique
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[#24BBD0] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#24BBD0]/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Ajouter un produit
        </Link>
      </div>

      <ProductsTable products={data} />
    </div>
  )
}
