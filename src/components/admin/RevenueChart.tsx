'use client'

import { motion } from 'framer-motion'
import { useMemo } from 'react'

interface Props {
  data: Array<{ date: string; total: number }>
}

/**
 * Petit graphique en barres SVG, ultra léger (pas de lib externe).
 * Affiche le CA jour par jour sur 30 jours.
 */
export function RevenueChart({ data }: Props) {
  const max  = useMemo(() => Math.max(1, ...data.map((d) => d.total)), [data])
  const total = data.reduce((s, d) => s + d.total, 0)
  const avg   = data.length ? total / data.length : 0

  if (data.every((d) => d.total === 0)) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-400">
          Aucune commande sur les 30 derniers jours.
        </p>
        <p className="text-xs text-gray-300 mt-1">Les ventes apparaîtront ici dès qu&apos;il y en aura.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Légende */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4 text-xs">
        <div>
          <span className="text-gray-400">Total période :</span>
          <span className="font-semibold text-[#0E4F5E] ml-1.5">
            {total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
          </span>
        </div>
        <div>
          <span className="text-gray-400">Moyenne / jour :</span>
          <span className="font-semibold text-[#0E4F5E] ml-1.5">
            {avg.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
          </span>
        </div>
        <div>
          <span className="text-gray-400">Jour record :</span>
          <span className="font-semibold text-[#0E4F5E] ml-1.5">
            {max.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
          </span>
        </div>
      </div>

      {/* Barres */}
      <div className="flex items-end gap-0.5 h-32 sm:h-40 relative">
        {data.map((d, i) => {
          const ratio = d.total / max
          const height = ratio * 100
          return (
            <div key={d.date} className="flex-1 flex flex-col items-center justify-end group relative">
              {/* Tooltip */}
              {d.total > 0 && (
                <div className="absolute -top-9 bg-[#0E4F5E] text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity z-10">
                  {new Date(d.date).toLocaleDateString('fr-FR', { day:'numeric', month:'short' })} : {d.total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€
                </div>
              )}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(2, height)}%` }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.015 }}
                className={`w-full ${d.total > 0 ? 'bg-gradient-to-t from-[#24BBD0] to-[#A7D5E6]' : 'bg-gray-100'} rounded-t hover:from-[#D4AF37] hover:to-[#f0d77a] transition-colors`}
                title={`${d.date} : ${d.total}€`}
              />
            </div>
          )
        })}
      </div>

      {/* Axe X */}
      <div className="flex justify-between mt-2 text-[10px] text-gray-400 px-1">
        <span>
          {new Date(data[0]?.date).toLocaleDateString('fr-FR', { day:'numeric', month:'short' })}
        </span>
        <span>Aujourd&apos;hui</span>
      </div>
    </div>
  )
}
