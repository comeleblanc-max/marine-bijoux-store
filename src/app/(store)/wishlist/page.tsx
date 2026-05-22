'use client'

import { useWishlist } from '@/hooks/useWishlist'
import { PRODUCTS } from '@/lib/data'
import { ProductCard } from '@/components/product/ProductCard'
import { Button } from '@/components/ui/Button'
import { Heart, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1] as const

export default function WishlistPage() {
  const { items, clear } = useWishlist()

  const wishlistProducts = PRODUCTS.filter((p) => items.includes(p.id))

  return (
    <div className="min-h-screen bg-[#F5E9D6] py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-3xl sm:text-4xl text-[#1F3A56] font-light"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Mes favoris
            </h1>
            {wishlistProducts.length > 0 && (
              <p className="text-gray-400 text-sm mt-1">
                {wishlistProducts.length} bijou{wishlistProducts.length > 1 ? 'x' : ''} enregistré{wishlistProducts.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
          {wishlistProducts.length > 0 && (
            <button
              onClick={clear}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Tout supprimer
            </button>
          )}
        </div>

        {/* Vide */}
        {wishlistProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block mb-6"
            >
              <div className="w-20 h-20 rounded-full bg-[#F5E9D6] flex items-center justify-center mx-auto">
                <Heart className="w-10 h-10 text-gray-300" />
              </div>
            </motion.div>
            <p className="text-gray-500 font-medium mb-2">Votre liste de favoris est vide</p>
            <p className="text-gray-400 text-sm mb-8">
              Cliquez sur le cœur ♡ sur un produit pour l'ajouter à vos favoris.
            </p>
            <Link href="/collections/all">
              <Button variant="primary">Découvrir nos bijoux</Button>
            </Link>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlistProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.05, ease: EASE }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
