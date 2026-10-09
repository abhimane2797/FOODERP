import { type ReactNode } from 'react'
import { clsx, getStatusColor, statusLabels } from '../../utils'
import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useClickOutside } from '../../hooks'

// Re-export form components and Button
export { Button } from './Button'
export { Input, Textarea, Select, Toggle, Checkbox, SearchInput } from './Form'
export { DataTable } from './DataTable'
export type { Column } from './DataTable'
export { Toaster } from './Toaster'

// ─── Badge ─────────────────────────────────────────────────────────
interface BadgeProps {
  children: ReactNode
  variant?: 'status' | 'type' | 'default' | 'outline'
  color?: string
  size?: 'sm' | 'md'
  dot?: boolean
  className?: string
}

export function Badge({ children, variant = 'default', color, size = 'md', dot, className }: BadgeProps) {
  const base = 'inline-flex items-center font-medium ring-1 ring-inset whitespace-nowrap'
  const sizes = { sm: 'px-1.5 py-0.5 text-[11px]', md: 'px-2 py-1 text-xs' }

  if (variant === 'status' || variant === 'type') {
    return (
      <span className={clsx(base, sizes[size], color || getStatusColor(String(children)), 'rounded-md', className)}>
        {dot && <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-60" />}
        {statusLabels[String(children)] || children}
      </span>
    )
  }
  if (variant === 'outline') {
    return (
      <span className={clsx(base, sizes[size], 'rounded-md border border-surface-300 text-surface-600 bg-white', className)}>
        {children}
      </span>
    )
  }
  return (
    <span className={clsx(base, sizes[size], 'rounded-md bg-surface-100 text-surface-700', className)}>
      {children}
    </span>
  )
}

// ─── Card ──────────────────────────────────────────────────────────
interface CardProps {
  children: ReactNode
  className?: string
  padding?: boolean
  hover?: boolean
  onClick?: () => void
}

export function Card({ children, className, padding = true, hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-xl border border-surface-200 shadow-xs',
        padding && 'p-5',
        hover && 'hover:shadow-md hover:border-surface-300 transition-all duration-200 cursor-pointer',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  )
}

// ─── Section Header ────────────────────────────────────────────────
interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
}

export function SectionHeader({ title, subtitle, action, className }: SectionHeaderProps) {
  return (
    <div className={clsx('flex items-center justify-between', className)}>
      <div>
        <h2 className="text-base font-semibold text-surface-900">{title}</h2>
        {subtitle && <p className="text-sm text-surface-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// ─── Modal ─────────────────────────────────────────────────────────
interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  footer?: ReactNode
}

export function Modal({ open, onClose, title, children, size = 'md', footer }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null)
  useClickOutside(ref, onClose)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const sizes = {
    sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl',
    xl: 'max-w-4xl', '2xl': 'max-w-6xl', full: 'max-w-[95vw]',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-surface-950/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div
        ref={ref}
        className={clsx(
          'relative w-full bg-white rounded-2xl shadow-xl animate-scale-in max-h-[90vh] flex flex-col',
          sizes[size],
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 shrink-0">
            <h3 className="text-lg font-semibold text-surface-900">{title}</h3>
            <button onClick={onClose} className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-surface-200 flex items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Drawer ────────────────────────────────────────────────────────
interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Drawer({ open, onClose, title, children, size = 'md' }: DrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl' }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-surface-950/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={clsx(
        'absolute right-0 top-0 bottom-0 w-full bg-white shadow-xl animate-slide-in-right flex flex-col',
        sizes[size],
      )}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 shrink-0">
          <h3 className="text-lg font-semibold text-surface-900">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

// ─── Confirm Dialog ────────────────────────────────────────────────
interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'primary'
  loading?: boolean
}

export function ConfirmDialog({
  open, onClose, onConfirm, title, message,
  confirmLabel = 'Confirm', cancelLabel = 'Cancel', variant = 'primary', loading,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} size="sm" title={title}>
      <p className="text-sm text-surface-600 leading-relaxed">{message}</p>
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onClose}
          className="h-10 px-4 rounded-lg text-sm font-medium text-surface-700 bg-surface-100 hover:bg-surface-200 transition-colors"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={clsx(
            'h-10 px-4 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50',
            variant === 'danger' ? 'bg-danger-600 hover:bg-danger-700' : 'bg-primary-600 hover:bg-primary-700',
          )}
        >
          {loading ? 'Processing...' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}

// ─── Tabs ──────────────────────────────────────────────────────────
interface TabsProps {
  tabs: { id: string; label: string; count?: number }[]
  active: string
  onChange: (id: string) => void
  className?: string
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div className={clsx('flex items-center gap-1 border-b border-surface-200 overflow-x-auto no-scrollbar', className)}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors duration-150',
            active === tab.id
              ? 'border-primary-600 text-primary-700'
              : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300',
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={clsx(
              'ml-1.5 px-1.5 py-0.5 text-[11px] rounded-full',
              active === tab.id ? 'bg-primary-100 text-primary-700' : 'bg-surface-100 text-surface-500',
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

// ─── Pagination ────────────────────────────────────────────────────
interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  total?: number
}

export function Pagination({ page, totalPages, onPageChange, total }: PaginationProps) {
  return (
    <div className="flex items-center justify-between px-1 py-3">
      {total !== undefined && (
        <p className="text-sm text-surface-500">
          Showing page {page} of {totalPages} · {total} total
        </p>
      )}
      <div className="flex items-center gap-1 ml-auto">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="h-8 px-3 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="h-8 px-3 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}

// ─── Dropdown ──────────────────────────────────────────────────────
interface DropdownProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'left' | 'right'
  className?: string
}

export function Dropdown({ trigger, children, align = 'right', className }: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  useClickOutside(ref, () => setOpen(false))

  return (
    <div ref={ref} className={clsx('relative', className)}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={clsx(
            'absolute z-40 mt-1 min-w-[200px] bg-white rounded-xl border border-surface-200 shadow-lg py-1 animate-scale-in',
            align === 'right' ? 'right-0' : 'left-0',
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export function DropdownItem({ children, onClick, icon, danger }: {
  children: ReactNode; onClick?: () => void; icon?: ReactNode; danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors',
        danger ? 'text-danger-600 hover:bg-danger-50' : 'text-surface-700 hover:bg-surface-50',
      )}
    >
      {icon}
      {children}
    </button>
  )
}

// ─── Empty State ───────────────────────────────────────────────────
interface EmptyStateProps {
  icon?: ReactNode
  title: string
  message?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, message, action, className }: EmptyStateProps) {
  return (
    <div className={clsx('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mb-4 text-surface-400">
        {icon || (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4m16 0h-3.5l-2 3h-5l-2-3H4" />
          </svg>
        )}
      </div>
      <h3 className="text-sm font-semibold text-surface-900">{title}</h3>
      {message && <p className="text-sm text-surface-500 mt-1 max-w-sm">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// ─── Loading State ─────────────────────────────────────────────────
export function LoadingState({ className }: { className?: string }) {
  return (
    <div className={clsx('flex flex-col items-center justify-center py-16', className)}>
      <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      <p className="text-sm text-surface-500 mt-3">Loading...</p>
    </div>
  )
}

// ─── Skeleton ──────────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={clsx(
      'rounded-lg bg-gradient-to-r from-surface-100 via-surface-200 to-surface-100 bg-[length:200%_100%] animate-shimmer',
      className,
    )} />
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}

// ─── Avatar ────────────────────────────────────────────────────────
interface AvatarProps {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  const sizes = { xs: 'w-6 h-6 text-[10px]', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' }
  const colors = ['bg-primary-100 text-primary-700', 'bg-blue-100 text-blue-700', 'bg-amber-100 text-amber-700', 'bg-purple-100 text-purple-700', 'bg-rose-100 text-rose-700']
  const color = colors[name.charCodeAt(0) % colors.length]
  return (
    <div className={clsx('rounded-full flex items-center justify-center font-semibold shrink-0', sizes[size], color, className)}>
      {name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
    </div>
  )
}

// ─── Stat Card ─────────────────────────────────────────────────────
interface StatCardProps {
  title: string
  value: string
  change?: number
  icon?: ReactNode
  iconBg?: string
  className?: string
}

export function StatCard({ title, value, change, icon, iconBg, className }: StatCardProps) {
  return (
    <Card className={className}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-surface-500 truncate">{title}</p>
          <p className="text-2xl font-bold text-surface-900 mt-1.5 tracking-tight">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <span className={clsx(
                'text-xs font-semibold',
                change >= 0 ? 'text-success-600' : 'text-danger-600',
              )}>
                {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
              </span>
              <span className="text-xs text-surface-400">vs last period</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={clsx('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', iconBg || 'bg-primary-50 text-primary-600')}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
