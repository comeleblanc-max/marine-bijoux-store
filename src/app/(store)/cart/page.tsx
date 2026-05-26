'use client'

import { useCart } from '@/store/cart'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart()
  const cartTotal = total()
  const count = itemCount()
  const shipping = cartTotal >= 60 ? 0 : 4.9

  if (items.length === 0) {
    return (
      <section className="min-h-[60vh] bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <ShoppingBag className="w-12 h-12 text-[#E8E2D5] mx-auto mb-6" strokeWidth={1} />
          <p className="eyebrow mb-3">Panier vide</p>
          <h1 className="text-3xl text-[#1F3A56] mb-4">Votre panier est vide</h1>
          <p className="text-[#6B6B6B] text-sm mb-8">
            Découvrez notre collection de bijoux en acier inoxydable.
          </p>
          <Link href="/collections/all" className="btn-primary">
            Voir les bijoux
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="container-x">
        <div className="text-center mb-10 sm:mb-14">
          <p className="eyebrow mb-3">Panier</p>
          <h1 className="text-3xl sm:text-4xl text-[#1F3A56]">Votre commande</h1>
          <p className="text-xs text-[#6B6B6B] mt-2">{count} article{count > 1 ? 's' : ''}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 sm:gap-5 border border-[#E8E2D5] p-4 sm:p-5 hover:border-[#D4AF37] transition-colors">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-[#FAF5EA] flex-shrink-0 overflow-hidden">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="112px" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col">
                  <p className="eyebrow text-[9px] mb-1">Acier inoxydable</p>
                  <Link
                    href={`/products/${item.slug}`}
                    className="text-sm sm:text-base text-[#1F3A56] hover:text-[#D4AF37] transition-colors"
                  >
                    {item.name}
                  </Link>
                  {item.variantName && <p className="text-xs text-[#6B6B6B] mt-1">{item.variantName}</p>}
                  <p className="text-sm text-[#1F3A56] font-medium mt-1">{formatPrice(item.price)}</p>

                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-center border border-[#E8E2D5]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-[#1F3A56] hover:text-white transition-colors"
                        aria-label="Diminuer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-[#1F3A56] hover:text-white transition-colors"
                        aria-label="Augmenter"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#6B6B6B] hover:text-[#1F3A56] transition-colors"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.3} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Récapitulatif */}
          <aside className="border border-[#E8E2D5] p-6 h-fit lg:sticky lg:top-32 space-y-5">
            <h2 className="text-[11px] tracking-[0.25em] uppercase font-medium text-[#1F3A56]">
              Récapitulatif
            </h2>
            <div className="space-y-2 text-sm">
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
              {shipping > 0 && (
                <p className="text-[10px] text-[#D4AF37] tracking-wide">
                  Plus {formatPrice(60 - cartTotal)} pour la livraison offerte
                </p>
              )}
            </div>
            <div className="border-t border-[#E8E2D5] pt-4 flex justify-between items-baseline">
              <span className="text-[11px] tracking-[0.25em] uppercase font-medium text-[#1F3A56]">Total</span>
              <span className="text-xl text-[#1F3A56] font-medium">
                {formatPrice(cartTotal + shipping)}
              </span>
            </div>
            <Link href="/checkout" className="btn-primary w-full">
              Passer commande
            </Link>
            <Link
              href="/collections/all"
              className="block text-center text-[11px] tracking-[0.2em] uppercase text-[#6B6B6B] hover:text-[#1F3A56] transition-colors"
            >
              Continuer mes achats
            </Link>
          </aside>
        </div>
      </div>
    </section>
  )
}
