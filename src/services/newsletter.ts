export async function subscribeToNewsletter(email: string): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    return { ok: res.ok, message: data.message || (res.ok ? 'Inscription réussie !' : 'Erreur') }
  } catch {
    return { ok: false, message: 'Erreur réseau. Réessayez.' }
  }
}
