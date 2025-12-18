import { supabase, supabaseAdmin } from './supabase-client'
import bcrypt from 'bcryptjs'

export interface SignUpData {
  email: string
  password: string
  full_name: string
  phone?: string
  role: 'customer' | 'seller' | 'blogger'
  // Seller specific
  company_name?: string
  business_license?: string
  tax_id?: string
  // Blogger specific
  youtube_channel?: string
  youtube_followers?: number
  instagram_username?: string
  instagram_followers?: number
  telegram_channel?: string
  telegram_followers?: number
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
  // Approval system
  status: 'pending' | 'approved' | 'rejected' | 'active'
  approved_at?: string
  rejected_at?: string
  rejection_reason?: string
  // Seller specific
  company_name?: string
  business_license?: string
  tax_id?: string
  // Blogger specific
  youtube_channel?: string
  youtube_followers?: number
  instagram_username?: string
  instagram_followers?: number
  telegram_channel?: string
  telegram_followers?: number
  verification_documents?: string[]
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

    // Validate seller data
    if (data.role === 'seller') {
      if (!data.company_name || data.company_name.trim().length === 0) {
        return { user: null, error: 'Kompaniya nomi kiritilishi shart' }
      }
      if (!data.business_license) {
        return { user: null, error: 'Biznes litsenziya raqami kiritilishi shart' }
      }
      if (!data.tax_id) {
        return { user: null, error: 'STIR raqami kiritilishi shart' }
      }
    }

    // Validate blogger data
    if (data.role === 'blogger') {
      let totalFollowers = 0
      
      if (data.youtube_followers) totalFollowers += data.youtube_followers
      if (data.instagram_followers) totalFollowers += data.instagram_followers
      if (data.telegram_followers) totalFollowers += data.telegram_followers

      if (totalFollowers < 500) {
        return { user: null, error: 'Kamida 500 ta faol obunachi bo\'lishi kerak (YouTube, Instagram yoki Telegram)' }
      }

      if (!data.youtube_channel && !data.instagram_username && !data.telegram_channel) {
        return { user: null, error: 'Kamida bitta ijtimoiy tarmoq hisobi kiritilishi kerak' }
      }
    }

    // Determine initial status
    const initialStatus = data.role === 'customer' ? 'active' : 'pending'

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
        status: initialStatus,
        company_name: data.company_name,
        business_license: data.business_license,
        tax_id: data.tax_id,
        youtube_channel: data.youtube_channel,
        youtube_followers: data.youtube_followers,
        instagram_username: data.instagram_username,
        instagram_followers: data.instagram_followers,
        telegram_channel: data.telegram_channel,
        telegram_followers: data.telegram_followers,
      }
      
      // Store in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      users.push({ ...mockUser, password: await bcrypt.hash(data.password, 10) })
      localStorage.setItem('users', JSON.stringify(users))
      
      // Only set current user if customer (others need approval)
      if (data.role === 'customer') {
        localStorage.setItem('user', JSON.stringify(mockUser))
      }
      
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
        status: initialStatus,
        company_name: data.company_name,
        business_license: data.business_license,
        tax_id: data.tax_id,
        youtube_channel: data.youtube_channel,
        youtube_followers: data.youtube_followers,
        instagram_username: data.instagram_username,
        instagram_followers: data.instagram_followers,
        telegram_channel: data.telegram_channel,
        telegram_followers: data.telegram_followers,
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
      status: initialStatus,
      company_name: data.company_name,
      business_license: data.business_license,
      tax_id: data.tax_id,
      youtube_channel: data.youtube_channel,
      youtube_followers: data.youtube_followers,
      instagram_username: data.instagram_username,
      instagram_followers: data.instagram_followers,
      telegram_channel: data.telegram_channel,
      telegram_followers: data.telegram_followers,
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
