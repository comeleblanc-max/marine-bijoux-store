'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Lock, ShoppingBag, AlertCircle } from 'lucide-react'
import { useCart } from '@/store/cart'
import { formatPrice } from '@/lib/utils'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total } = useCart()
  const cartTotal = total()

  /* Frais de port : seuil de gratuité fixé à 60€ (configurable côté admin) */
  const shipping = cartTotal >= 60 ? 0 : 4.9

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [hydrated, setHydrated] = useState(false)

  /* Évite le mismatch d'hydratation avec le panier persistant */
  useEffect(() => { setHydrated(true) }, [])

  const handleCheckout = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.url) {
        setError(data.error || 'Impossible de démarrer le paiement.')
        setLoading(false)
        return
      }
      /* Redirection vers Stripe Checkout (hébergé chez Stripe, sécurisé) */
      window.location.href = data.url
    } catch {
      setError('Erreur réseau. Veuillez réessayer.')
      setLoading(false)
    }
  }

  /* Panier vide */
  if (hydrated && items.length === 0) {
    return (
      <section className="min-h-[60vh] bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <ShoppingBag className="w-12 h-12 text-[#E8E2D5] mx-auto mb-6" strokeWidth={1} />
          <p className="text-[#6B6B6B] mb-6">
            Votre panier est vide — impossible de finaliser une commande.
          </p>
          <Link href="/collections/all" className="btn-primary">Découvrir les bijoux</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white py-10 sm:py-16">
      <div className="container-x max-w-2xl">
        <button
          onClick={() => router.back()}
          className="text-[10px] tracking-[0.2em] uppercase text-[#6B6B6B] hover:text-[#0E4F5E] transition-colors mb-6"
        >
          ← Retour
        </button>

        <div className="text-center mb-10">
          <p className="eyebrow mb-3">Finaliser</p>
          <h1 className="text-3xl sm:text-4xl text-[#0E4F5E]">Votre commande</h1>
          <p className="text-sm text-[#6B6B6B] mt-3">
            Tu seras redirigée vers une page de paiement <strong>sécurisée Stripe</strong> pour finaliser.
          </p>
        </div>

        {/* Récapitulatif */}
        <aside className="border border-[#E8E2D5] p-6 mb-6">
          <h2 className="text-[11px] tracking-[0.25em] uppercase font-medium text-[#0E4F5E] mb-5">
            Récapitulatif
          </h2>
          <div className="space-y-3 mb-5 max-h-96 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center">
                <div className="relative w-12 h-12 bg-[#FAF5EA] flex-shrink-0 overflow-hidden">
                  <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#0E4F5E] truncate">{item.name}</p>
                  <p className="text-[10px] text-[#6B6B6B]">Qté {item.quantity}</p>
                </div>
                <span className="text-xs text-[#0E4F5E] font-medium">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#E8E2D5] pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-[#6B6B6B]">
              <span>Sous-total</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-[#6B6B6B]">
              <span>Livraison</span>
              <span className={shipping === 0 ? 'text-[#D4AF37] font-medium' : ''}>
                {shipping === 0 ? 'Offerte' : formatPrice(shipping)}
              </span>
            </div>
            <div className="flex justify-between font-medium text-[#0E4F5E] pt-3 border-t border-[#E8E2D5]">
              <span className="text-[11px] tracking-[0.2em] uppercase">Total</span>
              <span className="text-lg">{formatPrice(cartTotal + shipping)}</span>
            </div>
          </div>
        </aside>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={loading || items.length === 0}
          className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading
            ? 'Redirection vers Stripe…'
            : <span className="flex items-center gap-2"><Lock className="w-4 h-4" strokeWidth={1.5} /> Payer {formatPrice(cartTotal + shipping)}</span>
          }
        </button>

        <p className="text-[10px] text-[#6B6B6B] text-center mt-4">
          🔒 Paiement 100% sécurisé via Stripe. Aucune donnée bancaire n&apos;est stockée sur le site.
        </p>
      </div>
    </section>
  )
}
