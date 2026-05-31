'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, signOut, useSession } from 'next-auth/react'
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  Mail,
  Lock,
  ChevronRight,
  AlertCircle,
} from 'lucide-react'
import { Reveal, motion } from '@/components/ui/motion'

type Tab = 'login' | 'register'

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF5EA]" />}>
      <AccountPageInner />
    </Suspense>
  )
}

function AccountPageInner() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const search = useSearchParams()

  const [tab, setTab]         = useState<Tab>('login')
  const [loading, setLoading] = useState(false)
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState<string>('')

  /* ============================================================
     SI CONNECTÉE → Tableau de bord
     ============================================================ */
  if (status === 'authenticated' && session?.user) {
    const firstName = session.user.name?.split(' ')[0] || 'vous'
    const isAdmin = (session.user as { role?: string }).role === 'ADMIN'
    return (
      <div className="min-h-screen bg-[#FAF5EA] py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
              <div>
                <h1
                  className="text-3xl sm:text-4xl text-[#24BBD0] font-light"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  Bonjour {firstName} 👋
                  {isAdmin && (
                    <span className="ml-3 align-middle text-[10px] uppercase tracking-[0.18em] font-medium bg-[#D4AF37] text-white px-2 py-0.5 rounded">
                      Admin
                    </span>
                  )}
                </h1>
                <p className="text-gray-500 mt-1">{session.user.email}</p>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 mt-3 text-sm bg-[#24BBD0] text-white hover:bg-[#D4AF37] px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    🛠️ Tableau de bord admin →
                  </Link>
                )}
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
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
              <Link href="/account/orders" className="block bg-white rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#D4AF37]" />
                    <h2
                      className="text-lg font-medium text-[#24BBD0]"
                      style={{ fontFamily: 'var(--font-playfair)' }}
                    >
                      Mes commandes
                    </h2>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">
                  Retrouvez votre historique, le détail de vos achats et le suivi de vos colis.
                </p>
              </Link>
            </Reveal>

            {/* Cartes latérales */}
            <Reveal delay={0.1} className="space-y-6">
              <Link href="/wishlist" className="block bg-white rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-[#E89B6F]" />
                  <h3 className="font-medium text-[#24BBD0]">Mes favoris</h3>
                </div>
                <p className="text-gray-400 text-sm">
                  Retrouvez ici les bijoux que vous avez aimés.
                </p>
                <span className="mt-3 text-sm text-[#D4AF37] hover:text-[#b8963e] font-medium inline-flex items-center gap-1">
                  Voir mes favoris <ChevronRight className="w-4 h-4" />
                </span>
              </Link>

              <div className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-[#A7D5E6]" />
                  <h3 className="font-medium text-[#24BBD0]">Mes adresses</h3>
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

  /* ============================================================
     SI NON CONNECTÉE → Connexion / Inscription
     ============================================================ */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (tab === 'register') {
        // Inscription
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError(data.error || 'Erreur lors de la création du compte.')
          setLoading(false)
          return
        }
      }

      // Connexion (juste après inscription, ou direct si login)
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email ou mot de passe incorrect.')
        setLoading(false)
        return
      }

      const callbackUrl = search.get('callbackUrl') || '/account'
      router.push(callbackUrl)
      router.refresh()
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF5EA] py-16 px-4 flex items-center justify-center">
      <Reveal className="w-full max-w-md">
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          {/* Icône */}
          <div className="w-14 h-14 mx-auto mb-6 bg-gradient-to-br from-[#A7D5E6] to-[#24BBD0] rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>

          {/* Onglets */}
          <div className="flex bg-[#FAF5EA] rounded-full p-1 mb-6">
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setTab(t); setError('') }}
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
                    tab === t ? 'text-[#24BBD0]' : 'text-gray-400'
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
                <label className="block text-sm font-medium text-[#24BBD0] mb-1.5">
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
              <label className="block text-sm font-medium text-[#24BBD0] mb-1.5">
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
              <label className="block text-sm font-medium text-[#24BBD0] mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#A7D5E6] text-sm"
                />
              </div>
              {tab === 'register' && (
                <p className="text-[11px] text-gray-400 mt-1.5">
                  Au moins 8 caractères.
                </p>
              )}
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#24BBD0] hover:bg-[#D4AF37] text-white py-3.5 rounded-xl text-sm font-medium uppercase tracking-wider transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? '...'
                : tab === 'login'
                  ? 'Se connecter'
                  : 'Créer mon compte'}
            </button>

            <p className="text-center text-xs text-gray-400 pt-2">
              {tab === 'login' ? (
                <>
                  Pas encore de compte ?{' '}
                  <button
                    type="button"
                    onClick={() => { setTab('register'); setError('') }}
                    className="text-[#D4AF37] hover:text-[#b8963e] font-medium"
                  >
                    Inscrivez-vous
                  </button>
                </>
              ) : (
                <>
                  Déjà un compte ?{' '}
                  <button
                    type="button"
                    onClick={() => { setTab('login'); setError('') }}
                    className="text-[#D4AF37] hover:text-[#b8963e] font-medium"
                  >
                    Connectez-vous
                  </button>
                </>
              )}
            </p>
          </form>
        </div>
      </Reveal>
    </div>
  )
}
