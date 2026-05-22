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
} from 'lucide-react'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/hooks/useWishlist'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { SearchModal } from '@/features/search/SearchModal'

const EASE = [0.22, 1, 0.36, 1] as const

const NAV = [
  { label: 'Nouveautés',  href: '/collections/all?filter=new' },
  { label: 'Lumière d\'été', href: '/collections/lumiere-dete', accent: true },
  { label: 'Colliers',    href: '/collections/colliers' },
  { label: 'Bracelets',   href: '/collections/bracelets' },
  { label: 'Bagues',      href: '/collections/bagues' },
  { label: 'Boucles',     href: '/collections/boucles-doreilles' },
  { label: 'Le Journal',  href: '/blog' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { openCart, itemCount } = useCart()
  const count = itemCount()
  const wishlistCount = useWishlist((s) => s.items.length)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [pathname])

  const isActive = (href: string) =>
    pathname === href.split('?')[0] || pathname.startsWith(href.split('?')[0] + '/')

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 bg-white/95 backdrop-blur transition-all duration-300',
          scrolled ? 'border-b border-[#E8E2D5]' : 'border-b border-transparent'
        )}
      >
        {/* Ligne logo + icônes */}
        <div className="container-x">
          <div className="relative flex items-center justify-between h-20 lg:h-24">
            {/* Gauche : burger mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-[#1A1A1A] -ml-1 p-1"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo au centre */}
            <Link
              href="/"
              aria-label="Marine — Accueil"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Image
                src="/logo-marine.png"
                alt="Marine et la douceur de l'été"
                width={220}
                height={110}
                priority
                className="h-12 lg:h-16 w-auto object-contain"
              />
            </Link>

            {/* Droite : icônes */}
            <div className="flex items-center gap-4 lg:gap-5 ml-auto">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Rechercher"
                className="text-[#1A1A1A] hover:text-[#C9A45F] transition-colors"
              >
                <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </button>
              <Link
                href="/account"
                aria-label="Compte"
                className="text-[#1A1A1A] hover:text-[#C9A45F] transition-colors hidden sm:block"
              >
                <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </Link>
              <Link
                href="/wishlist"
                aria-label="Favoris"
                className="relative text-[#1A1A1A] hover:text-[#C9A45F] transition-colors"
              >
                <Heart className="w-[18px] h-[18px]" strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 text-[9px] bg-[#C9A45F] text-white rounded-full min-w-[15px] h-[15px] flex items-center justify-center px-1 font-medium">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <button
                onClick={openCart}
                aria-label="Panier"
                className="relative text-[#1A1A1A] hover:text-[#C9A45F] transition-colors"
              >
                <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.5} />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      className="absolute -top-1.5 -right-2 text-[9px] bg-[#1A1A1A] text-white rounded-full min-w-[15px] h-[15px] flex items-center justify-center px-1 font-medium"
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
            {NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative text-[11px] tracking-[0.18em] uppercase font-medium transition-colors',
                  isActive(link.href)
                    ? 'text-[#C9A45F]'
                    : link.accent
                    ? 'text-[#C9A45F] hover:text-[#A78340]'
                    : 'text-[#1A1A1A] hover:text-[#C9A45F]'
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-[#C9A45F]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
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
                {NAV.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        'block text-sm tracking-wide py-3 border-b border-[#F0E6D8]',
                        link.accent ? 'text-[#C9A45F] font-medium' : 'text-[#1A1A1A]'
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <Link
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm py-3 mt-2 text-[#6B6B6B]"
                >
                  Mon compte
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
