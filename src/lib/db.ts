// Database Adapter - Automatically switches between Mock and Supabase
import { mockDB } from './mock-db'
import { supabase } from './supabase-client'

const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true'

interface User {
  id: string
  email: string
  password?: string
  full_name: string
  role: 'admin' | 'seller' | 'blogger' | 'customer'
  phone: string
  created_at: string
}

interface Product {
  id: string
  seller_id: string
  title: string
  description: string
  category: string
  price: number
  images: string[]
  stock: number
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

interface Order {
  id: string
  order_number: string
  customer_id: string
  blogger_id?: string
  promo_code?: string
  items: any[]
  subtotal: number
  delivery_fee: number
  discount: number
  total: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  delivery_address: string
  delivery_phone: string
  created_at: string
}

class DatabaseAdapter {
  // Auth methods
  async login(email: string, password: string): Promise<User> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password)
        .single()
      
      if (error) throw new Error('Email yoki parol noto\'g\'ri')
      return data as User
    }
    return mockDB.login(email, password)
  }

  async register(data: Partial<User>): Promise<User> {
    if (USE_SUPABASE) {
      const { data: user, error } = await supabase
        .from('users')
        .insert([{
          email: data.email,
          password_hash: data.password,
          full_name: data.full_name,
          role: data.role || 'customer',
          phone: data.phone,
        }])
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      return user as User
    }
    return mockDB.register(data)
  }

  async getCurrentUser(): Promise<User | null> {
    if (USE_SUPABASE) {
      // Implement Supabase session check
      return null
    }
    return mockDB.getCurrentUser()
  }

  async logout(): Promise<void> {
    if (USE_SUPABASE) {
      await supabase.auth.signOut()
    }
    return mockDB.logout()
  }

  // Product methods
  async getProducts(filters?: any): Promise<Product[]> {
    if (USE_SUPABASE) {
      let query = supabase.from('products').select('*')
      
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.seller_id) {
        query = query.eq('seller_id', filters.seller_id)
      }
      
      const { data, error } = await query
      if (error) throw new Error(error.message)
      return data as Product[]
    }
    return mockDB.getProducts(filters)
  }

  async getProduct(id: string): Promise<Product | null> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) return null
      return data as Product
    }
    return mockDB.getProduct(id)
  }

  async createProduct(data: Partial<Product>): Promise<Product> {
    if (USE_SUPABASE) {
      const { data: product, error } = await supabase
        .from('products')
        .insert([data])
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      return product as Product
    }
    return mockDB.createProduct(data)
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    if (USE_SUPABASE) {
      const { data: product, error } = await supabase
        .from('products')
        .update(data)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      return product as Product
    }
    return mockDB.updateProduct(id, data)
  }

  async deleteProduct(id: string): Promise<void> {
    if (USE_SUPABASE) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      
      if (error) throw new Error(error.message)
      return
    }
    return mockDB.deleteProduct(id)
  }

  // Order methods
  async createOrder(data: Partial<Order>): Promise<Order> {
    if (USE_SUPABASE) {
      const { data: order, error } = await supabase
        .from('orders')
        .insert([data])
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      return order as Order
    }
    return mockDB.createOrder(data)
  }

  async getOrders(filters?: any): Promise<Order[]> {
    if (USE_SUPABASE) {
      let query = supabase.from('orders').select('*')
      
      if (filters?.customer_id) {
        query = query.eq('customer_id', filters.customer_id)
      }
      
      const { data, error } = await query
      if (error) throw new Error(error.message)
      return data as Order[]
    }
    return mockDB.getOrders(filters)
  }

  async getOrder(id: string): Promise<Order | null> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) return null
      return data as Order
    }
    return mockDB.getOrder(id)
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw new Error(error.message)
      return data as Order
    }
    return mockDB.updateOrderStatus(id, status)
  }

  // Promo code validation
  async validatePromoCode(code: string): Promise<{ valid: boolean; discount: number }> {
    if (USE_SUPABASE) {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('active', true)
        .single()
      
      if (error || !data) {
        return { valid: false, discount: 0 }
      }
      
      return {
        valid: true,
        discount: data.discount_value / 100,
      }
    }
    return mockDB.validatePromoCode(code)
  }
}

export const db = new DatabaseAdapter()
