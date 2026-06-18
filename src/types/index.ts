export interface Product {
  id: string
  name: string
  slug: string
  description?: string | null
  details?: string | null
  price: number
  compareAt?: number | null
  images: string[]
  category: string
  collection?: string | null
  material?: string | null
  inStock: boolean
  /** Quantité réellement en stock (toujours présent côté DB ; optionnel pour les fixtures src/lib/data.ts). */
  stock?: number
  featured: boolean
  newArrival: boolean
  variants: Variant[]
  reviews?: Review[]
  createdAt: Date
}

export interface Variant {
  id: string
  productId: string
  name: string
  sku: string
  stock: number
  price?: number | null
}

export interface Collection {
  id: string
  name: string
  slug: string
  description?: string | null
  image?: string | null
  featured: boolean
  order: number
}

export interface Order {
  id: string
  email: string
  status: OrderStatus
  total: number
  items: OrderItem[]
  shippingName: string
  shippingAddress: string
  shippingCity: string
  shippingZip: string
  shippingCountry: string
  stripeId?: string | null
  promoCode?: string | null
  discount?: number | null
  createdAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  variantId?: string | null
  name: string
  image: string
  quantity: number
  price: number
}

export interface User {
  id: string
  email: string
  name?: string | null
  role: 'CUSTOMER' | 'ADMIN'
  wishlist: string[]
  createdAt: Date
}

export interface Review {
  id: string
  productId: string
  userId?: string | null
  name: string
  rating: number
  comment: string
  approved: boolean
  createdAt: Date
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  name: string
  variantName?: string
  price: number
  image: string
  quantity: number
  slug: string
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  total: () => number
  itemCount: () => number
}
