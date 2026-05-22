import Link from 'next/link'
import { Waves, Sun, Shell } from 'lucide-react'
import { Reveal, FloatingShape } from '@/components/ui/motion'

export function BrandStory() {
  return (
    <section className="py-20 sm:py-28 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visuel */}
          <Reveal className="relative" y={40} duration={0.9}>
            <div className="aspect-square max-w-lg mx-auto lg:mx-0 bg-gradient-to-br from-[#F5E9D6] to-[#EAD9BE] rounded-3xl flex items-center justify-center relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-50"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 70% 30%, rgba(77,184,212,0.2), transparent 50%)',
                }}
              />
              <div className="text-center p-12 relative z-10">
                <FloatingShape
                  className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#4DB8D4] to-[#1F3A56] rounded-full flex items-center justify-center shadow-xl"
                  duration={6}
                  distance={12}
                >
                  <span className="text-5xl">🌊</span>
                </FloatingShape>
                <p
                  className="text-3xl text-[#1F3A56] font-light"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  Marine
                </p>
                <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase mt-1">
                  et la douceur de l'été
                </p>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-[#D4AF37] text-white rounded-2xl px-4 py-2 text-sm font-semibold shadow-lg">
              ✨ Collection Lumière d'été
            </div>
            <div className="absolute -bottom-4 -left-4 bg-[#4DB8D4] text-white rounded-2xl px-4 py-2 text-sm font-semibold shadow-lg">
              🚢 Fabriqué en France
            </div>
          </Reveal>

          {/* Texte */}
          <div>
            <Reveal>
              <p className="text-[#D4AF37] text-sm tracking-[0.25em] uppercase font-medium mb-4">
                Notre histoire
              </p>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl text-[#1F3A56] font-light leading-tight mb-6"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Née d'une passion
                <br />
                <span className="text-[#4DB8D4] italic">pour la mer</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-gray-600 leading-relaxed mb-6">
                Marine et la douceur de l'été est née d'une passion simple : capturer dans chaque bijou
                la magie de ces journées au bord de l'eau, où le temps s'étire doucement et où tout semble
                possible.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Chaque pièce est conçue pour vous rappeler ce sentiment — la chaleur du soleil sur la peau,
                le bruit des vagues, la légèreté de l'été. Des bijoux à porter chaque jour, qui racontent
                votre histoire.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { icon: Sun, label: "Inspiré par l'été", color: '#D4AF37' },
                  { icon: Waves, label: 'Esprit marin', color: '#4DB8D4' },
                  { icon: Shell, label: 'Fait avec soin', color: '#D8B98C' },
                ].map(({ icon: Icon, label, color }) => (
                  <div
                    key={label}
                    className="text-center p-4 rounded-xl bg-[#F5E9D6] hover:bg-[#ede6db] transition-colors duration-300"
                  >
                    <Icon className="w-6 h-6 mx-auto mb-2" style={{ color }} />
                    <p className="text-xs text-gray-600 font-medium">{label}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/pages/a-propos"
                className="inline-flex items-center gap-2 border border-[#1F3A56] text-[#1F3A56] hover:bg-[#1F3A56] hover:text-white transition-colors duration-300 px-7 py-3 rounded-full font-medium group"
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
