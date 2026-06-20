'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, AlertCircle, Plus, X, UploadCloud, Loader2 } from 'lucide-react'

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
  stock:       string
  featured:    boolean
  newArrival:  boolean
}

/* Fallback si la page parent ne fournit pas les catégories */
const FALLBACK_CATEGORIES = [
  { value: 'colliers',            label: 'Colliers' },
  { value: 'bracelets',           label: 'Bracelets' },
  { value: 'bracelets-cheville',  label: 'Bracelets de cheville' },
  { value: 'boucles-doreilles',   label: 'Boucles d\'oreilles' },
  { value: 'bagues',              label: 'Bagues' },
]

const COLLECTIONS = [
  { value: '',             label: '— Aucune —' },
  { value: 'lumiere-dete', label: 'Lumière d\'été' },
]

interface ProductFormProps {
  initial:     ProductFormData
  mode:        'create' | 'edit'
  categories?: { slug: string; name: string }[]
}

export function ProductForm({ initial, mode, categories }: ProductFormProps) {
  const CATEGORIES = categories && categories.length > 0
    ? categories.map((c) => ({ value: c.slug, label: c.name }))
    : FALLBACK_CATEGORIES

  const router = useRouter()
  const [form, setForm] = useState<ProductFormData>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [newImageUrl, setNewImageUrl] = useState('')
  const [uploading, setUploading]     = useState(false)
  const [uploadError, setUploadError] = useState('')

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

  /* Redimensionne l'image dans le navigateur (max 2000px, webp) pour
     un upload léger et rapide — évite d'envoyer une photo de 5 Mo. */
  async function resizeImage(file: Blob, maxSize = 2000, quality = 0.85): Promise<Blob> {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const fr = new FileReader()
      fr.onload  = () => resolve(fr.result as string)
      fr.onerror = () => reject(new Error('read'))
      fr.readAsDataURL(file)
    })
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new window.Image()
      i.onload  = () => resolve(i)
      i.onerror = () => reject(new Error('decode'))
      i.src = dataUrl
    })
    let { width, height } = img
    if (width > maxSize || height > maxSize) {
      if (width >= height) { height = Math.round((height * maxSize) / width); width = maxSize }
      else                 { width  = Math.round((width * maxSize) / height); height = maxSize }
    }
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('canvas')
    ctx.drawImage(img, 0, 0, width, height)
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', quality),
    )
    if (!blob) throw new Error('export')
    return blob
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    setUploadError('')
    const uploaded: string[] = []
    try {
      for (const file of Array.from(files)) {
        const isHeic = /\.hei[cf]$/i.test(file.name) || /heic|heif/i.test(file.type)
        if (!file.type.startsWith('image/') && !isHeic) continue

        const fd = new FormData()
        if (isHeic) {
          /* HEIC iPhone : on envoie l'original, la conversion se fait côté serveur */
          fd.append('file', file, file.name)
        } else {
          let body: Blob
          try {
            body = await resizeImage(file)
          } catch {
            throw new Error(`Impossible de lire « ${file.name} ». Essaie une autre photo (JPG/PNG).`)
          }
          fd.append('file', body, 'photo.webp')
        }

        const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || 'Échec du téléversement.')
        uploaded.push(data.url)
      }
      if (uploaded.length) {
        setForm((f) => ({ ...f, images: [...f.images, ...uploaded] }))
      }
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Erreur lors du téléversement.')
    } finally {
      setUploading(false)
    }
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
          className="inline-flex items-center gap-2 bg-[#24BBD0] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#24BBD0]/90 transition-colors disabled:opacity-60"
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
        {form.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {form.images.map((img, idx) => (
              <div key={idx} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="w-full h-full object-cover" />
                {idx === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 text-[9px] uppercase tracking-wider bg-[#0E4F5E] text-white px-1.5 py-0.5 rounded">
                    Principale
                  </span>
                )}
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
          </div>
        )}

        {/* Zone de téléversement */}
        <label
          className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl px-4 py-8 text-center transition-colors ${
            uploading
              ? 'border-[#24BBD0] bg-[#24BBD0]/5 cursor-wait'
              : 'border-gray-200 hover:border-[#24BBD0] hover:bg-[#24BBD0]/5 cursor-pointer'
          }`}
        >
          <input
            type="file"
            accept="image/*,.heic,.heif"
            multiple
            disabled={uploading}
            onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }}
            className="hidden"
          />
          {uploading ? (
            <>
              <Loader2 className="w-7 h-7 text-[#24BBD0] animate-spin" />
              <p className="text-sm text-[#0E4F5E] font-medium">Téléversement en cours…</p>
            </>
          ) : (
            <>
              <UploadCloud className="w-7 h-7 text-[#24BBD0]" />
              <p className="text-sm text-[#0E4F5E] font-medium">Cliquez pour choisir une ou plusieurs photos</p>
              <p className="text-[11px] text-gray-400">JPG, PNG ou WEBP — depuis votre ordinateur ou téléphone</p>
            </>
          )}
        </label>

        {uploadError && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mt-3">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">{uploadError}</p>
          </div>
        )}

        {form.images.length > 0 && (
          <p className="text-[11px] text-gray-400 mt-3">
            💡 La photo marquée « Principale » (la première) est celle affichée dans la boutique.
            Retirez-la pour en mettre une autre en avant.
          </p>
        )}

        {/* Option avancée : coller une URL */}
        <details className="mt-4 group">
          <summary className="text-[11px] text-gray-400 cursor-pointer hover:text-gray-600 select-none">
            Ou coller un lien d&apos;image (avancé)
          </summary>
          <div className="flex gap-2 mt-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="input flex-1"
              placeholder="https://exemple.com/photo.jpg"
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
        </details>
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
        <div className="space-y-4">
          <Field label="Stock disponible">
            <input
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="input w-32"
              placeholder="0"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Quantité réellement en ta possession. Diminue automatiquement à chaque commande payée.
              À 0 → le produit affiche « Épuisé » et n&apos;est plus commandable.
            </p>
          </Field>
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
          className="inline-flex items-center gap-2 bg-[#24BBD0] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#24BBD0]/90 transition-colors disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </form>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="admin-card p-5 sm:p-6">
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
        className="w-4 h-4 rounded text-[#0E4F5E] focus:ring-[#24BBD0]"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  )
}
