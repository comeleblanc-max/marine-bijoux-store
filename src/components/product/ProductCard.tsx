'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import type { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { useCart } from '@/store/cart'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [wished, setWished] = useState(false)
  const [imgIdx, setImgIdx] = useState(0)
  const { addItem } = useCart()

  const discount = product.compareAt
    ? Math.round((1 - product.price / product.compareAt) * 100)
    : null

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: `${product.id}-default`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/images/placeholder.jpg',
      quantity: 1,
      slug: product.slug,
    })
  }

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-square bg-[#F5F1ED] rounded-2xl overflow-hidden mb-3">
        {/* Images */}
        {product.images.length > 0 ? (
          <Image
            src={product.images[imgIdx] || '/images/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = '/images/placeholder.jpg'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">💎</span>
          </div>
        )}

        {/* Hover — second image */}
        {product.images.length > 1 && (
          <Image
            src={product.images[1]}
            alt={product.name}
            fill
            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute inset-0"
            onError={() => {}}
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.newArrival && <Badge variant="new">Nouveau</Badge>}
          {discount && <Badge variant="promo">-{discount}%</Badge>}
          {!product.inStock && <Badge variant="soldout">Épuisé</Badge>}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setWished(!wished) }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white"
          aria-label="Ajouter aux favoris"
        >
          <Heart className={`w-4 h-4 ${wished ? 'fill-[#F08080] text-[#F08080]' : 'text-gray-500'}`} />
        </button>

        {/* Quick add */}
        {product.inStock && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 left-3 right-3 bg-[#1A3A52] text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Ajouter au panier
          </button>
        )}
      </div>

      {/* Info */}
      <div className="px-1">
        <h3 className="text-sm font-medium text-[#1A3A52] group-hover:text-[#C9A84C] transition-colors line-clamp-2 mb-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[#C9A84C] font-semibold">{formatPrice(product.price)}</span>
          {product.compareAt && (
            <span className="text-gray-400 text-sm line-through">{formatPrice(product.compareAt)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
