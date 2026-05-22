'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { motion, Reveal, FloatingShape } from '@/components/ui/motion'

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
    <section className="py-20 sm:py-28 px-4 bg-gradient-to-br from-[#4DB8D4] to-[#2a8fa8] relative overflow-hidden">
      <FloatingShape
        className="absolute top-10 left-[8%] w-32 h-32 rounded-full border border-white/15"
        duration={8}
        distance={22}
      />
      <FloatingShape
        className="absolute bottom-8 right-[10%] w-20 h-20 rounded-full bg-white/5"
        duration={6}
        delay={1}
        distance={18}
      />

      <Reveal className="max-w-2xl mx-auto text-center relative z-10">
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 250, damping: 18 }}
            className="bg-white/20 rounded-2xl px-8 py-6 text-white font-medium"
          >
            ✨ Merci ! Vérifie ta boîte mail pour ton code de réduction.
          </motion.div>
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
            <motion.button
              type="submit"
              disabled={status === 'loading'}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="inline-flex items-center justify-center gap-1.5 bg-[#D4AF37] hover:bg-[#b8963e] text-white px-6 py-3.5 rounded-xl font-semibold whitespace-nowrap disabled:opacity-60"
            >
              {status === 'loading' ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              S'inscrire
            </motion.button>
          </form>
        )}

        <p className="text-white/50 text-xs mt-4">Aucun spam. Désabonnement en un clic.</p>
      </Reveal>
    </section>
  )
}
