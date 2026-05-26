'use client'

import { TESTIMONIALS } from '@/lib/data'
import { Star } from 'lucide-react'
import { Reveal } from '@/components/ui/motion'
import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="container-x">
        <Reveal className="text-center mb-12">
          <p className="eyebrow mb-3">⭐ Avis vérifiés 💎</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#1F3A56]">
            Elles parlent de nous
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
              ))}
            </div>
            <span className="text-sm text-[#6B6B6B]">4.9 / 5 — 124 avis</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              className="border border-[#E8E2D5] p-7 hover:border-[#D4AF37] transition-colors duration-300"
            >
              <div className="flex gap-0.5 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${s <= t.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-[#E8E2D5]'}`}
                  />
                ))}
              </div>
              <p className="text-[#1F3A56] leading-relaxed text-sm mb-6 italic">
                "{t.comment}"
              </p>
              <div className="border-t border-[#E8E2D5] pt-4">
                <p className="text-sm font-medium text-[#1F3A56]">{t.name}</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#6B6B6B] mt-1">
                  {t.product}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
