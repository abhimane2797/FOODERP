import { Outlet } from 'react-router-dom'

export function QRCustomerLayout() {
  return (
    <div className="min-h-screen bg-surface-50 max-w-md mx-auto relative">
      <Outlet />
    </div>
  )
}
