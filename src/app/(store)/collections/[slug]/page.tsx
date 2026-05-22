import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { COLLECTIONS, PRODUCTS } from '@/lib/data'
import { ProductCard } from '@/components/product/ProductCard'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/motion'

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
  const collection =
    slug === 'all'
      ? {
          id: 'all',
          name: 'Tous les bijoux',
          slug: 'all',
          description: 'Découvrez l\'intégralité de notre univers estival.',
          image: null,
          featured: false,
          order: 0,
        }
      : COLLECTIONS.find((c) => c.slug === slug)

  if (!collection) notFound()

  const products =
    slug === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === slug || p.collection === slug)

  return (
    <div className="min-h-screen bg-white">
      {/* En-tête */}
      <div className="bg-gradient-to-br from-[#F5F1ED] to-[#ede6db] py-16 sm:py-20 px-4 text-center">
        <Reveal>
          <h1
            className="text-3xl sm:text-5xl text-[#1A3A52] font-light mb-3"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {collection.name}
          </h1>
          {collection.description && (
            <p className="text-gray-500 max-w-md mx-auto">{collection.description}</p>
          )}
          <p className="text-[#C9A84C] text-sm mt-3 font-medium">
            {products.length} bijou{products.length > 1 ? 'x' : ''}
          </p>
        </Reveal>
      </div>

      {/* Grille produits */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        {products.length === 0 ? (
          <Reveal className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🌊</p>
            <p className="text-xl">Bientôt disponible ✨</p>
          </Reveal>
        ) : (
          <Stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </div>
  )
}
