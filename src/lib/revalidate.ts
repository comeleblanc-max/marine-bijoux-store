import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Vide tous les caches "publics" pour qu'une sauvegarde admin soit visible
 * immédiatement côté boutique (ne dépend pas de la fenêtre ISR de 60s).
 */
export function bustStoreCache(opts?: { productSlug?: string }) {
  revalidatePath('/')
  revalidatePath('/collections/[slug]', 'page')
  if (opts?.productSlug) revalidatePath(`/products/${opts.productSlug}`)
  revalidatePath('/avis')
  revalidatePath('/bientot')
  /* Tags facultatifs si on en utilise un jour côté fetch.
     Next 16 : signature à 2 args (tag, profile). 'max' = stale-while-revalidate. */
  revalidateTag('products', 'max')
}
