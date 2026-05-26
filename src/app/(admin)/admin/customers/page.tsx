import { db } from '@/lib/db'
import { Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminCustomers() {
  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      role: true,
      _count: { select: { orders: true } },
    },
  })

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-bold text-gray-900"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Clientes
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {users.length} {users.length > 1 ? 'clientes inscrites' : 'cliente inscrite'}
          </p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
          <Users className="w-10 h-10 mx-auto mb-3 text-gray-200" />
          <p className="text-gray-400">Aucune cliente inscrite pour le moment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-3">Nom</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3 text-center">Commandes</th>
                <th className="px-6 py-3">Inscription</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">
                      {u.name || u.email.split('@')[0]}
                    </p>
                    {u.role === 'ADMIN' && (
                      <span className="text-[10px] uppercase tracking-wider bg-[#D4AF37]/15 text-[#b8963e] px-1.5 py-0.5 rounded mt-1 inline-block">
                        Admin
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{u.email}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 bg-gray-100 rounded-full text-xs font-medium">
                      {u._count.orders}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">
                    {new Date(u.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric',
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
