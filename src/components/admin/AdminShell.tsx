'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  Star,
  Mail,
  ExternalLink,
  LogOut,
  Menu,
  X,
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
  { label: 'Avis',        href: '/admin/reviews',     icon: Star },
  { label: 'Clientes',    href: '/admin/customers',   icon: Users },
  { label: 'Newsletter',  href: '/admin/newsletter',  icon: Mail },
  { label: 'Paramètres',  href: '/admin/settings',    icon: Settings },
]

const EASE = [0.22, 1, 0.36, 1] as const

interface Props {
  children:  React.ReactNode
  userName?: string | null
  userEmail?: string | null
  logout:    () => Promise<void>
}

export function AdminShell({ children, userName, userEmail, logout }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const current = NAV.find((n) =>
    n.href === pathname || (n.href !== '/admin' && pathname.startsWith(n.href)),
  )

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* ===== Sidebar desktop ===== */}
      <aside className="hidden lg:flex w-64 flex-col bg-gradient-to-b from-[#0E4F5E] to-[#0a3a45] text-white sticky top-0 h-screen">
        <SidebarContent
          pathname={pathname}
          userName={userName}
          userEmail={userEmail}
          logout={logout}
        />
      </aside>

      {/* ===== Colonne contenu ===== */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar mobile */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between gap-3 bg-white/90 backdrop-blur border-b border-gray-200 px-4 h-14">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
            className="p-2 -ml-2 rounded-lg text-[#0E4F5E] hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <p className="font-medium text-[#0E4F5E] text-sm truncate">
            {current?.label ?? 'Administration'}
          </p>
          <Link
            href="/"
            className="p-2 -mr-2 rounded-lg text-gray-400 hover:text-[#0E4F5E] hover:bg-gray-100 transition-colors"
            aria-label="Voir le site"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* ===== Drawer mobile ===== */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.35, ease: EASE }}
              className="fixed left-0 top-0 bottom-0 w-72 max-w-[80%] bg-gradient-to-b from-[#0E4F5E] to-[#0a3a45] text-white z-50 flex flex-col lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Fermer le menu"
                className="absolute top-4 right-4 p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent
                pathname={pathname}
                userName={userName}
                userEmail={userEmail}
                logout={logout}
                onNavigate={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ───────────────── Contenu partagé sidebar (desktop + drawer) ─────────────── */

function SidebarContent({
  pathname,
  userName,
  userEmail,
  logout,
  onNavigate,
}: {
  pathname:    string
  userName?:   string | null
  userEmail?:  string | null
  logout:      () => Promise<void>
  onNavigate?: () => void
}) {
  const initial = (userName || userEmail || 'M').trim().charAt(0).toUpperCase()

  return (
    <>
      {/* En-tête */}
      <div className="px-6 pt-6 pb-5 border-b border-white/10">
        <h1 className="font-bold text-lg leading-none" style={{ fontFamily: 'var(--font-playfair)' }}>
          Marine
        </h1>
        <p className="text-[11px] tracking-[0.18em] uppercase text-[#A7D5E6] mt-1.5">
          Administration
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 scrollbar-hide">
        {NAV.map(({ label, href, icon: Icon, comingSoon }) => {
          const active =
            href === pathname || (href !== '/admin' && pathname.startsWith(href))

          if (comingSoon) {
            return (
              <div
                key={href}
                className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm text-white/30 cursor-not-allowed"
                title="Bientôt disponible"
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
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
              onClick={onNavigate}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
                active
                  ? 'bg-white/15 text-white font-medium'
                  : 'text-white/55 hover:text-white hover:bg-white/10',
              )}
            >
              {active && (
                <motion.span
                  layoutId="admin-active-bar"
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-[#D4AF37]"
                />
              )}
              <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Pied — identité + actions */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#0E4F5E] flex items-center justify-center text-sm font-bold flex-shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{userName || 'Marine'}</p>
            <p className="text-[11px] text-white/45 truncate">{userEmail || 'Administratrice'}</p>
          </div>
        </div>

        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/55 hover:text-white hover:bg-white/10 text-sm transition-colors"
        >
          <ExternalLink className="w-[18px] h-[18px]" strokeWidth={1.8} />
          Voir le site
        </Link>

        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/55 hover:text-white hover:bg-white/10 text-sm transition-colors"
          >
            <LogOut className="w-[18px] h-[18px]" strokeWidth={1.8} />
            Se déconnecter
          </button>
        </form>
      </div>
    </>
  )
}
