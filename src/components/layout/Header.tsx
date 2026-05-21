'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '@/store/cart'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Collection Lumière d\'été', href: '/collections/lumiere-dete' },
  { label: 'Colliers', href: '/collections/colliers' },
  { label: 'Bracelets', href: '/collections/bracelets' },
  { label: 'Boucles d\'oreilles', href: '/collections/boucles-doreilles' },
  { label: 'Bagues', href: '/collections/bagues' },
  { label: 'Notre histoire', href: '/pages/a-propos' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { openCart, itemCount } = useCart()
  const count = itemCount()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-white transition-shadow duration-300',
        scrolled && 'shadow-md'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-[#1A3A52] hover:text-[#C9A84C] transition-colors"
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop nav — left */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.slice(0, 3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#1A3A52] hover:text-[#C9A84C] transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <div className="flex flex-col items-center">
              <span
                className="text-lg lg:text-xl font-bold text-[#1A3A52] leading-tight"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Marine
              </span>
              <span className="text-[10px] text-[#C9A84C] tracking-[0.2em] uppercase font-medium">
                et la douceur de l'été
              </span>
              <span className="text-[9px] text-[#D4A574] tracking-[0.3em] uppercase">
                Bijoux
              </span>
            </div>
          </Link>

          {/* Desktop nav — right */}
          <nav className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.slice(3).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#1A3A52] hover:text-[#C9A84C] transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-3 lg:gap-4">
            <button className="text-[#1A3A52] hover:text-[#C9A84C] transition-colors hidden sm:block" aria-label="Rechercher">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/account" className="text-[#1A3A52] hover:text-[#C9A84C] transition-colors" aria-label="Mon compte">
              <User className="w-5 h-5" />
            </Link>
            <button
              onClick={openCart}
              className="relative text-[#1A3A52] hover:text-[#C9A84C] transition-colors"
              aria-label="Panier"
            >
              <ShoppingBag className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#F08080] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 pb-6 pt-4">
          <nav className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-base text-[#1A3A52] hover:text-[#C9A84C] transition-colors font-medium py-1 border-b border-gray-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
