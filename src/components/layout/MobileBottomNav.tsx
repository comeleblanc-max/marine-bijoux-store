'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Home, ShoppingBag, Heart, User } from 'lucide-react'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/hooks/useWishlist'

interface Item { href: string; label: string; icon: typeof Home }

const NAV: Item[] = [
  { href: '/',                 label: 'Accueil',  icon: Home },
  { href: '/collections/all',  label: 'Boutique', icon: ShoppingBag },
  { href: '/wishlist', label: 'Favoris',  icon: Heart },
  { href: '/account',          label: 'Compte',   icon: User },
]

/**
 * Barre de navigation fixe en bas, visible uniquement sur mobile/tablette.
 * - Active si le pathname commence par href (sauf "/" qui est strict)
 * - Affiche les compteurs panier (sur Boutique) et favoris
 * - Respecte la safe-area iPhone (notch / barre home)
 * - Se masque automatiquement quand le panier (drawer) est ouvert
 */
export function MobileBottomNav() {
  const pathname = usePathname()
  const { itemCount, isOpen: cartOpen } = useCart()
  const wished = useWishlist((s) => s.items.length)
  const cartCount = itemCount()

  /* Évite le clignotement d'hydratation des compteurs (zustand persist) */
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  /* Masquage si admin, checkout, ou panneau panier ouvert */
  const hidden =
    cartOpen ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/checkout/success')

  if (hidden) return null

  return (
    <nav
      aria-label="Navigation principale"
      className="lg:hidden fixed inset-x-0 bottom-0 z-30 bg-white/95 backdrop-blur border-t border-[#E8E2D5]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid grid-cols-4 max-w-md mx-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          const badge =
            mounted && href === '/collections/all' && cartCount > 0 ? cartCount :
            mounted && href === '/wishlist' && wished > 0   ? wished    :
            null

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`relative flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] tracking-wider uppercase transition-colors ${
                  active ? 'text-[#0E4F5E]' : 'text-[#6B6B6B] hover:text-[#0E4F5E]'
                }`}
              >
                <span className="relative">
                  <Icon
                    className="w-5 h-5"
                    strokeWidth={active ? 2 : 1.5}
                    fill={active && href === '/wishlist' ? 'currentColor' : 'none'}
                  />
                  {badge !== null && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-[#D4AF37] text-white text-[9px] font-medium rounded-full flex items-center justify-center tabular-nums">
                      {badge > 99 ? '99+' : badge}
                    </span>
                  )}
                </span>
                <span>{label}</span>
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#D4AF37] rounded-b-full" />
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
