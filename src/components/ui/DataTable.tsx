import { type ReactNode } from 'react'
import { clsx } from '../../utils'

export interface Column<T> {
  key: string
  header: string
  render?: (row: T) => ReactNode
  className?: string
  headerClassName?: string
  align?: 'left' | 'center' | 'right'
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (row: T) => void
  emptyMessage?: string
  className?: string
  rowKey: (row: T) => string
}

export function DataTable<T>({ columns, data, onRowClick, emptyMessage = 'No data found', className, rowKey }: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className={clsx('bg-white rounded-xl border border-surface-200', className)}>
        <div className="py-16 text-center text-sm text-surface-500">{emptyMessage}</div>
      </div>
    )
  }

  return (
    <div className={clsx('bg-white rounded-xl border border-surface-200 overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-200 bg-surface-50/80">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={clsx(
                    'px-4 py-3 text-xs font-semibold text-surface-500 uppercase tracking-wider whitespace-nowrap',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    !col.align && 'text-left',
                    col.headerClassName,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {data.map(row => (
              <tr
                key={rowKey(row)}
                onClick={() => onRowClick?.(row)}
                className={clsx(
                  'transition-colors',
                  onRowClick && 'cursor-pointer hover:bg-surface-50',
                )}
              >
                {columns.map(col => (
                  <td
                    key={col.key}
                    className={clsx(
                      'px-4 py-3.5 text-surface-700 whitespace-nowrap',
                      col.align === 'center' && 'text-center',
                      col.align === 'right' && 'text-right',
                      col.className,
                    )}
                  >
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
