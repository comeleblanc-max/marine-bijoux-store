'use client'

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useState, use } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Plus, Minus, Truck, ShieldCheck, RefreshCw, Sparkles, ChevronDown, Star } from 'lucide-react'
import { PRODUCTS } from '@/lib/data'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/store/cart'
import { useWishlist } from '@/hooks/useWishlist'
import { ProductRow } from '@/components/product/ProductRow'

const EASE = [0.22, 1, 0.36, 1] as const

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function ProductPage({ params }: PageProps) {
  const { slug } = use(params)
  const product = PRODUCTS.find((p) => p.slug === slug)
  if (!product) notFound()

  const [qty, setQty] = useState(1)
  const [openTab, setOpenTab] = useState<'details' | 'shipping' | null>('details')
  const { addItem, openCart } = useCart()
  const { toggle, has } = useWishlist()
  const wished = has(product.id)

  const related = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.collection === product.collection)
  ).slice(0, 6)

  const handleAdd = () => {
    addItem({
      id: `${product.id}-default`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/images/placeholder.jpg',
      quantity: qty,
      slug: product.slug,
    })
    openCart()
  }

  return (
    <>
      {/* En-tête + galerie */}
      <section className="bg-white">
        <div className="container-x py-8 sm:py-12">
          {/* Fil d'Ariane */}
          <nav className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#6B6B6B] mb-8">
            <Link href="/" className="hover:text-[#1A1A1A] transition-colors">Accueil</Link>
            <span>/</span>
            <Link href={`/collections/${product.category}`} className="hover:text-[#1A1A1A] transition-colors capitalize">
              {product.category.replace('-', ' ')}
            </Link>
            <span>/</span>
            <span className="text-[#1A1A1A] truncate">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Galerie */}
            <div className="relative">
              <div className="relative aspect-square bg-[#FAF5EA] overflow-hidden">
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-7xl text-[#D4AF37]/30">✦</div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.newArrival && (
                    <span className="bg-white text-[#1A1A1A] text-[10px] tracking-[0.2em] uppercase font-medium px-3 py-1.5">
                      Nouveau
                    </span>
                  )}
                  {!product.inStock && (
                    <span className="bg-[#6B6B6B] text-white text-[10px] tracking-[0.2em] uppercase font-medium px-3 py-1.5">
                      Épuisé
                    </span>
                  )}
                </div>
              </div>

              {/* Mini galerie si plusieurs images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {product.images.map((img, i) => (
                    <div key={i} className="relative aspect-square bg-[#FAF5EA]">
                      <Image src={img} alt="" fill className="object-cover" sizes="120px" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Infos */}
            <div className="lg:py-6">
              <p className="eyebrow mb-3">{product.material ?? 'Acier inoxydable'}</p>
              <h1 className="text-3xl sm:text-4xl text-[#1A1A1A] mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Étoiles */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>
                <span className="text-xs text-[#6B6B6B]">(24 avis)</span>
              </div>

              {/* Prix */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-2xl text-[#1A1A1A] font-medium">{formatPrice(product.price)}</span>
                {product.compareAt && (
                  <span className="text-[#6B6B6B] line-through">{formatPrice(product.compareAt)}</span>
                )}
              </div>

              {product.description && (
                <p className="text-[#6B6B6B] leading-relaxed mb-8">{product.description}</p>
              )}

              {/* Quantité + ajout */}
              <div className="flex items-stretch gap-3 mb-4">
                <div className="flex items-center border border-[#1A1A1A]">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-12 flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white transition-colors"
                    aria-label="Diminuer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-10 h-12 flex items-center justify-center hover:bg-[#1A1A1A] hover:text-white transition-colors"
                    aria-label="Augmenter"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  onClick={handleAdd}
                  disabled={!product.inStock}
                  className="flex-1 btn-primary disabled:bg-[#6B6B6B] disabled:hover:bg-[#6B6B6B] disabled:hover:gap-2"
                >
                  {product.inStock ? 'Ajouter au panier' : 'Épuisé'}
                </button>
              </div>

              <button
                onClick={() => toggle(product.id)}
                className="flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#6B6B6B] hover:text-[#D4AF37] transition-colors mb-8"
              >
                <Heart
                  className={`w-4 h-4 ${wished ? 'fill-[#D4AF37] text-[#D4AF37]' : ''}`}
                  strokeWidth={1.5}
                />
                {wished ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              </button>

              {/* Réassurance compacte */}
              <div className="grid grid-cols-3 gap-3 mb-8 py-5 border-y border-[#E8E2D5]">
                {[
                  { icon: Truck, label: 'Livraison\noffert dès 60€' },
                  { icon: ShieldCheck, label: 'Paiement\nsécurisé' },
                  { icon: RefreshCw, label: 'Retours\nsous 14j' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center text-center gap-2">
                    <Icon className="w-5 h-5 text-[#D4AF37]" strokeWidth={1.3} />
                    <p className="text-[10px] tracking-wide text-[#6B6B6B] whitespace-pre-line">{label}</p>
                  </div>
                ))}
              </div>

              {/* Accordéons */}
              {product.details && (
                <Accordion
                  title="Détails du produit"
                  open={openTab === 'details'}
                  onToggle={() => setOpenTab(openTab === 'details' ? null : 'details')}
                >
                  <p className="text-sm text-[#6B6B6B] whitespace-pre-line leading-relaxed">
                    {product.details}
                  </p>
                </Accordion>
              )}
              <Accordion
                title="Livraison & retours"
                open={openTab === 'shipping'}
                onToggle={() => setOpenTab(openTab === 'shipping' ? null : 'shipping')}
              >
                <ul className="text-sm text-[#6B6B6B] space-y-2 leading-relaxed">
                  <li>• Livraison standard 2-4 jours ouvrés</li>
                  <li>• Offerte dès 60 € d'achat</li>
                  <li>• Retours gratuits sous 14 jours</li>
                  <li>• Emballage cadeau offert sur demande</li>
                </ul>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* Produits liés */}
      {related.length > 0 && (
        <div className="bg-[#FAF5EA]">
          <ProductRow
            eyebrow="Vous aimerez aussi"
            title="Dans le même esprit"
            products={related}
          />
        </div>
      )}
    </>
  )
}

function Accordion({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border-t border-[#E8E2D5]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-[11px] tracking-[0.2em] uppercase font-medium text-[#1A1A1A]">
          {title}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          strokeWidth={1.5}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
