'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistState {
  items: string[] // product IDs
  toggle: (id: string) => void
  has: (id: string) => boolean
  clear: () => void
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (id) => set((s) => ({
        items: s.items.includes(id) ? s.items.filter(i => i !== id) : [...s.items, id]
      })),
      has: (id) => get().items.includes(id),
      clear: () => set({ items: [] }),
    }),
    { name: 'marine-wishlist' }
  )
)
