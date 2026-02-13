import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/lib/auth-context'
import { ApplicationShell } from '@/components/layout/application-shell'
import { SelectedCourseProvider } from '@/lib/selected-course-context'

export default function DashboardLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/prihlaseni" replace />
  }

  return (
    <SelectedCourseProvider>
      <ApplicationShell>
        <Outlet />
      </ApplicationShell>
    </SelectedCourseProvider>
  )
}
