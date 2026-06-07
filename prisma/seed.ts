/**
 * Seed — synchronise les produits de src/lib/data.ts avec la base.
 *
 * Logique :
 *   1. Pour chaque produit :
 *      - S'il n'existe PAS en base → on le crée
 *      - S'il existe et que son slug est dans ALWAYS_SYNC_DETAILS → on force la mise à jour
 *        de son champ "details" + "description" (utile pour pousser des MAJ de dimensions)
 *      - Sinon → on n'y touche pas (les modifs admin sont préservées)
 *
 * Exécuté à chaque build via "build" dans package.json.
 *
 * 📌 Pour pousser une MAJ de description/dimensions d'un produit déjà en base,
 *    ajoute son slug à ALWAYS_SYNC_DETAILS, déploie, puis retire-le (optionnel)
 *    pour redonner la main à l'admin.
 */
import { PrismaClient } from '@prisma/client'
import { PRODUCTS } from '../src/lib/data'

const db = new PrismaClient()

/** Produits dont on force la sync des détails (overrides éventuels admin) */
const ALWAYS_SYNC_DETAILS = new Set<string>([
  'collier-solea',
  'bracelet-eclat-ocean',
  'bague-trois-soleils',
  'collier-perla-bora',
  'bracelet-vaiana',
  'bracelet-ibiza',
  'bague-bora-bora',
  'bague-noumea',
  'boucles-ibiza',
])

async function main() {
  console.log('🌱 Seed des produits…')

  let created = 0
  let synced  = 0
  let skipped = 0

  for (const p of PRODUCTS) {
    const exists = await db.product.findUnique({ where: { slug: p.slug } })

    if (!exists) {
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
      created++
    } else if (ALWAYS_SYNC_DETAILS.has(p.slug)) {
      await db.product.update({
        where: { slug: p.slug },
        data: {
          description: p.description ?? null,
          details:     p.details ?? null,
        },
      })
      synced++
    } else {
      skipped++
    }
  }

  console.log(`✅ Seed terminé : ${created} créé(s), ${synced} sync'd, ${skipped} ignoré(s).`)

  /* Ordre par défaut souhaité par Marine. On l'applique UNIQUEMENT à ceux
     qui sont encore au sortOrder par défaut (1000) — pour ne JAMAIS écraser
     un ordre personnalisé fixé depuis l'admin par la suite. */
  const DEFAULT_ORDER = [
    'collier-solea', 'bracelet-eclat-ocean', 'bague-trois-soleils', 'boucles-lumia',
    'collier-perla-bora', 'bracelet-vaiana', 'bague-bora-bora', 'boucles-ibiza',
    'collier-nacre', 'boucles-azura', 'collier-sirena', 'bracelet-ibiza',
    'bague-noumea', 'boucles-nalia',
  ]
  let ordered = 0
  for (let i = 0; i < DEFAULT_ORDER.length; i++) {
    const slug = DEFAULT_ORDER[i]
    const res = await db.product.updateMany({
      where: { slug, sortOrder: 1000 },
      data:  { sortOrder: (i + 1) * 10 },
    })
    if (res.count) ordered++
  }
  if (ordered > 0) console.log(`📋 Ordre par défaut appliqué à ${ordered} produit(s).`)
}

main()
  .catch((err) => {
    console.error('❌ Erreur seed :', err)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
