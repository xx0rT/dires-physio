import { Navigate, Outlet } from 'react-router-dom'
import {
  BarChart3,
  BookOpen,
  Home,
  Receipt,
  Settings,
  Shield,
  Users,
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { useAdmin } from '@/lib/use-admin'
import {
  ApplicationShell,
  type NavigationConfig,
} from '@/components/layout/application-shell'

const adminSections = [
  {
    id: "main",
    items: [
      { id: "overview", label: "Přehled", icon: BarChart3, path: "/admin" },
      { id: "users", label: "Uživatelé", icon: Users, path: "/admin/users" },
      { id: "courses", label: "Kurzy", icon: BookOpen, path: "/admin/courses" },
      { id: "invoices", label: "Faktury", icon: Receipt, path: "/admin/invoices" },
    ],
  },
]

const adminNavigationConfig: NavigationConfig = {
  railIcons: [
    { moduleId: "overview", label: "Přehled", icon: BarChart3, defaultPath: "/admin" },
    { moduleId: "users", label: "Uživatelé", icon: Users, defaultPath: "/admin/users" },
    { moduleId: "courses", label: "Kurzy", icon: BookOpen, defaultPath: "/admin/courses" },
    { moduleId: "invoices", label: "Faktury", icon: Receipt, defaultPath: "/admin/invoices" },
  ],
  modules: [
    { id: "overview", label: "Přehled", icon: BarChart3, defaultPath: "/admin", sections: adminSections },
    { id: "users", label: "Uživatelé", icon: Users, defaultPath: "/admin/users", sections: adminSections },
    { id: "courses", label: "Kurzy", icon: BookOpen, defaultPath: "/admin/courses", sections: adminSections },
    { id: "invoices", label: "Faktury", icon: Receipt, defaultPath: "/admin/invoices", sections: adminSections },
  ],
  utilities: [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
    { id: "settings", label: "Nastavení", icon: Settings, path: "/dashboard/settings" },
  ],
}

function resolveAdminModuleId(pathname: string): string {
  if (pathname.startsWith("/admin/users")) return "users"
  if (pathname.startsWith("/admin/courses")) return "courses"
  if (pathname.startsWith("/admin/invoices")) return "invoices"
  return "overview"
}

function AdminPanelHeader() {
  return (
    <div className="mb-2 flex items-center gap-2 px-2 py-1.5">
      <div className="flex size-6 items-center justify-center rounded bg-red-100 dark:bg-red-900/50">
        <Shield className="size-4 text-red-600 dark:text-red-400" />
      </div>
      <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
        Admin Panel
      </span>
    </div>
  )
}

export default function AdminLayout() {
  const { user, loading: authLoading } = useAuth()
  const { isAdmin, loading: adminLoading } = useAdmin()

  if (authLoading || adminLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <ApplicationShell
      navigationConfig={adminNavigationConfig}
      resolveActiveModuleId={resolveAdminModuleId}
      panelHeader={<AdminPanelHeader />}
    >
      <Outlet />
    </ApplicationShell>
  )
}
