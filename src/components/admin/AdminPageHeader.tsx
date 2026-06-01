import type { ReactNode } from 'react'

/**
 * En-tête de page admin partagé — titre + sous-titre + slot d'actions à droite.
 * Utilisé sur toutes les pages pour une présentation homogène.
 */
export function AdminPageHeader({
  title,
  subtitle,
  children,
}: {
  title:     string
  subtitle?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
      <div>
        <h1
          className="text-xl sm:text-2xl font-bold text-gray-900"
          style={{ fontFamily: 'var(--font-playfair)' }}
        >
          {title}
        </h1>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2 flex-shrink-0">{children}</div>}
    </div>
  )
}
