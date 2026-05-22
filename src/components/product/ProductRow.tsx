'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '@/types'
import { ProductCard } from '@/components/product/ProductCard'
import { motion } from 'framer-motion'

interface Props {
  eyebrow?: string
  title: string
  products: Product[]
  href?: string
  hrefLabel?: string
}

export function ProductRow({ eyebrow, title, products, href, hrefLabel = 'Voir tout' }: Props) {
  const scroller = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const updateButtons = () => {
    const el = scroller.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    updateButtons()
    const el = scroller.current
    if (!el) return
    el.addEventListener('scroll', updateButtons, { passive: true })
    window.addEventListener('resize', updateButtons)
    return () => {
      el.removeEventListener('scroll', updateButtons)
      window.removeEventListener('resize', updateButtons)
    }
  }, [])

  const scroll = (dir: -1 | 1) => {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' })
  }

  if (products.length === 0) return null

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="container-x">
        {/* En-tête */}
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl text-[#1A1A1A]">
              {title}
            </h2>
          </motion.div>

          <div className="flex items-center gap-4">
            {href && (
              <Link
                href={href}
                className="hidden sm:inline text-[11px] tracking-[0.2em] uppercase text-[#6B6B6B] hover:text-[#D4AF37] underline-offset-4 hover:underline transition-colors"
              >
                {hrefLabel}
              </Link>
            )}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll(-1)}
                disabled={!canPrev}
                aria-label="Précédent"
                className="w-9 h-9 border border-[#E8E2D5] flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#1A1A1A] disabled:hover:border-[#E8E2D5]"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll(1)}
                disabled={!canNext}
                aria-label="Suivant"
                className="w-9 h-9 border border-[#E8E2D5] flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white hover:border-[#1A1A1A] transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#1A1A1A] disabled:hover:border-[#E8E2D5]"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carrousel — scroll horizontal */}
        <div
          ref={scroller}
          className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10"
        >
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="snap-start flex-shrink-0 w-[44vw] sm:w-[32vw] md:w-[24vw] lg:w-[260px]"
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>

        {/* Lien voir tout — mobile */}
        {href && (
          <div className="mt-8 text-center sm:hidden">
            <Link
              href={href}
              className="text-[11px] tracking-[0.2em] uppercase text-[#6B6B6B] underline-offset-4 underline"
            >
              {hrefLabel} →
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
