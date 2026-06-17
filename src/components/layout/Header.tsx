'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  Heart,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/hooks/useWishlist'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { SearchModal } from '@/features/search/SearchModal'

const EASE = [0.22, 1, 0.36, 1] as const

/* Catégories regroupées dans le menu "Bijoux" */
const CATEGORIES = [
  { label: 'Colliers',              href: '/collections/colliers' },
  { label: 'Bracelets',             href: '/collections/bracelets' },
  { label: 'Bracelets de cheville', href: '/collections/bracelets-cheville' },
  { label: "Boucles d'oreilles",    href: '/collections/boucles-doreilles' },
  { label: 'Bagues',                href: '/collections/bagues' },
  { label: 'Tous les bijoux',       href: '/collections/all' },
]

/* Liens principaux */
const MAIN_LINKS = [
  { label: 'Le Journal',    href: '/blog' },
  { label: 'Notre histoire', href: '/pages/a-propos' },
]

export function Header() {
  const [menuOpen, setMenuOpen]     = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { openCart, itemCount } = useCart()
  const count = itemCount()
  const wishlistCount = useWishlist((s) => s.items.length)
  const pathname = usePathname()
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user
  const firstName = session?.user?.name?.split(' ')[0] || session?.user?.email?.split('@')[0]
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'ADMIN'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 bg-white/95 backdrop-blur transition-all duration-300',
          scrolled ? 'border-b border-[#E8E2D5]' : 'border-b border-transparent'
        )}
      >
        <div className="container-x">
          {/* Ligne logo + icônes */}
          <div className="relative flex items-center justify-between h-24 lg:h-32">

            {/* Burger mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-[#0E4F5E] -ml-1 p-1"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo centré */}
            <Link
              href="/"
              aria-label="Marine — Accueil"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Image
                src="/logo-marine-transparent.png"
                alt="Marine et la douceur de l'été"
                width={927}
                height={955}
                priority
                className="h-14 lg:h-20 w-auto object-contain"
              />
            </Link>

            {/* Icônes droite */}
            <div className="flex items-center gap-4 lg:gap-5 ml-auto">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Rechercher"
                className="text-[#0E4F5E] hover:text-[#D4AF37] transition-colors"
              >
                <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </button>
              {isAdmin && (
                <Link
                  href="/admin"
                  aria-label="Administration"
                  className="hidden md:inline-flex items-center gap-1 text-[10px] tracking-[0.18em] uppercase font-medium bg-[#24BBD0] text-white hover:bg-[#D4AF37] px-2.5 py-1 rounded transition-colors"
                  title="Tableau de bord admin"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/account"
                aria-label={isLoggedIn ? `Mon compte (${firstName})` : 'Connexion'}
                className="text-[#0E4F5E] hover:text-[#D4AF37] transition-colors hidden sm:flex items-center gap-1.5"
              >
                <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
                {isLoggedIn && (
                  <span className="text-xs font-medium hidden md:inline">
                    {firstName}
                  </span>
                )}
              </Link>
              <Link
                href="/wishlist"
                aria-label="Favoris"
                className="relative text-[#0E4F5E] hover:text-[#D4AF37] transition-colors"
              >
                <Heart className="w-[18px] h-[18px]" strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 text-[9px] bg-[#D4AF37] text-white rounded-full min-w-[15px] h-[15px] flex items-center justify-center px-1 font-medium">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <button
                onClick={openCart}
                aria-label="Panier"
                className="relative text-[#0E4F5E] hover:text-[#D4AF37] transition-colors"
              >
                {/* L'icône panier "bounce" légèrement à chaque ajout */}
                <motion.span
                  key={`bag-${count}`}
                  animate={count > 0 ? { rotate: [0, -10, 8, -4, 0], scale: [1, 1.15, 1] } : {}}
                  transition={{ duration: 0.55, ease: 'easeOut' }}
                  className="inline-block"
                >
                  <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </motion.span>
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0, y: -4 }}
                      animate={{ scale: [0, 1.25, 1], y: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                      className="absolute -top-1.5 -right-2 text-[9px] bg-[#24BBD0] text-white rounded-full min-w-[15px] h-[15px] flex items-center justify-center px-1 font-medium"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Navigation desktop — sous le logo */}
          <nav className="hidden lg:flex items-center justify-center gap-9 pb-4 -mt-1">

            {/* Bijoux — menu déroulant */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                className={cn(
                  'flex items-center gap-1 text-[11px] tracking-[0.18em] uppercase font-medium transition-colors py-1',
                  isActive('/collections')
                    ? 'text-[#D4AF37]'
                    : 'text-[#0E4F5E] hover:text-[#D4AF37]'
                )}
              >
                Bijoux
                <ChevronDown
                  className={cn(
                    'w-3 h-3 transition-transform duration-200',
                    dropdownOpen && 'rotate-180'
                  )}
                  strokeWidth={1.5}
                />
              </button>

              {/* Indicateur actif */}
              {isActive('/collections') && (
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#D4AF37]" />
              )}

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18, ease: EASE }}
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-4"
                  >
                    <div className="w-52 bg-white border border-[#E8E2D5] shadow-lg py-2">
                      {CATEGORIES.map((cat) => (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          className={cn(
                            'block px-5 py-2.5 text-[11px] tracking-[0.12em] uppercase font-medium transition-colors',
                            isActive(cat.href)
                              ? 'text-[#D4AF37] bg-[#FAF5EA]'
                              : 'text-[#0E4F5E] hover:text-[#D4AF37] hover:bg-[#FAF5EA]'
                          )}
                        >
                          {cat.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Lumière d'été — lien accent */}
            <Link
              href="/collections/lumiere-dete"
              className={cn(
                'relative flex items-center gap-1.5 text-[11px] tracking-[0.18em] uppercase font-medium transition-colors',
                isActive('/collections/lumiere-dete')
                  ? 'text-[#D4AF37]'
                  : 'text-[#D4AF37] hover:text-[#B8923D]'
              )}
            >
              <Sparkles className="w-3 h-3" strokeWidth={1.5} />
              Lumière d&apos;été
              {isActive('/collections/lumiere-dete') && (
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#D4AF37]" />
              )}
            </Link>

            {/* Le Journal + Notre histoire */}
            {MAIN_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative text-[11px] tracking-[0.18em] uppercase font-medium transition-colors',
                  isActive(link.href)
                    ? 'text-[#D4AF37]'
                    : 'text-[#0E4F5E] hover:text-[#D4AF37]'
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#D4AF37]" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Menu mobile */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="lg:hidden bg-white border-t border-[#E8E2D5] overflow-hidden"
            >
              <nav className="container-x py-5 flex flex-col">

                {/* Lumière d'été en tête */}
                <Link
                  href="/collections/lumiere-dete"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-sm font-medium text-[#D4AF37] py-3 border-b border-[#F2E5CC]"
                >
                  <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Collection Lumière d&apos;été
                </Link>

                {/* Catégories Bijoux */}
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B6B6B] mt-4 mb-1">
                  Bijoux
                </p>
                {CATEGORIES.map((cat, i) => (
                  <motion.div
                    key={cat.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={cat.href}
                      onClick={() => setMenuOpen(false)}
                      className="block text-sm text-[#0E4F5E] hover:text-[#D4AF37] transition-colors py-3 border-b border-[#F2E5CC]"
                    >
                      {cat.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Liens principaux */}
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6B6B6B] mt-4 mb-1">
                  La maison
                </p>
                {MAIN_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (CATEGORIES.length + i) * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block text-sm text-[#0E4F5E] hover:text-[#D4AF37] transition-colors py-3 border-b border-[#F2E5CC]"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Accès rapides */}
                <div className="flex items-center gap-5 mt-4 pt-2">
                  <Link
                    href="/account"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#D4AF37] transition-colors"
                  >
                    <User className="w-4 h-4" strokeWidth={1.5} /> Mon compte
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-1.5 text-sm text-[#6B6B6B] hover:text-[#D4AF37] transition-colors"
                  >
                    <Heart className="w-4 h-4" strokeWidth={1.5} /> Favoris
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
