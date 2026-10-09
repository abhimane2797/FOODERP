import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from '../hooks/useToast'
import { CartProvider } from '../hooks/useCart'
import { Toaster } from '../components/ui/Toaster'
import { AdminLayout } from '../layouts/AdminLayout'
import { QRCustomerLayout } from '../layouts/QRCustomerLayout'
import { LoginPage } from '../pages/admin/LoginPage'
import { DashboardPage } from '../pages/admin/DashboardPage'
import { POSPage } from '../pages/admin/POSPage'
import { OrdersPage } from '../pages/admin/OrdersPage'
import { TablesPage } from '../pages/admin/TablesPage'
import { KitchenPage } from '../pages/admin/KitchenPage'
import { MenuManagementPage } from '../pages/admin/MenuManagementPage'
import { InventoryPage } from '../pages/admin/InventoryPage'
import { PurchasesPage } from '../pages/admin/PurchasesPage'
import { CustomersPage } from '../pages/admin/CustomersPage'
import { EmployeesPage } from '../pages/admin/EmployeesPage'
import { ExpensesPage } from '../pages/admin/ExpensesPage'
import { ReportsPage } from '../pages/admin/ReportsPage'
import { QROrderingPage } from '../pages/admin/QROrderingPage'
import { SettingsPage } from '../pages/admin/SettingsPage'
import { QRMenuPage } from '../pages/customer/QRMenuPage'
import { QRCartPage } from '../pages/customer/QRCartPage'
import { QROrderStatusPage } from '../pages/customer/QROrderStatusPage'
import { QRBillPage } from '../pages/customer/QRBillPage'
import { QRPaymentPage } from '../pages/customer/QRPaymentPage'
import { QRFeedbackPage } from '../pages/customer/QRFeedbackPage'

export function AppRoutes() {
  return (
    <ToastProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />

            {/* Admin */}
            <Route element={<AdminLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/pos" element={<POSPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/tables" element={<TablesPage />} />
              <Route path="/kitchen" element={<KitchenPage />} />
              <Route path="/menu" element={<MenuManagementPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/purchases" element={<PurchasesPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/qr" element={<QROrderingPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Customer QR */}
            <Route path="/qr/:restaurantId/:tableId" element={<QRCustomerLayout />}>
              <Route index element={<QRMenuPage />} />
              <Route path="cart" element={<QRCartPage />} />
              <Route path="order/:orderId" element={<QROrderStatusPage />} />
              <Route path="bill" element={<QRBillPage />} />
              <Route path="payment" element={<QRPaymentPage />} />
              <Route path="feedback" element={<QRFeedbackPage />} />
            </Route>

            {/* Default */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </CartProvider>
    </ToastProvider>
  )
}
