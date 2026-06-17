import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { isLaunched, LAUNCH_DATE } from '@/lib/launch'
import { ComingSoon } from '@/components/ComingSoon'

/* Page revalidée toutes les heures — son contenu (les photos de bijoux qui
   défilent en colonnes) change peu, pas besoin de DB à chaque visite. */
export const revalidate = 3600

/* Pas d'indexation Google pour la page d'attente. */
export const metadata = {
  title:   'Bientôt disponible — Marine et la douceur de l\'été',
  robots:  { index: false, follow: false },
}

export default async function BientotPage() {
  /* Si on est passé la date de lancement, la page d'attente n'a plus de sens. */
  if (isLaunched()) redirect('/')

  const products = await db.product.findMany({
    where:   { inStock: true },
    select:  { name: true, images: true },
    orderBy: { createdAt: 'desc' },
    take:    16,
  })
  const tiles = products
    .filter((p) => p.images?.[0])
    .map((p) => ({ name: p.name, image: p.images[0] }))

  return <ComingSoon targetIso={LAUNCH_DATE} tiles={tiles} />
}
