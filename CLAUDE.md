@AGENTS.md

# Marine et la douceur de l'été — Project

## Overview
Next.js 16 e-commerce site for a French artisan jewelry brand.

## Stack
- **Framework**: Next.js 16.2.6 (App Router)
- **UI**: React 19, Tailwind CSS v4, Framer Motion 12
- **State**: Zustand 5 (cart + wishlist + toasts)
- **DB**: Prisma 6 + PostgreSQL
- **Auth**: next-auth v5 beta
- **Payments**: Stripe (not yet integrated)
- **Email**: Resend + react-email

## Project Structure
```
src/
├── app/
│   ├── (store)/      # Public storefront
│   ├── (admin)/      # Admin panel
│   └── api/          # API routes
├── components/
│   ├── ui/           # Primitive UI components
│   ├── layout/       # Header, Footer, etc.
│   ├── home/         # Homepage sections
│   ├── product/      # Product components
│   └── admin/        # Admin components
├── features/
│   └── search/       # Search modal
├── hooks/            # Custom React hooks
├── store/            # Zustand stores
├── data/             # Static data (products, blog, pages)
├── lib/              # DB client, legacy utils
├── utils/            # Pure utility functions
├── services/         # External service wrappers
└── types/            # TypeScript types
```

## Brand Colors
- Navy: `#1A3A52`
- Gold: `#C9A84C`
- Ocean: `#4DB8D4`
- Coral: `#F08080`
- Sand: `#D4A574`
- Cream: `#F5F1ED`

## Fonts
- Headings: Playfair Display (`var(--font-playfair)`)
- Body: Inter (`var(--font-inter)`)

## Dev Server
Run on port 3001: `npm run dev -- --port 3001`

## Key Notes
- No real DB needed for demo — all data is static in `src/data/`
- lucide-react does NOT have Instagram or Youtube icons — use ExternalLink and Share2
- Prisma v6 (NOT v7 — v7 breaks `url` in datasource)
- Tailwind v4 uses `@theme inline` in globals.css, NOT tailwind.config.js
