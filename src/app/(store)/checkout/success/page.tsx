'use client'

import { Suspense, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { useCart } from '@/store/cart'

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] bg-white" />}>
      <CheckoutSuccessInner />
    </Suspense>
  )
}

function CheckoutSuccessInner() {
  const search    = useSearchParams()
  const sessionId = search.get('session_id')
  const { clearCart } = useCart()

  /* Vide le panier dès l'arrivée sur la page (paiement validé côté Stripe) */
  useEffect(() => {
    clearCart()
  }, [clearCart])

  const shortId = sessionId ? sessionId.slice(-8).toUpperCase() : 'XXXXXXXX'

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
          className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#24BBD0]/15 flex items-center justify-center"
        >
          <CheckCircle2 className="w-8 h-8 text-[#0E4F5E]" strokeWidth={1.5} />
        </motion.div>

        <p className="eyebrow mb-3">Confirmation</p>
        <h1 className="text-3xl sm:text-4xl text-[#0E4F5E] mb-4">Merci pour votre commande 🐚</h1>

        {sessionId && (
          <p className="text-sm text-[#6B6B6B] mb-2">
            Référence <strong className="text-[#D4AF37]">#{shortId}</strong>
          </p>
        )}

        <p className="text-sm text-[#6B6B6B] mb-10">
          Un email de confirmation vient de vous être envoyé. Vous recevrez le suivi dès l&apos;expédition.
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
