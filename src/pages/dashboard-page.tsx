import { useAuth } from '@/lib/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RiUserLine, RiLineChartLine, RiShieldCheckLine, RiCalendarLine } from '@remixicon/react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const stats = [
  {
    title: 'Total Users',
    value: '2,543',
    change: '+12.5%',
    icon: RiUserLine,
    trend: 'up'
  },
  {
    title: 'Revenue',
    value: '$45,231',
    change: '+8.2%',
    icon: RiLineChartLine,
    trend: 'up'
  },
  {
    title: 'Active Projects',
    value: '12',
    change: '+3',
    icon: RiShieldCheckLine,
    trend: 'up'
  },
  {
    title: 'This Month',
    value: '148',
    change: '-2.4%',
    icon: RiCalendarLine,
    trend: 'down'
  }
]

const recentActivity = [
  {
    id: 1,
    title: 'New user registration',
    description: 'john.doe@example.com signed up',
    time: '2 minutes ago',
    type: 'user'
  },
  {
    id: 2,
    title: 'Payment received',
    description: 'Invoice #1234 paid',
    time: '1 hour ago',
    type: 'payment'
  },
  {
    id: 3,
    title: 'Project completed',
    description: 'Website redesign finished',
    time: '3 hours ago',
    type: 'project'
  },
  {
    id: 4,
    title: 'New feature deployed',
    description: 'API v2.0 is now live',
    time: '1 day ago',
    type: 'deployment'
  }
]

export default function DashboardPage() {
  const { user } = useAuth()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          {getGreeting()}, {user?.email?.split('@')[0] || 'there'}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your account today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              Your account statistics for the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-4">
                <RiLineChartLine className="h-16 w-16 mx-auto opacity-50" />
                <p>Chart visualization coming soon</p>
                <Button asChild variant="outline" size="sm">
                  <Link to="/dashboard/analytics">View Analytics</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest events from your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="mt-1 rounded-full bg-primary/10 p-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/dashboard/settings">
                <RiUserLine className="mr-2 h-4 w-4" />
                Update Profile
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/dashboard/api">
                <RiShieldCheckLine className="mr-2 h-4 w-4" />
                API Keys
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/dashboard/billing">
                <RiCalendarLine className="mr-2 h-4 w-4" />
                Billing
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Complete these steps to get the most out of your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-green-500/20 p-1">
                <svg className="h-3 w-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Create your account</p>
                <p className="text-xs text-muted-foreground">You've successfully signed up</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-primary/20 p-1">
                <div className="h-3 w-3 rounded-full border-2 border-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Complete your profile</p>
                <p className="text-xs text-muted-foreground">Add your information in settings</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-full bg-muted p-1">
                <div className="h-3 w-3 rounded-full border-2 border-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Connect integrations</p>
                <p className="text-xs text-muted-foreground">Link your favorite tools</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
