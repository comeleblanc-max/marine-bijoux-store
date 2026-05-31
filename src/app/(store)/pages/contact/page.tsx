'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Mail, Clock, Share2 } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErrorMsg(data.error || "Une erreur est survenue. Veuillez réessayer.")
        setStatus('error')
        return
      }
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setErrorMsg("Impossible d'envoyer le message. Vérifiez votre connexion.")
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF5EA]">
      <div className="bg-[#24BBD0] py-20 px-4 text-center text-white">
        <h1 className="text-4xl font-light" style={{ fontFamily: 'var(--font-playfair)' }}>
          Nous contacter
        </h1>
        <p className="text-white/60 mt-3">Une question ? On vous répond avec plaisir.</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Info */}
        <div className="lg:col-span-2 space-y-6">
          {[
            { icon: Mail, title: 'Email', desc: 'contact@marineetladouceurdelete.com', sub: 'Réponse sous 24h' },
            { icon: Clock, title: 'Horaires', desc: 'Lun — Ven', sub: '9h à 18h' },
            { icon: Share2, title: 'Instagram', desc: '@marineetladouceurdelete', sub: 'Suivez-nous !' },
          ].map(({ icon: Icon, title, desc, sub }) => (
            <div key={title} className="bg-white rounded-2xl p-5 flex gap-4 items-start">
              <div className="w-10 h-10 bg-[#FAF5EA] rounded-full flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-[#A7D5E6]" />
              </div>
              <div>
                <p className="font-semibold text-[#24BBD0] text-sm">{title}</p>
                <p className="text-gray-700 text-sm">{desc}</p>
                <p className="text-gray-400 text-xs">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-8">
          {status === 'success' ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-4">✉️</p>
              <h2 className="text-xl font-semibold text-[#24BBD0] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                Message envoyé !
              </h2>
              <p className="text-gray-500">Nous vous répondons sous 24h.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#24BBD0] mb-1.5">Nom</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#A7D5E6] text-sm"
                    placeholder="Marie Dupont"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#24BBD0] mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#A7D5E6] text-sm"
                    placeholder="marie@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#24BBD0] mb-1.5">Sujet</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#A7D5E6] text-sm"
                >
                  <option value="">Choisir un sujet...</option>
                  <option>Question sur un produit</option>
                  <option>Suivi de commande</option>
                  <option>Retour / échange</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#24BBD0] mb-1.5">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#A7D5E6] text-sm resize-none"
                  placeholder="Votre message..."
                />
              </div>
              {status === 'error' && errorMsg && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  {errorMsg}
                </p>
              )}
              <Button type="submit" size="lg" loading={status === 'loading'} className="w-full rounded-xl">
                Envoyer le message ✉️
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
