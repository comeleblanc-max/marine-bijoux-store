/**
 * Source unique des données produits.
 * Ce fichier ré-exporte tout depuis src/lib/data.ts pour éviter les doublons.
 * Pour modifier les bijoux, éditer UNIQUEMENT src/lib/data.ts
 */
import type { Product } from '@/types'
import { PRODUCTS, COLLECTIONS } from '@/lib/data'

export { PRODUCTS, COLLECTIONS, TESTIMONIALS, ANNOUNCEMENTS } from '@/lib/data'

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug) ?? null
}

export function getCollection(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug) ?? null
}

export function getProductsByCollection(slug: string) {
  if (slug === 'all') return PRODUCTS
  const col = getCollection(slug)
  if (!col) return []
  return PRODUCTS.filter((p) => p.category === slug || p.collection === slug)
}

export function getFeaturedProducts() {
  return PRODUCTS.filter((p) => p.featured)
}

export function getNewArrivals() {
  return PRODUCTS.filter((p) => p.newArrival)
}

export function getRelatedProducts(product: Product, limit = 4) {
  return PRODUCTS.filter(
    (p) =>
      p.id !== product.id &&
      (p.category === product.category || p.collection === product.collection)
  ).slice(0, limit)
}
