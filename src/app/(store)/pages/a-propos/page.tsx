import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Reveal } from '@/components/ui/motion'

export const metadata: Metadata = {
  title: 'Notre histoire',
  description:
    "Marine, 21 ans, vous raconte l'histoire de sa boutique de bijoux en acier inoxydable inspirée par le soleil, la plage et la douceur de l'été.",
}

export default function AProposPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero coucher de soleil ── */}
      <div
        className="py-24 sm:py-32 px-4 text-center relative overflow-hidden"
        style={{
          background:
            'linear-gradient(180deg, #A7D5E6 0%, #C9DCDA 30%, #F0DCB8 60%, #F5E9D6 100%)',
        }}
      >
        <Reveal>
          <p className="text-[#1F3A56]/60 text-xs tracking-[0.35em] uppercase mb-5">
            Notre histoire
          </p>
          <h1
            className="text-4xl sm:text-6xl font-light mb-6 text-[#1F3A56]"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Bonjour et bienvenue
            <br />
            <span className="italic text-[#D4AF37]">dans mon univers</span>
          </h1>
          <p className="text-[#1F3A56]/70 max-w-xl mx-auto leading-relaxed italic">
            « Des bijoux qui sentent bon le soleil et la mer. »
          </p>
        </Reveal>
      </div>

      {/* ── Le récit ── */}
      <div className="max-w-2xl mx-auto px-4 py-20 sm:py-24">

        <Reveal>
          <p className="text-gray-700 leading-loose mb-6 text-lg">
            Je m'appelle <strong className="text-[#1F3A56]">Marine</strong>, j'ai 21 ans,
            et la création de cette boutique en ligne est pour moi la concrétisation
            d'une passion de toujours.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-gray-600 leading-loose mb-6">
            Depuis mon enfance, les bijoux font partie de mon quotidien : je ne conçois
            pas une journée sans porter mes bagues, mes colliers, mes bracelets ou mes
            boucles d'oreilles préférés.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="text-gray-600 leading-loose mb-12">
            Le thème de la boutique s'est imposé comme une évidence. Née en plein cœur
            de l'été, je suis inspirée par la chaleur du soleil, les journées sur la
            plage et la beauté simple des coquillages.
          </p>
        </Reveal>

        {/* Bloc citation — origine du nom */}
        <Reveal delay={0.1}>
          <div className="my-12 rounded-3xl bg-gradient-to-br from-[#F5E9D6] to-[#EAD9BE] overflow-hidden">
            {/* Image tatouage */}
            <div className="relative w-full aspect-square sm:aspect-[16/9]">
              <Image
                src="/KMW7J.jpg"
                alt="Le tatouage de Marine — palmier, oiseaux et soleil avec la douceur de l'été"
                fill
                className="object-cover object-center"
                sizes="(max-width: 640px) 100vw, 672px"
              />
            </div>
            {/* Légende */}
            <div className="p-8 sm:p-10 text-center">
              <p className="text-3xl mb-4">𓆉 𓇼</p>
              <p
                className="text-2xl sm:text-3xl text-[#1F3A56] font-light italic leading-snug mb-4"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                « la douceur de l'été »
              </p>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Ce nom a une histoire très personnelle. Il est inspiré de l'un de mes
                tatouages — un palmier, des oiseaux et un soleil — accompagné de cette
                phrase gravée sur ma peau.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-gray-600 leading-loose mb-6">
            À travers ma sélection de bijoux en <strong className="text-[#1F3A56]">acier
            inoxydable</strong>, mon objectif est de vous partager un peu de cette
            légèreté et de cette douceur ensoleillée, tout au long de l'été.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="text-gray-700 leading-loose mb-10 text-lg">
            Merci de faire partie de cette aventure !
          </p>
        </Reveal>

        {/* Signature */}
        <Reveal delay={0.1}>
          <div className="border-t border-gray-100 pt-8 text-center">
            <p
              className="text-2xl text-[#D4AF37] italic mb-1"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Marine et la douceur de l'été
            </p>
            <p className="text-2xl">𓆉 𓇼</p>
          </div>
        </Reveal>
      </div>

      {/* ── Valeurs ── */}
      <div className="bg-[#F5E9D6]/50 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-12">
            <p className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase font-medium mb-3">
              Mes engagements
            </p>
            <h2
              className="text-2xl sm:text-3xl text-[#1F3A56] font-light"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Ce qui me tient à cœur
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                emoji: '☀️',
                title: 'Inspiré par l\'été',
                text: 'Chaque bijou puise son inspiration dans le soleil, la plage et la beauté des coquillages.',
              },
              {
                emoji: '✨',
                title: 'Acier inoxydable',
                text: 'Des bijoux résistants, qui ne noircissent pas et se portent au quotidien, même près de l\'eau.',
              },
              {
                emoji: '🐚',
                title: 'Une sélection personnelle',
                text: 'Je choisis chaque pièce comme si elle était pour moi — légère, douce et ensoleillée.',
              },
            ].map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1}>
                <div className="text-center p-8 bg-white rounded-2xl h-full">
                  <p className="text-4xl mb-4">{v.emoji}</p>
                  <h3
                    className="font-semibold text-[#1F3A56] mb-2"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    {v.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="text-center mt-12">
            <Link
              href="/collections/all"
              className="inline-flex items-center gap-2 bg-[#1F3A56] hover:bg-[#D4AF37] text-white transition-colors duration-300 px-8 py-3.5 rounded-full font-medium group"
            >
              Découvrir mes bijoux
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
