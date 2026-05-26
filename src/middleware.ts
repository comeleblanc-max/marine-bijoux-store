import NextAuth from 'next-auth'
import { authConfig } from '@/auth.config'

/**
 * Middleware légère — utilise UNIQUEMENT authConfig (pas de Prisma, pas de bcrypt).
 * La redirection est gérée par le callback `authorized` de authConfig.
 */
export default NextAuth(authConfig).auth

export const config = {
  matcher: ['/admin/:path*'],
}
