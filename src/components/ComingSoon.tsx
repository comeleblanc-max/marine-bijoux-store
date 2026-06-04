'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, ArrowRight } from 'lucide-react'

function diff(targetTs: number) {
  const ms = Math.max(0, targetTs - Date.now())
  const days    = Math.floor(ms / 86_400_000)
  const hours   = Math.floor((ms % 86_400_000) / 3_600_000)
  const minutes = Math.floor((ms % 3_600_000) / 60_000)
  const seconds = Math.floor((ms % 60_000) / 1000)
  return { days, hours, minutes, seconds }
}

export function ComingSoon({ targetIso }: { targetIso: string }) {
  const router  = useRouter()
  const targetTs = new Date(targetIso).getTime()

  const [mounted, setMounted] = useState(false)
  const [t, setT]   = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [code, setCode]       = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
    setT(diff(targetTs))
    const id = setInterval(() => setT(diff(targetTs)), 1000)
    return () => clearInterval(id)
  }, [targetTs])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/preview-unlock', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ code: code.trim() }),
      })
      if (!res.ok) {
        setError('Code incorrect. Réessayez.')
        setLoading(false)
        inputRef.current?.focus()
        return
      }
      router.refresh()
    } catch {
      setError('Erreur réseau. Réessayez.')
      setLoading(false)
    }
  }

  const cells: Array<{ label: string; value: number }> = [
    { label: 'Jours',    value: t.days },
    { label: 'Heures',   value: t.hours },
    { label: 'Minutes',  value: t.minutes },
    { label: 'Secondes', value: t.seconds },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0E4F5E] to-[#0a3a45] text-white flex flex-col items-center justify-center px-5 py-12 text-center relative overflow-hidden">
      {/* halo doux */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-2xl max-h-2xl bg-[#24BBD0]/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-xl"
      >
        <Image
          src="/logo-marine-white.png"
          alt="Marine et la douceur de l'été"
          width={220}
          height={120}
          priority
          className="h-20 sm:h-24 w-auto object-contain mx-auto mb-8"
        />

        <p className="text-[11px] tracking-[0.3em] uppercase text-[#A7D5E6] mb-4">
          ✨ Ouverture imminente
        </p>
        <h1
          className="text-3xl sm:text-4xl leading-tight mb-4"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          La boutique ouvre<br />
          <span className="italic text-[#D4AF37]">très bientôt</span>
        </h1>
        <p className="text-sm text-[#A7D5E6] max-w-md mx-auto mb-10 leading-relaxed">
          Des bijoux en acier inoxydable inspirés par le soleil, la mer et la douceur de l&apos;été.
          Encore un peu de patience 🐚
        </p>

        {/* Décompte */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto mb-12">
          {cells.map((c) => (
            <div key={c.label} className="bg-white/10 backdrop-blur rounded-xl py-4 px-1 border border-white/10">
              <div className="text-2xl sm:text-4xl font-light tabular-nums" style={{ fontFamily: 'var(--font-playfair)' }}>
                {mounted ? String(c.value).padStart(2, '0') : '--'}
              </div>
              <div className="text-[9px] sm:text-[10px] tracking-[0.15em] uppercase text-[#A7D5E6] mt-1">
                {c.label}
              </div>
            </div>
          ))}
        </div>

        {/* Accès anticipé */}
        <form onSubmit={submit} className="max-w-sm mx-auto">
          <p className="text-[11px] tracking-[0.2em] uppercase text-white/50 mb-3 flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3" /> Accès anticipé
          </p>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Votre code"
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#D4AF37] transition-colors text-center tracking-wide"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#D4AF37] hover:bg-[#c19f30] text-[#0E4F5E] px-4 rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center"
              aria-label="Entrer"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          {error && <p className="text-[#E89B6F] text-xs mt-3">{error}</p>}
        </form>

        <p className="text-[11px] text-white/40 mt-10">
          © {new Date().getFullYear()} Marine et la douceur de l&apos;été
        </p>
      </motion.div>
    </main>
  )
}
