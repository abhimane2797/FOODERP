import { useState, useMemo } from 'react'
import { UserPlus, Phone, Mail, Calendar, Star, Clock, Briefcase, Eye } from 'lucide-react'
import { Badge, Button, Card, StatCard, Drawer, Avatar, Tabs, SearchInput } from '../../components/ui'
import { DataTable, type Column } from '../../components/ui/DataTable'
import { useApi } from '../../hooks'
import { mockEmployees } from '../../mock/mockOperations'
import type { Employee } from '../../types'
import { formatCurrency, formatDate, clsx } from '../../utils'

const attendanceColors: Record<string, string> = {
  present: 'bg-success-50 text-success-700 ring-success-600/20',
  absent: 'bg-danger-50 text-danger-700 ring-danger-600/20',
  late: 'bg-warning-50 text-warning-700 ring-warning-600/20',
  leave: 'bg-surface-100 text-surface-600 ring-surface-500/20',
}

export function EmployeesPage() {
  const { data: employees } = useApi<Employee[]>(() => Promise.resolve(mockEmployees))
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Employee | null>(null)

  const filtered = useMemo(() => {
    let result = employees || []
    if (tab !== 'all') result = result.filter(e => e.status === tab)
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(e => e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q))
    }
    return result
  }, [employees, tab, search])

  const stats = useMemo(() => {
    const all = employees || []
    return {
      total: all.length,
      present: all.filter(e => e.attendanceToday === 'present').length,
      absent: all.filter(e => e.attendanceToday === 'absent').length,
      onLeave: all.filter(e => e.status === 'on-leave').length,
    }
  }, [employees])

  const columns: Column<Employee>[] = [
    { key: 'name', header: 'Employee', render: e => (
      <div className="flex items-center gap-3">
        <Avatar name={e.name} size="sm" />
        <div>
          <p className="font-medium text-surface-900">{e.name}</p>
          <p className="text-xs text-surface-400">{e.email}</p>
        </div>
      </div>
    )},
    { key: 'role', header: 'Role', render: e => <Badge variant="outline" size="sm">{e.role}</Badge> },
    { key: 'phone', header: 'Phone', render: e => <span className="text-surface-600">{e.phone}</span> },
    { key: 'branchName', header: 'Branch', render: e => <span className="text-surface-600">{e.branchName}</span> },
    { key: 'shift', header: 'Shift', render: e => <span className="text-xs text-surface-500">{e.shift}</span> },
    {
      key: 'attendanceToday', header: 'Attendance',
      render: e => (
        <span className={clsx('inline-flex px-2 py-1 text-xs font-medium rounded-md ring-1 ring-inset', attendanceColors[e.attendanceToday])}>
          {e.attendanceToday}
        </span>
      ),
    },
    { key: 'status', header: 'Status', render: e => <Badge variant="status" size="sm">{e.status}</Badge> },
    {
      key: 'actions', header: '', align: 'right',
      render: e => (
        <button onClick={ev => { ev.stopPropagation(); setSelected(e) }} className="p-1.5 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50">
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 tracking-tight">Employees</h1>
          <p className="text-sm text-surface-500 mt-0.5">Staff management and attendance</p>
        </div>
        <Button icon={<UserPlus className="w-4 h-4" />}>Add Employee</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Staff" value={String(stats.total)} icon={<Briefcase className="w-5 h-5" />} iconBg="bg-primary-50 text-primary-600" />
        <StatCard title="Present Today" value={String(stats.present)} icon={<Clock className="w-5 h-5" />} iconBg="bg-success-50 text-success-600" />
        <StatCard title="Absent" value={String(stats.absent)} icon={<Calendar className="w-5 h-5" />} iconBg="bg-danger-50 text-danger-600" />
        <StatCard title="On Leave" value={String(stats.onLeave)} icon={<Calendar className="w-5 h-5" />} iconBg="bg-warning-50 text-warning-600" />
      </div>

      <Tabs
        tabs={[
          { id: 'all', label: 'All', count: employees?.length },
          { id: 'active', label: 'Active', count: employees?.filter(e => e.status === 'active').length },
          { id: 'on-leave', label: 'On Leave', count: employees?.filter(e => e.status === 'on-leave').length },
        ]}
        active={tab}
        onChange={setTab}
      />

      <SearchInput value={search} onChange={setSearch} placeholder="Search employees..." className="max-w-md" />

      <DataTable columns={columns} data={filtered} rowKey={e => e.id} onRowClick={setSelected} emptyMessage="No employees found" />

      {/* Employee Profile Drawer */}
      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.name || ''} size="lg">
        {selected && (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <Avatar name={selected.name} size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-surface-900">{selected.name}</h3>
                  <Badge variant="status" size="sm">{selected.status}</Badge>
                </div>
                <p className="text-sm text-surface-500">{selected.role} · {selected.branchName}</p>
                <div className="flex items-center gap-3 mt-1 text-sm text-surface-500">
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{selected.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{selected.email}</span>
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Role', value: selected.role },
                { label: 'Branch', value: selected.branchName },
                { label: 'Shift', value: selected.shift },
                { label: 'Joining Date', value: formatDate(selected.joiningDate) },
                { label: 'Salary', value: formatCurrency(selected.salary) },
                { label: 'Attendance', value: selected.attendanceToday },
              ].map(info => (
                <Card key={info.label} padding className="bg-surface-50">
                  <p className="text-xs text-surface-400 font-medium">{info.label}</p>
                  <p className="text-sm font-semibold text-surface-900 mt-0.5">{info.value}</p>
                </Card>
              ))}
            </div>

            {/* Performance */}
            <Card padding>
              <p className="text-xs text-surface-400 font-medium uppercase tracking-wider mb-3">Performance</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={clsx('w-5 h-5', s <= Math.round(selected.performanceRating) ? 'text-amber-500 fill-amber-500' : 'text-surface-200')} />
                  ))}
                </div>
                <span className="text-lg font-bold text-surface-900">{selected.performanceRating}</span>
                <span className="text-sm text-surface-500">/ 5.0</span>
              </div>
            </Card>

            {/* Leave */}
            <Card padding>
              <p className="text-xs text-surface-400 font-medium uppercase tracking-wider mb-3">Leave Balance</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-surface-500">Taken</p>
                  <p className="text-xl font-bold text-surface-900">{selected.leavesTaken} days</p>
                </div>
                <div>
                  <p className="text-sm text-surface-500">Remaining</p>
                  <p className="text-xl font-bold text-success-600">{selected.leavesRemaining} days</p>
                </div>
              </div>
              <div className="mt-3 h-2 bg-surface-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full"
                  style={{ width: `${(selected.leavesTaken / (selected.leavesTaken + selected.leavesRemaining)) * 100}%` }}
                />
              </div>
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" fullWidth>Edit Profile</Button>
              <Button fullWidth>Manage Attendance</Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
