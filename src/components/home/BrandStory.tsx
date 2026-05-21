import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Waves, Sun, Shell } from 'lucide-react'

export function BrandStory() {
  return (
    <section className="py-20 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Visual */}
          <div className="relative">
            <div className="aspect-square max-w-lg mx-auto lg:mx-0 bg-gradient-to-br from-[#F5F1ED] to-[#e8e0d5] rounded-3xl flex items-center justify-center">
              <div className="text-center p-12">
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#4DB8D4] to-[#1A3A52] rounded-full flex items-center justify-center shadow-xl">
                  <span className="text-5xl">🌊</span>
                </div>
                <p
                  className="text-3xl text-[#1A3A52] font-light"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  Marine
                </p>
                <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mt-1">
                  et la douceur de l'été
                </p>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-[#C9A84C] text-white rounded-2xl px-4 py-2 text-sm font-semibold shadow-lg">
              ✨ Collection Lumière d'été
            </div>
            <div className="absolute -bottom-4 -left-4 bg-[#4DB8D4] text-white rounded-2xl px-4 py-2 text-sm font-semibold shadow-lg">
              🚢 Fabriqué en France
            </div>
          </div>

          {/* Text */}
          <div>
            <p className="text-[#C9A84C] text-sm tracking-[0.25em] uppercase font-medium mb-4">
              Notre histoire
            </p>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl text-[#1A3A52] font-light leading-tight mb-6"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Née d'une passion
              <br />
              <span className="text-[#4DB8D4] italic">pour la mer</span>
            </h2>
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

            {/* Values */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: Sun, label: 'Inspiré par l\'été', color: '#C9A84C' },
                { icon: Waves, label: 'Esprit marin', color: '#4DB8D4' },
                { icon: Shell, label: 'Fait avec soin', color: '#D4A574' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="text-center p-3 rounded-xl bg-[#F5F1ED]">
                  <Icon className="w-6 h-6 mx-auto mb-2" style={{ color }} />
                  <p className="text-xs text-gray-600 font-medium">{label}</p>
                </div>
              ))}
            </div>

            <Link href="/pages/a-propos">
              <Button variant="outline" size="md">
                Découvrir notre histoire →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
