'use client'

import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed',
          {
            'bg-[#C9A84C] text-white hover:bg-[#b8963e] shadow-md hover:shadow-lg active:scale-95':
              variant === 'primary',
            'bg-white text-[#C9A84C] border border-[#C9A84C] hover:bg-[#C9A84C] hover:text-white':
              variant === 'secondary',
            'bg-transparent text-[#1A3A52] hover:text-[#C9A84C] underline-offset-4 hover:underline':
              variant === 'ghost',
            'border border-[#1A3A52] text-[#1A3A52] hover:bg-[#1A3A52] hover:text-white':
              variant === 'outline',
          },
          {
            'px-4 py-2 text-sm rounded-md': size === 'sm',
            'px-6 py-3 text-base rounded-lg': size === 'md',
            'px-8 py-4 text-lg rounded-xl': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
