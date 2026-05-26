import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { authConfig } from '@/auth.config'

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
  ...authConfig,
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email:    { label: 'Email',         type: 'email' },
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
})
