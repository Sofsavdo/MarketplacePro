// Mock Database - Production uchun Supabase bilan almashtiring
// To use real Supabase: Set NEXT_PUBLIC_USE_SUPABASE=true in .env.local

interface User {
  id: string
  email: string
  password: string
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

class MockDatabase {
  private users: User[] = [
    {
      id: '1',
      email: 'admin@dubaymall.uz',
      password: 'admin123',
      full_name: 'Admin User',
      role: 'admin',
      phone: '+998901234567',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      email: 'seller@dubaymall.uz',
      password: 'seller123',
      full_name: 'TechStore UZ',
      role: 'seller',
      phone: '+998901234568',
      created_at: new Date().toISOString(),
    },
    {
      id: '3',
      email: 'blogger@dubaymall.uz',
      password: 'blogger123',
      full_name: 'Blogger User',
      role: 'blogger',
      phone: '+998901234569',
      created_at: new Date().toISOString(),
    },
  ]

  private products: Product[] = [
    {
      id: '1',
      seller_id: '2',
      title: 'iPhone 15 Pro Max 256GB',
      description: 'Apple iPhone 15 Pro Max - eng so\'nggi texnologiya va premium dizayn. A17 Pro chip, titanium korpus, ProMotion displey va professional kamera tizimi.',
      category: 'Elektronika',
      price: 15500000,
      images: [
        'https://images.unsplash.com/photo-1696446702183-cbd50c2a2476?w=800',
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
      ],
      stock: 12,
      status: 'approved',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      seller_id: '2',
      title: 'Samsung Galaxy S24 Ultra 512GB',
      description: 'Samsung Galaxy S24 Ultra - flagship smartfon. Snapdragon 8 Gen 3, 200MP kamera, S Pen va premium dizayn.',
      category: 'Elektronika',
      price: 13200000,
      images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800'],
      stock: 8,
      status: 'approved',
      created_at: new Date().toISOString(),
    },
  ]

  private orders: Order[] = []
  private currentSession: User | null = null

  // Auth methods
  async login(email: string, password: string): Promise<User> {
    const user = this.users.find(u => u.email === email && u.password === password)
    if (!user) throw new Error('Email yoki parol noto\'g\'ri')
    this.currentSession = user
    return user
  }

  async register(data: Partial<User>): Promise<User> {
    const existingUser = this.users.find(u => u.email === data.email)
    if (existingUser) throw new Error('Bu email allaqachon ro\'yxatdan o\'tgan')

    const newUser: User = {
      id: String(this.users.length + 1),
      email: data.email!,
      password: data.password!,
      full_name: data.full_name!,
      role: data.role || 'customer',
      phone: data.phone!,
      created_at: new Date().toISOString(),
    }

    this.users.push(newUser)
    this.currentSession = newUser
    return newUser
  }

  async getCurrentUser(): Promise<User | null> {
    return this.currentSession
  }

  async logout(): Promise<void> {
    this.currentSession = null
  }

  // Product methods
  async getProducts(filters?: any): Promise<Product[]> {
    let products = [...this.products]
    
    if (filters?.status) {
      products = products.filter(p => p.status === filters.status)
    }
    
    if (filters?.seller_id) {
      products = products.filter(p => p.seller_id === filters.seller_id)
    }

    return products
  }

  async getProduct(id: string): Promise<Product | null> {
    return this.products.find(p => p.id === id) || null
  }

  async createProduct(data: Partial<Product>): Promise<Product> {
    const newProduct: Product = {
      id: String(this.products.length + 1),
      seller_id: data.seller_id!,
      title: data.title!,
      description: data.description!,
      category: data.category!,
      price: data.price!,
      images: data.images || [],
      stock: data.stock || 0,
      status: 'pending',
      created_at: new Date().toISOString(),
    }

    this.products.push(newProduct)
    return newProduct
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const index = this.products.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Mahsulot topilmadi')

    this.products[index] = { ...this.products[index], ...data }
    return this.products[index]
  }

  async deleteProduct(id: string): Promise<void> {
    const index = this.products.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Mahsulot topilmadi')
    this.products.splice(index, 1)
  }

  // Order methods
  async createOrder(data: Partial<Order>): Promise<Order> {
    const orderNumber = `DM${Date.now()}`
    
    const newOrder: Order = {
      id: String(this.orders.length + 1),
      order_number: orderNumber,
      customer_id: data.customer_id!,
      blogger_id: data.blogger_id,
      promo_code: data.promo_code,
      items: data.items!,
      subtotal: data.subtotal!,
      delivery_fee: data.delivery_fee!,
      discount: data.discount || 0,
      total: data.total!,
      status: 'pending',
      delivery_address: data.delivery_address!,
      delivery_phone: data.delivery_phone!,
      created_at: new Date().toISOString(),
    }

    this.orders.push(newOrder)
    return newOrder
  }

  async getOrders(filters?: any): Promise<Order[]> {
    let orders = [...this.orders]
    
    if (filters?.customer_id) {
      orders = orders.filter(o => o.customer_id === filters.customer_id)
    }

    return orders
  }

  async getOrder(id: string): Promise<Order | null> {
    return this.orders.find(o => o.id === id) || null
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    const index = this.orders.findIndex(o => o.id === id)
    if (index === -1) throw new Error('Buyurtma topilmadi')

    this.orders[index].status = status
    return this.orders[index]
  }

  // Promo code validation
  async validatePromoCode(code: string): Promise<{ valid: boolean; discount: number }> {
    // Mock promo codes
    const promoCodes: Record<string, number> = {
      'BLOGGER2024': 0.10, // 10%
      'WELCOME': 0.15, // 15%
      'SALE50': 0.50, // 50%
    }

    const discount = promoCodes[code.toUpperCase()]
    return {
      valid: !!discount,
      discount: discount || 0,
    }
  }
}

export const mockDB = new MockDatabase()
