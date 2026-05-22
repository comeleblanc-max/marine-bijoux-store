'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Grid3X3, ShoppingBag, Users, Settings, LogOut, Tag } from 'lucide-react'
import { cn } from '@/utils/cn'

const NAV = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Produits', href: '/admin/products', icon: Package },
  { label: 'Collections', href: '/admin/collections', icon: Grid3X3 },
  { label: 'Commandes', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Clients', href: '/admin/customers', icon: Users },
  { label: 'Promotions', href: '/admin/promos', icon: Tag },
  { label: 'Paramètres', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-60 bg-[#1F3A56] text-white flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="font-bold text-lg" style={{ fontFamily: 'var(--font-playfair)' }}>Marine</h1>
        <p className="text-xs text-[#4DB8D4] mt-0.5">Administration</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
                active ? 'bg-white/15 text-white font-medium' : 'text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 text-sm transition-colors">
          <LogOut className="w-4 h-4" />
          Retour au site
        </Link>
      </div>
    </aside>
  )
}
