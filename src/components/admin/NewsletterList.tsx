'use client'

import { useState } from 'react'
import { Copy, Check, Mail } from 'lucide-react'

interface Sub { email: string; createdAt: string }

export function NewsletterList({ subscribers }: { subscribers: Sub[] }) {
  const [copied, setCopied] = useState(false)

  function copyAll() {
    const all = subscribers.map((s) => s.email).join(', ')
    navigator.clipboard.writeText(all).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  if (subscribers.length === 0) {
    return (
      <div className="admin-card p-12 text-center">
        <Mail className="w-10 h-10 mx-auto mb-3 text-gray-200" strokeWidth={1.2} />
        <p className="text-gray-400">Pas encore d&apos;inscrite à la newsletter.</p>
        <p className="text-xs text-gray-300 mt-1">Les emails collectés sur le site apparaîtront ici.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs text-gray-500">
          Copie tous les emails pour les coller dans ta plateforme d&apos;envoi (ou en Cci d&apos;un email).
        </p>
        <button
          onClick={copyAll}
          className="inline-flex items-center gap-2 bg-[#24BBD0] hover:bg-[#1A9AAD] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copié ✓' : 'Copier tous les emails'}
        </button>
      </div>

      <div className="admin-card overflow-x-auto">
        <table className="w-full text-sm min-w-[420px]">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Inscription</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subscribers.map((s) => (
              <tr key={s.email} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 text-gray-800">{s.email}</td>
                <td className="px-6 py-3 text-gray-400 text-xs">
                  {new Date(s.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
