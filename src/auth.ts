import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

/* Liste des emails admin (séparés par virgule) — défini sur Vercel */
function isAdminEmail(email: string): boolean {
  const raw = process.env.ADMIN_EMAILS || ''
  return raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase())
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/account',
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email:    { label: 'Email',          type: 'email' },
        password: { label: 'Mot de passe',  type: 'password' },
      },
      async authorize(credentials) {
        const email    = String(credentials?.email    ?? '').toLowerCase().trim()
        const password = String(credentials?.password ?? '')

        if (!email || !password) return null

        const user = await db.user.findUnique({ where: { email } })
        if (!user || !user.passwordHash) return null

        const ok = await bcrypt.compare(password, user.passwordHash)
        if (!ok) return null

        /* Promotion automatique en ADMIN si l'email est dans ADMIN_EMAILS */
        let role = user.role
        if (isAdminEmail(user.email) && role !== 'ADMIN') {
          await db.user.update({
            where: { id: user.id },
            data:  { role: 'ADMIN' },
          })
          role = 'ADMIN'
        }

        return {
          id:    user.id,
          email: user.email,
          name:  user.name ?? undefined,
          role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id
        // @ts-expect-error - we add role to the user object
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
  },
})
