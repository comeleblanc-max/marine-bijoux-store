'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Send } from 'lucide-react'

export function NewsletterBanner() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-[#4DB8D4] to-[#2a8fa8]">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-white/70 text-sm tracking-widest uppercase mb-3">Rejoins la famille</p>
        <h2
          className="text-3xl sm:text-4xl text-white font-light mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          L'été dans ta boîte mail 🌊
        </h2>
        <p className="text-white/80 mb-8 leading-relaxed">
          Inscris-toi et reçois 10% de réduction sur ta première commande,
          <br className="hidden sm:block" /> les nouvelles collections en avant-première et nos conseils bijoux.
        </p>

        {status === 'success' ? (
          <div className="bg-white/20 rounded-2xl px-8 py-6 text-white font-medium">
            ✨ Merci ! Vérifie ta boîte mail pour ton code de réduction.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              required
              className="flex-1 px-5 py-3.5 rounded-xl bg-white/20 backdrop-blur text-white placeholder-white/60 border border-white/30 focus:outline-none focus:border-white focus:bg-white/30 transition-all"
            />
            <Button
              type="submit"
              loading={status === 'loading'}
              className="bg-[#C9A84C] hover:bg-[#b8963e] text-white px-6 py-3.5 rounded-xl font-semibold whitespace-nowrap"
            >
              <Send className="w-4 h-4 mr-1" />
              S'inscrire
            </Button>
          </form>
        )}

        <p className="text-white/50 text-xs mt-4">
          Aucun spam. Désabonnement en un clic.
        </p>
      </div>
    </section>
  )
}
