'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, AlertCircle, CheckCircle2, MessageSquare, PenSquare } from 'lucide-react'

interface Review {
  id:        string
  name:      string
  rating:    number
  comment:   string
  createdAt: string
}

interface Props {
  productSlug: string
}

export function ProductReviews({ productSlug }: Props) {
  const [data, setData]       = useState<{ reviews: Review[]; count: number; average: number }>({
    reviews: [], count: 0, average: 0,
  })
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  // formulaire
  const [name, setName]     = useState('')
  const [rating, setRating] = useState(5)
  const [hover, setHover]   = useState(0)
  const [comment, setComment] = useState('')
  const [posting, setPosting] = useState(false)
  const [msg, setMsg]       = useState<{ ok: boolean; text: string } | null>(null)

  useEffect(() => {
    fetch(`/api/products/${productSlug}/reviews`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [productSlug])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setPosting(true)
    setMsg(null)
    try {
      const res = await fetch(`/api/products/${productSlug}/reviews`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, rating, comment }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMsg({ ok: false, text: data.error || 'Erreur lors de l\'envoi.' })
      } else {
        setMsg({ ok: true, text: data.message || 'Merci, votre avis sera publié après validation.' })
        setName(''); setRating(5); setComment('')
        setTimeout(() => { setShowForm(false); setMsg(null) }, 3000)
      }
    } catch {
      setMsg({ ok: false, text: 'Erreur réseau.' })
    } finally {
      setPosting(false)
    }
  }

  const fullStars  = Math.floor(data.average)
  const hasHalf    = data.average - fullStars >= 0.5

  return (
    <section className="bg-[#FAF5EA] py-14 sm:py-20">
      <div className="container-x max-w-4xl">
        <div className="text-center mb-10">
          <p className="eyebrow mb-3">⭐ Avis clients</p>
          <h2 className="text-3xl sm:text-4xl text-[#0E4F5E] mb-4">Ce qu&apos;elles en pensent</h2>

          {/* Note moyenne */}
          {!loading && (
            <div className="inline-flex flex-col items-center gap-2 mt-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i <= fullStars
                        ? 'fill-[#D4AF37] text-[#D4AF37]'
                        : (i === fullStars + 1 && hasHalf
                          ? 'fill-[#D4AF37] text-[#D4AF37] opacity-60'
                          : 'text-[#E8E2D5]')
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-[#6B6B6B]">
                {data.count > 0
                  ? <><span className="font-medium text-[#0E4F5E]">{data.average.toFixed(1)}</span> / 5  ·  {data.count} avis</>
                  : 'Aucun avis pour le moment — soyez la première !'
                }
              </p>
            </div>
          )}
        </div>

        {/* Bouton "Laisser un avis" */}
        {!showForm && (
          <div className="text-center mb-8">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-white border border-[#0E4F5E] text-[#0E4F5E] px-5 py-2.5 text-xs tracking-[0.18em] uppercase font-medium hover:bg-[#0E4F5E] hover:text-white transition-colors"
            >
              <PenSquare className="w-4 h-4" />
              Laisser un avis
            </button>
          </div>
        )}

        {/* Formulaire */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              onSubmit={submit}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 sm:p-8 mb-8 overflow-hidden"
            >
              <h3 className="text-lg font-medium text-[#0E4F5E] mb-5">Votre avis</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs tracking-wider uppercase text-[#6B6B6B] mb-2">Votre note</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(i)}
                        onMouseEnter={() => setHover(i)}
                        onMouseLeave={() => setHover(0)}
                        aria-label={`${i} étoile${i > 1 ? 's' : ''}`}
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            (hover || rating) >= i
                              ? 'fill-[#D4AF37] text-[#D4AF37]'
                              : 'text-[#E8E2D5]'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs tracking-wider uppercase text-[#6B6B6B] mb-2">Votre prénom</label>
                  <input
                    type="text"
                    required
                    maxLength={60}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sophie"
                    className="w-full border border-[#E8E2D5] px-4 py-3 text-sm focus:border-[#24BBD0] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs tracking-wider uppercase text-[#6B6B6B] mb-2">Votre avis</label>
                  <textarea
                    required
                    maxLength={1000}
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Partagez votre expérience avec ce bijou…"
                    className="w-full border border-[#E8E2D5] px-4 py-3 text-sm focus:border-[#24BBD0] focus:outline-none resize-none"
                  />
                  <p className="text-[10px] text-[#6B6B6B] mt-1">{comment.length}/1000 caractères</p>
                </div>

                {msg && (
                  <div className={`flex items-start gap-2 px-4 py-3 text-sm ${
                    msg.ok ? 'bg-green-50 border border-green-200 text-green-700'
                           : 'bg-red-50 border border-red-200 text-red-700'
                  }`}>
                    {msg.ok ? <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                    {msg.text}
                  </div>
                )}

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-xs tracking-wider uppercase text-[#6B6B6B] hover:text-[#0E4F5E] px-4 py-2.5"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={posting}
                    className="inline-flex items-center gap-2 bg-[#0E4F5E] hover:bg-[#24BBD0] text-white px-6 py-2.5 text-xs tracking-[0.18em] uppercase font-medium transition-colors disabled:opacity-60"
                  >
                    {posting ? 'Envoi…' : 'Publier mon avis'}
                  </button>
                </div>

                <p className="text-[10px] text-[#6B6B6B] text-center">
                  Votre avis sera publié après validation par notre équipe.
                </p>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Liste des avis */}
        {loading ? (
          <div className="text-center py-8 text-[#6B6B6B] text-sm">Chargement…</div>
        ) : data.reviews.length === 0 ? (
          <div className="text-center py-12 bg-white">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 text-[#E8E2D5]" strokeWidth={1.2} />
            <p className="text-sm text-[#6B6B6B]">
              Aucun avis pour le moment. Soyez la première à partager votre expérience !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {data.reviews.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white p-6 border border-transparent hover:border-[#D4AF37]/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i <= r.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-[#E8E2D5]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-[#6B6B6B]">
                    {new Date(r.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <p className="text-sm text-[#0E4F5E] italic leading-relaxed mb-4">&ldquo;{r.comment}&rdquo;</p>
                <p className="text-xs font-medium text-[#0E4F5E]">— {r.name}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
