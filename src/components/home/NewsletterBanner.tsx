'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Reveal } from '@/components/ui/motion'

export function NewsletterBanner() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section className="py-16 sm:py-24 bg-[#1A1A1A] text-white">
      <div className="container-x">
        <Reveal>
          <div className="max-w-xl mx-auto text-center">
            <p className="eyebrow text-[#D4AF37] mb-3">✨ Newsletter 🐚</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-4 leading-tight">
              Recevez nos<br />
              <span className="italic text-[#D4AF37]">nouveautés</span> en avant-première
            </h2>
            <p className="text-[#A8A8A8] text-sm leading-relaxed mb-8 max-w-sm mx-auto">
              Inscrivez-vous et profitez de -10% sur votre première commande.
              Pas de spam, promis.
            </p>

            {submitted ? (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[#D4AF37] text-sm tracking-wide"
              >
                ✨ Merci ! Votre code arrive dans votre boîte mail.
              </motion.p>
            ) : (
              <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  className="flex-1 bg-transparent border border-white/30 px-5 py-3.5 text-sm placeholder:text-white/40 focus:border-[#D4AF37] focus:outline-none transition-colors"
                />
                <button type="submit" className="btn-gold">
                  S'inscrire
                </button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
