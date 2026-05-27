/**
 * Fonctions serveur pour lire les produits depuis la base de données.
 * À utiliser dans les pages server-side ou les API routes.
 */
import { db } from '@/lib/db'

export async function getAllProducts() {
  return db.product.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function getProductBySlug(slug: string) {
  return db.product.findUnique({ where: { slug } })
}

export async function getProductById(id: string) {
  return db.product.findUnique({ where: { id } })
}

export async function getFeaturedProducts(limit = 4) {
  return db.product.findMany({
    where:   { featured: true, inStock: true },
    take:    limit,
    orderBy: { createdAt: 'desc' },
  })
}

export async function getNewArrivals(limit = 4) {
  return db.product.findMany({
    where:   { newArrival: true, inStock: true },
    take:    limit,
    orderBy: { createdAt: 'desc' },
  })
}

export async function getProductsByCategory(category: string) {
  return db.product.findMany({
    where:   { category },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getProductsByCollection(collection: string) {
  return db.product.findMany({
    where:   { collection },
    orderBy: { createdAt: 'desc' },
  })
}
