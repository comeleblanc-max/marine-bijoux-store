import { NextResponse } from 'next/server'
import { auth } from '@/auth'

/**
 * Protège les routes /admin :
 * - Non connecté → redirige vers /account?callbackUrl=...
 * - Connecté mais pas admin → redirige vers /
 */
export default auth((req) => {
  const { pathname } = req.nextUrl

  if (!pathname.startsWith('/admin')) return NextResponse.next()

  const user = req.auth?.user as { role?: string } | undefined

  if (!req.auth) {
    const signInUrl = new URL('/account', req.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  if (user?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*'],
}
