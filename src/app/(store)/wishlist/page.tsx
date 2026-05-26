'use client'

import { useWishlist } from '@/hooks/useWishlist'
import { PRODUCTS } from '@/lib/data'
import { ProductCard } from '@/components/product/ProductCard'
import { Heart, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Stagger, StaggerItem } from '@/components/ui/motion'

export default function WishlistPage() {
  const { items, clear } = useWishlist()
  const products = PRODUCTS.filter((p) => items.includes(p.id))

  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="container-x">
        <div className="flex items-end justify-between mb-10 sm:mb-14">
          <div>
            <p className="eyebrow mb-3">Mes favoris</p>
            <h1 className="text-3xl sm:text-4xl text-[#1F3A56]">Liste de souhaits</h1>
            {products.length > 0 && (
              <p className="text-xs text-[#6B6B6B] mt-2">
                {products.length} bijou{products.length > 1 ? 'x' : ''}
              </p>
            )}
          </div>
          {products.length > 0 && (
            <button
              onClick={clear}
              className="hidden sm:flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#6B6B6B] hover:text-[#1F3A56] transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.3} />
              Tout retirer
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 max-w-md mx-auto">
            <Heart className="w-12 h-12 text-[#E8E2D5] mx-auto mb-6" strokeWidth={1} />
            <p className="text-[#1F3A56] mb-2">Aucun favori pour le moment</p>
            <p className="text-sm text-[#6B6B6B] mb-8">
              Cliquez sur ♡ sur un produit pour l'ajouter à vos favoris.
            </p>
            <Link href="/collections/all" className="btn-primary">
              Découvrir les bijoux
            </Link>
          </div>
        ) : (
          <Stagger className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {products.map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  )
}
