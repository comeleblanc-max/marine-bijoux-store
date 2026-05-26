import type { Metadata } from 'next'
import Link from 'next/link'
import { BLOG_POSTS } from '@/lib/blog'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/motion'

export const metadata: Metadata = {
  title: 'Le Journal',
  description:
    'Conseils, tendances et inspirations autour des bijoux et de l\'été par Marine et la douceur de l\'été.',
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* En-tête */}
      <div className="bg-gradient-to-br from-[#FAF5EA] to-[#ede6db] py-20 px-4 text-center">
        <Reveal>
          <p className="text-[#D4AF37] text-sm tracking-widest uppercase mb-4">
            Le Journal
          </p>
          <h1
            className="text-3xl sm:text-5xl text-[#1F3A56] font-light mb-3"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Conseils & inspirations
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">
            Nos articles pour prendre soin de vos bijoux et célébrer l'été toute l'année.
          </p>
        </Reveal>
      </div>

      {/* Articles */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_POSTS.map((post) => (
            <StaggerItem key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block h-full">
                <article className="h-full bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="aspect-[4/3] bg-gradient-to-br from-[#A7D5E6]/15 to-[#D4AF37]/15 flex items-center justify-center">
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      {post.emoji}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs mb-2">
                      <span className="text-[#D4AF37] font-semibold uppercase tracking-wide">
                        {post.category}
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="text-gray-400">{post.readingTime}</span>
                    </div>
                    <h2
                      className="text-lg text-[#1F3A56] font-medium mb-2 group-hover:text-[#D4AF37] transition-colors"
                      style={{ fontFamily: 'var(--font-playfair)' }}
                    >
                      {post.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                    <p className="text-gray-400 text-xs mt-4">{post.date}</p>
                  </div>
                </article>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  )
}
