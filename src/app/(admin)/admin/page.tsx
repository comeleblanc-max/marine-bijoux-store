import { PRODUCTS } from '@/data/products'
import { Package, ShoppingBag, Users, TrendingUp, ArrowUpRight } from 'lucide-react'
import { formatPrice } from '@/utils/format'

const STATS = [
  { label: 'Revenus ce mois', value: '2 847 €', change: '+12%', icon: TrendingUp, color: 'bg-[#A7D5E6]/10 text-[#A7D5E6]' },
  { label: 'Commandes', value: '47', change: '+8%', icon: ShoppingBag, color: 'bg-[#D4AF37]/10 text-[#D4AF37]' },
  { label: 'Produits actifs', value: String(PRODUCTS.length), change: '', icon: Package, color: 'bg-[#E89B6F]/10 text-[#E89B6F]' },
  { label: 'Clients', value: '312', change: '+23%', icon: Users, color: 'bg-green-100 text-green-600' },
]

const RECENT_ORDERS = [
  { id: 'MDE-8821', customer: 'Sophie L.', total: 77, status: 'Livré', date: '20 mai 2026' },
  { id: 'MDE-8820', customer: 'Camille M.', total: 32, status: 'En cours', date: '19 mai 2026' },
  { id: 'MDE-8819', customer: 'Léa R.', total: 90, status: 'Expédié', date: '18 mai 2026' },
  { id: 'MDE-8818', customer: 'Julie B.', total: 45, status: 'Confirmé', date: '17 mai 2026' },
  { id: 'MDE-8817', customer: 'Emma D.', total: 64, status: 'Livré', date: '16 mai 2026' },
]

const STATUS_COLORS: Record<string, string> = {
  'Livré': 'bg-green-100 text-green-700',
  'Expédié': 'bg-blue-100 text-blue-700',
  'En cours': 'bg-yellow-100 text-yellow-700',
  'Confirmé': 'bg-purple-100 text-purple-700',
}

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>Tableau de bord</h1>
        <p className="text-sm text-gray-500 mt-1">Bienvenue, Marine 👋</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              {stat.change && (
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.change}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Commandes récentes</h2>
          <a href="/admin/orders" className="text-sm text-[#D4AF37] hover:underline">Voir tout →</a>
        </div>
        <div className="divide-y divide-gray-50">
          {RECENT_ORDERS.map(order => (
            <div key={order.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
              <div>
                <p className="text-sm font-medium text-gray-900">{order.id}</p>
                <p className="text-xs text-gray-400">{order.customer} · {order.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-sm text-[#1F3A56]">{formatPrice(order.total)}</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top products */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Produits en vedette</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {PRODUCTS.filter(p => p.featured).map(product => (
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
    </div>
  )
}
