import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * POST /api/newsletter   body: { email }
 * Enregistre l'email dans la base (table Newsletter). Idempotent : si l'email
 * existe déjà, on renvoie quand même un succès (pas d'erreur de doublon).
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    const clean = typeof email === 'string' ? email.trim().toLowerCase() : ''

    if (!clean || !clean.includes('@') || clean.length > 200) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 })
    }

    await db.newsletter.upsert({
      where:  { email: clean },
      create: { email: clean },
      update: {},
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[newsletter]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
