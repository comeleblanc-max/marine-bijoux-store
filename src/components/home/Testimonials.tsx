import { TESTIMONIALS } from '@/lib/data'
import { StarRating } from '@/components/ui/StarRating'

export function Testimonials() {
  return (
    <section className="py-20 px-4 bg-[#1A3A52]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-[#C9A84C] text-sm tracking-[0.25em] uppercase font-medium mb-3">
            Avis clients
          </p>
          <h2
            className="text-3xl sm:text-4xl text-white font-light"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Elles adorent Marine ✨
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((review) => (
            <div
              key={review.id}
              className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <StarRating rating={review.rating} size="md" className="mb-4" />
              <p className="text-white/80 text-sm leading-relaxed italic mb-4">
                "{review.comment}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium text-sm">{review.name}</p>
                  <p className="text-[#C9A84C] text-xs">{review.product}</p>
                </div>
                <p className="text-white/40 text-xs">{review.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Global rating */}
        <div className="mt-12 text-center">
          <p className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair)' }}>
            4.9/5
          </p>
          <StarRating rating={5} count={87} size="md" className="justify-center mt-2" />
          <p className="text-white/50 text-sm mt-1">Basé sur 87 avis vérifiés</p>
        </div>
      </div>
    </section>
  )
}
