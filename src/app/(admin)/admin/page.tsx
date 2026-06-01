import { Package, ShoppingBag, Users, TrendingUp, Star, AlertCircle } from 'lucide-react'
import { db } from '@/lib/db'
import Link from 'next/link'
import { RevenueChart } from '@/components/admin/RevenueChart'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  /* Bornes "ce mois" et "30 derniers jours" pour le graphique */
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const last30Days   = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000)
  last30Days.setHours(0, 0, 0, 0)

  /* Lecture parallèle des stats réelles depuis la base */
  const [
    userCount,
    orderCount,
    productCount,
    recentUsers,
    monthOrders,
    totalRevenueAgg,
    pendingReviewsCount,
    last30Orders,
    recentOrders,
  ] = await Promise.all([
    db.user.count(),
    db.order.count({ where: { status: { not: 'CANCELLED' } } }),
    db.product.count(),
    db.user.findMany({
      orderBy: { createdAt: 'desc' },
      take:    5,
      select:  { id: true, name: true, email: true, createdAt: true, role: true },
    }),
    db.order.findMany({
      where:  { status: { not: 'CANCELLED' }, createdAt: { gte: startOfMonth } },
      select: { total: true },
    }),
    db.order.aggregate({ where: { status: { not: 'CANCELLED' } }, _sum: { total: true } }),
    db.review.count({ where: { approved: false } }),
    db.order.findMany({
      where:  { status: { not: 'CANCELLED' }, createdAt: { gte: last30Days } },
      select: { total: true, createdAt: true },
    }),
    db.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { items: { select: { id: true } } },
    }),
  ])

  /* Sommes */
  const monthRevenue = monthOrders.reduce((s, o) => s + Number(o.total), 0)
  const totalRevenue = Number(totalRevenueAgg._sum.total ?? 0)

  const fmt = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  /* Données pour le graphique : revenu par jour sur 30 jours */
  const dailyMap = new Map<string, number>()
  for (let i = 0; i < 30; i++) {
    const d = new Date(last30Days)
    d.setDate(d.getDate() + i)
    dailyMap.set(d.toISOString().slice(0, 10), 0)
  }
  for (const o of last30Orders) {
    const day = o.createdAt.toISOString().slice(0, 10)
    dailyMap.set(day, (dailyMap.get(day) ?? 0) + Number(o.total))
  }
  const chartData = Array.from(dailyMap.entries()).map(([date, total]) => ({ date, total }))

  const stats = [
    { label: 'Revenus ce mois',  value: `${fmt(monthRevenue)} €`,   icon: TrendingUp,  color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Commandes',        value: String(orderCount),          icon: ShoppingBag, color: 'bg-amber-50 text-amber-600' },
    { label: 'Produits',         value: String(productCount),        icon: Package,     color: 'bg-orange-50 text-orange-600' },
    { label: 'Clientes',         value: String(userCount),           icon: Users,       color: 'bg-cyan-50 text-cyan-600' },
  ]

  return (
    <div className="space-y-6 max-w-6xl">
      <AdminPageHeader title="Tableau de bord" subtitle="Bienvenue, Marine 👋">
        {pendingReviewsCount > 0 && (
          <Link
            href="/admin/reviews"
            className="inline-flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors border border-amber-200"
          >
            <AlertCircle className="w-4 h-4" />
            <span>{pendingReviewsCount} avis en attente</span>
          </Link>
        )}
      </AdminPageHeader>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={stat.label} className="admin-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            {idx === 0 && totalRevenue > 0 && (
              <p className="text-[11px] text-gray-400 mt-2 pt-2 border-t border-gray-100">
                Total cumulé : <span className="font-medium text-gray-600">{fmt(totalRevenue)} €</span>
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Graphique revenus 30 derniers jours */}
      <div className="admin-card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-gray-900">Revenus sur 30 jours</h2>
            <p className="text-xs text-gray-500 mt-0.5">Évolution quotidienne du chiffre d&apos;affaires</p>
          </div>
        </div>
        <RevenueChart data={chartData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commandes récentes */}
        <div className="admin-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Commandes récentes</h2>
            <Link href="/admin/orders" className="text-sm text-[#D4AF37] hover:underline">
              Voir tout →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">Aucune commande pour le moment.</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentOrders.map((o) => (
                <Link
                  key={o.id}
                  href={`/admin/orders/${o.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 font-mono">#{o.id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">
                      {o.items.length} article{o.items.length > 1 ? 's' : ''} · {new Date(o.createdAt).toLocaleDateString('fr-FR', { day:'numeric', month:'short' })}
                    </p>
                  </div>
                  <span className="font-semibold text-sm text-[#0E4F5E]">{fmt(Number(o.total))} €</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Dernières clientes */}
        <div className="admin-card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Dernières clientes</h2>
            <Link href="/admin/customers" className="text-sm text-[#D4AF37] hover:underline">
              Voir tout →
            </Link>
          </div>
          {recentUsers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">Pas encore de cliente inscrite.</p>
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
                    {new Date(u.createdAt).toLocaleDateString('fr-FR', { day:'numeric', month:'short' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Liens rapides */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <QuickLink href="/admin/products"  icon={Package}     label="Modifier les produits" />
        <QuickLink href="/admin/orders"    icon={ShoppingBag} label="Gérer les commandes" />
        <QuickLink href="/admin/reviews"   icon={Star}        label="Modérer les avis" />
        <QuickLink href="/admin/settings"  icon={TrendingUp}  label="Paramètres du site" />
      </div>
    </div>
  )
}

function QuickLink({ href, icon: Icon, label }: { href: string; icon: typeof Package; label: string }) {
  return (
    <Link
      href={href}
      className="admin-card hover:border-[#D4AF37] hover:shadow-md p-4 transition-all group"
    >
      <Icon className="w-5 h-5 text-[#0E4F5E] group-hover:text-[#D4AF37] transition-colors mb-2" />
      <p className="text-xs font-medium text-gray-700">{label}</p>
    </Link>
  )
}
