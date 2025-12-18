'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, signInUser, signOutUser } from '@/lib/auth-service'
import type { User } from '@/lib/auth-service'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const loadUser = async () => {
    try {
      const { user: currentUser, error } = await getCurrentUser()
      if (error) {
        console.error('Failed to load user:', error)
        setUser(null)
      } else {
        setUser(currentUser)
      }
    } catch (error) {
      console.error('Failed to load user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const { user: loggedInUser, error } = await signInUser({ email, password })

      if (error || !loggedInUser) {
        throw new Error(error || 'Login failed')
      }

      setUser(loggedInUser)

      // Redirect based on role
      const role = loggedInUser.role
      if (role === 'admin') {
        router.push('/admin/dashboard')
      } else if (role === 'seller') {
        router.push('/seller/dashboard')
      } else if (role === 'blogger') {
        router.push('/blogger/dashboard')
      } else {
        router.push('/')
      }
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    await signOutUser()
    setUser(null)
    router.push('/login')
  }

  const refreshUser = async () => {
    await loadUser()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
        isAuthenticated: !!user,
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
