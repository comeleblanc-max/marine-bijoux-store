import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { COLLECTIONS, PRODUCTS } from '@/lib/data'
import { ProductCard } from '@/components/product/ProductCard'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const collection = COLLECTIONS.find((c) => c.slug === slug)
  if (!collection) return {}
  return {
    title: collection.name,
    description: collection.description ?? undefined,
  }
}

export async function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }))
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params
  const collection = slug === 'all'
    ? { id: 'all', name: 'Tous les bijoux', slug: 'all', description: null, image: null, featured: false, order: 0 }
    : COLLECTIONS.find((c) => c.slug === slug)

  if (!collection) notFound()

  const products = slug === 'all'
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.category === slug || p.collection === slug)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#F5F1ED] py-16 px-4 text-center">
        <h1
          className="text-3xl sm:text-5xl text-[#1A3A52] font-light mb-3"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {collection.name}
        </h1>
        {collection.description && (
          <p className="text-gray-500 max-w-md mx-auto">{collection.description}</p>
        )}
        <p className="text-[#C9A84C] text-sm mt-2">{products.length} bijou{products.length > 1 ? 'x' : ''}</p>
      </div>

      {/* Products grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl">Bientôt disponible ✨</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
