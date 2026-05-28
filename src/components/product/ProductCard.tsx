'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Plus } from 'lucide-react'
import type { Product } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/hooks/useWishlist'
import { motion } from 'framer-motion'

interface Props {
  product: Product
}

const COLOR_MAP: Record<string, string> = {
  'doré': '#D4AF37',
  'argenté': '#C0C0C0',
  'nacre': '#F8F0DA',
}

export function ProductCard({ product }: Props) {
  const { addItem } = useCart()
  const { toggle, has } = useWishlist()
  const wished = has(product.id)

  // Couleurs disponibles déduites du matériau
  const colors: string[] = []
  const m = (product.material ?? '').toLowerCase()
  if (m.includes('doré')) colors.push('doré')
  if (m.includes('argenté')) colors.push('argenté')
  if (m.includes('nacre')) colors.push('nacre')

  const discount = product.compareAt
    ? Math.round((1 - product.price / product.compareAt) * 100)
    : null

  const onAdd = (e: React.MouseEvent) => {
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
      {/* Image */}
      <div className="relative aspect-square bg-[#FAF5EA] overflow-hidden mb-4">
        {product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-[#D4AF37]/30">
            ✦
          </div>
        )}

        {/* Badges en haut à gauche */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.newArrival && (
            <span className="bg-white/95 text-[#0E4F5E] text-[9px] tracking-[0.2em] uppercase font-medium px-2.5 py-1">
              Nouveau
            </span>
          )}
          {discount && (
            <span className="bg-[#0E4F5E] text-white text-[9px] tracking-[0.2em] uppercase font-medium px-2.5 py-1">
              -{discount}%
            </span>
          )}
          {!product.inStock && (
            <span className="bg-[#6B6B6B] text-white text-[9px] tracking-[0.2em] uppercase font-medium px-2.5 py-1">
              Épuisé
            </span>
          )}
        </div>

        {/* Favoris */}
        <button
          onClick={(e) => {
            e.preventDefault()
            toggle(product.id)
          }}
          aria-label={wished ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          className={`absolute top-3 right-3 w-8 h-8 bg-white flex items-center justify-center transition-all duration-300 ${
            wished ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart
            className={`w-[14px] h-[14px] transition-colors ${
              wished ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-[#0E4F5E]'
            }`}
            strokeWidth={1.5}
          />
        </button>

        {/* Bouton ajout rapide — bottom slide */}
        {product.inStock && (
          <button
            onClick={onAdd}
            className="absolute bottom-0 left-0 right-0 bg-[#0E4F5E] text-white py-3 text-[10px] tracking-[0.25em] uppercase font-medium flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
          >
            <Plus className="w-3 h-3" strokeWidth={2} />
            Ajouter
          </button>
        )}
      </div>

      {/* Infos */}
      <div className="space-y-1.5">
        <p className="eyebrow">Acier inoxydable</p>
        <h3 className="text-sm text-[#0E4F5E] group-hover:text-[#D4AF37] transition-colors leading-snug">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#0E4F5E] font-medium">
            {formatPrice(product.price)}
          </span>
          {product.compareAt && (
            <span className="text-xs text-[#6B6B6B] line-through">
              {formatPrice(product.compareAt)}
            </span>
          )}
        </div>

        {/* Sélecteur de couleur */}
        {colors.length > 0 && (
          <div className="flex items-center gap-1.5 pt-1">
            {colors.map((c) => (
              <motion.span
                key={c}
                whileHover={{ scale: 1.15 }}
                className="w-3 h-3 rounded-full ring-1 ring-[#E8E2D5] ring-offset-1"
                style={{ background: COLOR_MAP[c] || '#999' }}
                title={c}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
