import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Prisma } from '@prisma/client'
import { COLLECTIONS } from '@/lib/data'
import { db } from '@/lib/db'
import { getCategories } from '@/lib/categories'
import { serializeProducts } from '@/lib/serialize'
import { ProductCard } from '@/components/product/ProductCard'
import { Stagger, StaggerItem } from '@/components/ui/motion'
import { ShopFilters } from '@/components/shop/ShopFilters'

/* Cache ISR (60 s). Invalidé depuis l'admin sur sauvegarde produit / réordon. */
export const revalidate = 60

const VALID_SORTS = new Set(['manual', 'new', 'price-asc', 'price-desc'])

interface PageProps {
  params:       Promise<{ slug: string }>
  searchParams: Promise<{ cat?: string; sort?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  if (slug === 'all') {
    return { title: 'Tous les bijoux — Marine et la douceur de l\'été' }
  }
  const col = COLLECTIONS.find((c) => c.slug === slug)
  return { title: col ? `${col.name} — Marine` : 'Collection' }
}

/* Choix du tri Prisma en fonction du paramètre URL. */
function orderByFor(sort: string): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case 'new':        return [{ newArrival: 'desc' }, { createdAt: 'desc' }]
    case 'price-asc':  return [{ price: 'asc' }, { createdAt: 'desc' }]
    case 'price-desc': return [{ price: 'desc' }, { createdAt: 'desc' }]
    default:           return [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
  }
}

export default async function CollectionPage({ params, searchParams }: PageProps) {
  const { slug }     = await params
  const sp           = await searchParams
  const rawCat       = (sp.cat  ?? '').toLowerCase()
  const rawSort      = (sp.sort ?? '').toLowerCase()
  const categories   = await getCategories()
  const validCats    = new Set(categories.map((c) => c.slug))
  const activeCat    = validCats.has(rawCat) ? rawCat : null
  const activeSort   = VALID_SORTS.has(rawSort) ? rawSort : 'manual'

  let title       = 'Tous les bijoux'
  let description = 'Découvrez l\'intégralité de la collection.'
  let eyebrow     = 'Boutique'

  let raw
  if (slug === 'all') {
    raw = await db.product.findMany({
      where:   activeCat ? { category: activeCat } : undefined,
      orderBy: orderByFor(activeSort),
    })
  } else {
    /* Le slug est-il une catégorie admin OU une collection statique (data.ts) ? */
    const cat = categories.find((c) => c.slug === slug)
    const col = COLLECTIONS.find((c) => c.slug === slug)
    if (!cat && !col) notFound()
    raw = await db.product.findMany({
      where:   { OR: [{ category: slug }, { collection: slug }] },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    title       = cat?.name ?? col!.name
    description = cat?.description ?? col?.description ?? ''
    eyebrow     = slug === 'lumiere-dete' ? 'Collection' : 'Catégorie'
  }

  const products = serializeProducts(raw)
  const isShop   = slug === 'all'

  return (
    <div className="bg-white">
      {/* En-tête de collection */}
      <section className="border-b border-[#E8E2D5] py-14 sm:py-20 bg-[#FAF5EA]">
        <div className="container-x text-center">
          {/* Fil d'Ariane */}
          <nav className="flex items-center justify-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#6B6B6B] mb-5">
            <Link href="/" className="hover:text-[#0E4F5E] transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-[#0E4F5E]">{title}</span>
          </nav>

          <p className="eyebrow mb-3">{eyebrow}</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl text-[#0E4F5E] mb-4">{title}</h1>
          {description && (
            <p className="text-[#6B6B6B] max-w-lg mx-auto leading-relaxed">{description}</p>
          )}
        </div>
      </section>

      {/* Grille produits */}
      <section className="py-10 sm:py-14">
        <div className="container-x">
          {isShop && (
            <ShopFilters
              categories={categories.map((c) => ({ slug: c.slug, label: c.name }))}
              activeCat={activeCat}
              activeSort={activeSort}
              count={products.length}
            />
          )}

          {products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#6B6B6B]">
                {isShop && activeCat
                  ? 'Aucun bijou dans cette catégorie pour le moment.'
                  : 'Aucun bijou pour le moment.'}
              </p>
              <Link
                href={isShop && activeCat ? '/collections/all' : '/'}
                className="btn-ghost mt-6 inline-flex"
              >
                {isShop && activeCat ? 'Voir tous les bijoux' : 'Retour à l\'accueil'}
              </Link>
            </div>
          ) : (
            <Stagger
              key={`${activeCat ?? 'all'}-${activeSort}`}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
            >
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
