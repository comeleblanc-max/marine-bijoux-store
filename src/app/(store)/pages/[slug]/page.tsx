import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { CONTENT_PAGES, getContentPage } from '@/lib/pages-content'
import { Reveal } from '@/components/ui/motion'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return CONTENT_PAGES.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = getContentPage(slug)
  if (!page) return {}
  return { title: page.title, description: page.intro }
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params
  const page = getContentPage(slug)
  if (!page) notFound()

  return (
    <div className="min-h-screen bg-white">
      {/* En-tête */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#A7D5E6] py-20 px-4 text-center text-white">
        <Reveal>
          <p className="text-[#C9A45F] text-sm tracking-widest uppercase mb-4">
            Informations
          </p>
          <h1
            className="text-3xl sm:text-5xl font-light mb-4"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {page.title}
          </h1>
          <p className="text-white/70 max-w-xl mx-auto leading-relaxed">{page.intro}</p>
        </Reveal>
      </div>

      {/* Contenu */}
      <article className="max-w-3xl mx-auto px-4 py-16">
        <p className="text-sm text-gray-400 mb-10">
          Dernière mise à jour : {page.updatedAt}
        </p>

        <div className="space-y-10">
          {page.sections.map((section, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <section>
                {section.heading && (
                  <h2
                    className="text-xl sm:text-2xl text-[#1A1A1A] font-medium mb-4"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {section.heading}
                  </h2>
                )}
                {section.body?.map((paragraph, j) => (
                  <p key={j} className="text-gray-600 leading-relaxed mb-3">
                    {paragraph}
                  </p>
                ))}
                {section.list && (
                  <ul className="space-y-2 mt-2">
                    {section.list.map((item, j) => (
                      <li key={j} className="flex gap-3 text-gray-600 leading-relaxed">
                        <span className="text-[#C9A45F] flex-shrink-0 mt-1">◆</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </Reveal>
          ))}
        </div>

        {/* Aide */}
        <Reveal delay={0.1}>
          <div className="mt-16 p-6 bg-[#FAF7F2] rounded-2xl text-center">
            <p className="text-[#1A1A1A] font-medium mb-1">Une question ?</p>
            <p className="text-gray-500 text-sm mb-4">
              Notre équipe vous répond avec plaisir sous 24 h.
            </p>
            <Link
              href="/pages/contact"
              className="inline-flex items-center gap-2 bg-[#C9A45F] hover:bg-[#b8963e] text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </Reveal>
      </article>
    </div>
  )
}
