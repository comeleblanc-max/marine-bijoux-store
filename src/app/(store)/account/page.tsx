'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  Mail,
  Lock,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { motion, Reveal } from '@/components/ui/motion'

type Tab = 'login' | 'register'

const DEMO_ORDERS = [
  { id: 'MDE-1042', date: '12 mai 2026', status: 'Livrée', total: '83,00 €', items: 2 },
  { id: 'MDE-1031', date: '28 avril 2026', status: 'Livrée', total: '45,00 €', items: 1 },
]

export default function AccountPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [tab, setTab] = useState<Tab>('login')
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    setLoggedIn(true)
  }

  /* ---------------- Tableau de bord ---------------- */
  if (loggedIn) {
    return (
      <div className="min-h-screen bg-[#FAF5EA] py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1
                  className="text-3xl sm:text-4xl text-[#1A1A1A] font-light"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  Bonjour {name || 'Marine'} 👋
                </h1>
                <p className="text-gray-500 mt-1">Bienvenue dans votre espace personnel.</p>
              </div>
              <button
                onClick={() => setLoggedIn(false)}
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#E89B6F] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Commandes */}
            <Reveal className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Package className="w-5 h-5 text-[#D4AF37]" />
                  <h2
                    className="text-lg font-medium text-[#1A1A1A]"
                    style={{ fontFamily: 'var(--font-playfair)' }}
                  >
                    Mes commandes
                  </h2>
                </div>
                <div className="space-y-3">
                  {DEMO_ORDERS.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-[#FAF5EA] rounded-xl"
                    >
                      <div>
                        <p className="font-medium text-[#1A1A1A] text-sm">{order.id}</p>
                        <p className="text-gray-400 text-xs">
                          {order.date} · {order.items} article{order.items > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block text-xs px-2.5 py-0.5 rounded-full bg-[#A7D5E6]/15 text-[#2a8fa8] font-medium">
                          {order.status}
                        </span>
                        <p className="text-[#D4AF37] font-semibold text-sm mt-1">
                          {order.total}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Cartes latérales */}
            <Reveal delay={0.1} className="space-y-6">
              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-[#E89B6F]" />
                  <h3 className="font-medium text-[#1A1A1A]">Mes favoris</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Retrouvez ici les bijoux que vous avez aimés.
                </p>
                <Link
                  href="/collections/all"
                  className="text-sm text-[#D4AF37] hover:text-[#b8963e] font-medium inline-flex items-center gap-1"
                >
                  Explorer la boutique <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-[#A7D5E6]" />
                  <h3 className="font-medium text-[#1A1A1A]">Mes adresses</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Aucune adresse enregistrée pour le moment.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    )
  }

  /* ---------------- Connexion / Inscription ---------------- */
  return (
    <div className="min-h-screen bg-[#FAF5EA] py-16 px-4 flex items-center justify-center">
      <Reveal className="w-full max-w-md">
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          {/* Icône */}
          <div className="w-14 h-14 mx-auto mb-6 bg-gradient-to-br from-[#A7D5E6] to-[#1A1A1A] rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>

          {/* Onglets */}
          <div className="flex bg-[#FAF5EA] rounded-full p-1 mb-6">
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="relative flex-1 py-2.5 text-sm font-medium rounded-full transition-colors"
              >
                {tab === t && (
                  <motion.span
                    layoutId="account-tab"
                    className="absolute inset-0 bg-white rounded-full shadow-sm"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    tab === t ? 'text-[#1A1A1A]' : 'text-gray-400'
                  }`}
                >
                  {t === 'login' ? 'Connexion' : 'Inscription'}
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                  Prénom
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Marie"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#A7D5E6] text-sm"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marie@email.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#A7D5E6] text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#A7D5E6] text-sm"
                />
              </div>
            </div>

            {tab === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-xs text-gray-400 hover:text-[#D4AF37] transition-colors"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            <Button type="submit" size="lg" loading={loading} className="w-full rounded-xl">
              {tab === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            En continuant, vous acceptez nos{' '}
            <Link href="/pages/cgv" className="text-[#D4AF37] hover:underline">
              conditions générales de vente
            </Link>
            .
          </p>
        </div>
      </Reveal>
    </div>
  )
}
