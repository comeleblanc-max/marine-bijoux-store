// Lightweight analytics event tracker (ready for GA4 / Plausible)
export function trackEvent(name: string, props?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  // @ts-expect-error - gtag optional
  if (typeof window.gtag === 'function') window.gtag('event', name, props)
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', name, props)
  }
}

export const Analytics = {
  viewProduct: (id: string, name: string, price: number) =>
    trackEvent('view_item', { item_id: id, item_name: name, value: price }),
  addToCart: (id: string, name: string, price: number, quantity: number) =>
    trackEvent('add_to_cart', { item_id: id, item_name: name, value: price * quantity, quantity }),
  beginCheckout: (total: number) => trackEvent('begin_checkout', { value: total }),
  purchase: (orderId: string, total: number) => trackEvent('purchase', { transaction_id: orderId, value: total }),
}
