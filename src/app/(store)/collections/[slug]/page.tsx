import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { COLLECTIONS } from '@/lib/data'
import { db } from '@/lib/db'
import { serializeProducts } from '@/lib/serialize'
import { ProductCard } from '@/components/product/ProductCard'
import { Stagger, StaggerItem } from '@/components/ui/motion'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  if (slug === 'all') {
    return { title: 'Tous les bijoux — Marine et la douceur de l\'été' }
  }
  const col = COLLECTIONS.find((c) => c.slug === slug)
  return { title: col ? `${col.name} — Marine` : 'Collection' }
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params

  let title       = 'Tous les bijoux'
  let description = 'Découvrez l\'intégralité de la collection.'
  let eyebrow     = 'Boutique'

  let raw
  if (slug === 'all') {
    raw = await db.product.findMany({ orderBy: { createdAt: 'desc' } })
  } else {
    const col = COLLECTIONS.find((c) => c.slug === slug)
    if (!col) notFound()
    raw = await db.product.findMany({
      where:   { OR: [{ category: slug }, { collection: slug }] },
      orderBy: { createdAt: 'desc' },
    })
    title       = col.name
    description = col.description ?? ''
    eyebrow     = col.slug === 'lumiere-dete' ? 'Collection' : 'Catégorie'
  }

  const products = serializeProducts(raw)

  return (
    <div className="bg-white">
      {/* En-tête de collection */}
      <section className="border-b border-[#E8E2D5] py-14 sm:py-20 bg-[#FAF5EA]">
        <div className="container-x text-center">
          {/* Fil d'Ariane */}
          <nav className="flex items-center justify-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#6B6B6B] mb-5">
            <Link href="/" className="hover:text-[#1F3A56] transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-[#1F3A56]">{title}</span>
          </nav>

          <p className="eyebrow mb-3">{eyebrow}</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl text-[#1F3A56] mb-4">{title}</h1>
          {description && (
            <p className="text-[#6B6B6B] max-w-lg mx-auto leading-relaxed">{description}</p>
          )}
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#D4AF37] mt-6">
            {products.length} bijou{products.length > 1 ? 'x' : ''}
          </p>
        </div>
      </section>

      {/* Grille produits */}
      <section className="py-14 sm:py-20">
        <div className="container-x">
          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#6B6B6B]">Aucun bijou dans cette catégorie pour le moment.</p>
              <Link href="/collections/all" className="btn-ghost mt-6 inline-flex">
                Voir tous les bijoux
              </Link>
            </div>
          ) : (
            <Stagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {products.map((p) => (
                <StaggerItem key={p.id}>
                  <ProductCard product={p} />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </section>
    </div>
  )
}
