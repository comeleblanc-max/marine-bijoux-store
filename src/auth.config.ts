import type { NextAuthConfig } from 'next-auth'

/**
 * Config légère de NextAuth pour la middleware (Edge runtime).
 *
 * Ne pas importer ici de modules Node-only (Prisma, bcrypt, etc.),
 * sinon la middleware dépasse la limite de taille (1 Mo sur Vercel Hobby).
 *
 * La config complète (providers + DB) est dans /src/auth.ts.
 */
export const authConfig = {
  pages: {
    signIn: '/account',
  },
  providers: [],   // les providers sont ajoutés dans auth.ts uniquement
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        // @ts-expect-error - role ajouté dynamiquement
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        if (token?.id)   (session.user as { id?: string }).id     = String(token.id)
        if (token?.role) (session.user as { role?: string }).role = String(token.role)
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const { pathname } = nextUrl

      if (pathname.startsWith('/admin')) {
        if (!auth) return false                                       // non connectée
        const role = (auth.user as { role?: string } | undefined)?.role
        return role === 'ADMIN'
      }

      return true
    },
  },
} satisfies NextAuthConfig
