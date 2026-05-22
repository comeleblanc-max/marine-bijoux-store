'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Lock, CheckCircle2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { motion, Reveal } from '@/components/ui/motion'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const cartTotal = total()
  const shipping = cartTotal >= 60 ? 0 : 4.9

  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [orderId, setOrderId] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1400))
    setOrderId('MDE-' + Math.floor(1000 + Math.random() * 9000))
    clearCart()
    setLoading(false)
    setDone(true)
  }

  /* ---------------- Confirmation ---------------- */
  if (done) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center px-4 py-16">
        <Reveal className="w-full max-w-md">
          <div className="bg-white rounded-3xl p-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 16 }}
              className="w-20 h-20 mx-auto mb-6 bg-[#4DB8D4]/15 rounded-full flex items-center justify-center"
            >
              <CheckCircle2 className="w-10 h-10 text-[#4DB8D4]" />
            </motion.div>
            <h1
              className="text-2xl text-[#1A3A52] font-light mb-2"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Merci pour votre commande ✨
            </h1>
            <p className="text-gray-500 text-sm mb-1">
              Votre commande <strong className="text-[#C9A84C]">{orderId}</strong> est confirmée.
            </p>
            <p className="text-gray-400 text-sm mb-8">
              Un email de confirmation vous a été envoyé. Vous recevrez le suivi
              dès l'expédition.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/account">
                <Button variant="primary" className="w-full rounded-xl">
                  Suivre ma commande
                </Button>
              </Link>
              <Link href="/collections/all">
                <Button variant="ghost" className="w-full">
                  Continuer mes achats
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    )
  }

  /* ---------------- Panier vide ---------------- */
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-3xl p-12 text-center max-w-md">
          <ShoppingBag className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 mb-6">
            Votre panier est vide — impossible de passer commande.
          </p>
          <Link href="/collections/all">
            <Button variant="primary">Découvrir nos bijoux</Button>
          </Link>
        </div>
      </div>
    )
  }

  /* ---------------- Formulaire de commande ---------------- */
  return (
    <div className="min-h-screen bg-[#F5F1ED] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-400 hover:text-[#1A3A52] transition-colors mb-6"
        >
          ← Retour
        </button>
        <h1
          className="text-3xl sm:text-4xl text-[#1A3A52] font-light mb-8"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Finaliser ma commande
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulaire */}
          <div className="lg:col-span-2 space-y-6">
            {/* Coordonnées */}
            <div className="bg-white rounded-2xl p-6">
              <h2
                className="font-medium text-[#1A3A52] mb-4"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Coordonnées
              </h2>
              <div className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="Adresse email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4DB8D4] text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Prénom"
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4DB8D4] text-sm"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Nom"
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4DB8D4] text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Livraison */}
            <div className="bg-white rounded-2xl p-6">
              <h2
                className="font-medium text-[#1A3A52] mb-4"
                style={{ fontFamily: 'var(--font-playfair)' }}
              >
                Adresse de livraison
              </h2>
              <div className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Adresse"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4DB8D4] text-sm"
                />
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Code postal"
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4DB8D4] text-sm"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Ville"
                    className="col-span-2 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4DB8D4] text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Paiement */}
            <div className="bg-white rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-4 h-4 text-[#4DB8D4]" />
                <h2
                  className="font-medium text-[#1A3A52]"
                  style={{ fontFamily: 'var(--font-playfair)' }}
                >
                  Paiement sécurisé
                </h2>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  placeholder="Numéro de carte"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4DB8D4] text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="MM / AA"
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4DB8D4] text-sm"
                  />
                  <input
                    type="text"
                    required
                    inputMode="numeric"
                    placeholder="CVC"
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4DB8D4] text-sm"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                🔒 Vos données de paiement sont chiffrées et sécurisées.
              </p>
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="bg-white rounded-2xl p-6 h-fit lg:sticky lg:top-24">
            <h2
              className="font-medium text-[#1A3A52] mb-4"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Ma commande
            </h2>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#F5F1ED] flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#1A3A52] truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400">Qté {item.quantity}</p>
                  </div>
                  <span className="text-xs font-semibold text-[#C9A84C]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Sous-total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Livraison</span>
                <span className={shipping === 0 ? 'text-[#4DB8D4] font-medium' : ''}>
                  {shipping === 0 ? 'Offerte' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-[#1A3A52] pt-2 border-t">
                <span>Total</span>
                <span className="text-lg">{formatPrice(cartTotal + shipping)}</span>
              </div>
            </div>
            <Button
              type="submit"
              size="lg"
              loading={loading}
              className="w-full rounded-xl mt-4"
            >
              Payer {formatPrice(cartTotal + shipping)}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
