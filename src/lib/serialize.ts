/**
 * Sérialisation des produits Prisma → format passable aux composants client.
 *
 * Prisma renvoie les prix en Decimal (BigNumber), mais les composants client
 * (ProductCard, ProductRow…) attendent des numbers. On convertit ici.
 */
import type { Product as DbProduct } from '@prisma/client'
import type { Product } from '@/types'

export function serializeProduct(p: DbProduct): Product {
  return {
    id:          p.id,
    name:        p.name,
    slug:        p.slug,
    description: p.description,
    details:     p.details,
    price:       Number(p.price),
    compareAt:   p.compareAt != null ? Number(p.compareAt) : null,
    images:      p.images,
    category:    p.category,
    collection:  p.collection,
    material:    p.material,
    inStock:     p.inStock,
    featured:    p.featured,
    newArrival:  p.newArrival,
    variants:    [],
    createdAt:   p.createdAt,
  }
}

export function serializeProducts(list: DbProduct[]): Product[] {
  return list.map(serializeProduct)
}
