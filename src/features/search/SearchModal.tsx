'use client'
import { useState, useEffect, useRef } from 'react'
import { Search, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { PRODUCTS } from '@/data/products'
import { formatPrice } from '@/utils/format'
import { useDebounce } from '@/hooks/useDebounce'
import { cn } from '@/utils/cn'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const debounced = useDebounce(query, 200)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = debounced.length > 1
    ? PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(debounced.toLowerCase()) ||
        p.description?.toLowerCase().includes(debounced.toLowerCase()) ||
        p.material?.toLowerCase().includes(debounced.toLowerCase())
      ).slice(0, 6)
    : []

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      setQuery('')
    }
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Rechercher un bijou…"
                className="flex-1 text-base outline-none text-[#1F3A56] placeholder:text-gray-400"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600 pl-2 border-l border-gray-200">
                Esc
              </button>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {debounced.length > 1 && results.length === 0 && (
                <p className="p-6 text-center text-gray-400 text-sm">Aucun résultat pour &ldquo;{debounced}&rdquo;</p>
              )}
              {results.length > 0 && (
                <ul className="py-2">
                  {results.map(product => (
                    <li key={product.id}>
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-4 px-5 py-3 hover:bg-[#F5E9D6] transition-colors group"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image src={product.images[0]} alt={product.name} fill sizes="48px" className="object-cover" onError={e => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.jpg' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#1F3A56] group-hover:text-[#D4AF37] transition-colors text-sm">{product.name}</p>
                          <p className="text-xs text-gray-400 capitalize">{product.category}</p>
                        </div>
                        <span className="text-sm font-semibold text-[#D4AF37]">{formatPrice(product.price)}</span>
                        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#D4AF37] transition-colors" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {debounced.length <= 1 && (
                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Catégories</p>
                  <div className="flex flex-wrap gap-2">
                    {['Colliers', 'Bracelets', "Boucles d'oreilles", 'Bagues'].map(cat => (
                      <Link
                        key={cat}
                        href={`/collections/${cat.toLowerCase().replace(/'/g, '-').replace(/ /g, '-')}`}
                        onClick={onClose}
                        className={cn(
                          'px-3 py-1.5 rounded-full bg-[#F5E9D6] text-sm text-[#1F3A56] hover:bg-[#D4AF37] hover:text-white transition-colors'
                        )}
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
