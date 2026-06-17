import NextAuth from 'next-auth'
import { authConfig } from '@/auth.config'

/**
 * Middleware (Edge runtime) — utilise UNIQUEMENT authConfig (pas de Prisma).
 * Gère :
 *   - la garde /admin (réservé aux comptes ADMIN connectés)
 *   - le verrou "Bientôt disponible" avant LAUNCH_DATE
 *
 * Le matcher couvre TOUTES les routes pour pouvoir intercepter le verrou
 * avant-lancement, mais exclut les fichiers statiques et les API.
 */
export default NextAuth(authConfig).auth

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|webp|svg|ico|gif|woff2?|ttf|otf)$).*)',
  ],
}
