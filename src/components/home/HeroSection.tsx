'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ChevronDown } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient (placeholder pour l'image) */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#1A3A52] via-[#2a5472] to-[#4DB8D4]"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 20% 50%, rgba(77,184,212,0.3) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.2) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 80%, rgba(240,128,128,0.15) 0%, transparent 40%)
          `,
        }}
      />

      {/* Decorative circles */}
      <div className="absolute top-10 right-10 w-64 h-64 rounded-full border border-white/10 animate-pulse" />
      <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full border border-white/10 animate-pulse delay-700" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full border border-white/5" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        {/* Eyebrow */}
        <p className="text-[#C9A84C] text-sm tracking-[0.3em] uppercase font-medium mb-6 animate-fade-in">
          ✨ Première Collection
        </p>

        {/* Title */}
        <h1
          className="text-4xl sm:text-5xl lg:text-7xl font-light leading-tight mb-6"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          La Lumière
          <br />
          <span className="text-[#C9A84C] italic">d'été</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-xl mx-auto leading-relaxed">
          Des bijoux artisanaux inspirés par la douceur de la mer.
          <br />
          Porter l'été toujours avec soi.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/collections/lumiere-dete">
            <Button size="lg" className="bg-[#C9A84C] hover:bg-[#b8963e] text-white px-10 rounded-full font-semibold tracking-wide shadow-lg shadow-[#C9A84C]/30">
              Découvrir la collection
            </Button>
          </Link>
          <Link href="/pages/a-propos">
            <Button variant="ghost" size="lg" className="text-white hover:text-[#C9A84C] border border-white/30 hover:border-[#C9A84C] rounded-full px-10">
              Notre histoire
            </Button>
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-12 text-white/60 text-xs">
          <span>🚚 Livraison gratuite dès 60€</span>
          <span>·</span>
          <span>🔒 Paiement sécurisé</span>
          <span>·</span>
          <span>↩️ Retours 14 jours</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce">
        <ChevronDown className="w-6 h-6" />
      </div>
    </section>
  )
}
