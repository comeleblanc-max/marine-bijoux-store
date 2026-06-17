import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { isLaunched, LAUNCH_DATE, PREVIEW_COOKIE } from '@/lib/launch'
import { ComingSoon } from '@/components/ComingSoon'

/* La page lit les cookies à chaque hit pour décider si elle redirige : pas d'ISR. */
export const dynamic = 'force-dynamic'

/* Pas d'indexation Google pour la page d'attente. */
export const metadata = {
  title:   'Bientôt disponible — Marine et la douceur de l\'été',
  robots:  { index: false, follow: false },
}

export default async function BientotPage() {
  /* Si on est passé la date de lancement, la page d'attente n'a plus de sens. */
  if (isLaunched()) redirect('/')

  /* Après un POST /api/preview-unlock réussi, le cookie est posé et le client
     fait un router.refresh(). On en profite pour le renvoyer vers la home. */
  const unlocked = (await cookies()).get(PREVIEW_COOKIE)?.value === '1'
  if (unlocked) redirect('/')

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
