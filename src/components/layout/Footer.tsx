import Link from 'next/link'
import { ExternalLink, Share2 } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-[#1A3A52] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>
              Marine
            </h3>
            <p className="text-[#4DB8D4] text-xs tracking-widest uppercase mb-4">
              et la douceur de l'été
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Des bijoux artisanaux inspirés par la mer et la lumière de l'été. Portez l'été toujours avec vous.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#C9A84C] transition-colors"
                aria-label="Instagram"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#C9A84C] transition-colors"
                aria-label="TikTok"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#D4A574] mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Lumière d'été", href: '/collections/lumiere-dete' },
                { label: 'Colliers', href: '/collections/colliers' },
                { label: 'Bracelets', href: '/collections/bracelets' },
                { label: "Boucles d'oreilles", href: '/collections/boucles-doreilles' },
                { label: 'Bagues', href: '/collections/bagues' },
                { label: 'Nouveautés', href: '/collections/all' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informations */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#D4A574] mb-4">
              Informations
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Notre histoire', href: '/pages/a-propos' },
                { label: 'Contact', href: '/pages/contact' },
                { label: 'FAQ', href: '/pages/faq' },
                { label: 'Blog', href: '/blog' },
                { label: 'Entretien des bijoux', href: '/pages/entretien' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal & livraison */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#D4A574] mb-4">
              Aide & Légal
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Livraison & retours', href: '/pages/livraison' },
                { label: 'Mentions légales', href: '/pages/mentions-legales' },
                { label: 'CGV', href: '/pages/cgv' },
                { label: 'Politique de confidentialité', href: '/pages/confidentialite' },
                { label: 'Mon compte', href: '/account' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Marine et la douceur de l'été. Tous droits réservés.
          </p>
          <div className="flex items-center gap-3 text-gray-400 text-sm">
            <span>🔒 Paiement sécurisé</span>
            <span>·</span>
            <span>🚚 Livraison offerte dès 60€</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
