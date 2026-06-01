import { getSettings } from '@/lib/settings'
import { SettingsForm } from '@/components/admin/SettingsForm'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const settings = await getSettings()

  return (
    <div className="max-w-3xl">
      <AdminPageHeader
        title="Paramètres du site"
        subtitle="Modifie ici les textes affichés sur la boutique."
      />

      <SettingsForm initial={settings} />
    </div>
  )
}
