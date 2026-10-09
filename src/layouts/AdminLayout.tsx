import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingCart, ClipboardList, UtensilsCrossed, ChefHat,
  Menu as MenuIcon, Package, Truck, Users, UserCog, Receipt, BarChart3,
  QrCode, Settings, Search, Bell, ChevronDown, Plus, PanelLeftClose, PanelLeft,
  LogOut, User, Clock, Building2, Utensils,
} from 'lucide-react'
import { clsx, formatTime } from '../utils'
import { useClickOutside, useClock, useLocalStorage } from '../hooks'
import { Dropdown, DropdownItem, Avatar } from '../components/ui'
import { mockNotifications } from '../mock/mockOperations'
import { branches, restaurant } from '../mock/mockRestaurant'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/pos', label: 'POS', icon: ShoppingCart },
  { to: '/orders', label: 'Orders', icon: ClipboardList },
  { to: '/tables', label: 'Tables', icon: UtensilsCrossed },
  { to: '/kitchen', label: 'KOT / Kitchen', icon: ChefHat },
  { to: '/menu', label: 'Menu', icon: MenuIcon },
  { to: '/inventory', label: 'Inventory', icon: Package },
  { to: '/purchases', label: 'Purchases', icon: Truck },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/employees', label: 'Employees', icon: UserCog },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/qr', label: 'QR Ordering', icon: QrCode },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function AdminLayout() {
  const [collapsed, setCollapsed] = useLocalStorage('sidebar-collapsed', false)
  const [branchId, setBranchId] = useLocalStorage('selected-branch', 'br-001')
  const [notifications, setNotifications] = useState(mockNotifications)
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useState<React.RefObject<HTMLDivElement | null>>({ current: null })[0]
  const now = useClock()
  const navigate = useNavigate()
  const location = useLocation()

  useClickOutside(notifRef, () => setNotifOpen(false))

  const unreadCount = notifications.filter(n => !n.isRead).length
  const currentBranch = branches.find(b => b.id === branchId) || branches[0]

  useEffect(() => {
    setNotifOpen(false)
  }, [location.pathname])

  return (
    <div className="h-screen flex bg-surface-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={clsx(
        'shrink-0 bg-white border-r border-surface-200 flex flex-col transition-all duration-300 ease-in-out z-30',
        collapsed ? 'w-[68px]' : 'w-60',
        'max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-40 max-lg:shadow-xl',
        collapsed ? 'max-lg:w-[68px]' : 'max-lg:w-60',
        !collapsed && 'max-lg:translate-x-0',
        collapsed && 'max-lg:translate-x-0',
      )}>
        {/* Logo */}
        <div className={clsx(
          'h-16 flex items-center border-b border-surface-200 shrink-0',
          collapsed ? 'justify-center px-2' : 'px-4',
        )}>
          <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shrink-0">
            <Utensils className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="ml-3 min-w-0">
              <p className="text-sm font-bold text-surface-900 truncate">{restaurant.name}</p>
              <p className="text-[10px] text-surface-400 truncate">{restaurant.tagline}</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-thin">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => clsx(
                'flex items-center rounded-lg text-sm font-medium transition-colors duration-150 group',
                collapsed ? 'justify-center h-10 w-10 mx-auto' : 'px-3 h-10',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900',
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={clsx('shrink-0', collapsed ? 'w-5 h-5' : 'w-[18px] h-[18px] mr-3')} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="p-2 border-t border-surface-200 shrink-0">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={clsx(
              'flex items-center w-full rounded-lg text-sm text-surface-500 hover:bg-surface-100 hover:text-surface-700 transition-colors',
              collapsed ? 'justify-center h-10 w-10 mx-auto' : 'px-3 h-10',
            )}
          >
            {collapsed ? <PanelLeft className="w-5 h-5" /> : <><PanelLeftClose className="w-[18px] h-[18px] mr-3" /> <span>Collapse</span></>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-surface-200 flex items-center gap-3 px-4 lg:px-6 shrink-0 z-20">
          {/* Mobile menu */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="lg:hidden p-2 rounded-lg text-surface-500 hover:bg-surface-100"
          >
            <MenuIcon className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                placeholder="Search orders, items, customers..."
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-surface-100 text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Date/Time */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-50 text-sm text-surface-600">
              <Clock className="w-4 h-4 text-surface-400" />
              <span className="font-medium">{formatTime(now.toISOString())}</span>
            </div>

            {/* Branch selector */}
            <Dropdown
              trigger={
                <button className="flex items-center gap-2 h-10 px-3 rounded-lg border border-surface-200 text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors">
                  <Building2 className="w-4 h-4 text-surface-400" />
                  <span className="hidden sm:inline max-w-[120px] truncate">{currentBranch.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-surface-400" />
                </button>
              }
            >
              {branches.map(b => (
                <DropdownItem
                  key={b.id}
                  onClick={() => setBranchId(b.id)}
                  icon={<Building2 className={clsx('w-4 h-4', b.id === branchId ? 'text-primary-600' : 'text-surface-400')} />}
                >
                  <span className={clsx(b.id === branchId && 'font-semibold text-primary-700')}>{b.name}</span>
                </DropdownItem>
              ))}
            </Dropdown>

            {/* Quick action */}
            <button
              onClick={() => navigate('/pos')}
              className="hidden sm:flex items-center gap-1.5 h-10 px-3.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Order
            </button>

            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2.5 rounded-lg text-surface-500 hover:bg-surface-100 hover:text-surface-700 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-danger-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-surface-200 shadow-xl animate-scale-in z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-surface-200">
                    <p className="text-sm font-semibold text-surface-900">Notifications</p>
                    <button
                      onClick={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))}
                      className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        className={clsx(
                          'px-4 py-3 border-b border-surface-100 last:border-0 hover:bg-surface-50 transition-colors',
                          !n.isRead && 'bg-primary-50/30',
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={clsx(
                            'w-2 h-2 rounded-full mt-1.5 shrink-0',
                            !n.isRead ? 'bg-primary-500' : 'bg-transparent',
                          )} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-surface-900">{n.title}</p>
                            <p className="text-xs text-surface-500 mt-0.5 truncate">{n.message}</p>
                            <p className="text-[11px] text-surface-400 mt-1">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <Dropdown
              trigger={
                <button className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-lg hover:bg-surface-100 transition-colors">
                  <Avatar name="Rajesh Kumar" size="sm" />
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-surface-900 leading-tight">Rajesh Kumar</p>
                    <p className="text-[11px] text-surface-400">Manager</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-surface-400 hidden lg:block" />
                </button>
              }
            >
              <div className="px-3.5 py-2.5 border-b border-surface-100">
                <p className="text-sm font-semibold text-surface-900">Rajesh Kumar</p>
                <p className="text-xs text-surface-500">rajesh@spicegarden.in</p>
              </div>
              <DropdownItem icon={<User className="w-4 h-4 text-surface-400" />}>My Profile</DropdownItem>
              <DropdownItem icon={<Settings className="w-4 h-4 text-surface-400" />} onClick={() => navigate('/settings')}>Settings</DropdownItem>
              <div className="border-t border-surface-100 my-1" />
              <DropdownItem icon={<LogOut className="w-4 h-4 text-surface-400" />} danger onClick={() => navigate('/login')}>Sign Out</DropdownItem>
            </Dropdown>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
