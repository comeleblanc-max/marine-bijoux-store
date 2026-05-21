'use client'

import { useCart } from '@/store/cart'
import { X, ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, total, itemCount } = useCart()
  const cartTotal = total()
  const count = itemCount()
  const freeShippingThreshold = 60
  const remaining = freeShippingThreshold - cartTotal

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C9A84C]" />
            <h2 className="font-semibold text-lg text-[#1A3A52]" style={{ fontFamily: 'var(--font-playfair)' }}>
              Mon panier
            </h2>
            {count > 0 && (
              <span className="text-sm text-gray-500">({count} article{count > 1 ? 's' : ''})</span>
            )}
          </div>
          <button onClick={closeCart} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free shipping progress */}
        {cartTotal > 0 && (
          <div className="px-5 py-3 bg-[#F5F1ED]">
            {remaining > 0 ? (
              <>
                <p className="text-xs text-[#1A3A52] mb-1.5">
                  Plus que <strong>{formatPrice(remaining)}</strong> pour la livraison gratuite !
                </p>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4DB8D4] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((cartTotal / freeShippingThreshold) * 100, 100)}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="text-xs text-[#4DB8D4] font-semibold">
                🎉 Félicitations ! Votre livraison est offerte.
              </p>
            )}
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-200" />
              <p className="text-gray-400 font-medium">Votre panier est vide</p>
              <Button variant="primary" onClick={closeCart} size="sm">
                Découvrir nos bijoux
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-[#F5F1ED] rounded-xl p-3">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/placeholder.jpg'
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeCart}
                    className="font-medium text-sm text-[#1A3A52] hover:text-[#C9A84C] transition-colors line-clamp-2"
                  >
                    {item.name}
                  </Link>
                  {item.variantName && (
                    <p className="text-xs text-gray-500 mt-0.5">{item.variantName}</p>
                  )}
                  <p className="text-[#C9A84C] font-semibold text-sm mt-1">
                    {formatPrice(item.price)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#C9A84C] transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#C9A84C] transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Sous-total</span>
              <span className="text-xl font-bold text-[#1A3A52]" style={{ fontFamily: 'var(--font-playfair)' }}>
                {formatPrice(cartTotal)}
              </span>
            </div>
            <Link href="/cart" onClick={closeCart}>
              <Button variant="primary" className="w-full" size="lg">
                Passer commande →
              </Button>
            </Link>
            <button
              onClick={closeCart}
              className="w-full text-center text-sm text-gray-500 hover:text-[#1A3A52] transition-colors py-1"
            >
              Continuer mes achats
            </button>
          </div>
        )}
      </div>
    </>
  )
}
