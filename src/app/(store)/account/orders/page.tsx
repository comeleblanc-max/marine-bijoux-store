import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { Package, ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  PENDING:    { label: 'En attente',     color: 'bg-gray-100   text-gray-700' },
  CONFIRMED:  { label: 'Confirmée',      color: 'bg-blue-100   text-blue-700' },
  PROCESSING: { label: 'En préparation', color: 'bg-amber-100  text-amber-700' },
  SHIPPED:    { label: 'Expédiée',       color: 'bg-purple-100 text-purple-700' },
  DELIVERED:  { label: 'Livrée',         color: 'bg-green-100  text-green-700' },
  CANCELLED:  { label: 'Annulée',        color: 'bg-red-100    text-red-700' },
  REFUNDED:   { label: 'Remboursée',     color: 'bg-orange-100 text-orange-700' },
}

export default async function ClientOrdersPage() {
  const session = await auth()
  if (!session?.user) redirect('/account?callbackUrl=/account/orders')
  const userId = (session.user as { id?: string }).id

  /* Récupère les commandes du user, OU celles dont l'email match (achat invité) */
  const orders = await db.order.findMany({
    where: {
      OR: [
        userId        ? { userId: userId }      : { id: '__never__' },
        session.user.email ? { email: session.user.email } : { id: '__never__' },
      ],
    },
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  })

  return (
    <div className="min-h-screen bg-[#FAF5EA] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/account" className="text-xs text-gray-500 hover:text-[#24BBD0] transition-colors">
            ← Retour à mon compte
          </Link>
          <h1
            className="text-3xl sm:text-4xl text-[#24BBD0] font-light mt-3"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Mes commandes
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {orders.length === 0
              ? "Vous n'avez pas encore passé de commande."
              : `${orders.length} commande${orders.length > 1 ? 's' : ''}`}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 mb-6">Vous n&apos;avez pas encore passé de commande.</p>
            <Link href="/collections/all" className="btn-primary">
              Découvrir les bijoux
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => {
              const badge = STATUS_BADGE[o.status] ?? { label: o.status, color: 'bg-gray-100 text-gray-700' }
              return (
                <div key={o.id} className="bg-white rounded-2xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Commande</p>
                      <p className="font-mono font-semibold text-[#24BBD0]">#{o.id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Passée le {new Date(o.createdAt).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${badge.color}`}>
                        {badge.label}
                      </span>
                      <p className="text-lg font-semibold text-[#24BBD0] mt-2">{Number(o.total).toFixed(2)} €</p>
                    </div>
                  </div>

                  {/* Articles */}
                  <div className="border-t border-gray-100 pt-4 space-y-2">
                    {o.items.map((it) => (
                      <p key={it.id} className="text-sm text-gray-700">
                        • {it.name} × {it.quantity}
                      </p>
                    ))}
                  </div>

                  {/* Suivi si expédiée */}
                  {o.trackingNumber && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">📦 Suivi de livraison</p>
                      <p className="font-mono text-sm text-[#24BBD0]">{o.trackingNumber}</p>
                      {o.trackingCarrier && (
                        <p className="text-xs text-gray-400 mt-1">
                          via {o.trackingCarrier.charAt(0).toUpperCase() + o.trackingCarrier.slice(1)}
                        </p>
                      )}
                      <TrackingLink carrier={o.trackingCarrier} number={o.trackingNumber} />
                    </div>
                  )}

                  {/* Adresse */}
                  <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                    <p className="font-medium text-gray-600 mb-1">Adresse de livraison</p>
                    <p>{o.shippingName}</p>
                    <p>{o.shippingAddress}</p>
                    <p>{o.shippingZip} {o.shippingCity}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function TrackingLink({ carrier, number }: { carrier: string | null; number: string }) {
  if (!carrier) return null
  const urls: Record<string, string> = {
    colissimo:    `https://www.laposte.fr/outils/suivre-vos-envois?code=${encodeURIComponent(number)}`,
    laposte:      `https://www.laposte.fr/outils/suivre-vos-envois?code=${encodeURIComponent(number)}`,
    mondialrelay: `https://www.mondialrelay.fr/suivi-de-colis?numeroExpedition=${encodeURIComponent(number)}`,
    chronopost:   `https://www.chronopost.fr/tracking-no-cms/suivi-page?listeNumerosLT=${encodeURIComponent(number)}`,
  }
  const url = urls[carrier]
  if (!url) return null
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 mt-2 text-xs text-[#24BBD0] hover:text-[#24BBD0] underline"
    >
      Suivre mon colis <ChevronRight className="w-3 h-3" />
    </a>
  )
}
