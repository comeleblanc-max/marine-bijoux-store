import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notre histoire',
  description: 'Découvrez l\'histoire de Marine et la douceur de l\'été, une marque de bijoux née d\'une passion pour la mer.',
}

export default function AProposPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1F3A56] to-[#4DB8D4] py-24 px-4 text-center text-white">
        <p className="text-[#D4AF37] text-sm tracking-widest uppercase mb-4">Notre histoire</p>
        <h1 className="text-4xl sm:text-6xl font-light mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
          Née d'une passion
          <br />
          <span className="italic">pour la mer</span>
        </h1>
        <p className="text-white/70 max-w-xl mx-auto leading-relaxed">
          Une marque de bijoux artisanaux, inspirée par la lumière, la mer et la douceur de l'été.
        </p>
      </div>

      {/* Story */}
      <div className="max-w-3xl mx-auto px-4 py-20">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 leading-relaxed mb-6 text-lg">
            Marine et la douceur de l'été est née d'une envie simple : créer des bijoux qui racontent
            l'été. Ces moments suspendus au bord de l'eau, la chaleur du soleil sur la peau, le bruit
            doux des vagues...
          </p>
          <p className="text-gray-600 leading-relaxed mb-6">
            Chaque pièce de notre collection est pensée pour capturer cet esprit — léger, lumineux,
            libre. Des bijoux à porter tous les jours, même loin de la mer, pour retrouver cette
            sensation de douceur estivale.
          </p>
          <p className="text-gray-600 leading-relaxed mb-12">
            Notre première collection, "Lumière d'été", est une invitation à porter l'été toujours
            avec soi. Des pièces intemporelles, fabriquées avec soin, pour des femmes qui aiment
            la beauté des choses simples.
          </p>

          {/* Values */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 not-prose">
            {[
              { title: 'Inspiré par la nature', text: 'Chaque bijou puise son inspiration dans les merveilles de la mer et du soleil.' },
              { title: 'Qualité artisanale', text: 'Des matériaux choisis avec soin : acier inoxydable, argent 925, nacre naturelle.' },
              { title: 'Made with love', text: 'Chaque pièce est conçue avec passion pour sublimer votre beauté naturelle.' },
            ].map((v) => (
              <div key={v.title} className="text-center p-6 bg-[#F5E9D6] rounded-2xl">
                <h3 className="font-semibold text-[#1F3A56] mb-2" style={{ fontFamily: 'var(--font-playfair)' }}>
                  {v.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
