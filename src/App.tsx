import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { AuthProvider } from './lib/auth-context'
import MarketingLayout from './layouts/marketing-layout'
import DashboardLayout from './layouts/dashboard-layout'
import HomePage from './pages/home-page'
import DashboardPage from './pages/dashboard-page'
import AnalyticsPage from './pages/analytics-page'
import ApiPage from './pages/api-page'
import BillingPage from './pages/billing-page'
import IntegrationsPage from './pages/integrations-page'
import SettingsPage from './pages/settings-page'
import AuthPage from './pages/auth-page'

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MarketingLayout />}>
            <Route index element={<HomePage />} />
          </Route>
          <Route path="/auth/*" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="api" element={<ApiPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="integrations" element={<IntegrationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}
