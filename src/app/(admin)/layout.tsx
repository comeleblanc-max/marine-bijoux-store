import { AdminSidebar } from '@/components/admin/AdminSidebar'
import type { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div data-section="admin" className="flex min-h-screen bg-gray-50 flex-1">
      <AdminSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
