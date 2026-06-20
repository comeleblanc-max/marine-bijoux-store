/**
 * Helpers pour les catégories de produits.
 * Les catégories sont stockées dans Setting.value.categories (cf. settings.ts).
 * Côté serveur uniquement.
 */
import { getSettings, type CategoryEntry } from '@/lib/settings'

export type { CategoryEntry } from '@/lib/settings'

/* Renvoie la liste ordonnée des catégories actuelles. */
export async function getCategories(): Promise<CategoryEntry[]> {
  const s = await getSettings()
  return s.categories ?? []
}

/* Convertit un nom en slug URL (ex: "Bracelets de cheville" → "bracelets-cheville") */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '') // accents
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
