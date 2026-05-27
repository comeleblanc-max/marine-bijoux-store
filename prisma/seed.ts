/**
 * Seed initial — copie les produits du fichier statique (src/lib/data.ts) vers la base.
 *
 * Logique :
 *   - Pour chaque produit : on regarde s'il existe déjà (par slug)
 *   - S'il n'existe PAS → on le crée
 *   - S'il existe DÉJÀ → on ne touche à rien (les modifs admin sont préservées)
 *
 * Exécuté automatiquement à chaque build Vercel via package.json :
 *   "build": "prisma generate && prisma db push && tsx prisma/seed.ts && next build"
 */
import { PrismaClient } from '@prisma/client'
import { PRODUCTS } from '../src/lib/data'

const db = new PrismaClient()

async function main() {
  console.log('🌱 Seed des produits…')

  let createdCount = 0
  let skippedCount = 0

  for (const p of PRODUCTS) {
    const exists = await db.product.findUnique({ where: { slug: p.slug } })

    if (exists) {
      skippedCount++
      continue
    }

    await db.product.create({
      data: {
        name:        p.name,
        slug:        p.slug,
        description: p.description ?? null,
        details:     p.details ?? null,
        price:       p.price,
        compareAt:   p.compareAt ?? null,
        images:      p.images,
        category:    p.category,
        collection:  p.collection ?? null,
        material:    p.material ?? null,
        inStock:     p.inStock ?? true,
        featured:    p.featured ?? false,
        newArrival:  p.newArrival ?? false,
      },
    })
    createdCount++
  }

  console.log(`✅ Seed terminé : ${createdCount} produit(s) créé(s), ${skippedCount} ignoré(s) (déjà en base).`)
}

main()
  .catch((err) => {
    console.error('❌ Erreur seed :', err)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
