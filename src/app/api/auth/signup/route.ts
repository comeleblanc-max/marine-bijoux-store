import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

/**
 * POST /api/auth/signup
 * Crée un nouveau compte client.
 * Body: { name, email, password }
 */
export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis.' },
        { status: 400 }
      )
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email invalide.' }, { status: 400 })
    }
    if (String(password).length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères.' },
        { status: 400 }
      )
    }

    const normalizedEmail = String(email).toLowerCase().trim()

    const existing = await db.user.findUnique({ where: { email: normalizedEmail } })
    if (existing) {
      return NextResponse.json(
        { error: 'Un compte existe déjà avec cet email.' },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await db.user.create({
      data: {
        email: normalizedEmail,
        name:  name ? String(name).trim() : null,
        passwordHash,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[signup] erreur :', err)
    return NextResponse.json(
      { error: "Erreur lors de la création du compte." },
      { status: 500 }
    )
  }
}
