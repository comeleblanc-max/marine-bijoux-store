import { cn } from '@/utils/cn'

interface Props { size?: 'sm' | 'md' | 'lg'; className?: string }

export function LoadingSpinner({ size = 'md', className }: Props) {
  const sizes = { sm: 'w-4 h-4 border-2', md: 'w-8 h-8 border-2', lg: 'w-12 h-12 border-3' }
  return (
    <div className={cn('rounded-full border-gray-200 border-t-[#D4AF37] animate-spin', sizes[size], className)} />
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-[#F5E9D6] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-gray-400">Chargement…</p>
      </div>
    </div>
  )
}
