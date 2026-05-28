import { db } from '@/lib/db'
import { ShoppingBag } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminOrders() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      items: true,
    },
  })

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1
          className="text-2xl font-bold text-gray-900"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Commandes
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {orders.length} {orders.length > 1 ? 'commandes' : 'commande'}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
          <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-gray-200" />
          <p className="text-gray-400 mb-1">Aucune commande pour le moment.</p>
          <p className="text-xs text-gray-300">
            Les commandes apparaîtront ici dès que Stripe sera configuré.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-3">Numéro</th>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3 text-center">Articles</th>
                <th className="px-6 py-3 text-right">Total</th>
                <th className="px-6 py-3">Statut</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{o.id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{o.user?.name || '—'}</p>
                    <p className="text-xs text-gray-400">{o.user?.email}</p>
                  </td>
                  <td className="px-6 py-4 text-center">{o.items.length}</td>
                  <td className="px-6 py-4 text-right font-semibold text-[#0E4F5E]">
                    {Number(o.total).toFixed(2)} €
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {new Date(o.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'short',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
