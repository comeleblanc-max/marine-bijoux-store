import { PRODUCTS } from '@/data/products'
import { Package, ShoppingBag, Users, TrendingUp } from 'lucide-react'
import { formatPrice } from '@/utils/format'
import { db } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  /* Lecture des stats réelles depuis la base */
  const [userCount, orderCount, recentUsers] = await Promise.all([
    db.user.count(),
    db.order.count(),
    db.user.findMany({
      orderBy: { createdAt: 'desc' },
      take:    5,
      select:  { id: true, name: true, email: true, createdAt: true, role: true },
    }),
  ])

  const stats = [
    { label: 'Revenus ce mois', value: '0 €',                  icon: TrendingUp,  color: 'bg-[#A7D5E6]/10 text-[#A7D5E6]' },
    { label: 'Commandes',       value: String(orderCount),     icon: ShoppingBag, color: 'bg-[#D4AF37]/10 text-[#D4AF37]' },
    { label: 'Produits actifs', value: String(PRODUCTS.length), icon: Package,    color: 'bg-[#E89B6F]/10 text-[#E89B6F]' },
    { label: 'Clientes',        value: String(userCount),       icon: Users,      color: 'bg-green-100 text-green-600' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
          Tableau de bord
        </h1>
        <p className="text-sm text-gray-500 mt-1">Bienvenue, Marine 👋</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Dernières clientes inscrites */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Dernières clientes inscrites</h2>
          <Link href="/admin/customers" className="text-sm text-[#D4AF37] hover:underline">
            Voir tout →
          </Link>
        </div>
        {recentUsers.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">
            Pas encore de cliente inscrite.
          </p>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {u.name || u.email.split('@')[0]}
                    {u.role === 'ADMIN' && (
                      <span className="ml-2 text-[10px] uppercase tracking-wider bg-[#D4AF37]/15 text-[#b8963e] px-1.5 py-0.5 rounded">
                        Admin
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(u.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Produits en vedette */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Produits en vedette</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {PRODUCTS.filter((p) => p.featured).map((product) => (
            <div key={product.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
              <div>
                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                <p className="text-xs text-gray-400 capitalize">{product.category}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-[#D4AF37]">{formatPrice(product.price)}</span>
                <span className={`text-xs px-2.5 py-1 rounded-full ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {product.inStock ? 'En stock' : 'Rupture'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        💡 Stripe sera branché bientôt — tu verras les vraies commandes ici.
      </p>
    </div>
  )
}
