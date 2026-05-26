import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

interface Crumb { label: string; href?: string }
interface Props { crumbs: Crumb[]; className?: string }

export function Breadcrumb({ crumbs, className }: Props) {
  return (
    <nav aria-label="breadcrumb" className={cn('flex items-center gap-1 text-sm text-gray-500', className)}>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-300" />}
          {crumb.href && i < crumbs.length - 1 ? (
            <Link href={crumb.href} className="hover:text-[#1F3A56] transition-colors">{crumb.label}</Link>
          ) : (
            <span className={i === crumbs.length - 1 ? 'text-[#1F3A56] font-medium' : ''}>{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
