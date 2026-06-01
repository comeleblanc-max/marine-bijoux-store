'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Plus, X, AlertCircle, CheckCircle2 } from 'lucide-react'
import type { SiteSettings } from '@/lib/settings'

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter()
  const [form, setForm] = useState<SiteSettings>(initial)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saved' | 'error'>('idle')
  const [error, setError]   = useState('')
  const [newMessage, setNewMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setStatus('idle')
    setError('')
    try {
      const res = await fetch('/api/admin/settings', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Erreur lors de la sauvegarde.')
        setStatus('error')
        setSaving(false)
        return
      }
      setStatus('saved')
      setSaving(false)
      router.refresh()
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setError('Erreur réseau.')
      setStatus('error')
      setSaving(false)
    }
  }

  function addMessage() {
    if (!newMessage.trim()) return
    setForm({
      ...form,
      announcement: {
        ...form.announcement,
        messages: [...form.announcement.messages, newMessage.trim().toUpperCase()],
      },
    })
    setNewMessage('')
  }

  function removeMessage(idx: number) {
    setForm({
      ...form,
      announcement: {
        ...form.announcement,
        messages: form.announcement.messages.filter((_, i) => i !== idx),
      },
    })
  }

  function updateMessage(idx: number, value: string) {
    const messages = [...form.announcement.messages]
    messages[idx]  = value
    setForm({ ...form, announcement: { ...form.announcement, messages } })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* === BANDEAU HAUT === */}
      <Card title="🔔 Bandeau du haut" desc="Les messages qui défilent au-dessus du logo.">
        <Toggle
          label="Activer le bandeau"
          checked={form.announcement.enabled}
          onChange={(v) => setForm({ ...form, announcement: { ...form.announcement, enabled: v } })}
        />

        <div className="space-y-2 mt-4">
          {form.announcement.messages.map((msg, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={msg}
                onChange={(e) => updateMessage(idx, e.target.value)}
                className="input flex-1"
              />
              <button
                type="button"
                onClick={() => removeMessage(idx)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Supprimer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addMessage() } }}
              placeholder="Ajouter un nouveau message…"
              className="input flex-1"
            />
            <button
              type="button"
              onClick={addMessage}
              className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </div>
        </div>
      </Card>

      {/* === HERO === */}
      <Card title="🌅 Texte d'accueil (Hero)" desc="Le grand texte visible sur la photo d'accueil.">
        <Field label="Petite étiquette (eyebrow)">
          <input
            type="text"
            value={form.hero.eyebrow}
            onChange={(e) => setForm({ ...form, hero: { ...form.hero, eyebrow: e.target.value } })}
            className="input"
            placeholder="🐚 Collection — Été 2026"
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Titre (1ère ligne)">
            <input
              type="text"
              value={form.hero.title}
              onChange={(e) => setForm({ ...form, hero: { ...form.hero, title: e.target.value } })}
              className="input"
              placeholder="La douceur de l'été"
            />
          </Field>
          <Field label="Titre (2e ligne, en italique)">
            <input
              type="text"
              value={form.hero.titleItalic}
              onChange={(e) => setForm({ ...form, hero: { ...form.hero, titleItalic: e.target.value } })}
              className="input"
              placeholder="à fleur de peau."
            />
          </Field>
        </div>
        <Field label="Description (sous le titre)">
          <textarea
            value={form.hero.description}
            onChange={(e) => setForm({ ...form, hero: { ...form.hero, description: e.target.value } })}
            rows={3}
            className="input"
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Texte du bouton principal">
            <input
              type="text"
              value={form.hero.ctaPrimary}
              onChange={(e) => setForm({ ...form, hero: { ...form.hero, ctaPrimary: e.target.value } })}
              className="input"
            />
          </Field>
          <Field label="Texte du bouton secondaire">
            <input
              type="text"
              value={form.hero.ctaSecondary}
              onChange={(e) => setForm({ ...form, hero: { ...form.hero, ctaSecondary: e.target.value } })}
              className="input"
            />
          </Field>
        </div>
      </Card>

      {/* === LIVRAISON === */}
      <Card title="🚚 Livraison & retours" desc="Affiché sur les fiches produits et la page livraison.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Livraison offerte dès (€)">
            <input
              type="number"
              step="0.01"
              value={form.shipping.freeThreshold}
              onChange={(e) => setForm({ ...form, shipping: { ...form.shipping, freeThreshold: Number(e.target.value) } })}
              className="input"
            />
          </Field>
          <Field label="Frais de port standard (€)">
            <input
              type="number"
              step="0.01"
              value={form.shipping.standardFee}
              onChange={(e) => setForm({ ...form, shipping: { ...form.shipping, standardFee: Number(e.target.value) } })}
              className="input"
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Délai de livraison">
            <input
              type="text"
              value={form.shipping.deliveryDays}
              onChange={(e) => setForm({ ...form, shipping: { ...form.shipping, deliveryDays: e.target.value } })}
              className="input"
              placeholder="2-4 jours ouvrés"
            />
          </Field>
          <Field label="Retours sous (jours)">
            <input
              type="number"
              value={form.shipping.returnsDays}
              onChange={(e) => setForm({ ...form, shipping: { ...form.shipping, returnsDays: Number(e.target.value) } })}
              className="input"
            />
          </Field>
        </div>
      </Card>

      {/* === CONTACT === */}
      <Card title="📞 Informations de contact" desc="Affichées dans le footer et la page Contact.">
        <Field label="Email">
          <input
            type="email"
            value={form.contact.email}
            onChange={(e) => setForm({ ...form, contact: { ...form.contact, email: e.target.value } })}
            className="input"
          />
        </Field>
        <Field label="Pseudo Instagram (avec @)">
          <input
            type="text"
            value={form.contact.instagram}
            onChange={(e) => setForm({ ...form, contact: { ...form.contact, instagram: e.target.value } })}
            className="input"
            placeholder="@marineetladouceurdelete"
          />
        </Field>
        <Field label="Téléphone (optionnel)">
          <input
            type="tel"
            value={form.contact.phone}
            onChange={(e) => setForm({ ...form, contact: { ...form.contact, phone: e.target.value } })}
            className="input"
            placeholder="06 12 34 56 78"
          />
        </Field>
      </Card>

      {/* MESSAGES */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
      {status === 'saved' && (
        <div className="flex items-start gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-700">Paramètres enregistrés ✨</p>
        </div>
      )}

      {/* BOUTON SAUVER STICKY EN BAS */}
      <div className="sticky bottom-0 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-4 bg-white/90 backdrop-blur border-t border-gray-200 flex justify-end gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[#24BBD0] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#24BBD0]/90 transition-colors disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Enregistrement…' : 'Enregistrer tout'}
        </button>
      </div>
    </form>
  )
}

function Card({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="admin-card p-5 sm:p-6">
      <h2 className="font-semibold text-gray-900">{title}</h2>
      {desc && <p className="text-xs text-gray-500 mt-1 mb-4">{desc}</p>}
      <div className="space-y-4 mt-3">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
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
