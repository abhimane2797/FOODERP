import { useState, useMemo, useCallback } from 'react'
import {
  QrCode, RefreshCw, Eye, EyeOff, Smartphone, DollarSign,
  ShoppingCart, Table2, Link2, Copy, Check,
} from 'lucide-react'
import { Badge, Button, Card, StatCard, Modal, Tabs } from '../../components/ui'
import { useToast } from '../../hooks/useToast'
import { QRCodeDisplay } from '../../components/qr/QRCodeDisplay'
import { useApi } from '../../hooks'
import { tableService } from '../../services/tableService'
import { getQRRestaurant, getQRTable, type QRTable } from '../../mock/mockQR'
import { getQRMenuUrl } from '../../utils/qr'
import { formatCurrency, clsx } from '../../utils'
import type { RestaurantTable } from '../../types'

const RESTAURANT_ID = 'demo-restaurant'

/** Map an admin-side table (tbl-12) onto a QR table id (table-12). */
function toQRTableId(adminId: string): string {
  const n = adminId.replace(/^tbl-?/, '')
  return `table-${n.replace(/^0/, '')}`
}

export function QROrderingPage() {
  const { data: tables } = useApi<RestaurantTable[]>(() => tableService.getTables())
  const [floor, setFloor] = useState('all')
  const [selected, setSelected] = useState<QRTable | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const { addToast } = useToast()
  const [qrEnabled, setQrEnabled] = useState<Record<string, boolean>>({})

  const restaurant = getQRRestaurant(RESTAURANT_ID)

  const qrTables = useMemo<QRTable[]>(() => {
    return (tables || []).map(t => {
      const qrId = toQRTableId(t.id)
      const resolved = getQRTable(RESTAURANT_ID, qrId)
      return { ...resolved, qrActive: qrEnabled[qrId] ?? resolved.qrActive, floor: t.floor }
    })
  }, [tables, qrEnabled])

  const filtered = useMemo(() => {
    if (floor === 'all') return qrTables
    return qrTables.filter(t => t.floor === floor)
  }, [qrTables, floor])

  const activeCount = qrTables.filter(t => t.qrActive).length

  const stats = {
    totalQR: activeCount,
    todayQR: 30,
    qrRevenue: 18450,
    activeTables: activeCount,
  }

  const toggleQR = (table: QRTable) => {
    const next = !table.qrActive
    setQrEnabled(prev => ({ ...prev, [table.id]: next }))
    addToast({
      type: next ? 'success' : 'info',
      title: next ? 'QR Enabled' : 'QR Disabled',
      message: `${table.label} QR ordering ${next ? 'activated' : 'deactivated'}`,
    })
  }

  const copyUrl = useCallback(async (table: QRTable) => {
    const url = getQRMenuUrl(RESTAURANT_ID, table.id)
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(table.id)
      setTimeout(() => setCopiedId(null), 2000)
      addToast({ type: 'success', title: 'Link Copied', message: url })
    } catch {
      addToast({ type: 'error', title: 'Copy Failed', message: url })
    }
  }, [addToast])

  const regenerate = (table: QRTable) => {
    addToast({ type: 'info', title: 'QR Regenerated', message: `New QR code generated for ${table.label}` })
  }

  const printAll = () => {
    addToast({ type: 'success', title: 'QR Codes Queued', message: 'All active QR codes sent to printer' })
  }

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">QR Ordering</h1>
          <p className="text-sm text-surface-500 mt-0.5">
            Real, scannable QR codes — one per table, unique URLs
          </p>
        </div>
        <Button variant="outline" icon={<RefreshCw className="w-4 h-4" />} onClick={printAll}>
          Print All QR
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total QR Tables" value={String(stats.totalQR)} icon={<QrCode className="w-5 h-5" />} iconBg="bg-primary-50 text-primary-600" />
        <StatCard title="Today's QR Orders" value={String(stats.todayQR)} icon={<ShoppingCart className="w-5 h-5" />} iconBg="bg-blue-50 text-blue-600" />
        <StatCard title="QR Revenue Today" value={formatCurrency(stats.qrRevenue)} icon={<DollarSign className="w-5 h-5" />} iconBg="bg-success-50 text-success-600" />
        <StatCard title="Active Tables" value={String(stats.activeTables)} icon={<Table2 className="w-5 h-5" />} iconBg="bg-purple-50 text-purple-600" />
      </div>

      <Tabs
        tabs={[
          { id: 'all', label: 'All Tables', count: qrTables.length },
          { id: 'Floor 1', label: 'Floor 1' },
          { id: 'Floor 2', label: 'Floor 2' },
          { id: 'Outdoor', label: 'Outdoor' },
        ]}
        active={floor}
        onChange={setFloor}
      />

      {/* QR Table Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filtered.map(table => {
          const url = getQRMenuUrl(RESTAURANT_ID, table.id)
          return (
            <Card key={table.id} padding={false} className={clsx('overflow-hidden text-center transition-all', !table.qrActive && 'opacity-70')}>
              {/* QR symbol */}
              <div className="p-3 bg-white flex justify-center">
                <QRCodeDisplay value={url} size={104} />
              </div>

              {/* Info */}
              <div className="px-3 pb-3 -mt-1">
                <p className="text-sm font-bold text-surface-900">{table.label}</p>
                <p className="text-xs text-surface-500">{table.seats} seats · {table.floor}</p>
                <div className="mt-2">
                  <Badge variant="status" size="sm">{table.qrActive ? 'active' : 'inactive'}</Badge>
                </div>

                {/* URL row with copy */}
                <button
                  onClick={() => copyUrl(table)}
                  className="mt-2 w-full flex items-center justify-center gap-1 text-[10px] font-mono text-surface-400 hover:text-primary-600 transition-colors truncate"
                  title={url}
                >
                  {copiedId === table.id ? <Check className="w-3 h-3 text-success-500" /> : <Link2 className="w-3 h-3" />}
                  <span className="truncate">/qr/{RESTAURANT_ID}/{table.id}</span>
                </button>

                {/* Actions */}
                <div className="flex items-center justify-center gap-1 mt-2">
                  <button
                    onClick={() => setSelected(table)}
                    className="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    title="View QR"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => copyUrl(table)}
                    className="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    title="Copy link"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => regenerate(table)}
                    className="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    title="Regenerate"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleQR(table)}
                    className={clsx(
                      'p-1.5 rounded-lg transition-colors',
                      table.qrActive
                        ? 'text-danger-500 hover:bg-danger-50'
                        : 'text-success-500 hover:bg-success-50',
                    )}
                    title={table.qrActive ? 'Disable' : 'Enable'}
                  >
                    {table.qrActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Full-screen QR modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `${restaurant.name} — ${selected.label}` : ''}
        size="sm"
      >
        {selected && (
          <div className="flex flex-col items-center gap-4 py-2">
            <p className="text-sm text-surface-500">Scan with any phone camera to open the menu</p>
            <QRCodeDisplay
              value={getQRMenuUrl(RESTAURANT_ID, selected.id)}
              size={240}
              caption={selected.label}
              subcaption={restaurant.name}
              showActions
            />
            <a
              href={getQRMenuUrl(RESTAURANT_ID, selected.id)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              <Smartphone className="w-4 h-4" />
              Open customer menu in a new tab
            </a>
          </div>
        )}
      </Modal>
    </div>
  )
}
