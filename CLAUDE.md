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

## Brand Colors (moodboard "douceur de l'été")
- Bleu marin: `#1F3A56`
- Doré: `#D4AF37`
- Bleu océan: `#4DB8D4` / soft `#A7D5E6`
- Corail: `#FF7A45`
- Sable accent: `#D8B98C`
- Sable fond: `#F5E9D6`

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
