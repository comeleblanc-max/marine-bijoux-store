'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Reorder } from 'framer-motion'
import { GripVertical, Save, RotateCcw, Check, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Item { id: string; name: string; slug: string; image: string | null; category: string }

export function ReorderProducts({ initial }: { initial: Item[] }) {
  const router = useRouter()
  const initialIds = useRef(initial.map((p) => p.id))
  const [items, setItems] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [error, setError]   = useState('')

  const dirty = items.map((i) => i.id).join('|') !== initialIds.current.join('|')

  useEffect(() => {
    /* Avertit si on quitte la page avec des changements non enregistrés */
    function beforeUnload(e: BeforeUnloadEvent) {
      if (dirty) { e.preventDefault(); e.returnValue = '' }
    }
    window.addEventListener('beforeunload', beforeUnload)
    return () => window.removeEventListener('beforeunload', beforeUnload)
  }, [dirty])

  async function save() {
    setSaving(true); setStatus('idle'); setError('')
    try {
      const res = await fetch('/api/admin/products/reorder', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ ids: items.map((p) => p.id) }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setError(d.error || 'Erreur lors de la sauvegarde.')
        setStatus('error')
      } else {
        initialIds.current = items.map((p) => p.id)
        setStatus('saved')
        router.refresh()
        setTimeout(() => setStatus('idle'), 2500)
      }
    } catch {
      setError('Erreur réseau.')
      setStatus('error')
    } finally {
      setSaving(false)
    }
  }

  function reset() {
    setItems(initial)
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#0E4F5E] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Retour aux produits
        </Link>
        <div className="flex items-center gap-2">
          {dirty && (
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Annuler
            </button>
          )}
          <button
            onClick={save}
            disabled={saving || !dirty}
            className="inline-flex items-center gap-1.5 bg-[#24BBD0] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#1A9AAD] transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? 'Sauvegarde…' : 'Enregistrer l\'ordre'}
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Glisse les bijoux pour les réordonner. L&apos;ordre s&apos;applique à la page <strong>Tous les bijoux</strong> de la boutique.
      </p>

      {status === 'saved' && (
        <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">Nouvel ordre enregistré ✨</p>
        </div>
      )}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <Reorder.Group
        axis="y"
        values={items}
        onReorder={setItems}
        className="space-y-2 list-none p-0"
      >
        {items.map((item, idx) => (
          <Reorder.Item
            key={item.id}
            value={item}
            className="admin-card flex items-center gap-3 px-4 py-2.5 cursor-grab active:cursor-grabbing select-none"
            whileDrag={{ scale: 1.02, boxShadow: '0 10px 30px rgba(14, 79, 94, 0.18)' }}
          >
            <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
            <span className="w-7 text-xs text-gray-400 tabular-nums">{idx + 1}</span>
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {item.image ? (
                <Image src={item.image} alt="" fill sizes="40px" className="object-cover pointer-events-none" />
              ) : null}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 truncate">{item.name}</p>
              <p className="text-[11px] text-gray-400 capitalize truncate">{item.category.replace(/-/g, ' ')}</p>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  )
}
