/**
 * Gestion des paramètres du site (stockés en base, JSON).
 *
 * Une seule entrée dans la table Setting avec key="site" qui contient
 * tous les paramètres. Si elle n'existe pas, on renvoie les valeurs par défaut.
 *
 * Utilisable côté serveur uniquement.
 */
import { db } from '@/lib/db'

export interface SiteSettings {
  announcement: {
    enabled:  boolean
    messages: string[]
  }
  hero: {
    eyebrow:     string
    title:       string
    titleItalic: string
    description: string
    ctaPrimary:  string
    ctaSecondary: string
  }
  shipping: {
    freeThreshold: number   // seuil livraison offerte (France)
    standardFee:   number   // frais France
    europeFee:     number   // frais Europe (hors France)
    deliveryDays:  string
    returnsDays:   number
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
      'RETOURS GRATUITS SOUS 14 JOURS',
      'LIVRAISON OFFERTE DÈS 60€',
      'ACIER INOXYDABLE HYPOALLERGÉNIQUE — NE TERNIT PAS',
      'NOUVELLE COLLECTION ÉTÉ 2026 ✨',
    ],
  },
  hero: {
    eyebrow:      '🐚 Collection — Été 2026 ✨',
    title:        "La douceur de l'été",
    titleItalic:  'à fleur de peau.',
    description:  "Bijoux en acier inoxydable, conçus pour durer. Inspirés par le soleil, la mer, et les après-midis d'été qui ne finissent jamais.",
    ctaPrimary:   'Découvrir la collection',
    ctaSecondary: 'Notre histoire',
  },
  shipping: {
    freeThreshold: 60,
    standardFee:   4.9,
    europeFee:     9.9,
    deliveryDays:  '2-4 jours ouvrés',
    returnsDays:   14,
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
    hero:         { ...base.hero,         ...(override.hero         ?? {}) },
    shipping:     { ...base.shipping,     ...(override.shipping     ?? {}) },
    contact:      { ...base.contact,      ...(override.contact      ?? {}) },
  }
}
