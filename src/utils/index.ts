// ─── Currency & Number ─────────────────────────────────────────────
export const formatCurrency = (amount: number): string => {
  return '₹' + amount.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

export const formatNumber = (n: number): string => n.toLocaleString('en-IN')

export const formatCompact = (n: number): string => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`
  return `₹${n}`
}

export const formatPercent = (n: number): string => `${n > 0 ? '+' : ''}${n.toFixed(1)}%`

// ─── Date ──────────────────────────────────────────────────────────
export const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const formatTime = (dateStr: string): string => {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
}

export const formatDateTime = (dateStr: string): string => `${formatDate(dateStr)} · ${formatTime(dateStr)}`

export const getRelativeTime = (dateStr: string): string => {
  const now = new Date()
  const d = new Date(dateStr)
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin} min ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr} hr ago`
  const diffDays = Math.floor(diffHr / 24)
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
}

// ─── Labels ────────────────────────────────────────────────────────
export const statusLabels: Record<string, string> = {
  'new': 'New', 'preparing': 'Preparing', 'ready': 'Ready', 'served': 'Served',
  'completed': 'Completed', 'cancelled': 'Cancelled', 'billing': 'Billing',
  'available': 'Available', 'occupied': 'Occupied', 'reserved': 'Reserved',
  'paid': 'Paid', 'pending': 'Pending', 'partial': 'Partial', 'refunded': 'Refunded',
  'in-stock': 'In Stock', 'low-stock': 'Low Stock', 'out-of-stock': 'Out of Stock',
  'active': 'Active', 'inactive': 'Inactive', 'vip': 'VIP', 'on-leave': 'On Leave',
  'draft': 'Draft', 'sent': 'Sent', 'received': 'Received',
  'approved': 'Approved', 'rejected': 'Rejected',
  'dine-in': 'Dine-In', 'takeaway': 'Takeaway', 'delivery': 'Delivery', 'qr': 'QR Order', 'online': 'Online',
  'present': 'Present', 'absent': 'Absent', 'late': 'Late', 'leave': 'Leave',
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed': case 'paid': case 'available': case 'in-stock': case 'active': case 'approved': case 'present': case 'received':
      return 'bg-success-50 text-success-700 ring-success-600/20'
    case 'preparing': case 'occupied': case 'low-stock': case 'partial': case 'late': case 'pending': case 'sent':
      return 'bg-warning-50 text-warning-700 ring-warning-600/20'
    case 'new': case 'ready': case 'reserved': case 'billing':
      return 'bg-info-50 text-info-700 ring-info-600/20'
    case 'cancelled': case 'out-of-stock': case 'inactive': case 'rejected': case 'absent': case 'refunded':
      return 'bg-danger-50 text-danger-700 ring-danger-600/20'
    case 'served': case 'draft': case 'on-leave': case 'leave': case 'unpaid':
      return 'bg-surface-100 text-surface-600 ring-surface-500/20'
    case 'vip':
      return 'bg-purple-50 text-purple-700 ring-purple-600/20'
    default:
      return 'bg-surface-100 text-surface-600 ring-surface-500/20'
  }
}

export const getOrderTypeColor = (type: string): string => {
  switch (type) {
    case 'dine-in': return 'bg-blue-50 text-blue-700 ring-blue-600/20'
    case 'takeaway': return 'bg-amber-50 text-amber-700 ring-amber-600/20'
    case 'delivery': return 'bg-purple-50 text-purple-700 ring-purple-600/20'
    case 'qr': return 'bg-teal-50 text-teal-700 ring-teal-600/20'
    case 'online': return 'bg-rose-50 text-rose-700 ring-rose-600/20'
    default: return 'bg-surface-100 text-surface-600 ring-surface-500/20'
  }
}

export const getPriorityColor = (p: string): string => {
  switch (p) {
    case 'urgent': return 'bg-danger-500'
    case 'high': return 'bg-warning-500'
    case 'normal': return 'bg-info-500'
    case 'low': return 'bg-surface-400'
    default: return 'bg-surface-400'
  }
}

// ─── Misc ──────────────────────────────────────────────────────────
export const clsx = (...classes: (string | false | null | undefined)[]): string =>
  classes.filter(Boolean).join(' ')

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const generateId = (): string => Math.random().toString(36).substring(2, 11)
