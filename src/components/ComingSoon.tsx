'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, useAnimationFrame } from 'framer-motion'
import { Lock, ArrowRight, Volume2, VolumeX } from 'lucide-react'

interface Tile { name: string; image: string }

/* ───────── Ambiance "vagues" générée via Web Audio (aucun fichier) ───────── */
function createOcean(ctx: AudioContext) {
  const master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  /* Bruit "brown" (plus doux/grave que le blanc) */
  const size = ctx.sampleRate * 4
  const buffer = ctx.createBuffer(1, size, ctx.sampleRate)
  const d = buffer.getChannelData(0)
  let last = 0
  for (let i = 0; i < size; i++) {
    const white = Math.random() * 2 - 1
    last = (last + 0.02 * white) / 1.02
    d[i] = last * 3.2
  }
  const noise = ctx.createBufferSource()
  noise.buffer = buffer
  noise.loop = true

  /* Filtre passe-bas → son feutré, façon ressac */
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 600
  lp.Q.value = 0.6

  /* Gonflement lent des vagues (LFO sur le volume) */
  const swell = ctx.createGain()
  swell.gain.value = 0.55
  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.11
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 0.4
  lfo.connect(lfoGain).connect(swell.gain)

  /* Modulation du filtre → écume/mouvement */
  const fLfo = ctx.createOscillator()
  fLfo.frequency.value = 0.07
  const fLfoGain = ctx.createGain()
  fLfoGain.gain.value = 220
  fLfo.connect(fLfoGain).connect(lp.frequency)

  noise.connect(lp).connect(swell).connect(master)
  noise.start()
  lfo.start()
  fLfo.start()

  return {
    fadeIn:  () => master.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 1.6),
    fadeOut: () => master.gain.linearRampToValueAtTime(0,    ctx.currentTime + 0.7),
  }
}

function AmbientSound() {
  const [on, setOn] = useState(false)
  const ctxRef   = useRef<AudioContext | null>(null)
  const oceanRef = useRef<ReturnType<typeof createOcean> | null>(null)

  function toggle() {
    if (!on) {
      if (!ctxRef.current) {
        const Ctx = window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (!Ctx) return
        ctxRef.current = new Ctx()
      }
      const ctx = ctxRef.current
      ctx.resume().catch(() => {})
      if (!oceanRef.current) oceanRef.current = createOcean(ctx)
      oceanRef.current.fadeIn()
      setOn(true)
    } else {
      oceanRef.current?.fadeOut()
      setOn(false)
    }
  }

  useEffect(() => () => { try { ctxRef.current?.close() } catch { /* noop */ } }, [])

  return (
    <button
      onClick={toggle}
      className="pointer-events-auto fixed bottom-5 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur border border-white/15 rounded-full pl-3 pr-4 py-2 text-[11px] tracking-wide text-white/80 transition-colors"
      aria-label={on ? 'Couper le son' : 'Activer l\'ambiance marine'}
    >
      {on ? <Volume2 className="w-4 h-4 text-[#D4AF37]" /> : <VolumeX className="w-4 h-4" />}
      {on ? 'Ambiance marine' : 'Activer l\'ambiance 🌊'}
    </button>
  )
}

function diff(targetTs: number) {
  const ms = Math.max(0, targetTs - Date.now())
  return {
    days:    Math.floor(ms / 86_400_000),
    hours:   Math.floor((ms % 86_400_000) / 3_600_000),
    minutes: Math.floor((ms % 3_600_000) / 60_000),
    seconds: Math.floor((ms % 60_000) / 1000),
  }
}

/* Rotation d'un tableau pour varier les colonnes */
function rotate<T>(arr: T[], n: number): T[] {
  if (arr.length === 0) return arr
  const k = ((n % arr.length) + arr.length) % arr.length
  return [...arr.slice(k), ...arr.slice(0, k)]
}

/* ──────────────── Colonne de photos en marquee ──────────────── */
function MarqueeColumn({
  tiles,
  direction,
  speed = 24,
}: {
  tiles: Tile[]
  direction: 'up' | 'down'
  speed?: number
}) {
  const trackRef  = useRef<HTMLDivElement>(null)
  const yRef      = useRef(direction === 'down' ? -1 : 0)
  const hRef      = useRef(1)
  const factorRef = useRef(1) // 1 = défile, 0 = arrêté (lerp doux)
  const [hovered, setHovered] = useState<number | null>(null)

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) hRef.current = trackRef.current.scrollHeight / 2 || 1
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [tiles])

  useAnimationFrame((_, delta) => {
    if (!trackRef.current) return
    const dt = Math.min(delta, 50) / 1000
    /* arrêt / reprise en douceur */
    const target = hovered !== null ? 0 : 1
    factorRef.current += (target - factorRef.current) * Math.min(1, dt * 4)
    const dir = direction === 'up' ? -1 : 1
    const h = hRef.current
    let y = yRef.current + dir * speed * factorRef.current * dt
    y = ((y % h) + h) % h - h // normalise dans [-h, 0) → boucle sans couture
    yRef.current = y
    trackRef.current.style.transform = `translateY(${y}px)`
  })

  const doubled = [...tiles, ...tiles]

  return (
    <div className="relative h-full overflow-hidden">
      <div ref={trackRef} className="will-change-transform">
        {doubled.map((tile, i) => (
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="relative mb-3 rounded-xl overflow-hidden aspect-[3/4] bg-white/5"
          >
            <Image
              src={tile.image}
              alt={tile.name}
              fill
              sizes="(max-width:1024px) 30vw, 200px"
              className="object-cover"
            />
            <div
              className={`absolute inset-0 flex items-end p-2.5 bg-gradient-to-t from-black/75 via-black/10 to-transparent transition-opacity duration-300 ${
                hovered === i ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className="text-white text-[11px] leading-tight font-medium">
                {tile.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ──────────────────────── Page d'attente ──────────────────────── */
export function ComingSoon({ targetIso, tiles = [] }: { targetIso: string; tiles?: Tile[] }) {
  const router   = useRouter()
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

  const cells = [
    { label: 'Jours',    value: t.days },
    { label: 'Heures',   value: t.hours },
    { label: 'Minutes',  value: t.minutes },
    { label: 'Secondes', value: t.seconds },
  ]

  const hasTiles = tiles.length > 0

  return (
    <main className="relative min-h-screen bg-[#0E4F5E] overflow-hidden">
      {/* Colonnes de photos (desktop) */}
      {hasTiles && (
        <div className="absolute inset-0 flex justify-between" aria-hidden="true">
          {/* Côté gauche */}
          <div className="hidden sm:grid grid-cols-2 gap-3 w-[34%] lg:w-[32%] h-full p-3">
            <MarqueeColumn tiles={rotate(tiles, 0)}  direction="up" />
            <MarqueeColumn tiles={rotate(tiles, 5)}  direction="down" />
          </div>
          {/* Côté droit — sens inverse */}
          <div className="hidden sm:grid grid-cols-2 gap-3 w-[34%] lg:w-[32%] h-full p-3">
            <MarqueeColumn tiles={rotate(tiles, 9)}  direction="down" />
            <MarqueeColumn tiles={rotate(tiles, 13)} direction="up" />
          </div>
        </div>
      )}

      {/* Voile pour la lisibilité du centre (laisse passer la souris vers les photos) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0E4F5E]/40 via-[#0E4F5E]/90 to-[#0E4F5E]/40 pointer-events-none" />
      <div className="absolute inset-0 bg-[#0E4F5E]/30 sm:bg-transparent pointer-events-none" />

      {/* Contenu central */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-5 py-12 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto w-full max-w-md text-center bg-[#0E4F5E]/50 sm:bg-[#0a3a45]/55 backdrop-blur-md rounded-3xl border border-white/10 px-6 py-10 sm:px-9 sm:py-12 shadow-2xl"
        >
          {/* Médaillon beige — fait ressortir le logo coloré sur le fond foncé */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-7 rounded-full bg-[#FAF5EA] shadow-[0_8px_30px_rgba(0,0,0,0.25)] ring-1 ring-[#D4AF37]/30 flex items-center justify-center">
            <Image
              src="/logo-marine-transparent.png"
              alt="Marine et la douceur de l'été"
              width={200}
              height={206}
              priority
              className="w-[88%] h-[88%] object-contain"
            />
          </div>

          <p className="text-[11px] tracking-[0.3em] uppercase text-[#A7D5E6] mb-3">
            ✨ Ouverture imminente
          </p>
          <h1
            className="text-2xl sm:text-3xl text-white leading-tight mb-3"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            La boutique ouvre<br />
            <span className="italic text-[#D4AF37]">très bientôt</span>
          </h1>
          <p className="text-[13px] text-[#A7D5E6] max-w-xs mx-auto mb-8 leading-relaxed">
            Des bijoux inspirés par le soleil, la mer et la douceur de l&apos;été 🐚
          </p>

          {/* Décompte */}
          <div className="grid grid-cols-4 gap-2 mb-9">
            {cells.map((c) => (
              <div key={c.label} className="bg-white/10 rounded-xl py-3 border border-white/10">
                <div
                  className="text-xl sm:text-3xl text-white font-light tabular-nums"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  {mounted ? String(c.value).padStart(2, '0') : '--'}
                </div>
                <div className="text-[8px] sm:text-[9px] tracking-[0.12em] uppercase text-[#A7D5E6] mt-1">
                  {c.label}
                </div>
              </div>
            ))}
          </div>

          {/* Accès anticipé */}
          <form onSubmit={submit}>
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/50 mb-2.5 flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3" /> Accès anticipé
            </p>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Votre code"
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#D4AF37] transition-colors text-center tracking-wide"
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
        </motion.div>
      </div>

      <AmbientSound />
    </main>
  )
}
