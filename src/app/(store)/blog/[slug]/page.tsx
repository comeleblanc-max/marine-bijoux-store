import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { BLOG_POSTS, getBlogPost } from '@/lib/blog'
import { Reveal } from '@/components/ui/motion'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}
  return { title: post.title, description: post.excerpt }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const others = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2)

  return (
    <div className="min-h-screen bg-white">
      {/* En-tête */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#A7D5E6] py-20 px-4 text-center text-white">
        <Reveal>
          <div className="text-6xl mb-6">{post.emoji}</div>
          <div className="flex items-center justify-center gap-2 text-xs mb-4">
            <span className="text-[#D4AF37] font-semibold uppercase tracking-widest">
              {post.category}
            </span>
            <span className="text-white/40">·</span>
            <span className="text-white/60">{post.readingTime} de lecture</span>
          </div>
          <h1
            className="text-3xl sm:text-5xl font-light max-w-3xl mx-auto leading-tight"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            {post.title}
          </h1>
          <p className="text-white/50 text-sm mt-6">{post.date}</p>
        </Reveal>
      </div>

      {/* Contenu */}
      <article className="max-w-2xl mx-auto px-4 py-16">
        <Reveal>
          <p className="text-lg text-[#1A1A1A] leading-relaxed mb-10 font-medium">
            {post.excerpt}
          </p>
        </Reveal>

        <div className="space-y-8">
          {post.content.map((block, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <section>
                {block.heading && (
                  <h2
                    className="text-xl sm:text-2xl text-[#1A1A1A] font-medium mb-3"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {block.heading}
                  </h2>
                )}
                {block.paragraphs.map((p, j) => (
                  <p key={j} className="text-gray-600 leading-relaxed mb-3">
                    {p}
                  </p>
                ))}
              </section>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#b8963e] font-medium mt-12 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au journal
          </Link>
        </Reveal>
      </article>

      {/* Autres articles */}
      {others.length > 0 && (
        <div className="bg-[#FAF5EA] py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-2xl text-[#1A1A1A] font-light mb-8 text-center"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              À lire aussi
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {others.map((other) => (
                <Link
                  key={other.slug}
                  href={`/blog/${other.slug}`}
                  className="group flex gap-4 bg-white rounded-2xl p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#A7D5E6]/15 to-[#D4AF37]/15 flex items-center justify-center flex-shrink-0 text-3xl">
                    {other.emoji}
                  </div>
                  <div>
                    <p className="text-[#D4AF37] text-xs font-semibold uppercase tracking-wide mb-1">
                      {other.category}
                    </p>
                    <h3 className="text-[#1A1A1A] font-medium group-hover:text-[#D4AF37] transition-colors leading-snug">
                      {other.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
