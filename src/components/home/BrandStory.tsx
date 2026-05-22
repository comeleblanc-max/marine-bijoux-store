import Link from 'next/link'
import { Reveal } from '@/components/ui/motion'

export function BrandStory() {
  return (
    <section className="py-16 sm:py-24 px-4 bg-[#1F3A56] text-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Bloc citation / visuels */}
          <Reveal y={40} duration={0.9}>
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-[#2C5270] to-[#1a2f45] flex items-center justify-center p-12 border border-white/10">
                {/* Logo badge style moodboard */}
                <div className="text-center">
                  <div className="w-28 h-28 mx-auto mb-6 rounded-full border-2 border-[#D4AF37]/60 flex items-center justify-center bg-[#D4AF37]/10">
                    <span className="text-5xl">🐚</span>
                  </div>
                  <p
                    className="text-3xl font-light text-white leading-tight"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    Marine
                  </p>
                  <p className="text-[#D4AF37] text-[10px] tracking-[0.35em] uppercase mt-1.5">
                    et la douceur de l'été
                  </p>
                  <p className="text-white/40 text-[9px] tracking-[0.4em] uppercase mt-0.5">
                    Bijoux
                  </p>
                </div>
              </div>

              {/* Stats flottantes */}
              <div className="absolute -bottom-4 -right-4 bg-[#D4AF37] text-white rounded-2xl px-5 py-3 shadow-xl">
                <p className="text-2xl font-bold">100%</p>
                <p className="text-xs opacity-90">artisanal</p>
              </div>
              <div className="absolute -top-4 -left-4 bg-[#FF7A45] text-white rounded-2xl px-5 py-3 shadow-xl">
                <p className="text-2xl font-bold">✨ New</p>
                <p className="text-xs opacity-90">Collection été</p>
              </div>
            </div>
          </Reveal>

          {/* Texte */}
          <div>
            <Reveal>
              <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase font-medium mb-5">
                Notre histoire
              </p>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-light leading-tight mb-7"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Née d'une passion
                <br />
                <span className="italic text-[#D4AF37]">pour la mer</span>
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="text-white/70 leading-relaxed mb-5 text-base">
                Chaque bijou raconte une histoire — celle d'une journée au bord de l'eau,
                où le temps s'étire, où le soleil réchauffe la peau et où tout semble léger.
              </p>
              <p className="text-white/70 leading-relaxed mb-10 text-base">
                Des pièces conçues pour vous accompagner chaque jour et vous rappeler
                la douceur de l'été, quelle que soit la saison.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="flex gap-10 mb-10">
                {[
                  { value: '6', label: 'Nouvelles pièces' },
                  { value: '5', label: 'Collections' },
                  { value: '4.9', label: 'Note client' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <p
                      className="text-3xl font-light text-[#D4AF37]"
                      style={{ fontFamily: 'var(--font-playfair)' }}
                    >
                      {value}
                    </p>
                    <p className="text-white/50 text-xs mt-1">{label}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/pages/a-propos"
                className="inline-flex items-center gap-2 border border-white/30 hover:border-[#D4AF37] text-white hover:text-[#D4AF37] transition-colors duration-300 px-7 py-3.5 rounded-full font-medium group text-sm"
              >
                Découvrir notre histoire
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
