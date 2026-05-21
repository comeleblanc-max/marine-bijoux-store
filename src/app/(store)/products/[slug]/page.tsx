'use client'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import { useState, use } from 'react'
import { ShoppingBag, Heart, ChevronDown, Shield, Truck, RotateCcw } from 'lucide-react'
import { PRODUCTS } from '@/lib/data'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { StarRating } from '@/components/ui/StarRating'
import { ProductCard } from '@/components/product/ProductCard'
import { useCart } from '@/store/cart'

interface Props {
  params: Promise<{ slug: string }>
}

export default function ProductPage({ params }: Props) {
  const { slug } = use(params)
  const product = PRODUCTS.find((p) => p.slug === slug)
  if (!product) notFound()

  const related = PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4)
  const { addItem } = useCart()

  const [imgIndex, setImgIndex] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0] ?? null)
  const [wished, setWished] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<string | null>('description')

  const price = selectedVariant?.price ?? product.price
  const discount = product.compareAt
    ? Math.round((1 - price / product.compareAt) * 100)
    : null

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedVariant?.id ?? 'default'}`,
      productId: product.id,
      variantId: selectedVariant?.id,
      variantName: selectedVariant?.name,
      name: product.name,
      price,
      image: product.images[0] || '/images/placeholder.jpg',
      quantity: 1,
      slug: product.slug,
    })
  }

  const ACCORDIONS = [
    { id: 'description', label: 'Description', content: product.description },
    { id: 'details', label: 'Composition & détails', content: product.details },
    { id: 'entretien', label: 'Entretien du bijou', content: 'Évitez le contact avec l\'eau, les parfums et la crème solaire. Conservez votre bijou dans sa pochette. Nettoyez-le délicatement avec un chiffon doux.' },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-8 flex items-center gap-2">
          <a href="/" className="hover:text-[#C9A84C] transition-colors">Accueil</a>
          <span>/</span>
          <a href={`/collections/${product.category}`} className="hover:text-[#C9A84C] transition-colors capitalize">
            {product.category}
          </a>
          <span>/</span>
          <span className="text-[#1A3A52]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square bg-[#F5F1ED] rounded-3xl overflow-hidden">
              {product.images.length > 0 ? (
                <Image
                  src={product.images[imgIndex] || '/images/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  onError={(e) => { e.currentTarget.src = '/images/placeholder.jpg' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">💎</div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.newArrival && <Badge variant="new">Nouveau</Badge>}
                {discount && <Badge variant="promo">-{discount}%</Badge>}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                      i === imgIndex ? 'border-[#C9A84C]' : 'border-transparent'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <h1
              className="text-3xl sm:text-4xl text-[#1A3A52] font-light mb-3 leading-tight"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              {product.name}
            </h1>

            <StarRating rating={4.8} count={24} size="md" className="mb-4" />

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-[#C9A84C]">{formatPrice(price)}</span>
              {product.compareAt && (
                <span className="text-gray-400 text-lg line-through">{formatPrice(product.compareAt)}</span>
              )}
              {discount && (
                <Badge variant="promo">Économisez {discount}%</Badge>
              )}
            </div>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-[#1A3A52] mb-2">
                  Longueur : <span className="text-[#C9A84C]">{selectedVariant?.name}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      disabled={v.stock === 0}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                        selectedVariant?.id === v.id
                          ? 'border-[#C9A84C] bg-[#C9A84C] text-white'
                          : 'border-gray-200 text-[#1A3A52] hover:border-[#C9A84C]'
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to cart */}
            <div className="flex gap-3 mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                size="lg"
                className="flex-1 rounded-full"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                {product.inStock ? 'Ajouter au panier' : 'Épuisé'}
              </Button>
              <button
                onClick={() => setWished(!wished)}
                className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#F08080] transition-colors"
                aria-label="Favoris"
              >
                <Heart className={`w-5 h-5 ${wished ? 'fill-[#F08080] text-[#F08080]' : 'text-gray-400'}`} />
              </button>
            </div>

            {/* Reassurance */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                { icon: Truck, label: 'Livraison gratuite', sub: 'dès 60€' },
                { icon: RotateCcw, label: 'Retours', sub: '14 jours' },
                { icon: Shield, label: 'Paiement', sub: '100% sécurisé' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center p-3 rounded-xl bg-[#F5F1ED]">
                  <Icon className="w-5 h-5 mx-auto mb-1 text-[#4DB8D4]" />
                  <p className="text-xs font-medium text-[#1A3A52]">{label}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div className="space-y-2 border-t border-gray-100 pt-4">
              {ACCORDIONS.map((acc) => (
                <div key={acc.id} className="border-b border-gray-100">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === acc.id ? null : acc.id)}
                    className="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-[#1A3A52] hover:text-[#C9A84C] transition-colors"
                  >
                    {acc.label}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${openAccordion === acc.id ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openAccordion === acc.id && acc.content && (
                    <div className="pb-4 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                      {acc.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2
              className="text-2xl text-[#1A3A52] font-light mb-8 text-center"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              Vous aimerez aussi
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
