import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface User {
  id: string
  email: string
  created_at: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'auth_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY)
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))

    const storedUsers = localStorage.getItem('users') || '{}'
    const users = JSON.parse(storedUsers)

    if (users[email] && users[email].password === password) {
      const newUser: User = {
        id: users[email].id,
        email,
        created_at: users[email].created_at
      }
      setUser(newUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
      toast.success('Úspěšně přihlášen!')
      navigate('/dashboard')
    } else {
      throw new Error('Neplatné přihlašovací údaje')
    }
  }

  const signUp = async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))

    const storedUsers = localStorage.getItem('users') || '{}'
    const users = JSON.parse(storedUsers)

    if (users[email]) {
      throw new Error('Uživatel s tímto e-mailem již existuje')
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      created_at: new Date().toISOString()
    }

    users[email] = {
      id: newUser.id,
      password,
      created_at: newUser.created_at
    }

    localStorage.setItem('users', JSON.stringify(users))
    setUser(newUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    toast.success('Účet úspěšně vytvořen!')
    navigate('/dashboard')
  }

  const signOut = async () => {
    await new Promise(resolve => setTimeout(resolve, 300))
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    toast.success('Úspěšně odhlášen!')
    navigate('/')
  }

  const resetPassword = async (_email: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    toast.success('Odkaz pro obnovení hesla byl odeslán na váš e-mail')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
