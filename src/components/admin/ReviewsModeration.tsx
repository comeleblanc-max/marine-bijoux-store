'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Star, Check, X, Trash2, MessageSquare, Eye, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ReviewItem {
  id:        string
  name:      string
  rating:    number
  comment:   string
  approved:  boolean
  createdAt: string
  product:   { slug: string; name: string; image: string | null } | null
}

type Filter = 'pending' | 'approved' | 'all'

export function ReviewsModeration({ initial }: { initial: ReviewItem[] }) {
  const router = useRouter()
  const [items, setItems]   = useState(initial)
  const [filter, setFilter] = useState<Filter>('pending')
  const [busy, setBusy]     = useState<string | null>(null)

  const pendingCount  = items.filter((r) => !r.approved).length
  const approvedCount = items.filter((r) => r.approved).length

  const filtered = items.filter((r) =>
    filter === 'pending'  ? !r.approved :
    filter === 'approved' ?  r.approved :
    true
  )

  async function setApproved(id: string, approved: boolean) {
    setBusy(id)
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ approved }),
      })
      if (!res.ok) throw new Error()
      setItems((curr) => curr.map((r) => (r.id === id ? { ...r, approved } : r)))
      router.refresh()
    } catch {
      alert('Erreur lors de la mise à jour.')
    } finally {
      setBusy(null)
    }
  }

  async function remove(id: string) {
    if (!confirm('Supprimer définitivement cet avis ?')) return
    setBusy(id)
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setItems((curr) => curr.filter((r) => r.id !== id))
      router.refresh()
    } catch {
      alert('Erreur lors de la suppression.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
            Avis clients
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Modère les avis avant qu&apos;ils ne soient publiés sur le site.
          </p>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        <TabBtn active={filter === 'pending'}  onClick={() => setFilter('pending')}  label="En attente"   count={pendingCount}  highlight />
        <TabBtn active={filter === 'approved'} onClick={() => setFilter('approved')} label="Publiés"      count={approvedCount} />
        <TabBtn active={filter === 'all'}      onClick={() => setFilter('all')}      label="Tous"         count={items.length} />
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 text-gray-200" strokeWidth={1.2} />
          <p className="text-gray-400">
            {filter === 'pending'  ? '✨ Pas d\'avis en attente — tout est à jour.'
            : filter === 'approved' ? 'Aucun avis publié pour le moment.'
            : 'Aucun avis client pour le moment.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {filtered.map((r) => (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-transparent hover:border-gray-200 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Photo produit */}
                  {r.product?.image && (
                    <Link href={`/products/${r.product.slug}`} target="_blank" className="flex-shrink-0">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100">
                        <Image src={r.product.image} alt="" fill sizes="56px" className="object-cover" />
                      </div>
                    </Link>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {r.name}
                          {!r.approved && (
                            <span className="ml-2 text-[10px] uppercase tracking-wider bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                              En attente
                            </span>
                          )}
                        </p>
                        {r.product && (
                          <Link
                            href={`/products/${r.product.slug}`}
                            target="_blank"
                            className="text-xs text-gray-500 hover:text-[#0E4F5E] inline-flex items-center gap-1"
                          >
                            {r.product.name}
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider whitespace-nowrap">
                        {new Date(r.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    {/* Étoiles */}
                    <div className="flex gap-0.5 mb-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i <= r.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-200'}`}
                        />
                      ))}
                    </div>

                    {/* Commentaire */}
                    <p className="text-sm text-gray-700 italic leading-relaxed mb-4">&ldquo;{r.comment}&rdquo;</p>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {!r.approved ? (
                        <button
                          onClick={() => setApproved(r.id, true)}
                          disabled={busy === r.id}
                          className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approuver
                        </button>
                      ) : (
                        <button
                          onClick={() => setApproved(r.id, false)}
                          disabled={busy === r.id}
                          className="inline-flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Dépublier
                        </button>
                      )}
                      <button
                        onClick={() => remove(r.id)}
                        disabled={busy === r.id}
                        className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

function TabBtn({ active, onClick, label, count, highlight }: {
  active: boolean; onClick: () => void; label: string; count: number; highlight?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active ? 'bg-white text-[#0E4F5E] shadow-sm' : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
      <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
        active && highlight && count > 0
          ? 'bg-[#D4AF37] text-white'
          : 'bg-gray-200 text-gray-600'
      }`}>
        {count}
      </span>
    </button>
  )
}
