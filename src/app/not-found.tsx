import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-[#FAF5EA] flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-lg">
        <div className="text-7xl sm:text-8xl mb-6 opacity-90">🐚</div>

        <p className="eyebrow mb-3">Erreur 404</p>
        <h1
          className="text-4xl sm:text-5xl text-[#0E4F5E] mb-4 leading-tight"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Cette page<br />
          <span className="italic text-[#D4AF37]">a été emportée par la marée</span>
        </h1>

        <p className="text-[#6B6B6B] leading-relaxed mb-10 max-w-md mx-auto">
          La page que vous cherchez n&apos;existe pas (ou plus). Mais ne vous en faites pas,
          il y a plein d&apos;autres jolis bijoux à découvrir sur le rivage.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">
            Retour à l&apos;accueil
          </Link>
          <Link href="/collections/all" className="btn-ghost">
            Découvrir les bijoux
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-[#E8E2D5] text-sm text-[#6B6B6B]">
          <p>Besoin d&apos;aide ?</p>
          <Link href="/pages/contact" className="text-[#D4AF37] hover:text-[#b8963e] font-medium">
            Contactez-nous →
          </Link>
        </div>
      </div>
    </div>
  )
}
