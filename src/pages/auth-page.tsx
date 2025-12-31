import { useState } from 'react'
import { useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function AuthPage() {
  const location = useLocation()
  const { user, signIn, signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const isSignUp = location.pathname.includes('sign-up')

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password)
        toast.success('Account created successfully!')
      } else {
        await signIn(email, password)
        toast.success('Signed in successfully!')
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignUp ? 'Create an account' : 'Sign in'}</CardTitle>
          <CardDescription>
            {isSignUp
              ? 'Enter your email below to create your account'
              : 'Enter your email below to sign in to your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : (isSignUp ? 'Sign up' : 'Sign in')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
