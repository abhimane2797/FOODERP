import { useState } from 'react'
import {
  Store, Building2, Percent, FileText, Printer, CreditCard,
  Users, Bell, QrCode, ChevronRight,
} from 'lucide-react'
import { Badge, Button, Card, Input, Select, Toggle, SectionHeader, Textarea } from '../../components/ui'
import { useToast } from '../../hooks/useToast'
import { clsx } from '../../utils'
import type { SettingsSection } from '../../types'

const sections: { id: SettingsSection; label: string; icon: typeof Store }[] = [
  { id: 'restaurant', label: 'Restaurant Settings', icon: Store },
  { id: 'branch', label: 'Branch Settings', icon: Building2 },
  { id: 'tax', label: 'Tax Settings', icon: Percent },
  { id: 'invoice', label: 'Invoice Settings', icon: FileText },
  { id: 'printer', label: 'Printer Settings', icon: Printer },
  { id: 'payment', label: 'Payment Settings', icon: CreditCard },
  { id: 'users', label: 'Users & Roles', icon: Users },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'qr', label: 'QR Settings', icon: QrCode },
]

export function SettingsPage() {
  const [active, setActive] = useState<SettingsSection>('restaurant')
  const { addToast } = useToast()

  const handleSave = () => {
    addToast({ type: 'success', title: 'Settings Saved', message: 'Your changes have been saved successfully' })
  }

  const renderForm = () => {
    switch (active) {
      case 'restaurant':
        return (
          <div className="space-y-5">
            <SectionHeader title="Restaurant Information" subtitle="Basic details about your restaurant" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Restaurant Name" defaultValue="Spice Garden" />
              <Input label="Tagline" defaultValue="Fine Dining & Multi-Cuisine" />
              <Input label="Phone" defaultValue="+91 98765 43210" />
              <Input label="Email" defaultValue="hello@spicegarden.in" type="email" />
              <div className="md:col-span-2">
                <Textarea label="Address" defaultValue="12 MG Road, Pune, Maharashtra 411001" />
              </div>
              <Select label="Currency" options={[{ value: 'INR', label: '₹ Indian Rupee (INR)' }, { value: 'USD', label: '$ US Dollar (USD)' }]} defaultValue="INR" />
              <Select label="Timezone" options={[{ value: 'IST', label: 'IST (Asia/Kolkata)' }, { value: 'UTC', label: 'UTC' }]} defaultValue="IST" />
            </div>
          </div>
        )
      case 'branch':
        return (
          <div className="space-y-5">
            <SectionHeader title="Branch Management" subtitle="Manage your restaurant branches" />
            {[
              { name: 'Main Branch', address: '12 MG Road, Pune', active: true },
              { name: 'Koregaon Park', address: 'Lane 6, KP, Pune', active: true },
              { name: 'Baner Outlet', address: 'Baner Road, Pune', active: false },
            ].map(b => (
              <Card key={b.name} padding className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-surface-900">{b.name}</p>
                  <p className="text-sm text-surface-500">{b.address}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="status" size="sm">{b.active ? 'active' : 'inactive'}</Badge>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </Card>
            ))}
            <Button variant="outline" fullWidth>+ Add Branch</Button>
          </div>
        )
      case 'tax':
        return (
          <div className="space-y-5">
            <SectionHeader title="Tax Configuration" subtitle="Manage GST and tax rates" />
            {[
              { name: 'CGST', rate: '2.5%', active: true },
              { name: 'SGST', rate: '2.5%', active: true },
              { name: 'Service Charge', rate: '10%', active: true },
              { name: 'Luxury Tax', rate: '5%', active: false },
            ].map(t => (
              <Card key={t.name} padding className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-surface-900">{t.name}</p>
                  <p className="text-sm text-surface-500">Rate: {t.rate}</p>
                </div>
                <Toggle checked={t.active} onChange={() => {}} />
              </Card>
            ))}
            <Button variant="outline" fullWidth>+ Add Tax Rule</Button>
          </div>
        )
      case 'invoice':
        return (
          <div className="space-y-5">
            <SectionHeader title="Invoice Settings" subtitle="Configure invoice formatting" />
            <div className="space-y-4">
              <Input label="Invoice Prefix" defaultValue="SG" />
              <Input label="Next Invoice Number" type="number" defaultValue="1057" />
              <Input label="Invoice Footer Note" defaultValue="Thank you for dining with us! Visit again." />
              <Toggle checked={true} onChange={() => {}} label="Show GST number on invoice" />
              <Toggle checked={true} onChange={() => {}} label="Auto-print invoice after payment" />
              <Toggle checked={false} onChange={() => {}} label="Include QR code on invoice" />
            </div>
          </div>
        )
      case 'printer':
        return (
          <div className="space-y-5">
            <SectionHeader title="Printer Settings" subtitle="Configure receipt and KOT printers" />
            {[
              { name: 'Receipt Printer', type: 'Thermal 80mm', status: 'Connected', location: 'Counter 1' },
              { name: 'KOT Printer - Kitchen', type: 'Thermal 80mm', status: 'Connected', location: 'Kitchen' },
              { name: 'KOT Printer - Bar', type: 'Thermal 58mm', status: 'Offline', location: 'Bar' },
            ].map(p => (
              <Card key={p.name} padding className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-surface-900">{p.name}</p>
                  <p className="text-sm text-surface-500">{p.type} · {p.location}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="status" size="sm" dot>{p.status === 'Connected' ? 'active' : 'inactive'}</Badge>
                  <Button variant="ghost" size="sm">Test</Button>
                </div>
              </Card>
            ))}
          </div>
        )
      case 'payment':
        return (
          <div className="space-y-5">
            <SectionHeader title="Payment Settings" subtitle="Configure accepted payment methods" />
            {[
              { name: 'Cash', enabled: true, note: 'Accept cash payments' },
              { name: 'UPI', enabled: true, note: 'Google Pay, PhonePe, Paytm' },
              { name: 'Credit/Debit Card', enabled: true, note: 'Visa, Mastercard, RuPay' },
              { name: 'Online Payment', enabled: true, note: 'Swiggy, Zomato, Website' },
              { name: 'Wallet', enabled: false, note: 'Paytm, Amazon Pay wallets' },
            ].map(p => (
              <Card key={p.name} padding className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-surface-900">{p.name}</p>
                  <p className="text-sm text-surface-500">{p.note}</p>
                </div>
                <Toggle checked={p.enabled} onChange={() => {}} />
              </Card>
            ))}
          </div>
        )
      case 'users':
        return (
          <div className="space-y-5">
            <SectionHeader title="Users & Roles" subtitle="Manage staff access and permissions" action={<Button size="sm">+ Add User</Button>} />
            {[
              { name: 'Rajesh Kumar', email: 'rajesh@spicegarden.in', role: 'Admin', access: 'Full Access' },
              { name: 'Sunita Devi', email: 'sunita@spicegarden.in', role: 'Cashier', access: 'POS, Orders' },
              { name: 'Mohammed Irfan', email: 'irfan@spicegarden.in', role: 'Chef', access: 'Kitchen, Menu' },
              { name: 'Priya Sharma', email: 'priya.s@spicegarden.in', role: 'Waiter', access: 'Orders, Tables' },
            ].map(u => (
              <Card key={u.email} padding className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-surface-900">{u.name}</p>
                  <p className="text-sm text-surface-500">{u.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" size="sm">{u.role}</Badge>
                  <span className="text-xs text-surface-400">{u.access}</span>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </Card>
            ))}
          </div>
        )
      case 'notifications':
        return (
          <div className="space-y-5">
            <SectionHeader title="Notification Preferences" subtitle="Choose what notifications you receive" />
            {[
              { name: 'New Orders', desc: 'Get notified for every new order', enabled: true },
              { name: 'Low Stock Alerts', desc: 'When inventory falls below minimum', enabled: true },
              { name: 'Payment Received', desc: 'On every successful payment', enabled: true },
              { name: 'Customer Requests', desc: 'Waiter calls, bill requests from QR', enabled: true },
              { name: 'Daily Summary', desc: 'End-of-day sales report', enabled: false },
              { name: 'Employee Attendance', desc: 'Check-in/check-out alerts', enabled: false },
            ].map(n => (
              <Card key={n.name} padding className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-surface-900">{n.name}</p>
                  <p className="text-sm text-surface-500">{n.desc}</p>
                </div>
                <Toggle checked={n.enabled} onChange={() => {}} />
              </Card>
            ))}
          </div>
        )
      case 'qr':
        return (
          <div className="space-y-5">
            <SectionHeader title="QR Ordering Settings" subtitle="Configure digital menu and QR ordering" />
            <div className="space-y-4">
              <Toggle checked={true} onChange={() => {}} label="Enable QR Ordering" />
              <Toggle checked={true} onChange={() => {}} label="Show prices on QR menu" />
              <Toggle checked={true} onChange={() => {}} label="Allow online payment via QR" />
              <Toggle checked={false} onChange={() => {}} label="Require phone number for order" />
              <Toggle checked={true} onChange={() => {}} label="Show estimated prep time" />
              <Input label="QR Menu Header Text" defaultValue="Welcome to Spice Garden! Scan, browse & order." />
              <Select label="Default Order Type" options={[{ value: 'dine-in', label: 'Dine-In' }, { value: 'qr', label: 'QR Order' }]} defaultValue="qr" />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-4 lg:p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Settings</h1>
        <p className="text-sm text-surface-500 mt-0.5">Configure your restaurant preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-xl border border-surface-200 p-2 space-y-0.5 sticky top-4">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={clsx(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  active === s.id
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-surface-600 hover:bg-surface-50',
                )}
              >
                <s.icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left">{s.label}</span>
                <ChevronRight className={clsx('w-3.5 h-3.5', active === s.id ? 'text-primary-500' : 'text-surface-300')} />
              </button>
            ))}
          </div>
        </div>

        {/* Mobile select */}
        <div className="lg:hidden w-full mb-4">
          <Select
            value={active}
            onChange={e => setActive(e.target.value as SettingsSection)}
            options={sections.map(s => ({ value: s.id, label: s.label }))}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Card>
            {renderForm()}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-surface-200">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
