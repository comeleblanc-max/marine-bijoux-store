'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/store/cart'
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

export function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, total, itemCount } = useCart()
  const cartTotal = total()
  const count = itemCount()

  /* Config livraison réelle (depuis l'admin) */
  const [cfg, setCfg] = useState({ freeThreshold: 60, franceFee: 4.9 })
  useEffect(() => {
    fetch('/api/shipping')
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d.franceFee === 'number') {
          setCfg({ freeThreshold: d.freeThreshold, franceFee: d.franceFee })
        }
      })
      .catch(() => {})
  }, [])

  const remaining = cfg.freeThreshold - cartTotal
  const progress = Math.min((cartTotal / cfg.freeThreshold) * 100, 100)
  /* Estimation France (la zone exacte est choisie à l'étape commande) */
  const estShipping = cartTotal >= cfg.freeThreshold ? 0 : cfg.franceFee

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed right-0 top-0 h-full w-full max-w-[440px] bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* En-tête */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E2D5]">
              <div>
                <h2 className="text-[11px] tracking-[0.25em] uppercase font-medium text-[#0E4F5E]">
                  Votre panier
                </h2>
                {count > 0 && (
                  <p className="text-xs text-[#6B6B6B] mt-1">{count} article{count > 1 ? 's' : ''}</p>
                )}
              </div>
              <button onClick={closeCart} aria-label="Fermer" className="text-[#6B6B6B] hover:text-[#0E4F5E] transition-colors">
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Barre livraison — plus visible, dégradée, animation */}
            {cartTotal > 0 && (
              <div className="px-6 py-4 bg-gradient-to-br from-[#FAF5EA] to-[#F2E5CC] border-b border-[#E8E2D5]">
                {remaining > 0 ? (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-[#0E4F5E]">
                        🎁 Plus que <strong className="text-[#D4AF37]">{formatPrice(remaining)}</strong> pour la livraison offerte !
                      </p>
                      <span className="text-[10px] text-[#6B6B6B] font-medium">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/70 rounded-full relative overflow-hidden">
                      <motion.div
                        className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#D4AF37] to-[#24BBD0] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.7, ease: EASE }}
                      />
                    </div>
                  </>
                ) : (
                  <motion.p
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 250, damping: 18 }}
                    className="text-sm text-[#0E4F5E] font-medium text-center"
                  >
                    🎉 <span className="text-[#D4AF37]">Livraison offerte</span> débloquée !
                  </motion.p>
                )}
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-5 px-6 text-center">
                  <ShoppingBag className="w-12 h-12 text-[#E8E2D5]" strokeWidth={1} />
                  <p className="text-sm text-[#6B6B6B]">Votre panier est vide</p>
                  <button onClick={closeCart} className="btn-ghost mt-2">
                    Découvrir les bijoux
                  </button>
                </div>
              ) : (
                <ul className="px-6 py-5 space-y-5">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.3, ease: EASE }}
                        className="flex gap-4"
                      >
                        <div className="relative w-20 h-20 bg-[#FAF5EA] flex-shrink-0 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col">
                          <Link
                            href={`/products/${item.slug}`}
                            onClick={closeCart}
                            className="text-sm text-[#0E4F5E] hover:text-[#D4AF37] transition-colors line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          {item.variantName && (
                            <p className="text-xs text-[#6B6B6B] mt-0.5">{item.variantName}</p>
                          )}
                          <p className="text-xs text-[#0E4F5E] font-medium mt-1">
                            {formatPrice(item.price)}
                          </p>
                          <div className="flex items-center justify-between mt-auto pt-2">
                            <div className="flex items-center border border-[#E8E2D5]">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-[#24BBD0] hover:text-white transition-colors"
                                aria-label="Diminuer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-7 text-center text-xs">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center hover:bg-[#24BBD0] hover:text-white transition-colors"
                                aria-label="Augmenter"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-[#6B6B6B] hover:text-[#0E4F5E] transition-colors"
                              aria-label="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" strokeWidth={1.3} />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Pied */}
            {items.length > 0 && (
              <div className="border-t border-[#E8E2D5] px-6 py-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6B6B6B]">Sous-total</span>
                  <span className="text-[#0E4F5E]">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6B6B6B]">Livraison <span className="text-[10px]">(France)</span></span>
                  <span className={estShipping === 0 ? 'text-[#D4AF37] font-medium' : 'text-[#0E4F5E]'}>
                    {estShipping === 0 ? 'Offerte' : formatPrice(estShipping)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#E8E2D5]">
                  <span className="text-[11px] tracking-[0.2em] uppercase text-[#6B6B6B]">Total estimé</span>
                  <span className="text-lg text-[#0E4F5E] font-medium">{formatPrice(cartTotal + estShipping)}</span>
                </div>
                <p className="text-[10px] text-[#6B6B6B]">
                  Taxes incluses · Europe et destination exacte choisies à l&apos;étape suivante
                </p>
                <Link href="/checkout" onClick={closeCart} className="btn-primary w-full">
                  Passer commande
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="block text-center text-[11px] tracking-[0.2em] uppercase text-[#6B6B6B] hover:text-[#0E4F5E] transition-colors"
                >
                  Voir le panier complet
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
