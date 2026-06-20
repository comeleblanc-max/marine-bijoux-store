/**
 * Gestion des paramètres du site (stockés en base, JSON).
 *
 * Une seule entrée dans la table Setting avec key="site" qui contient
 * tous les paramètres. Si elle n'existe pas, on renvoie les valeurs par défaut.
 *
 * Utilisable côté serveur uniquement.
 */
import { db } from '@/lib/db'

export interface CategoryEntry {
  slug:        string   // identifiant URL (ex: "bracelets-cheville")
  name:        string   // libellé affiché (ex: "Bracelets de cheville")
  image?:      string   // URL de la photo de tuile (optionnelle)
  description?: string  // description courte (optionnelle, pour la page collection)
}

export interface SiteSettings {
  announcement: {
    enabled:  boolean
    messages: string[]
  }
  categories: CategoryEntry[]
  hero: {
    eyebrow:     string
    title:       string
    titleItalic: string
    description: string
    ctaPrimary:  string
    ctaSecondary: string
  }
  shipping: {
    freeThreshold:    number   // seuil livraison offerte (France, La Poste)
    standardFee:      number   // La Poste — France
    europeFee:        number   // La Poste — Europe
    mondialRelayFr:   number   // Mondial Relay — France (point relais)
    mondialRelayEu:   number   // Mondial Relay — hors France
    deliveryDays:     string
    returnsDays:      number
  }
  contact: {
    email:     string
    instagram: string
    phone:     string
  }
}

export const DEFAULT_SETTINGS: SiteSettings = {
  announcement: {
    enabled:  true,
    messages: [
      '-10% SUR VOTRE PREMIÈRE COMMANDE — CODE BIENVENUE10',
      'LIVRAISON OFFERTE DÈS 60€',
      'RETOURS GRATUITS SOUS 14 JOURS',
      'ACIER INOXYDABLE HYPOALLERGÉNIQUE — NE TERNIT PAS',
    ],
  },
  categories: [
    { slug: 'colliers',           name: 'Colliers',              image: '/tiles/colliers.webp' },
    { slug: 'bracelets',          name: 'Bracelets',             image: '/tiles/bracelets.webp' },
    { slug: 'bracelets-cheville', name: 'Bracelets de cheville', image: '/tiles/bracelets.webp' },
    { slug: 'boucles-doreilles',  name: "Boucles d'oreilles",    image: '/tiles/boucles-doreilles.webp' },
    { slug: 'bagues',             name: 'Bagues',                image: '/tiles/bagues.webp' },
  ],
  hero: {
    eyebrow:      '🐚 Collection — Été 2026 ✨',
    title:        "La douceur de l'été",
    titleItalic:  'à fleur de peau.',
    description:  "Bijoux en acier inoxydable, conçus pour durer. Inspirés par le soleil, la mer, et les après-midis d'été qui ne finissent jamais.",
    ctaPrimary:   'Découvrir la collection',
    ctaSecondary: 'Notre histoire',
  },
  shipping: {
    freeThreshold:  60,
    standardFee:    3.47,   // Lettre Suivie France
    europeFee:      7.50,   // Lettre Suivie International
    mondialRelayFr: 4.10,
    mondialRelayEu: 6.60,
    deliveryDays:   '2-4 jours ouvrés',
    returnsDays:    14,
  },
  contact: {
    email:     'mladouceurdelete@gmail.com',
    instagram: '@marineetladouceurdelete',
    phone:     '',
  },
}

const SETTINGS_KEY = 'site'

/* Récupère les paramètres du site (fusion défauts + valeurs en base) */
export async function getSettings(): Promise<SiteSettings> {
  try {
    const row = await db.setting.findUnique({ where: { key: SETTINGS_KEY } })
    if (!row) return DEFAULT_SETTINGS

    const stored = row.value as Partial<SiteSettings>
    return mergeSettings(DEFAULT_SETTINGS, stored)
  } catch {
    return DEFAULT_SETTINGS
  }
}

/* Met à jour les paramètres (merge profond avec l'existant) */
export async function updateSettings(patch: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSettings()
  const merged  = mergeSettings(current, patch)
  await db.setting.upsert({
    where:  { key: SETTINGS_KEY },
    create: { key: SETTINGS_KEY, value: merged as never },
    update: { value: merged as never },
  })
  return merged
}

/* Merge profond, niveau 1 (suffit pour notre structure) */
function mergeSettings(base: SiteSettings, override: Partial<SiteSettings>): SiteSettings {
  return {
    announcement: { ...base.announcement, ...(override.announcement ?? {}) },
    /* Pour categories : la liste est remplacée d'un bloc (pas merge profond),
       ce qui permet à l'admin de réordonner et supprimer librement. */
    categories:   override.categories ?? base.categories,
    hero:         { ...base.hero,         ...(override.hero         ?? {}) },
    shipping:     { ...base.shipping,     ...(override.shipping     ?? {}) },
    contact:      { ...base.contact,      ...(override.contact      ?? {}) },
  }
}
