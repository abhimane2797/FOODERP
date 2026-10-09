import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { clsx } from '../../utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline' | 'warning'
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
  iconRight?: ReactNode
  fullWidth?: boolean
  children?: ReactNode
}

const variants: Record<Variant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-xs',
  secondary: 'bg-surface-100 text-surface-700 hover:bg-surface-200 active:bg-surface-300',
  ghost: 'bg-transparent text-surface-600 hover:bg-surface-100 active:bg-surface-200',
  danger: 'bg-danger-600 text-white hover:bg-danger-700 active:bg-danger-700 shadow-xs',
  success: 'bg-success-600 text-white hover:bg-success-700 active:bg-success-700 shadow-xs',
  outline: 'border border-surface-300 bg-white text-surface-700 hover:bg-surface-50 active:bg-surface-100',
  warning: 'bg-warning-500 text-white hover:bg-warning-600 active:bg-warning-600 shadow-xs',
}

const sizes: Record<Size, string> = {
  xs: 'h-7 px-2 text-xs gap-1 rounded-md',
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-md',
  md: 'h-10 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-11 px-5 text-base gap-2 rounded-lg',
  xl: 'h-12 px-6 text-base gap-2.5 rounded-xl',
}

export function Button({
  variant = 'primary', size = 'md', loading = false,
  icon, iconRight, fullWidth, children, className, disabled, ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:pointer-events-none select-none',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {children}
      {iconRight}
    </button>
  )
}
