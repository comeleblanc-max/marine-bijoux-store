import { NextResponse } from 'next/server'
import { Resend } from 'resend'

/**
 * POST /api/contact
 *
 * Reçoit les données du formulaire de contact et envoie un email
 * à l'adresse définie dans CONTACT_TO_EMAIL.
 *
 * Variables d'environnement requises :
 * - RESEND_API_KEY        → la clé API Resend (commence par "re_")
 * - CONTACT_TO_EMAIL      → adresse où sont reçus les messages (ex : marine@gmail.com)
 * - CONTACT_FROM_EMAIL    → adresse d'expédition Resend (ex : contact@marineetladouceurdelete.com)
 *                            Tant que le domaine n'est pas vérifié, utiliser "onboarding@resend.dev".
 */
export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()

    // Validation simple
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Veuillez remplir tous les champs requis.' },
        { status: 400 }
      )
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Adresse email invalide.' },
        { status: 400 }
      )
    }

    const apiKey = process.env.RESEND_API_KEY
    const to     = process.env.CONTACT_TO_EMAIL
    const from   = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev'

    if (!apiKey || !to) {
      console.error('[contact] RESEND_API_KEY ou CONTACT_TO_EMAIL manquant')
      return NextResponse.json(
        { error: "Le service email n'est pas configuré." },
        { status: 500 }
      )
    }

    const resend = new Resend(apiKey)

    const safeSubject = subject?.toString().slice(0, 120) || 'Nouveau message'
    const cleanName = String(name).slice(0, 80)
    const cleanMessage = String(message).slice(0, 5000)

    const html = `
      <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width:600px; margin:auto; color:#0E4F5E;">
        <div style="background:#0E4F5E; color:white; padding:24px; text-align:center;">
          <h1 style="margin:0; font-weight:300; font-size:22px;">Nouveau message depuis le site</h1>
        </div>
        <div style="padding:24px; background:#FAF5EA;">
          <p style="margin:0 0 8px 0;"><strong>De :</strong> ${escapeHtml(cleanName)} &lt;${escapeHtml(email)}&gt;</p>
          <p style="margin:0 0 16px 0;"><strong>Sujet :</strong> ${escapeHtml(safeSubject)}</p>
          <div style="background:white; padding:16px; border-left:3px solid #D4AF37; white-space:pre-wrap;">
            ${escapeHtml(cleanMessage)}
          </div>
          <p style="margin-top:24px; font-size:12px; color:#6B6B6B;">
            Répondez directement à cet email pour répondre à ${escapeHtml(cleanName)}.
          </p>
        </div>
      </div>
    `

    const result = await resend.emails.send({
      from: `Marine — Site <${from}>`,
      to: [to],
      replyTo: email,                       // ⇒ "Répondre" envoie au visiteur
      subject: `[Contact] ${safeSubject}`,
      html,
    })

    if (result.error) {
      console.error('[contact] Erreur Resend :', JSON.stringify(result.error, null, 2))
      return NextResponse.json(
        {
          error: "Erreur lors de l'envoi du message.",
          detail: result.error.message || String(result.error),
        },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact] Erreur serveur :', err)
    return NextResponse.json(
      { error: 'Erreur serveur.' },
      { status: 500 }
    )
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
