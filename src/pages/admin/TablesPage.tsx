import { useState, useMemo } from 'react'
import { Plus, ArrowRightLeft, CalendarCheck, LayoutGrid, Users, Receipt } from 'lucide-react'
import { Button, Badge, Modal, Card, Tabs, Select, Input } from '../../components/ui'
import { useApi } from '../../hooks'
import { useToast } from '../../hooks/useToast'
import { tableService } from '../../services/tableService'
import { mockFloors } from '../../mock/mockTables'
import type { RestaurantTable, TableStatus } from '../../types'
import { formatCurrency, clsx } from '../../utils'

const statusConfig: Record<TableStatus, { label: string; bg: string; border: string; text: string }> = {
  available: { label: 'Available', bg: 'bg-success-50', border: 'border-success-200 hover:border-success-400', text: 'text-success-700' },
  occupied: { label: 'Occupied', bg: 'bg-danger-50', border: 'border-danger-200 hover:border-danger-400', text: 'text-danger-700' },
  reserved: { label: 'Reserved', bg: 'bg-info-50', border: 'border-info-200 hover:border-info-400', text: 'text-info-700' },
  billing: { label: 'Billing', bg: 'bg-warning-50', border: 'border-warning-200 hover:border-warning-400', text: 'text-warning-700' },
}

export function TablesPage() {
  const { data: tables } = useApi<RestaurantTable[]>(() => tableService.getTables())
  const [floor, setFloor] = useState('Floor 1')
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null)
  const [showAddTable, setShowAddTable] = useState(false)
  const [showReserve, setShowReserve] = useState(false)
  const { addToast } = useToast()

  const floorTables = useMemo(() => (tables || []).filter(t => t.floor === floor), [tables, floor])

  const counts = useMemo(() => {
    const all = tables || []
    return {
      total: all.length,
      available: all.filter(t => t.status === 'available').length,
      occupied: all.filter(t => t.status === 'occupied').length,
      reserved: all.filter(t => t.status === 'reserved').length,
      billing: all.filter(t => t.status === 'billing').length,
    }
  }, [tables])

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Table Management</h1>
          <p className="text-sm text-surface-500 mt-0.5">Visual floor plan and table status</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<ArrowRightLeft className="w-4 h-4" />}>Merge</Button>
          <Button variant="outline" size="sm" icon={<CalendarCheck className="w-4 h-4" />} onClick={() => setShowReserve(true)}>Reserve</Button>
          <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddTable(true)}>Add Table</Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total Tables', value: counts.total, color: 'text-surface-900' },
          { label: 'Available', value: counts.available, color: 'text-success-600' },
          { label: 'Occupied', value: counts.occupied, color: 'text-danger-600' },
          { label: 'Reserved', value: counts.reserved, color: 'text-info-600' },
          { label: 'Billing', value: counts.billing, color: 'text-warning-600' },
        ].map(s => (
          <Card key={s.label} padding className="text-center">
            <p className={clsx('text-2xl font-bold', s.color)}>{s.value}</p>
            <p className="text-xs text-surface-500 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Floor tabs */}
      <Tabs
        tabs={mockFloors.map(f => ({ id: f, label: f, count: (tables || []).filter(t => t.floor === f).length }))}
        active={floor}
        onChange={setFloor}
      />

      {/* Table Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {floorTables.map(table => {
          const config = statusConfig[table.status]
          return (
            <button
              key={table.id}
              onClick={() => setSelectedTable(table)}
              className={clsx(
                'relative rounded-xl border-2 p-4 text-left transition-all duration-200 hover:shadow-md',
                config.bg, config.border,
              )}
            >
              {table.qrActive && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-md bg-white/80 flex items-center justify-center">
                  <span className="text-[10px]">📱</span>
                </span>
              )}
              <div className="flex items-center gap-2 mb-2">
                <LayoutGrid className={clsx('w-4 h-4', config.text)} />
                <span className={clsx('text-sm font-bold', config.text)}>{table.name}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-surface-500 mb-2">
                <Users className="w-3 h-3" />
                <span>{table.seats} Seats</span>
              </div>
              <Badge variant="status" size="sm" className="mt-1">{table.status}</Badge>
              {table.currentBill && (
                <p className="text-xs font-semibold text-surface-700 mt-2">{formatCurrency(table.currentBill)}</p>
              )}
              {table.reservedFor && (
                <p className="text-xs text-surface-600 mt-2 truncate">For: {table.reservedFor}</p>
              )}
            </button>
          )
        })}
      </div>

      {/* Table Detail Modal */}
      <Modal open={!!selectedTable} onClose={() => setSelectedTable(null)} title={selectedTable?.name || ''} size="sm">
        {selectedTable && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="status" dot>{selectedTable.status}</Badge>
              <span className="text-sm text-surface-500">{selectedTable.seats} seats · {selectedTable.floor}</span>
            </div>
            {selectedTable.currentOrderId && (
              <Card padding className="bg-surface-50">
                <p className="text-xs text-surface-400 font-medium uppercase tracking-wider">Current Order</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-semibold text-surface-900">{selectedTable.currentOrderId}</span>
                  <span className="text-sm font-bold text-primary-700">{formatCurrency(selectedTable.currentBill || 0)}</span>
                </div>
              </Card>
            )}
            {selectedTable.reservedFor && (
              <Card padding className="bg-info-50">
                <p className="text-xs text-info-600 font-medium uppercase tracking-wider">Reservation</p>
                <p className="text-sm font-semibold text-info-800 mt-1">{selectedTable.reservedFor} at {selectedTable.reservedAt}</p>
              </Card>
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-surface-500">QR Ordering</span>
              <Badge variant="status">{selectedTable.qrActive ? 'active' : 'inactive'}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button variant="outline" fullWidth onClick={() => { addToast({ type: 'info', title: 'Transfer', message: 'Table transfer initiated' }); setSelectedTable(null) }}>
                Transfer
              </Button>
              <Button fullWidth onClick={() => { addToast({ type: 'success', title: 'Bill Generated', message: `Bill for ${selectedTable.name} generated` }); setSelectedTable(null) }}>
                <Receipt className="w-4 h-4 mr-1.5" />Bill
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Table Modal */}
      <Modal open={showAddTable} onClose={() => setShowAddTable(false)} title="Add New Table" size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowAddTable(false)}>Cancel</Button>
            <Button onClick={() => { setShowAddTable(false); addToast({ type: 'success', title: 'Table Added', message: 'New table has been created' }) }}>Add Table</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Table Name" placeholder="e.g. Table 15" />
          <Select label="Floor" options={mockFloors.map(f => ({ value: f, label: f }))} placeholder="Select floor" />
          <Select label="Seats" options={[{ value: '2', label: '2 Seats' }, { value: '4', label: '4 Seats' }, { value: '6', label: '6 Seats' }, { value: '8', label: '8 Seats' }]} placeholder="Select seats" />
        </div>
      </Modal>

      {/* Reserve Table Modal */}
      <Modal open={showReserve} onClose={() => setShowReserve(false)} title="Reserve a Table" size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowReserve(false)}>Cancel</Button>
            <Button onClick={() => { setShowReserve(false); addToast({ type: 'success', title: 'Table Reserved', message: 'Reservation has been confirmed' }) }}>Confirm Reservation</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select label="Table" options={(tables || []).filter(t => t.status === 'available').map(t => ({ value: t.id, label: `${t.name} (${t.seats} seats)` }))} placeholder="Select table" />
          <Input label="Guest Name" placeholder="Enter guest name" />
          <Input label="Date & Time" type="datetime-local" />
          <Input label="Party Size" type="number" placeholder="Number of guests" />
        </div>
      </Modal>
    </div>
  )
}
