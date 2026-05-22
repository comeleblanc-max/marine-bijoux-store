import type { LucideIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

interface Props {
  icon: LucideIcon
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, children, className }: Props) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 py-16 text-center', className)}>
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
        <Icon className="w-10 h-10 text-gray-300" />
      </div>
      <div>
        <p className="font-medium text-gray-600">{title}</p>
        {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
      </div>
      {children}
    </div>
  )
}
