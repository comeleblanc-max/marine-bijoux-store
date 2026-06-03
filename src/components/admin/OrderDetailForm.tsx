'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, AlertCircle, CheckCircle2, Truck, MapPin, User, Package, Calendar, Trash2 } from 'lucide-react'

interface OrderData {
  id:              string
  email:           string
  status:          string
  total:           number
  shippingName:    string
  shippingAddress: string
  shippingCity:    string
  shippingZip:     string
  shippingCountry: string
  trackingNumber:  string
  trackingCarrier: string
  adminNote:       string
  shippedAt:       string | null
  deliveredAt:     string | null
  createdAt:       string
  user: { name: string | null; email: string } | null
  items: Array<{
    id:        string
    name:      string
    image:     string | null
    quantity:  number
    price:     number
    productId: string
  }>
}

const STATUS_OPTIONS = [
  { value: 'PENDING',    label: '⏳ En attente',    color: 'bg-gray-100  text-gray-700'  },
  { value: 'CONFIRMED',  label: '✅ Confirmée',     color: 'bg-blue-100  text-blue-700'  },
  { value: 'PROCESSING', label: '📦 En préparation', color: 'bg-amber-100 text-amber-700' },
  { value: 'SHIPPED',    label: '🚚 Expédiée',      color: 'bg-purple-100 text-purple-700' },
  { value: 'DELIVERED',  label: '🎉 Livrée',        color: 'bg-green-100 text-green-700' },
  { value: 'CANCELLED',  label: '❌ Annulée',       color: 'bg-red-100   text-red-700'   },
  { value: 'REFUNDED',   label: '↩️ Remboursée',    color: 'bg-orange-100 text-orange-700' },
]

const CARRIERS = [
  { value: '',             label: '— Aucun —' },
  { value: 'colissimo',    label: 'Colissimo (La Poste)' },
  { value: 'laposte',      label: 'Lettre suivie (La Poste)' },
  { value: 'mondialrelay', label: 'Mondial Relay' },
  { value: 'chronopost',   label: 'Chronopost' },
  { value: 'autre',        label: 'Autre' },
]

export function OrderDetailForm({ initial }: { initial: OrderData }) {
  const router = useRouter()
  const [status,         setStatus]         = useState(initial.status)
  const [trackingNumber, setTrackingNumber] = useState(initial.trackingNumber)
  const [trackingCarrier, setTrackingCarrier] = useState(initial.trackingCarrier)
  const [adminNote,      setAdminNote]      = useState(initial.adminNote)
  const [saving,         setSaving]         = useState(false)
  const [error,          setError]          = useState('')
  const [success,        setSuccess]        = useState(false)
  const [deleting,       setDeleting]       = useState(false)

  const isShipped     = status === 'SHIPPED'
  const wasJustShippedNow = initial.status !== 'SHIPPED' && status === 'SHIPPED'
  const orderNumber   = initial.id.slice(-8).toUpperCase()
  const subtotal      = initial.items.reduce((sum, it) => sum + it.price * it.quantity, 0)
  const shipping      = initial.total - subtotal

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      const res = await fetch(`/api/admin/orders/${initial.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingNumber, trackingCarrier, adminNote }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Erreur lors de la sauvegarde.')
        setSaving(false)
        return
      }
      setSuccess(true)
      setSaving(false)
      router.refresh()
      setTimeout(() => setSuccess(false), 4000)
    } catch {
      setError('Erreur réseau.')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`Supprimer définitivement la commande #${orderNumber} ?\n\nÀ utiliser pour les commandes de test. Cette action est irréversible et ne rembourse pas le paiement Stripe.`)) return
    setDeleting(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/orders/${initial.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Erreur lors de la suppression.')
        setDeleting(false)
        return
      }
      router.push('/admin/orders')
      router.refresh()
    } catch {
      setError('Erreur réseau.')
      setDeleting(false)
    }
  }

  function copyAddress() {
    const txt = `${initial.shippingName}\n${initial.shippingAddress}\n${initial.shippingZip} ${initial.shippingCity}\n${initial.shippingCountry}`
    navigator.clipboard.writeText(txt).then(() => alert('Adresse copiée dans le presse-papier ✓'))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-mono">#{orderNumber}</h1>
            <p className="text-sm text-gray-500">
              <Calendar className="w-3 h-3 inline mr-1" />
              {new Date(initial.createdAt).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}
            </p>
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#24BBD0] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#24BBD0]/90 transition-colors disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      {success && (
        <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">
            Sauvegardé ✓
            {wasJustShippedNow && <span className="ml-1">— email d&apos;expédition envoyé à la cliente 📨</span>}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLONNE GAUCHE — Articles + Adresse */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Articles commandés" icon={Package}>
            <div className="divide-y divide-gray-100">
              {initial.items.map((it) => (
                <div key={it.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="relative w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {it.image ? (
                      <Image src={it.image} alt={it.name} fill sizes="56px" className="object-cover" />
                    ) : <div className="w-full h-full" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{it.name}</p>
                    <p className="text-xs text-gray-400">Quantité : {it.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{(it.price * it.quantity).toFixed(2)} €</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3 mt-3 space-y-1 text-sm">
              <div className="flex justify-between text-gray-500"><span>Sous-total</span><span>{subtotal.toFixed(2)} €</span></div>
              <div className="flex justify-between text-gray-500"><span>Livraison</span><span>{shipping > 0 ? `${shipping.toFixed(2)} €` : 'Offerte'}</span></div>
              <div className="flex justify-between font-semibold text-[#0E4F5E] text-base pt-2 border-t border-gray-100"><span>Total</span><span>{initial.total.toFixed(2)} €</span></div>
            </div>
          </Card>

          <Card title="Adresse de livraison" icon={MapPin}>
            <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm leading-relaxed">
              <p className="font-semibold">{initial.shippingName}</p>
              <p>{initial.shippingAddress}</p>
              <p>{initial.shippingZip} {initial.shippingCity}</p>
              <p>{initial.shippingCountry}</p>
            </div>
            <button
              type="button"
              onClick={copyAddress}
              className="mt-3 text-xs text-[#0E4F5E] hover:text-[#0E4F5E] underline"
            >
              📋 Copier l&apos;adresse complète
            </button>
          </Card>

          <Card title="Cliente" icon={User}>
            <p className="text-sm">
              <span className="font-medium">{initial.shippingName || initial.user?.name || '—'}</span>
              <br />
              <a href={`mailto:${initial.email}`} className="text-[#0E4F5E] hover:underline">{initial.email}</a>
            </p>
            {initial.user && (
              <p className="text-xs text-gray-400 mt-2">✓ Cliente inscrite sur le site</p>
            )}
          </Card>
        </div>

        {/* COLONNE DROITE — Statut + Suivi + Note */}
        <div className="space-y-6">
          <Card title="Statut de la commande" icon={Truck}>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="input w-full"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>

            <div className="mt-4 space-y-2 text-xs text-gray-500">
              <p>🕐 Créée : {new Date(initial.createdAt).toLocaleDateString('fr-FR')}</p>
              {initial.shippedAt   && <p>🚚 Expédiée : {new Date(initial.shippedAt).toLocaleDateString('fr-FR')}</p>}
              {initial.deliveredAt && <p>🎉 Livrée : {new Date(initial.deliveredAt).toLocaleDateString('fr-FR')}</p>}
            </div>
          </Card>

          <Card title="Suivi de livraison" icon={Package}>
            <Field label="Transporteur">
              <select
                value={trackingCarrier}
                onChange={(e) => setTrackingCarrier(e.target.value)}
                className="input"
              >
                {CARRIERS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </Field>
            <Field label="Numéro de suivi">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Ex : 9X1234567890"
                className="input font-mono"
              />
            </Field>

            {isShipped && trackingNumber && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-xs text-purple-800">
                ✨ Quand tu enregistres en passant le statut sur <strong>Expédiée</strong>, un email avec le numéro de suivi sera envoyé automatiquement à la cliente.
              </div>
            )}
          </Card>

          <Card title="Note interne" icon={User}>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={3}
              className="input resize-none"
              placeholder="Note personnelle (jamais envoyée à la cliente)"
            />
          </Card>
        </div>
      </div>

      {/* Zone danger — supprimer (utile pour les commandes de test) */}
      <div className="admin-card p-5 border-red-100">
        <h2 className="font-semibold text-gray-900 mb-1">Supprimer la commande</h2>
        <p className="text-xs text-gray-500 mb-4">
          Retire définitivement cette commande du tableau de bord (pratique pour les commandes de test).
          Cela ne rembourse pas le paiement Stripe — fais le remboursement séparément si besoin.
        </p>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          {deleting ? 'Suppression…' : 'Supprimer cette commande'}
        </button>
      </div>
    </form>
  )
}

function Card({
  title, icon: Icon, children,
}: { title: string; icon: typeof Truck; children: React.ReactNode }) {
  return (
    <div className="admin-card p-5">
      <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Icon className="w-4 h-4 text-[#0E4F5E]" />
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  )
}
