'use client'

import { useCart } from '@/store/cart'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart()
  const cartTotal = total()
  const count = itemCount()
  const shipping = cartTotal >= 60 ? 0 : 4.9

  return (
    <div className="min-h-screen bg-[#F5F1ED] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-3xl sm:text-4xl text-[#1A3A52] font-light mb-8"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          Mon panier {count > 0 && <span className="text-gray-400 text-2xl">({count})</span>}
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center">
            <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-6">Votre panier est vide</p>
            <Link href="/collections/all">
              <Button variant="primary">Découvrir nos bijoux</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-5 flex gap-4 items-center">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#F5F1ED] flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.slug}`} className="font-medium text-[#1A3A52] hover:text-[#C9A84C] transition-colors">
                      {item.name}
                    </Link>
                    {item.variantName && <p className="text-sm text-gray-400">{item.variantName}</p>}
                    <p className="text-[#C9A84C] font-semibold mt-1">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-full px-2 py-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-500 hover:text-[#1A3A52]">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-500 hover:text-[#1A3A52]">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl p-6 h-fit sticky top-24 space-y-4">
              <h2 className="font-semibold text-[#1A3A52] text-lg" style={{ fontFamily: 'var(--font-playfair)' }}>
                Récapitulatif
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className={shipping === 0 ? 'text-[#4DB8D4] font-medium' : ''}>
                    {shipping === 0 ? '🎉 Offerte' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-[#4DB8D4]">
                    Plus que {formatPrice(60 - cartTotal)} pour la livraison gratuite !
                  </p>
                )}
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-[#1A3A52]">
                <span>Total</span>
                <span className="text-xl">{formatPrice(cartTotal + shipping)}</span>
              </div>
              <Button size="lg" className="w-full rounded-xl">
                Passer commande →
              </Button>
              <Link href="/collections/all" className="block text-center text-sm text-gray-400 hover:text-[#1A3A52] transition-colors">
                Continuer mes achats
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
