import Link from 'next/link'
import { ExternalLink, Share2, Mail } from 'lucide-react'
import { PaymentBadges } from '@/components/ui/PaymentBadges'
import { CookiePreferencesButton } from '@/components/layout/CookiePreferencesButton'

const COL_BOUTIQUE = [
  { label: "Collection Lumière d'été", href: '/collections/lumiere-dete' },
  { label: 'Colliers', href: '/collections/colliers' },
  { label: 'Bracelets', href: '/collections/bracelets' },
  { label: "Boucles d'oreilles", href: '/collections/boucles-doreilles' },
  { label: 'Bagues', href: '/collections/bagues' },
  { label: 'Tous les bijoux', href: '/collections/all' },
]

const COL_INFOS = [
  { label: 'Notre histoire', href: '/pages/a-propos' },
  { label: 'Le Journal', href: '/blog' },
  { label: 'Entretien des bijoux', href: '/pages/entretien' },
  { label: 'Questions fréquentes', href: '/pages/faq' },
  { label: 'Mon compte', href: '/account' },
]

const COL_AIDE = [
  { label: 'Contact', href: '/pages/contact' },
  { label: 'Livraison & expédition', href: '/pages/livraison' },
  { label: 'Retours & remboursement', href: '/pages/remboursement' },
  { label: 'Conditions générales de vente', href: '/pages/cgv' },
]

const LEGAL = [
  { label: 'Politique de confidentialité', href: '/pages/confidentialite' },
  { label: 'Politique de remboursement', href: '/pages/remboursement' },
  { label: "Conditions d'utilisation", href: '/pages/conditions-utilisation' },
  { label: 'Coordonnées', href: '/pages/contact' },
  { label: "Politique d'expédition", href: '/pages/livraison' },
  { label: 'Mentions légales', href: '/pages/mentions-legales' },
  { label: 'Conditions générales de vente', href: '/pages/cgv' },
]

function LinkColumn({
  title,
  links,
}: {
  title: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold uppercase tracking-wider text-[#D8B98C] mb-4">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link
              href={link.href}
              className="text-gray-300 hover:text-white text-sm transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="bg-[#1F3A56] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Colonnes principales */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Marque */}
          <div className="col-span-2 lg:col-span-1">
            <h3
              className="text-xl font-bold mb-1"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Marine
            </h3>
            <p className="text-[#4DB8D4] text-xs tracking-widest uppercase mb-4">
              et la douceur de l'été
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Des bijoux artisanaux inspirés par la mer et la lumière de l'été.
              Portez l'été toujours avec vous.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D4AF37] transition-colors"
                aria-label="Instagram"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D4AF37] transition-colors"
                aria-label="TikTok"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@marineetladouceurdelete.com"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#D4AF37] transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <LinkColumn title="Boutique" links={COL_BOUTIQUE} />
          <LinkColumn title="Informations" links={COL_INFOS} />
          <LinkColumn title="Aide & contact" links={COL_AIDE} />
        </div>

        {/* Paiement & réassurance */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-gray-300 text-sm">
            <span>🔒 Paiement 100% sécurisé</span>
          </div>
          <PaymentBadges />
        </div>

        {/* Barre légale */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © {new Date().getFullYear()} Marine et la douceur de l'été. Tous droits
            réservés.
          </p>
          <nav className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2">
            {LEGAL.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-gray-400 hover:text-white text-xs transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <CookiePreferencesButton />
          </nav>
        </div>
      </div>
    </footer>
  )
}
