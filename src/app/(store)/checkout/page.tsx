'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Lock, CheckCircle2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { motion } from 'framer-motion'

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

  /* Confirmation */
  if (done) {
    return (
      <section className="min-h-[60vh] bg-white flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 16 }}
            className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#C9A45F]/10 flex items-center justify-center"
          >
            <CheckCircle2 className="w-8 h-8 text-[#C9A45F]" strokeWidth={1.5} />
          </motion.div>
          <p className="eyebrow mb-3">Confirmation</p>
          <h1 className="text-3xl sm:text-4xl text-[#1A1A1A] mb-4">Merci pour votre commande</h1>
          <p className="text-sm text-[#6B6B6B] mb-2">
            Numéro <strong className="text-[#C9A45F]">{orderId}</strong>
          </p>
          <p className="text-sm text-[#6B6B6B] mb-10">
            Un email de confirmation vous a été envoyé. Vous recevrez le suivi dès l'expédition.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/account" className="btn-primary">
              Suivre ma commande
            </Link>
            <Link href="/collections/all" className="btn-ghost">
              Continuer mes achats
            </Link>
          </div>
        </motion.div>
      </section>
    )
  }

  /* Panier vide */
  if (items.length === 0) {
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

  /* Formulaire */
  return (
    <section className="bg-white py-10 sm:py-16">
      <div className="container-x">
        <button
          onClick={() => router.back()}
          className="text-[10px] tracking-[0.2em] uppercase text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors mb-6"
        >
          ← Retour
        </button>

        <div className="text-center mb-10">
          <p className="eyebrow mb-3">Finaliser</p>
          <h1 className="text-3xl sm:text-4xl text-[#1A1A1A]">Votre commande</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Formulaire */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-[11px] tracking-[0.25em] uppercase font-medium text-[#1A1A1A] mb-5">
                Coordonnées
              </h2>
              <div className="space-y-3">
                <Input type="email" required placeholder="Adresse email" />
                <div className="grid grid-cols-2 gap-3">
                  <Input type="text" required placeholder="Prénom" />
                  <Input type="text" required placeholder="Nom" />
                </div>
                <Input type="tel" placeholder="Téléphone (optionnel)" />
              </div>
            </div>

            <div>
              <h2 className="text-[11px] tracking-[0.25em] uppercase font-medium text-[#1A1A1A] mb-5">
                Adresse de livraison
              </h2>
              <div className="space-y-3">
                <Input type="text" required placeholder="Adresse" />
                <Input type="text" placeholder="Complément d'adresse (optionnel)" />
                <div className="grid grid-cols-3 gap-3">
                  <Input type="text" required placeholder="Code postal" />
                  <Input type="text" required placeholder="Ville" className="col-span-2" />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-5">
                <Lock className="w-4 h-4 text-[#C9A45F]" strokeWidth={1.5} />
                <h2 className="text-[11px] tracking-[0.25em] uppercase font-medium text-[#1A1A1A]">
                  Paiement sécurisé
                </h2>
              </div>
              <div className="space-y-3">
                <Input type="text" required inputMode="numeric" placeholder="Numéro de carte" />
                <div className="grid grid-cols-2 gap-3">
                  <Input type="text" required placeholder="MM / AA" />
                  <Input type="text" required inputMode="numeric" placeholder="CVC" />
                </div>
              </div>
              <p className="text-[10px] text-[#6B6B6B] mt-3">
                🔒 Vos données de paiement sont chiffrées et sécurisées.
              </p>
            </div>
          </div>

          {/* Récapitulatif */}
          <aside className="border border-[#E8E2D5] p-6 h-fit lg:sticky lg:top-32">
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-medium text-[#1A1A1A] mb-5">
              Ma commande
            </h2>
            <div className="space-y-3 mb-5 max-h-72 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 items-center">
                  <div className="relative w-12 h-12 bg-[#FAF7F2] flex-shrink-0 overflow-hidden">
                    <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#1A1A1A] truncate">{item.name}</p>
                    <p className="text-[10px] text-[#6B6B6B]">Qté {item.quantity}</p>
                  </div>
                  <span className="text-xs text-[#1A1A1A] font-medium">
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
                <span className={shipping === 0 ? 'text-[#C9A45F] font-medium' : ''}>
                  {shipping === 0 ? 'Offerte' : formatPrice(shipping)}
                </span>
              </div>
              <div className="flex justify-between font-medium text-[#1A1A1A] pt-3 border-t border-[#E8E2D5]">
                <span className="text-[11px] tracking-[0.2em] uppercase">Total</span>
                <span className="text-lg">{formatPrice(cartTotal + shipping)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-5"
            >
              {loading ? 'Traitement…' : `Payer ${formatPrice(cartTotal + shipping)}`}
            </button>
          </aside>
        </form>
      </div>
    </section>
  )
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full border border-[#E8E2D5] px-4 py-3.5 text-sm placeholder:text-[#6B6B6B] focus:border-[#C9A45F] focus:outline-none transition-colors ${props.className ?? ''}`}
    />
  )
}
