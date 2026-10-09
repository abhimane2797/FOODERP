import { useToast } from '../../hooks/useToast'
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { clsx } from '../../utils'

const icons = {
  success: <CheckCircle2 className="w-5 h-5 text-success-500" />,
  error: <AlertCircle className="w-5 h-5 text-danger-500" />,
  info: <Info className="w-5 h-5 text-info-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-warning-500" />,
}

const borders = {
  success: 'border-l-success-500',
  error: 'border-l-danger-500',
  info: 'border-l-info-500',
  warning: 'border-l-warning-500',
}

export function Toaster() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={clsx(
            'pointer-events-auto flex items-start gap-3 p-4 bg-white rounded-xl border border-surface-200 border-l-4 shadow-lg animate-slide-in-right',
            borders[toast.type],
          )}
        >
          <div className="shrink-0 mt-0.5">{icons[toast.type]}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-surface-900">{toast.title}</p>
            {toast.message && <p className="text-sm text-surface-500 mt-0.5">{toast.message}</p>}
          </div>
          <button onClick={() => removeToast(toast.id)} className="shrink-0 p-0.5 rounded text-surface-400 hover:text-surface-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
