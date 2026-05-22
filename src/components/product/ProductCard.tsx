'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { useState } from 'react' // gardé pour d'autres états potentiels
import type { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/hooks/useWishlist'
import { motion } from '@/components/ui/motion'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggle, has } = useWishlist()
  const wished = has(product.id)
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
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative aspect-square bg-[#F5E9D6] rounded-2xl overflow-hidden mb-3"
      >
        {/* Image principale */}
        {product.images.length > 0 ? (
          <Image
            src={product.images[0] || '/images/placeholder.jpg'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = '/images/placeholder.jpg'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F5E9D6] to-[#EAD9BE]">
            <motion.span
              className="text-5xl"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              💎
            </motion.span>
          </div>
        )}

        {/* Image au survol */}
        {product.images.length > 1 && (
          <Image
            src={product.images[1]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500 absolute inset-0"
            onError={() => {}}
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.newArrival && <Badge variant="new">Nouveau</Badge>}
          {discount && <Badge variant="promo">-{discount}%</Badge>}
          {!product.inStock && <Badge variant="soldout">Épuisé</Badge>}
        </div>

        {/* Favoris */}
        <motion.button
          onClick={(e) => {
            e.preventDefault()
            toggle(product.id)
          }}
          whileTap={{ scale: 0.8 }}
          className={`absolute top-3 right-3 w-9 h-9 backdrop-blur rounded-full flex items-center justify-center transition-all duration-200 hover:bg-white z-10 ${
            wished
              ? 'opacity-100 bg-white shadow-sm'
              : 'opacity-0 group-hover:opacity-100 bg-white/90'
          }`}
          aria-label={wished ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <motion.span
            animate={wished ? { scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                wished ? 'fill-[#FF7A45] text-[#FF7A45]' : 'text-gray-500'
              }`}
            />
          </motion.span>
        </motion.button>

        {/* Ajout rapide */}
        {product.inStock && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 left-3 right-3 bg-[#1F3A56] text-white text-xs font-semibold py-3 rounded-xl flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#D4AF37] z-10"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Ajouter au panier
          </button>
        )}
      </motion.div>

      {/* Infos */}
      <div className="px-1">
        <h3 className="text-sm font-medium text-[#1F3A56] group-hover:text-[#D4AF37] transition-colors line-clamp-2 mb-1">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[#D4AF37] font-semibold">{formatPrice(product.price)}</span>
          {product.compareAt && (
            <span className="text-gray-400 text-sm line-through">
              {formatPrice(product.compareAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
