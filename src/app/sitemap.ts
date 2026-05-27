import { MetadataRoute } from 'next'
import { COLLECTIONS } from '@/lib/data'
import { BLOG_POSTS } from '@/data/blog'
import { db } from '@/lib/db'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://marineetladouceurdelete.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const staticPages = [
    { url: BASE_URL, lastModified: now, priority: 1.0 },
    { url: `${BASE_URL}/collections/all`, lastModified: now, priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: now, priority: 0.8 },
    { url: `${BASE_URL}/pages/a-propos`, lastModified: now, priority: 0.7 },
    { url: `${BASE_URL}/pages/contact`, lastModified: now, priority: 0.7 },
    { url: `${BASE_URL}/pages/faq`, lastModified: now, priority: 0.7 },
    { url: `${BASE_URL}/pages/livraison`, lastModified: now, priority: 0.6 },
    { url: `${BASE_URL}/pages/remboursement`, lastModified: now, priority: 0.6 },
    { url: `${BASE_URL}/pages/cgv`, lastModified: now, priority: 0.5 },
    { url: `${BASE_URL}/pages/confidentialite`, lastModified: now, priority: 0.5 },
    { url: `${BASE_URL}/pages/mentions-legales`, lastModified: now, priority: 0.5 },
  ]

  /* Produits depuis la base */
  const products = await db.product.findMany({
    select: { slug: true, updatedAt: true },
  })
  const productPages = products.map((p) => ({
    url: `${BASE_URL}/products/${p.slug}`,
    lastModified: p.updatedAt,
    priority: 0.8,
  }))

  const collectionPages = COLLECTIONS.map((c) => ({
    url: `${BASE_URL}/collections/${c.slug}`,
    lastModified: now,
    priority: 0.7,
  }))

  const blogPages = BLOG_POSTS.map((b) => ({
    url: `${BASE_URL}/blog/${b.slug}`,
    lastModified: now,
    priority: 0.6,
  }))

  return [...staticPages, ...productPages, ...collectionPages, ...blogPages]
}
