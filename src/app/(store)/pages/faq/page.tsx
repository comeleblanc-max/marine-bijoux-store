'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    category: 'Commande & Livraison',
    items: [
      { q: 'Quels sont les délais de livraison ?', a: 'Les commandes sont expédiées sous 2-3 jours ouvrés. La livraison en France prend ensuite 2-5 jours ouvrés selon le transporteur.' },
      { q: 'La livraison est-elle gratuite ?', a: 'La livraison est offerte pour toute commande d\'un montant supérieur à 60€. En dessous, les frais de port s\'élèvent à 4,90€.' },
      { q: 'Puis-je modifier ou annuler ma commande ?', a: 'Vous pouvez modifier ou annuler votre commande dans les 24h suivant la passation. Contactez-nous rapidement par email.' },
    ],
  },
  {
    category: 'Produits & Matières',
    items: [
      { q: 'Vos bijoux sont-ils hypoallergéniques ?', a: 'Oui ! Tous nos bijoux sont en acier inoxydable, argent 925 ou laiton doré, des matières hypoallergéniques adaptées aux peaux sensibles.' },
      { q: 'Vos bijoux résistent-ils à l\'eau ?', a: 'Nos bijoux en acier inoxydable résistent à l\'eau. Nous déconseillons toutefois de porter vos bijoux en argent 925 dans la piscine ou la mer pour préserver leur éclat.' },
      { q: 'Comment entretenir mes bijoux ?', a: 'Évitez le contact avec les parfums, crèmes et produits chimiques. Conservez vos bijoux dans leur pochette. Nettoyez-les délicatement avec un chiffon doux.' },
    ],
  },
  {
    category: 'Retours & Remboursements',
    items: [
      { q: 'Puis-je retourner un article ?', a: 'Oui, vous disposez de 14 jours à compter de la réception pour retourner un article non porté dans son emballage d\'origine. Les retours sont gratuits.' },
      { q: 'Comment procéder à un retour ?', a: 'Contactez-nous par email avec votre numéro de commande. Nous vous enverrons l\'étiquette de retour gratuite.' },
      { q: 'Dans quel délai suis-je remboursée ?', a: 'Le remboursement est effectué sous 5-7 jours ouvrés après réception et vérification de l\'article.' },
    ],
  },
]

export default function FaqPage() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#F5F1ED] py-20 px-4 text-center">
        <h1 className="text-4xl font-light text-[#1A3A52]" style={{ fontFamily: 'var(--font-playfair)' }}>
          Questions fréquentes
        </h1>
        <p className="text-gray-500 mt-3">Tout ce que vous devez savoir sur nos bijoux et votre commande.</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-16 space-y-10">
        {FAQS.map((section) => (
          <div key={section.category}>
            <h2 className="text-sm font-semibold text-[#C9A84C] uppercase tracking-widest mb-4">
              {section.category}
            </h2>
            <div className="space-y-2">
              {section.items.map((item) => (
                <div key={item.q} className="border border-gray-100 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpen(open === item.q ? null : item.q)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#F5F1ED] transition-colors"
                  >
                    <span className="font-medium text-[#1A3A52] text-sm pr-4">{item.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#C9A84C] flex-shrink-0 transition-transform ${open === item.q ? 'rotate-180' : ''}`} />
                  </button>
                  {open === item.q && (
                    <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                      <p className="pt-3">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
