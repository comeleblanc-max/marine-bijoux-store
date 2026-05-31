import Stripe from 'stripe'

/**
 * Client Stripe côté serveur.
 * La clé secrète vient de l'env Vercel : STRIPE_SECRET_KEY.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-04-22.dahlia',
  typescript: true,
  appInfo: { name: 'Marine et la douceur de l\'été' },
})

export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
