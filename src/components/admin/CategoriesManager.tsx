'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Reorder } from 'framer-motion'
import {
  GripVertical, Save, RotateCcw, Check, AlertCircle, Plus, Trash2, Image as ImageIcon, X,
} from 'lucide-react'
import type { CategoryEntry } from '@/lib/settings'

interface Props {
  initial: CategoryEntry[]
  counts:  Record<string, number>   // nb produits par slug
}

interface Row extends CategoryEntry {
  /* clé interne stable pour le drag (le slug peut changer si Marine renomme) */
  _key: string
}

function slugifyClient(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function CategoriesManager({ initial, counts }: Props) {
  const router = useRouter()
  const [items, setItems]   = useState<Row[]>(() => initial.map((c, i) => ({ ...c, _key: `${c.slug}-${i}` })))
  const [savedKey, setSavedKey] = useState(snap(initial))
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [error, setError]   = useState('')
  const [newName, setNewName] = useState('')

  const dirty = snap(items) !== savedKey

  useEffect(() => {
    function beforeUnload(e: BeforeUnloadEvent) {
      if (dirty) { e.preventDefault(); e.returnValue = '' }
    }
    window.addEventListener('beforeunload', beforeUnload)
    return () => window.removeEventListener('beforeunload', beforeUnload)
  }, [dirty])

  function addCategory() {
    const name = newName.trim()
    if (!name) return
    const slug = uniqueSlug(slugifyClient(name), items)
    setItems([...items, { _key: `new-${Date.now()}`, slug, name }])
    setNewName('')
  }

  function rename(idx: number, name: string) {
    const next = [...items]
    next[idx] = { ...next[idx], name }
    setItems(next)
  }

  function setImage(idx: number, image: string) {
    const next = [...items]
    next[idx] = { ...next[idx], image: image || undefined }
    setItems(next)
  }

  function remove(idx: number) {
    const c = items[idx]
    const n = counts[c.slug] ?? 0
    const msg = n > 0
      ? `Supprimer « ${c.name} » ? ⚠️ ${n} produit${n > 1 ? 's sont rattachés' : ' est rattaché'} à cette catégorie — ${n > 1 ? 'ils deviendront' : 'il deviendra'} orphelin${n > 1 ? 's' : ''} (à reclasser).`
      : `Supprimer « ${c.name} » ?`
    if (!confirm(msg)) return
    setItems(items.filter((_, i) => i !== idx))
  }

  async function save() {
    setSaving(true); setStatus('idle'); setError('')
    try {
      const payload = items.map(({ _key, ...c }) => c)
      const res = await fetch('/api/admin/categories', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ categories: payload }),
      })
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        setError(d.error || 'Erreur lors de la sauvegarde.')
        setStatus('error')
      } else {
        setSavedKey(snap(items))
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
    setItems(initial.map((c, i) => ({ ...c, _key: `${c.slug}-${i}` })))
  }

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Barre actions */}
      <div className="flex items-center justify-end gap-2">
        {dirty && (
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Annuler les changements
          </button>
        )}
        <button
          onClick={save}
          disabled={saving || !dirty}
          className="inline-flex items-center gap-1.5 bg-[#24BBD0] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#1A9AAD] transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {saving ? 'Sauvegarde…' : 'Enregistrer'}
        </button>
      </div>

      {status === 'saved' && (
        <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">Catégories enregistrées ✨</p>
        </div>
      )}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Ajout d'une catégorie */}
      <div className="admin-card p-4">
        <p className="text-xs text-gray-500 mb-3">
          Crée une nouvelle catégorie. L&apos;identifiant URL est généré automatiquement.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCategory() } }}
            placeholder="Ex : Pendentifs"
            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#A7D5E6]"
          />
          <button
            onClick={addCategory}
            disabled={!newName.trim()}
            className="inline-flex items-center gap-1.5 bg-[#0E4F5E] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#24BBD0] transition-colors disabled:opacity-40"
          >
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-500 px-1">
        Glisse les catégories pour les réordonner. L&apos;ordre s&apos;applique au menu « Bijoux » et au sélecteur produit.
      </p>

      <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-2 list-none p-0">
        {items.map((item, idx) => (
          <Reorder.Item
            key={item._key}
            value={item}
            className="admin-card px-4 py-3 select-none"
            whileDrag={{ scale: 1.02, boxShadow: '0 10px 30px rgba(14, 79, 94, 0.18)' }}
          >
            <div className="flex items-center gap-3">
              <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0 cursor-grab active:cursor-grabbing" />

              {/* Miniature */}
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {item.image ? (
                  <Image src={item.image} alt="" fill sizes="48px" className="object-cover pointer-events-none" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Nom + slug + compteur */}
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => rename(idx, e.target.value)}
                  className="w-full px-2 py-1 text-sm font-medium text-gray-900 border border-transparent hover:border-gray-200 rounded focus:outline-none focus:border-[#A7D5E6]"
                />
                <div className="flex items-center gap-3 px-2 mt-0.5">
                  <code className="text-[11px] text-gray-400">/{slugifyClient(item.name) || item.slug}</code>
                  <span className="text-[11px] text-gray-400">
                    {counts[item.slug] ?? 0} produit{(counts[item.slug] ?? 0) > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Bouton supprimer */}
              <button
                type="button"
                onClick={() => remove(idx)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* URL de photo (édition simple) */}
            <details className="mt-3 ml-7">
              <summary className="text-[11px] text-gray-500 cursor-pointer hover:text-[#0E4F5E]">
                Modifier la photo (URL)
              </summary>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={item.image ?? ''}
                  onChange={(e) => setImage(idx, e.target.value)}
                  placeholder="/tiles/ma-categorie.webp  ou  https://…"
                  className="flex-1 px-2.5 py-1.5 text-xs border border-gray-200 rounded-md bg-white focus:outline-none focus:border-[#A7D5E6]"
                />
                {item.image && (
                  <button
                    onClick={() => setImage(idx, '')}
                    className="p-1.5 text-gray-400 hover:text-red-500"
                    title="Retirer la photo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </details>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  )
}

/* Empreinte JSON ordonnée pour détecter les changements */
function snap(list: CategoryEntry[] | Row[]): string {
  return JSON.stringify(list.map((c) => ({ s: c.slug, n: c.name, i: c.image ?? '' })))
}

/* Trouve un slug unique en suffixant -2, -3, … si nécessaire */
function uniqueSlug(base: string, existing: CategoryEntry[]): string {
  const slugs = new Set(existing.map((c) => c.slug))
  if (!slugs.has(base)) return base
  let i = 2
  while (slugs.has(`${base}-${i}`)) i++
  return `${base}-${i}`
}
