'use client'

import { TESTIMONIALS } from '@/lib/data'
import { StarRating } from '@/components/ui/StarRating'
import { motion, Reveal } from '@/components/ui/motion'

const EASE = [0.22, 1, 0.36, 1] as const

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28 px-4 bg-[#1F3A56] relative overflow-hidden">
      {/* Halo décoratif */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 80% 10%, rgba(77,184,212,0.25), transparent 50%), radial-gradient(ellipse at 10% 90%, rgba(201,168,76,0.18), transparent 50%)',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <Reveal className="text-center mb-14">
          <p className="text-[#D4AF37] text-sm tracking-[0.25em] uppercase font-medium mb-3">
            Avis clients
          </p>
          <h2
            className="text-3xl sm:text-4xl text-white font-light"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Elles adorent Marine ✨
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
              whileHover={{ y: -6 }}
              className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors duration-300"
            >
              <StarRating rating={review.rating} size="md" className="mb-4" />
              <p className="text-white/80 text-sm leading-relaxed italic mb-4">
                "{review.comment}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium text-sm">{review.name}</p>
                  <p className="text-[#D4AF37] text-xs">{review.product}</p>
                </div>
                <p className="text-white/40 text-xs">{review.date}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-14 text-center">
          <motion.p
            initial={{ scale: 0.7, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
            className="text-5xl font-bold text-white"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            4.9<span className="text-2xl text-white/50">/5</span>
          </motion.p>
          <StarRating rating={5} count={87} size="md" className="justify-center mt-2" />
          <p className="text-white/50 text-sm mt-1">Basé sur 87 avis vérifiés</p>
        </Reveal>
      </div>
    </section>
  )
}
