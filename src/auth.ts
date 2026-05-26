import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

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

        return {
          id:    user.id,
          email: user.email,
          name:  user.name ?? undefined,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        ;(session.user as { id?: string }).id = String(token.id)
      }
      return session
    },
  },
})
