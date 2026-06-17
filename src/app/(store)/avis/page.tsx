import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { Star, MessageSquare, ArrowRight } from 'lucide-react'
import { db } from '@/lib/db'

/* Cache ISR (60 s). Invalidé depuis l'admin à l'approbation d'un avis. */
export const revalidate = 60

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://marineetladouceurdelete.com'

export const metadata: Metadata = {
  title:       'Avis clients',
  description: 'Découvrez ce que pensent les clientes de Marine et la douceur de l\'été. Avis vérifiés sur nos bijoux en acier inoxydable.',
  alternates:  { canonical: `${BASE}/avis` },
}

export default async function AvisPage() {
  const reviews = await db.review.findMany({
    where:    { approved: true },
    orderBy:  { createdAt: 'desc' },
    include:  { product: { select: { slug: true, name: true, images: true } } },
  })

  const count   = reviews.length
  const average = count > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0
  /* Nombre de produits distincts couverts par les avis */
  const productCount = new Set(reviews.map((r) => r.product?.slug).filter(Boolean)).size

  const fullStars = Math.floor(average)
  const hasHalf   = average - fullStars >= 0.5

  return (
    <main className="bg-[#FAF5EA]">
      {/* ═══ HÉRO ═══ */}
      <section className="container-x pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
        <p className="eyebrow mb-4">⭐ Avis clients</p>
        <h1
          className="text-4xl sm:text-5xl text-[#0E4F5E] mb-6 leading-tight"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Ce qu&apos;elles<br />
          <span className="italic text-[#D4AF37]">en pensent</span>
        </h1>
        <p className="text-[#6B6B6B] text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-8">
          Chaque avis est laissé par une vraie cliente et modéré avant publication.
          Merci à toutes celles qui prennent le temps de partager leur expérience 🐚
        </p>

        {/* Note globale */}
        {count > 0 ? (
          <div className="inline-flex flex-col items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i <= fullStars
                      ? 'fill-[#D4AF37] text-[#D4AF37]'
                      : (i === fullStars + 1 && hasHalf
                        ? 'fill-[#D4AF37] text-[#D4AF37] opacity-60'
                        : 'text-[#E8E2D5]')
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-[#6B6B6B]">
              <span className="text-lg font-medium text-[#0E4F5E]">{average.toFixed(1)}</span>
              <span className="mx-1">/</span>
              <span>5</span>
              <span className="mx-3">·</span>
              <span>{count} avis sur {productCount} bijou{productCount > 1 ? 'x' : ''}</span>
            </p>
          </div>
        ) : (
          <p className="text-sm text-[#6B6B6B] italic">
            Pas encore d&apos;avis publié. Soyez la première !
          </p>
        )}
      </section>

      {/* ═══ LISTE DES AVIS ═══ */}
      <section className="container-x pb-20">
        {count === 0 ? (
          <div className="bg-white p-12 text-center max-w-md mx-auto">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-[#E8E2D5]" strokeWidth={1.2} />
            <p className="text-sm text-[#6B6B6B] mb-6">
              Aucun avis publié pour le moment.<br />
              Soyez la première à partager votre expérience !
            </p>
            <Link
              href="/collections/all"
              className="inline-flex items-center gap-2 bg-[#0E4F5E] hover:bg-[#24BBD0] text-white px-5 py-2.5 text-xs tracking-[0.18em] uppercase font-medium transition-colors"
            >
              Découvrir les bijoux
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {reviews.map((r) => (
              <article
                key={r.id}
                className="bg-white p-6 border border-transparent hover:border-[#D4AF37]/40 transition-colors flex flex-col"
              >
                {/* Étoiles + date */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i <= r.rating ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-[#E8E2D5]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-[#6B6B6B]">
                    {new Date(r.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </span>
                </div>

                {/* Commentaire */}
                <p className="text-sm text-[#0E4F5E] italic leading-relaxed mb-4 flex-1">
                  &ldquo;{r.comment}&rdquo;
                </p>

                {/* Auteure */}
                <p className="text-xs font-medium text-[#0E4F5E] mb-4">— {r.name}</p>

                {/* Produit lié */}
                {r.product && (
                  <Link
                    href={`/products/${r.product.slug}#avis`}
                    className="flex items-center gap-3 pt-3 border-t border-[#E8E2D5] group"
                  >
                    {r.product.images[0] && (
                      <div className="relative w-12 h-12 bg-[#FAF5EA] flex-shrink-0 overflow-hidden">
                        <Image
                          src={r.product.images[0]}
                          alt={r.product.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-[#6B6B6B]">Bijou</p>
                      <p className="text-xs text-[#0E4F5E] group-hover:text-[#D4AF37] transition-colors truncate">
                        {r.product.name}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#6B6B6B] group-hover:text-[#D4AF37] transition-colors flex-shrink-0" />
                  </Link>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ═══ CTA "Laissez un avis" ═══ */}
      {count > 0 && (
        <section className="container-x pb-20">
          <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 text-center">
            <p className="eyebrow mb-3">Votre voix compte</p>
            <h2
              className="text-2xl sm:text-3xl text-[#0E4F5E] mb-4"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Vous voulez partager votre expérience ?
            </h2>
            <p className="text-sm text-[#6B6B6B] leading-relaxed mb-6">
              Laissez votre avis directement sur la fiche du bijou qui vous a plu.
              Il sera publié ici après une vérification rapide.
            </p>
            <Link
              href="/collections/all"
              className="inline-flex items-center gap-2 bg-[#0E4F5E] hover:bg-[#24BBD0] text-white px-6 py-3 text-xs tracking-[0.18em] uppercase font-medium transition-colors"
            >
              Voir les bijoux
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}
    </main>
  )
}
