import { useState, useMemo } from 'react'
import { Plus, Truck, FileText, Receipt, Eye, Download, Phone } from 'lucide-react'
import { Badge, Button, Input, Modal, Select, Tabs, SearchInput, StatCard } from '../../components/ui'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { useApi } from '../../hooks'
import { useToast } from '../../hooks/useToast'
import { mockSuppliers, mockPurchaseOrders, mockPurchaseInvoices } from '../../mock/mockOperations'
import type { Supplier, PurchaseOrder, PurchaseInvoice } from '../../types'
import { formatCurrency, formatDate } from '../../utils'

export function PurchasesPage() {
  const { data: suppliers } = useApi<Supplier[]>(() => Promise.resolve(mockSuppliers))
  const { data: pos } = useApi<PurchaseOrder[]>(() => Promise.resolve(mockPurchaseOrders))
  const { data: invoices } = useApi<PurchaseInvoice[]>(() => Promise.resolve(mockPurchaseInvoices))

  const [tab, setTab] = useState('suppliers')
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null)
  const { addToast } = useToast()

  const filteredSuppliers = useMemo(() => {
    const result = suppliers || []
    if (!search) return result
    const q = search.toLowerCase()
    return result.filter(s => s.name.toLowerCase().includes(q) || s.contactPerson.toLowerCase().includes(q))
  }, [suppliers, search])

  const filteredPOs = useMemo(() => {
    const result = pos || []
    if (!search) return result
    const q = search.toLowerCase()
    return result.filter(p => p.poNumber.toLowerCase().includes(q) || p.supplierName.toLowerCase().includes(q))
  }, [pos, search])

  const filteredInvoices = useMemo(() => {
    const result = invoices || []
    if (!search) return result
    const q = search.toLowerCase()
    return result.filter(i => i.invoiceNumber.toLowerCase().includes(q) || i.supplierName.toLowerCase().includes(q))
  }, [invoices, search])

  const supplierColumns: Column<Supplier>[] = [
    { key: 'name', header: 'Supplier', render: s => (
      <div>
        <p className="font-medium text-surface-900">{s.name}</p>
        <p className="text-xs text-surface-400">{s.contactPerson}</p>
      </div>
    )},
    { key: 'phone', header: 'Phone', render: s => <span className="text-surface-600">{s.phone}</span> },
    { key: 'itemsSupplied', header: 'Items', render: s => (
      <div className="flex flex-wrap gap-1">
        {s.itemsSupplied.slice(0, 2).map(item => (
          <Badge key={item} variant="outline" size="sm">{item}</Badge>
        ))}
        {s.itemsSupplied.length > 2 && <Badge variant="outline" size="sm">+{s.itemsSupplied.length - 2}</Badge>}
      </div>
    )},
    { key: 'outstandingAmount', header: 'Outstanding', align: 'right', render: s => (
      <span className={s.outstandingAmount > 0 ? 'font-semibold text-danger-600' : 'text-surface-500'}>
        {formatCurrency(s.outstandingAmount)}
      </span>
    )},
    { key: 'totalOrders', header: 'Orders', align: 'center', render: s => <span className="text-surface-600">{s.totalOrders}</span> },
    { key: 'status', header: 'Status', render: s => <Badge variant="status" size="sm">{s.status}</Badge> },
  ]

  const poColumns: Column<PurchaseOrder>[] = [
    { key: 'poNumber', header: 'PO Number', render: p => <span className="font-semibold text-surface-900">{p.poNumber}</span> },
    { key: 'supplierName', header: 'Supplier', render: p => <span className="text-surface-600">{p.supplierName}</span> },
    { key: 'date', header: 'Date', render: p => formatDate(p.date) },
    { key: 'expectedDate', header: 'Expected', render: p => formatDate(p.expectedDate) },
    { key: 'items', header: 'Items', align: 'center', render: p => <span>{p.items.length}</span> },
    { key: 'total', header: 'Total', align: 'right', render: p => <span className="font-semibold">{formatCurrency(p.total)}</span> },
    { key: 'status', header: 'Status', render: p => <Badge variant="status" size="sm">{p.status}</Badge> },
    {
      key: 'actions', header: '', align: 'right',
      render: p => (
        <button onClick={e => { e.stopPropagation(); setSelectedPO(p) }} className="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50">
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ]

  const invoiceColumns: Column<PurchaseInvoice>[] = [
    { key: 'invoiceNumber', header: 'Invoice #', render: i => <span className="font-semibold text-surface-900">{i.invoiceNumber}</span> },
    { key: 'poNumber', header: 'PO Ref', render: i => <span className="text-surface-500 font-mono text-xs">{i.poNumber}</span> },
    { key: 'supplierName', header: 'Supplier', render: i => <span className="text-surface-600">{i.supplierName}</span> },
    { key: 'date', header: 'Date', render: i => formatDate(i.date) },
    { key: 'dueDate', header: 'Due Date', render: i => formatDate(i.dueDate) },
    { key: 'amount', header: 'Amount', align: 'right', render: i => <span className="font-semibold">{formatCurrency(i.amount)}</span> },
    { key: 'paidAmount', header: 'Paid', align: 'right', render: i => <span className="text-success-600">{formatCurrency(i.paidAmount)}</span> },
    { key: 'status', header: 'Status', render: i => <Badge variant="status" size="sm">{i.status}</Badge> },
  ]

  const outstandingTotal = (suppliers || []).reduce((s, sup) => s + sup.outstandingAmount, 0)

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Purchases</h1>
          <p className="text-sm text-surface-500 mt-0.5">Suppliers, purchase orders and invoices</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowAdd(true)}>
          {tab === 'suppliers' ? 'Add Supplier' : tab === 'orders' ? 'New PO' : 'Add Invoice'}
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Suppliers" value={String(suppliers?.length || 0)} icon={<Truck className="w-5 h-5" />} iconBg="bg-primary-50 text-primary-600" />
        <StatCard title="Open POs" value={String((pos || []).filter(p => p.status === 'sent' || p.status === 'draft').length)} icon={<FileText className="w-5 h-5" />} iconBg="bg-blue-50 text-blue-600" />
        <StatCard title="Unpaid Invoices" value={String((invoices || []).filter(i => i.status !== 'paid').length)} icon={<Receipt className="w-5 h-5" />} iconBg="bg-warning-50 text-warning-600" />
        <StatCard title="Outstanding" value={formatCurrency(outstandingTotal)} icon={<Phone className="w-5 h-5" />} iconBg="bg-danger-50 text-danger-600" />
      </div>

      <Tabs
        tabs={[
          { id: 'suppliers', label: 'Suppliers', count: suppliers?.length },
          { id: 'orders', label: 'Purchase Orders', count: pos?.length },
          { id: 'invoices', label: 'Invoices', count: invoices?.length },
        ]}
        active={tab}
        onChange={setTab}
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search suppliers, PO numbers, invoices..." className="max-w-md" />

      {tab === 'suppliers' && (
        <DataTable columns={supplierColumns} data={filteredSuppliers} rowKey={s => s.id} emptyMessage="No suppliers found" />
      )}
      {tab === 'orders' && (
        <DataTable columns={poColumns} data={filteredPOs} rowKey={p => p.id} onRowClick={setSelectedPO} emptyMessage="No purchase orders found" />
      )}
      {tab === 'invoices' && (
        <DataTable columns={invoiceColumns} data={filteredInvoices} rowKey={i => i.id} emptyMessage="No invoices found" />
      )}

      {/* PO Detail Modal */}
      <Modal open={!!selectedPO} onClose={() => setSelectedPO(null)} title={`Purchase Order ${selectedPO?.poNumber || ''}`} size="lg">
        {selectedPO && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-surface-400 font-medium">Supplier</p>
                <p className="text-sm font-semibold text-surface-900 mt-0.5">{selectedPO.supplierName}</p>
              </div>
              <div>
                <p className="text-xs text-surface-400 font-medium">Date</p>
                <p className="text-sm text-surface-700 mt-0.5">{formatDate(selectedPO.date)}</p>
              </div>
              <div>
                <p className="text-xs text-surface-400 font-medium">Expected</p>
                <p className="text-sm text-surface-700 mt-0.5">{formatDate(selectedPO.expectedDate)}</p>
              </div>
              <div>
                <p className="text-xs text-surface-400 font-medium">Status</p>
                <div className="mt-0.5"><Badge variant="status" size="sm">{selectedPO.status}</Badge></div>
              </div>
            </div>

            <div className="border border-surface-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-50 border-b border-surface-200">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-surface-500 uppercase">Item</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-surface-500 uppercase">Qty</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-surface-500 uppercase">Rate</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-surface-500 uppercase">Tax</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-surface-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {selectedPO.items.map((item, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3 font-medium text-surface-900">{item.name}</td>
                      <td className="px-4 py-3 text-right text-surface-600">{item.quantity} {item.unit}</td>
                      <td className="px-4 py-3 text-right text-surface-600">{formatCurrency(item.rate)}</td>
                      <td className="px-4 py-3 text-right text-surface-600">{item.taxPercent}%</td>
                      <td className="px-4 py-3 text-right font-semibold text-surface-900">{formatCurrency(item.quantity * item.rate)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-surface-50">
                    <td colSpan={4} className="px-4 py-2 text-right text-sm text-surface-600">Subtotal</td>
                    <td className="px-4 py-2 text-right text-sm font-semibold">{formatCurrency(selectedPO.subtotal)}</td>
                  </tr>
                  <tr className="bg-surface-50">
                    <td colSpan={4} className="px-4 py-2 text-right text-sm text-surface-600">Tax</td>
                    <td className="px-4 py-2 text-right text-sm font-semibold">{formatCurrency(selectedPO.tax)}</td>
                  </tr>
                  <tr className="bg-primary-50">
                    <td colSpan={4} className="px-4 py-2.5 text-right text-sm font-bold text-surface-900">Grand Total</td>
                    <td className="px-4 py-2.5 text-right text-sm font-bold text-primary-700">{formatCurrency(selectedPO.total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" fullWidth icon={<Download className="w-4 h-4" />}>Download PDF</Button>
              <Button fullWidth>Update Status</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title={tab === 'suppliers' ? 'Add Supplier' : tab === 'orders' ? 'Create Purchase Order' : 'Add Invoice'} size="md"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={() => { setShowAdd(false); addToast({ type: 'success', title: 'Created', message: 'Record has been saved' }) }}>
              {tab === 'suppliers' ? 'Add Supplier' : tab === 'orders' ? 'Create PO' : 'Add Invoice'}
            </Button>
          </>
        }
      >
        {tab === 'suppliers' && (
          <div className="space-y-4">
            <Input label="Supplier Name" placeholder="Company name" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Contact Person" placeholder="Name" />
              <Input label="Phone" placeholder="+91..." />
            </div>
            <Input label="Email" type="email" placeholder="email@example.com" />
            <Input label="Address" placeholder="Full address" />
          </div>
        )}
        {tab === 'orders' && (
          <div className="space-y-4">
            <Select label="Supplier" options={(suppliers || []).map(s => ({ value: s.id, label: s.name }))} placeholder="Select supplier" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="PO Number" defaultValue={`PO-2026-046`} />
              <Input label="Expected Date" type="date" />
            </div>
            <Input label="Item Name" placeholder="Ingredient name" />
            <div className="grid grid-cols-3 gap-3">
              <Input label="Quantity" type="number" placeholder="0" />
              <Input label="Rate (₹)" type="number" placeholder="0" />
              <Input label="Tax (%)" type="number" placeholder="0" />
            </div>
          </div>
        )}
        {tab === 'invoices' && (
          <div className="space-y-4">
            <Input label="Invoice Number" placeholder="INV-XXX-000" />
            <Select label="Supplier" options={(suppliers || []).map(s => ({ value: s.id, label: s.name }))} placeholder="Select supplier" />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Invoice Date" type="date" />
              <Input label="Due Date" type="date" />
            </div>
            <Input label="Amount (₹)" type="number" placeholder="0" />
          </div>
        )}
      </Modal>
    </div>
  )
}
