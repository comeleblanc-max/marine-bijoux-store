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
import { useCart } from '@/store/cart'
import { useWishlist } from '@/hooks/useWishlist'
import { cn } from '@/lib/utils'
import { AnimatePresence } from 'framer-motion'
import { motion } from '@/components/ui/motion'
import { SearchModal } from '@/features/search/SearchModal'

const EASE = [0.22, 1, 0.36, 1] as const

/* Catégories regroupées dans le menu "Bijoux" */
const CATEGORIES = [
  { label: 'Colliers', href: '/collections/colliers' },
  { label: 'Bracelets', href: '/collections/bracelets' },
  { label: "Boucles d'oreilles", href: '/collections/boucles-doreilles' },
  { label: 'Bagues', href: '/collections/bagues' },
  { label: 'Tous les bijoux', href: '/collections/all' },
]

/* Liens principaux affichés directement */
const MAIN_LINKS = [
  { label: 'Le Journal', href: '/blog' },
  { label: 'Notre histoire', href: '/pages/a-propos' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { openCart, itemCount } = useCart()
  const count = itemCount()
  const wishlistCount = useWishlist((s) => s.items.length)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Ferme le menu mobile à chaque navigation */
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className={cn(
          'sticky top-0 z-50 bg-white/95 backdrop-blur transition-shadow duration-300',
          scrolled && 'shadow-md'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
            {/* ───── Gauche : burger (mobile) + logo ───── */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden text-[#1F3A56] hover:text-[#D4AF37] transition-colors"
                aria-label="Menu"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <Link href="/" className="flex-shrink-0" aria-label="Accueil">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                >
                  <Image
                    src="/logo-marine.png"
                    alt="Marine et la douceur de l'été"
                    width={130}
                    height={65}
                    className="h-10 lg:h-12 w-auto object-contain"
                    priority
                  />
                </motion.div>
              </Link>
            </div>

            {/* ───── Centre : navigation desktop ───── */}
            <nav className="hidden lg:flex items-center gap-7">
              {/* Menu déroulant "Bijoux" */}
              <div
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button
                  className={cn(
                    'flex items-center gap-1 text-sm font-medium transition-colors py-2',
                    isActive('/collections')
                      ? 'text-[#D4AF37]'
                      : 'text-[#1F3A56] hover:text-[#D4AF37]'
                  )}
                >
                  Bijoux
                  <ChevronDown
                    className={cn(
                      'w-3.5 h-3.5 transition-transform duration-200',
                      dropdownOpen && 'rotate-180'
                    )}
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      className="absolute left-1/2 -translate-x-1/2 top-full pt-3"
                    >
                      <div className="w-56 bg-white rounded-2xl shadow-xl border border-gray-100 p-2">
                        {CATEGORIES.map((cat) => (
                          <Link
                            key={cat.href}
                            href={cat.href}
                            className={cn(
                              'block px-3 py-2 rounded-xl text-sm transition-colors',
                              isActive(cat.href)
                                ? 'bg-[#F5E9D6] text-[#D4AF37] font-medium'
                                : 'text-[#1F3A56] hover:bg-[#F5E9D6] hover:text-[#D4AF37]'
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

              {/* Collection mise en avant */}
              <Link
                href="/collections/lumiere-dete"
                className={cn(
                  'flex items-center gap-1.5 text-sm font-medium transition-colors',
                  isActive('/collections/lumiere-dete')
                    ? 'text-[#D4AF37]'
                    : 'text-[#1F3A56] hover:text-[#D4AF37]'
                )}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                Lumière d&apos;été
              </Link>

              {/* Liens principaux */}
              {MAIN_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative text-sm font-medium transition-colors after:absolute after:left-0 after:-bottom-1 after:h-px after:bg-[#D4AF37] after:transition-all',
                    isActive(link.href)
                      ? 'text-[#D4AF37] after:w-full'
                      : 'text-[#1F3A56] hover:text-[#D4AF37] after:w-0 hover:after:w-full'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* ───── Droite : icônes ───── */}
            <div className="flex items-center gap-3 lg:gap-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="text-[#1F3A56] hover:text-[#D4AF37] transition-colors"
                aria-label="Rechercher"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link
                href="/account"
                className="text-[#1F3A56] hover:text-[#D4AF37] transition-colors hidden sm:block"
                aria-label="Mon compte"
              >
                <User className="w-5 h-5" />
              </Link>
              <Link
                href="/wishlist"
                className="relative text-[#1F3A56] hover:text-[#D4AF37] transition-colors hidden sm:block"
                aria-label="Liste de souhaits"
              >
                <Heart className="w-5 h-5" />
                <AnimatePresence>
                  {wishlistCount > 0 && (
                    <motion.span
                      key={wishlistCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                      className="absolute -top-2 -right-2 w-4 h-4 bg-[#FF7A45] text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
              <motion.button
                onClick={openCart}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative text-[#1F3A56] hover:text-[#D4AF37] transition-colors"
                aria-label="Panier"
              >
                <ShoppingBag className="w-5 h-5" />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                      className="absolute -top-2 -right-2 w-4 h-4 bg-[#FF7A45] text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* ───── Menu mobile ───── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <nav className="flex flex-col px-4 py-4">
                {/* Collection mise en avant */}
                <Link
                  href="/collections/lumiere-dete"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-base font-medium text-[#D4AF37] py-2.5 border-b border-gray-50"
                >
                  <Sparkles className="w-4 h-4" />
                  Collection Lumière d&apos;été
                </Link>

                {/* Catégories */}
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mt-4 mb-1">
                  Bijoux
                </p>
                {CATEGORIES.map((cat, i) => (
                  <motion.div
                    key={cat.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                  >
                    <Link
                      href={cat.href}
                      onClick={() => setMenuOpen(false)}
                      className="block text-base text-[#1F3A56] hover:text-[#D4AF37] transition-colors py-2.5 border-b border-gray-50"
                    >
                      {cat.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Liens principaux */}
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mt-4 mb-1">
                  La maison
                </p>
                {MAIN_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (CATEGORIES.length + i) * 0.04, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block text-base text-[#1F3A56] hover:text-[#D4AF37] transition-colors py-2.5 border-b border-gray-50"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Accès rapides */}
                <div className="flex items-center gap-4 mt-4 pt-2">
                  <Link
                    href="/account"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 text-sm text-[#1F3A56] hover:text-[#D4AF37] transition-colors"
                  >
                    <User className="w-4 h-4" /> Mon compte
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 text-sm text-[#1F3A56] hover:text-[#D4AF37] transition-colors"
                  >
                    <Heart className="w-4 h-4" /> Favoris
                  </Link>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
