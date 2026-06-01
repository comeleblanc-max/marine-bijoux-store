import Link from 'next/link'
import { db } from '@/lib/db'
import { ShoppingBag, ChevronRight } from 'lucide-react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'

export const dynamic = 'force-dynamic'

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  PENDING:    { label: '⏳ En attente',    color: 'bg-gray-100 text-gray-700' },
  CONFIRMED:  { label: '✅ Confirmée',     color: 'bg-blue-100 text-blue-700' },
  PROCESSING: { label: '📦 En préparation', color: 'bg-amber-100 text-amber-700' },
  SHIPPED:    { label: '🚚 Expédiée',      color: 'bg-purple-100 text-purple-700' },
  DELIVERED:  { label: '🎉 Livrée',        color: 'bg-green-100 text-green-700' },
  CANCELLED:  { label: '❌ Annulée',       color: 'bg-red-100 text-red-700' },
  REFUNDED:   { label: '↩️ Remboursée',    color: 'bg-orange-100 text-orange-700' },
}

export default async function AdminOrders() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user:  { select: { name: true, email: true } },
      items: { select: { id: true } },
    },
  })

  return (
    <div className="max-w-6xl">
      <AdminPageHeader
        title="Commandes"
        subtitle={`${orders.length} ${orders.length > 1 ? 'commandes' : 'commande'}`}
      />

      {orders.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-gray-200" />
          <p className="text-gray-400">Aucune commande pour le moment.</p>
        </div>
      ) : (
        <div className="admin-card overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-3">Numéro</th>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3 text-center">Articles</th>
                <th className="px-6 py-3 text-right">Total</th>
                <th className="px-6 py-3">Statut</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => {
                const badge = STATUS_BADGE[o.status] ?? { label: o.status, color: 'bg-gray-100 text-gray-700' }
                return (
                  <tr
                    key={o.id}
                    className="hover:bg-[#FAF5EA] transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-mono text-xs">
                      <Link href={`/admin/orders/${o.id}`} className="block text-[#0E4F5E] hover:underline">
                        #{o.id.slice(-8).toUpperCase()}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{o.shippingName || o.user?.name || '—'}</p>
                      <p className="text-xs text-gray-400">{o.user?.email ?? o.email}</p>
                    </td>
                    <td className="px-6 py-4 text-center">{o.items.length}</td>
                    <td className="px-6 py-4 text-right font-semibold text-[#0E4F5E]">
                      {Number(o.total).toFixed(2)} €
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${badge.color}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {new Date(o.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'short',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="inline-flex items-center text-[#0E4F5E] hover:text-[#0E4F5E]"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
