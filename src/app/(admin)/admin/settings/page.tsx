import { getSettings } from '@/lib/settings'
import { SettingsForm } from '@/components/admin/SettingsForm'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const settings = await getSettings()

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1
          className="text-2xl font-bold text-gray-900"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Paramètres du site
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Modifie ici les textes affichés sur la boutique.
        </p>
      </div>

      <SettingsForm initial={settings} />
    </div>
  )
}
