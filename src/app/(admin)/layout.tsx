import { AdminShell } from '@/components/admin/AdminShell'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import { auth, signOut } from '@/auth'
import type { ReactNode } from 'react'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth()

  async function logout() {
    'use server'
    await signOut({ redirectTo: '/' })
  }

  return (
    <div data-section="admin" className="flex min-h-screen flex-1">
      <ScrollToTop />
      <AdminShell
        userName={session?.user?.name}
        userEmail={session?.user?.email}
        logout={logout}
      >
        {children}
      </AdminShell>
    </div>
  )
}
