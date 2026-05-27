import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { ProductForm } from '@/components/admin/ProductForm'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await db.product.findUnique({ where: { id } })
  if (!product) notFound()

  return (
    <ProductForm
      mode="edit"
      initial={{
        id:          product.id,
        name:        product.name,
        slug:        product.slug,
        description: product.description ?? '',
        details:     product.details ?? '',
        price:       String(product.price),
        compareAt:   product.compareAt != null ? String(product.compareAt) : '',
        images:      product.images,
        category:    product.category,
        collection:  product.collection ?? '',
        material:    product.material ?? '',
        inStock:     product.inStock,
        featured:    product.featured,
        newArrival:  product.newArrival,
      }}
    />
  )
}
