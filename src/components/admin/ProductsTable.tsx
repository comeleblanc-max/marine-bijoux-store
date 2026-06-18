'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Edit, Trash2, Search, Sparkles, TrendingUp } from 'lucide-react'

interface Product {
  id:         string
  name:       string
  slug:       string
  images:     string[]
  category:   string
  price:      number
  compareAt:  number | null
  inStock:    boolean
  stock?:     number
  featured:   boolean
  newArrival: boolean
}

export function ProductsTable({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase()) ||
    p.slug.toLowerCase().includes(query.toLowerCase())
  )

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" ? Cette action est irréversible.`)) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        alert(data.error || 'Erreur lors de la suppression.')
        setDeleting(null)
        return
      }
      router.refresh()
    } catch {
      alert('Erreur réseau.')
      setDeleting(null)
    }
  }

  return (
    <>
      {/* Recherche */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un produit, une catégorie…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#A7D5E6]"
        />
      </div>

      {/* Tableau */}
      <div className="admin-card overflow-x-auto mt-6">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Produit</th>
              <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Catégorie</th>
              <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Prix</th>
              <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Statut</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-12 text-sm">
                  Aucun produit trouvé.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {p.images[0] ? (
                          <Image src={p.images[0]} alt={p.name} fill sizes="40px" className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-300">∅</div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.slug}</p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        {p.featured && (
                          <span title="Coup de cœur">
                            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                          </span>
                        )}
                        {p.newArrival && (
                          <span title="Nouveauté">
                            <TrendingUp className="w-3.5 h-3.5 text-[#E89B6F]" />
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600 capitalize">{p.category.replace(/-/g, ' ')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-[#0E4F5E]">{p.price.toFixed(2)} €</span>
                    {p.compareAt && (
                      <span className="text-xs text-gray-400 line-through ml-2">{p.compareAt.toFixed(2)} €</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {(() => {
                      const stock = p.stock ?? 0
                      const cls =
                        stock === 0   ? 'bg-red-100 text-red-700' :
                        stock <= 3    ? 'bg-orange-100 text-orange-700' :
                        stock <= 10   ? 'bg-amber-100 text-amber-700' :
                                        'bg-green-100 text-green-700'
                      const label =
                        stock === 0 ? 'Rupture' :
                        `${stock} en stock`
                      return (
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cls}`}>
                          {label}
                        </span>
                      )
                    })()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#0E4F5E] transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id, p.name)}
                        disabled={deleting === p.id}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
