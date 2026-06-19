import type { Metadata } from 'next'
import { db } from '@/lib/db'
import { serializeProducts } from '@/lib/serialize'
import { LumiereDeteExperience } from '@/components/collection/LumiereDeteExperience'

/* Cache ISR : la page est régénérée toutes les 60s.
   L'invalidation est forcée depuis l'admin après chaque sauvegarde produit. */
export const revalidate = 60

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://marineetladouceurdelete.com'

export const metadata: Metadata = {
  title:       'Lumière d\'été — Collection capsule',
  description: 'Une collection capsule née d\'un été. Des bijoux en acier inoxydable inspirés par le soleil, la mer et la lumière.',
  alternates:  { canonical: `${BASE}/collections/lumiere-dete` },
  openGraph:   {
    title:       'Lumière d\'été — Marine et la douceur de l\'été',
    description: 'Là où le soleil rencontre la mer. Une collection capsule.',
    url:         `${BASE}/collections/lumiere-dete`,
    images:      [{ url: `${BASE}/tiles/lumiere-dete.webp` }],
  },
}

export default async function LumiereDetePage() {
  /* On prend tous les bijoux marqués comme "Lumière d'été" (category OU collection),
     dans l'ordre fixé via Admin → Produits → Réordonner. */
  const raw = await db.product.findMany({
    where:   { OR: [{ category: 'lumiere-dete' }, { collection: 'lumiere-dete' }] },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  const products = serializeProducts(raw)

  return <LumiereDeteExperience products={products} />
}
