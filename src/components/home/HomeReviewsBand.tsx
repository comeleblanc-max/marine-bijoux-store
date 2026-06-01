import Link from 'next/link'
import { Star, ArrowRight } from 'lucide-react'

/**
 * Bandeau discret sur la page d'accueil — preuve sociale réelle qui pointe
 * vers la page /avis. Ne s'affiche que s'il y a au moins un avis approuvé.
 */
export function HomeReviewsBand({
  average,
  count,
}: {
  average: number
  count:   number
}) {
  if (count === 0) return null

  const fullStars = Math.floor(average)
  const hasHalf   = average - fullStars >= 0.5

  return (
    <section className="bg-white py-10 sm:py-12 border-y border-[#E8E2D5]">
      <Link
        href="/avis"
        aria-label={`Lire les ${count} avis clients (moyenne ${average.toFixed(1)} sur 5)`}
        className="container-x flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 group"
      >
        {/* Étoiles */}
        <div className="flex items-center gap-1" aria-hidden="true">
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

        {/* Note + nombre */}
        <p className="text-sm text-[#0E4F5E]">
          <span className="font-medium">{average.toFixed(1)}/5</span>
          <span className="text-[#6B6B6B] mx-2">·</span>
          <span className="text-[#6B6B6B]">
            {count} avis client{count > 1 ? 's' : ''}
          </span>
        </p>

        {/* CTA */}
        <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase text-[#0E4F5E] group-hover:text-[#D4AF37] transition-colors">
          Lire les avis
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </section>
  )
}
