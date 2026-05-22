import Link from 'next/link'
import Image from 'next/image'
import { Reveal } from '@/components/ui/motion'

export function BrandStory() {
  return (
    <section className="py-14 sm:py-24 bg-[#FAF7F2]">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Image */}
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden bg-white">
              <Image
                src="/tatouage.png"
                alt="Le tatouage de Marine"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </Reveal>

          {/* Texte */}
          <div className="max-w-md">
            <Reveal>
              <p className="eyebrow mb-3">Notre histoire</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl text-[#1A1A1A] mb-6 leading-tight">
                Née d'une passion<br />
                <span className="italic text-[#C9A45F]">pour la mer</span>
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="text-[#6B6B6B] leading-relaxed mb-5">
                Marine, 21 ans. Une boutique née d'une évidence : la chaleur du soleil,
                les journées sur la plage, la beauté simple des coquillages.
              </p>
              <p className="text-[#6B6B6B] leading-relaxed mb-8">
                Le nom <em>« la douceur de l'été »</em> est gravé sur sa peau —
                un palmier, des oiseaux, un soleil. À travers ces bijoux en acier
                inoxydable, elle partage un peu de cette légèreté ensoleillée.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <Link href="/pages/a-propos" className="btn-ghost">
                Lire son histoire
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
