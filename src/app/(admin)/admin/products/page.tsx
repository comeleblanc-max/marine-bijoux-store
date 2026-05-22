import { PRODUCTS } from '@/data/products'
import { formatPrice } from '@/utils/format'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import Image from 'next/image'

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>Produits</h1>
        <button className="flex items-center gap-2 bg-[#1F3A56] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1F3A56]/90 transition-colors">
          <Plus className="w-4 h-4" />
          Ajouter un produit
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          placeholder="Rechercher un produit…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#4DB8D4]"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Produit</th>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Catégorie</th>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Prix</th>
              <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Stock</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {PRODUCTS.map(product => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image src={product.images[0]} alt={product.name} fill sizes="40px" className="object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600 capitalize">{product.category}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-[#1F3A56]">{formatPrice(product.price)}</span>
                  {product.compareAt && (
                    <span className="text-xs text-gray-400 line-through ml-2">{formatPrice(product.compareAt)}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {product.inStock ? 'En stock' : 'Rupture'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#1F3A56] transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
