import { supabase, supabaseAdmin } from './supabase-client'
import bcrypt from 'bcryptjs'

export interface SignUpData {
  email: string
  password: string
  full_name: string
  phone?: string
  role: 'customer' | 'seller' | 'blogger'
}

export interface SignInData {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  role: string
  avatar_url?: string
  email_verified: boolean
  created_at: string
}

// Sign up new user
export async function signUpUser(data: SignUpData): Promise<{ user: User | null; error: string | null }> {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return { user: null, error: 'Email formati noto\'g\'ri' }
    }

    // Validate password strength
    if (data.password.length < 6) {
      return { user: null, error: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' }
    }

    // Check if Supabase is configured
    if (!supabase) {
      // Mock mode - create user in localStorage
      const mockUser: User = {
        id: Date.now().toString(),
        email: data.email,
        full_name: data.full_name,
        phone: data.phone,
        role: data.role,
        email_verified: false,
        created_at: new Date().toISOString(),
      }
      
      // Store in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      users.push({ ...mockUser, password: await bcrypt.hash(data.password, 10) })
      localStorage.setItem('users', JSON.stringify(users))
      localStorage.setItem('user', JSON.stringify(mockUser))
      
      return { user: mockUser, error: null }
    }

    // Real Supabase signup
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.full_name,
          phone: data.phone,
          role: data.role,
        },
      },
    })

    if (authError) {
      return { user: null, error: authError.message }
    }

    if (!authData.user) {
      return { user: null, error: 'Foydalanuvchi yaratilmadi' }
    }

    // Create user profile in database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: data.email,
        full_name: data.full_name,
        phone: data.phone,
        role: data.role,
      })
      .select()
      .single()

    if (profileError) {
      console.error('Profile creation error:', profileError)
    }

    const user: User = {
      id: authData.user.id,
      email: authData.user.email!,
      full_name: data.full_name,
      phone: data.phone,
      role: data.role,
      email_verified: authData.user.email_confirmed_at !== null,
      created_at: authData.user.created_at,
    }

    return { user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message || 'Xatolik yuz berdi' }
  }
}

// Sign in user
export async function signInUser(data: SignInData): Promise<{ user: User | null; error: string | null }> {
  try {
    // Check if Supabase is configured
    if (!supabase) {
      // Mock mode - check localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find((u: any) => u.email === data.email)
      
      if (!user) {
        return { user: null, error: 'Email yoki parol noto\'g\'ri' }
      }

      const isPasswordValid = await bcrypt.compare(data.password, user.password)
      if (!isPasswordValid) {
        return { user: null, error: 'Email yoki parol noto\'g\'ri' }
      }

      const { password, ...userWithoutPassword } = user
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      
      return { user: userWithoutPassword, error: null }
    }

    // Real Supabase signin
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      return { user: null, error: 'Email yoki parol noto\'g\'ri' }
    }

    if (!authData.user) {
      return { user: null, error: 'Foydalanuvchi topilmadi' }
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (profileError || !profile) {
      // Create profile if doesn't exist
      const { data: newProfile } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: authData.user.email!,
          full_name: authData.user.user_metadata.full_name || 'User',
          role: authData.user.user_metadata.role || 'customer',
        })
        .select()
        .single()

      if (newProfile) {
        return { user: newProfile as User, error: null }
      }
    }

    return { user: profile as User, error: null }
  } catch (error: any) {
    return { user: null, error: error.message || 'Xatolik yuz berdi' }
  }
}

// Sign out user
export async function signOutUser(): Promise<{ error: string | null }> {
  try {
    if (!supabase) {
      // Mock mode
      localStorage.removeItem('user')
      return { error: null }
    }

    const { error } = await supabase.auth.signOut()
    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (error: any) {
    return { error: error.message || 'Xatolik yuz berdi' }
  }
}

// Get current user
export async function getCurrentUser(): Promise<{ user: User | null; error: string | null }> {
  try {
    if (!supabase) {
      // Mock mode
      const user = localStorage.getItem('user')
      if (!user) {
        return { user: null, error: null }
      }
      return { user: JSON.parse(user), error: null }
    }

    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

    if (authError || !authUser) {
      return { user: null, error: authError?.message || null }
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (profileError || !profile) {
      return { user: null, error: profileError?.message || 'Profil topilmadi' }
    }

    return { user: profile as User, error: null }
  } catch (error: any) {
    return { user: null, error: error.message || 'Xatolik yuz berdi' }
  }
}

// Reset password request
export async function requestPasswordReset(email: string): Promise<{ error: string | null }> {
  try {
    if (!supabase) {
      // Mock mode
      return { error: 'Email yuborildi (mock mode)' }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    })

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (error: any) {
    return { error: error.message || 'Xatolik yuz berdi' }
  }
}

// Update password
export async function updatePassword(newPassword: string): Promise<{ error: string | null }> {
  try {
    if (!supabase) {
      // Mock mode
      return { error: null }
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (error: any) {
    return { error: error.message || 'Xatolik yuz berdi' }
  }
}

// Update user profile
export async function updateUserProfile(userId: string, updates: Partial<User>): Promise<{ error: string | null }> {
  try {
    if (!supabase) {
      // Mock mode
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const updatedUser = { ...user, ...updates }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      return { error: null }
    }

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (error: any) {
    return { error: error.message || 'Xatolik yuz berdi' }
  }
}

// Verify email
export async function verifyEmail(token: string): Promise<{ error: string | null }> {
  try {
    if (!supabase) {
      return { error: null }
    }

    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email',
    })

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (error: any) {
    return { error: error.message || 'Xatolik yuz berdi' }
  }
}
