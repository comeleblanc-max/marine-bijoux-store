'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, AlertCircle, Plus, X } from 'lucide-react'

interface ProductFormData {
  id?:         string
  name:        string
  slug:        string
  description: string
  details:     string
  price:       string
  compareAt:   string
  images:      string[]
  category:    string
  collection:  string
  material:    string
  inStock:     boolean
  featured:    boolean
  newArrival:  boolean
}

const CATEGORIES = [
  { value: 'colliers',          label: 'Colliers' },
  { value: 'bracelets',         label: 'Bracelets' },
  { value: 'boucles-doreilles', label: 'Boucles d\'oreilles' },
  { value: 'bagues',            label: 'Bagues' },
]

const COLLECTIONS = [
  { value: '',             label: '— Aucune —' },
  { value: 'lumiere-dete', label: 'Lumière d\'été' },
]

export function ProductForm({ initial, mode }: { initial: ProductFormData; mode: 'create' | 'edit' }) {
  const router = useRouter()
  const [form, setForm] = useState<ProductFormData>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [newImageUrl, setNewImageUrl] = useState('')

  /* Auto-slug à la création depuis le nom */
  function updateName(name: string) {
    const next = { ...form, name }
    if (mode === 'create') {
      next.slug = name
        .toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
    setForm(next)
  }

  function addImage() {
    if (!newImageUrl.trim()) return
    setForm({ ...form, images: [...form.images, newImageUrl.trim()] })
    setNewImageUrl('')
  }

  function removeImage(idx: number) {
    setForm({ ...form, images: form.images.filter((_, i) => i !== idx) })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const url    = mode === 'create' ? '/api/admin/products' : `/api/admin/products/${form.id}`
      const method = mode === 'create' ? 'POST' : 'PATCH'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Erreur lors de la sauvegarde.')
        setSaving(false)
        return
      }

      router.push('/admin/products')
      router.refresh()
    } catch {
      setError('Erreur réseau. Veuillez réessayer.')
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/products"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
            {mode === 'create' ? 'Nouveau produit' : `Modifier ${initial.name}`}
          </h1>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#0E4F5E] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#0E4F5E]/90 transition-colors disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* INFOS PRINCIPALES */}
      <Card title="Informations principales">
        <Field label="Nom du produit" required>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => updateName(e.target.value)}
            className="input"
            placeholder="Ex : Collier Soléa"
          />
        </Field>

        <Field label="Slug (identifiant dans l'URL)">
          <input
            type="text"
            required
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            disabled={mode === 'edit'}
            className="input disabled:bg-gray-50 disabled:text-gray-400"
            placeholder="collier-solea"
          />
          {mode === 'edit' && (
            <p className="text-[11px] text-gray-400 mt-1">Le slug ne peut pas être modifié après création.</p>
          )}
        </Field>

        <Field label="Description courte">
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="input"
            placeholder="Court texte qui apparaît sur la fiche produit"
          />
        </Field>

        <Field label="Détails techniques (matière, dimensions, etc.)">
          <textarea
            value={form.details}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
            rows={5}
            className="input font-mono text-xs"
            placeholder="Matière : Acier inoxydable doré&#10;Longueur : 40 cm&#10;Hypoallergénique"
          />
        </Field>
      </Card>

      {/* PRIX */}
      <Card title="Prix">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Prix de vente (€)" required>
            <input
              type="number"
              step="0.01"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="input"
              placeholder="18.00"
            />
          </Field>
          <Field label="Prix barré (€ — pour les promos)">
            <input
              type="number"
              step="0.01"
              value={form.compareAt}
              onChange={(e) => setForm({ ...form, compareAt: e.target.value })}
              className="input"
              placeholder="22.00"
            />
          </Field>
        </div>
      </Card>

      {/* PHOTOS */}
      <Card title="Photos">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          {form.images.map((img, idx) => (
            <div key={idx} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                title="Retirer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {form.images.length === 0 && (
            <div className="col-span-full text-center text-xs text-gray-400 py-6">
              Aucune photo pour le moment.
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="url"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            className="input flex-1"
            placeholder="https://exemple.com/photo.jpg  OU  /images/products/mon-bijou.jpg"
          />
          <button
            type="button"
            onClick={addImage}
            className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
        <p className="text-[11px] text-gray-400 mt-2">
          📌 Pour l&apos;instant : colle une URL d&apos;image. L&apos;upload direct de fichiers arrivera bientôt.
        </p>
      </Card>

      {/* CLASSIFICATION */}
      <Card title="Classification">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Catégorie" required>
            <select
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="input"
            >
              <option value="">— Choisir —</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Collection">
            <select
              value={form.collection}
              onChange={(e) => setForm({ ...form, collection: e.target.value })}
              className="input"
            >
              {COLLECTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Matière (affichée sur la fiche produit)">
          <input
            type="text"
            value={form.material}
            onChange={(e) => setForm({ ...form, material: e.target.value })}
            className="input"
            placeholder="Acier inoxydable doré"
          />
        </Field>
      </Card>

      {/* STATUTS */}
      <Card title="Statuts">
        <div className="space-y-3">
          <Toggle
            label="En stock (visible et achetable)"
            checked={form.inStock}
            onChange={(v) => setForm({ ...form, inStock: v })}
          />
          <Toggle
            label="Coup de cœur (mis en avant sur la page d'accueil)"
            checked={form.featured}
            onChange={(v) => setForm({ ...form, featured: v })}
          />
          <Toggle
            label="Nouveauté (badge « Nouveau » affiché)"
            checked={form.newArrival}
            onChange={(v) => setForm({ ...form, newArrival: v })}
          />
        </div>
      </Card>

      <div className="flex justify-end gap-3 pt-2">
        <Link
          href="/admin/products"
          className="px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Annuler
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#0E4F5E] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#0E4F5E]/90 transition-colors disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>

      {/* Styles utilitaires pour ce formulaire uniquement */}
      <style jsx global>{`
        [data-section="admin"] .input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.625rem;
          background: white;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;
        }
        [data-section="admin"] .input:focus {
          border-color: #0E4F5E;
        }
      `}</style>
    </form>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded text-[#0E4F5E] focus:ring-[#0E4F5E]"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  )
}
