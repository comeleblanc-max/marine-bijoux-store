import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, Share2, Mail } from 'lucide-react'
import { PaymentBadges } from '@/components/ui/PaymentBadges'
import { CookiePreferencesButton } from '@/components/layout/CookiePreferencesButton'

const COL_SHOP = [
  { label: 'Nouveautés',  href: '/collections/all' },
  { label: 'Lumière d\'été', href: '/collections/lumiere-dete' },
  { label: 'Colliers',    href: '/collections/colliers' },
  { label: 'Bracelets',   href: '/collections/bracelets' },
  { label: 'Bagues',      href: '/collections/bagues' },
  { label: 'Boucles',     href: '/collections/boucles-doreilles' },
]

const COL_INFO = [
  { label: 'Notre histoire', href: '/pages/a-propos' },
  { label: 'Le Journal',     href: '/blog' },
  { label: 'Entretien',      href: '/pages/entretien' },
  { label: 'FAQ',            href: '/pages/faq' },
  { label: 'Mon compte',     href: '/account' },
]

const COL_HELP = [
  { label: 'Contact',     href: '/pages/contact' },
  { label: 'Livraison',   href: '/pages/livraison' },
  { label: 'Retours',     href: '/pages/remboursement' },
  { label: 'CGV',         href: '/pages/cgv' },
]

const LEGAL = [
  { label: 'Confidentialité', href: '/pages/confidentialite' },
  { label: 'Mentions légales', href: '/pages/mentions-legales' },
  { label: 'CGV', href: '/pages/cgv' },
  { label: 'Conditions d\'utilisation', href: '/pages/conditions-utilisation' },
]

export function Footer() {
  return (
    <footer className="bg-[#0E4F5E] text-white">
      <div className="container-x py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Marque + social */}
          <div className="col-span-2">
            <Image
              src="/logo-marine-white.png"
              alt="Marine"
              width={180}
              height={90}
              className="h-12 w-auto object-contain mb-5"
            />
            <p className="text-[#A8A8A8] text-sm leading-relaxed max-w-xs mb-6">
              Des bijoux en acier inoxydable inspirés par le soleil, la mer
              et la douceur de l'été.
            </p>
            <div className="flex gap-3">
              {[
                { icon: ExternalLink, href: 'https://instagram.com', label: 'Instagram' },
                { icon: Share2, href: 'https://tiktok.com', label: 'TikTok' },
                { icon: Mail, href: 'mailto:contact@marineetladouceurdelete.com', label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 border border-white/20 flex items-center justify-center hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
                >
                  <Icon className="w-4 h-4" strokeWidth={1.3} />
                </a>
              ))}
            </div>
          </div>

          {/* Boutique */}
          <FooterColumn title="Boutique" links={COL_SHOP} />
          {/* Infos */}
          <FooterColumn title="La maison" links={COL_INFO} />
          {/* Aide */}
          <FooterColumn title="Aide" links={COL_HELP} />
        </div>

        {/* Paiements */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#6B6B6B]">
            Paiement 100% sécurisé
          </p>
          <PaymentBadges />
        </div>

        {/* Mentions */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[#6B6B6B]">
            © {new Date().getFullYear()} Marine et la douceur de l'été. Tous droits réservés.
          </p>
          <nav className="flex flex-wrap justify-center md:justify-end gap-x-5 gap-y-2">
            {LEGAL.map((l) => (
              <Link key={l.label} href={l.href} className="text-[10px] tracking-[0.15em] uppercase text-[#6B6B6B] hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
            <CookiePreferencesButton />
          </nav>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-[10px] tracking-[0.25em] uppercase font-medium text-[#D4AF37] mb-4">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link
              href={l.href}
              className="text-sm text-[#A8A8A8] hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
