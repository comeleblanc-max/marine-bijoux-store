'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Grid3X3,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Tag,
} from 'lucide-react'
import { cn } from '@/utils/cn'

interface NavItem {
  label:       string
  href:        string
  icon:        typeof LayoutDashboard
  comingSoon?: boolean
}

const NAV: NavItem[] = [
  { label: 'Dashboard',   href: '/admin',             icon: LayoutDashboard },
  { label: 'Produits',    href: '/admin/products',    icon: Package },
  { label: 'Commandes',   href: '/admin/orders',      icon: ShoppingBag },
  { label: 'Clientes',    href: '/admin/customers',   icon: Users },
  { label: 'Paramètres',  href: '/admin/settings',    icon: Settings },
  { label: 'Collections', href: '/admin/collections', icon: Grid3X3, comingSoon: true },
  { label: 'Promotions',  href: '/admin/promos',      icon: Tag,     comingSoon: true },
]

export function AdminSidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-60 bg-[#24BBD0] text-white flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="font-bold text-lg" style={{ fontFamily: 'var(--font-playfair)' }}>
          Marine
        </h1>
        <p className="text-xs text-[#A7D5E6] mt-0.5">Administration</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ label, href, icon: Icon, comingSoon }) => {
          const active =
            pathname === href || (href !== '/admin' && pathname.startsWith(href))

          if (comingSoon) {
            return (
              <div
                key={href}
                className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm text-white/30 cursor-not-allowed"
                title="Bientôt disponible"
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  {label}
                </span>
                <span className="text-[9px] uppercase tracking-wider bg-white/10 px-1.5 py-0.5 rounded">
                  Bientôt
                </span>
              </div>
            )
          }

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
                active
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-white/60 hover:text-white hover:bg-white/10',
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Retour au site
        </Link>
      </div>
    </aside>
  )
}
