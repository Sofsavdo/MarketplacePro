import { supabase } from './supabase-client'

export interface OrderItem {
  product_id: string
  product_title: string
  product_image: string
  quantity: number
  price: number
  discount_price?: number
}

export interface Order {
  id: string
  customer_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  items: OrderItem[]
  subtotal: number
  discount: number
  shipping_cost: number
  total: number
  payment_method: 'click' | 'payme' | 'cash' | 'card'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  delivery_address: {
    region: string
    city: string
    street: string
    house: string
    apartment?: string
    postal_code?: string
  }
  delivery_method: 'standard' | 'express' | 'pickup'
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  notes?: string
  tracking_number?: string
  created_at: string
  updated_at: string
}

export interface CreateOrderData {
  customer_id: string
  items: OrderItem[]
  delivery_address: Order['delivery_address']
  delivery_method: Order['delivery_method']
  payment_method: Order['payment_method']
  notes?: string
}

export interface UpdateOrderData {
  id: string
  status?: Order['status']
  payment_status?: Order['payment_status']
  tracking_number?: string
  notes?: string
}

export interface OrderFilters {
  customer_id?: string
  status?: string
  payment_status?: string
  date_from?: string
  date_to?: string
  search?: string
}

export interface OrderListResult {
  orders: Order[]
  total: number
  error: string | null
}

// Calculate order totals
function calculateOrderTotals(items: OrderItem[], deliveryMethod: Order['delivery_method']) {
  const subtotal = items.reduce((sum, item) => {
    const price = item.discount_price || item.price
    return sum + (price * item.quantity)
  }, 0)

  const discount = items.reduce((sum, item) => {
    if (item.discount_price) {
      return sum + ((item.price - item.discount_price) * item.quantity)
    }
    return sum
  }, 0)

  let shippingCost = 0
  if (deliveryMethod === 'standard') {
    shippingCost = 20000 // 20,000 so'm
  } else if (deliveryMethod === 'express') {
    shippingCost = 50000 // 50,000 so'm
  }

  const total = subtotal + shippingCost

  return { subtotal, discount, shippingCost, total }
}

// Create order
export async function createOrder(data: CreateOrderData): Promise<{ order: Order | null; error: string | null }> {
  try {
    // Validate items
    if (!data.items || data.items.length === 0) {
      return { order: null, error: 'Buyurtma bo\'sh bo\'lishi mumkin emas' }
    }

    // Validate delivery address
    if (!data.delivery_address.region || !data.delivery_address.city || !data.delivery_address.street) {
      return { order: null, error: 'Yetkazib berish manzili to\'liq kiritilishi kerak' }
    }

    // Calculate totals
    const { subtotal, discount, shippingCost, total } = calculateOrderTotals(data.items, data.delivery_method)

    // Get customer info (mock for now)
    const customerName = 'Customer Name' // TODO: Get from user service
    const customerEmail = 'customer@example.com'
    const customerPhone = '+998901234567'

    if (!supabase) {
      // Mock mode
      const mockOrder: Order = {
        id: `ORD-${Date.now()}`,
        customer_id: data.customer_id,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        items: data.items,
        subtotal,
        discount,
        shipping_cost: shippingCost,
        total,
        payment_method: data.payment_method,
        payment_status: 'pending',
        delivery_address: data.delivery_address,
        delivery_method: data.delivery_method,
        status: 'pending',
        notes: data.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Store in localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      orders.push(mockOrder)
      localStorage.setItem('orders', JSON.stringify(orders))

      return { order: mockOrder, error: null }
    }

    // Real Supabase insert
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        customer_id: data.customer_id,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        items: data.items,
        subtotal,
        discount,
        shipping_cost: shippingCost,
        total,
        payment_method: data.payment_method,
        payment_status: 'pending',
        delivery_address: data.delivery_address,
        delivery_method: data.delivery_method,
        status: 'pending',
        notes: data.notes,
      })
      .select()
      .single()

    if (error) {
      return { order: null, error: error.message }
    }

    return { order: order as Order, error: null }
  } catch (error: any) {
    return { order: null, error: error.message || 'Buyurtma yaratishda xatolik' }
  }
}

// Get order by ID
export async function getOrder(orderId: string): Promise<{ order: Order | null; error: string | null }> {
  try {
    if (!supabase) {
      // Mock mode
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      const order = orders.find((o: Order) => o.id === orderId)
      
      if (!order) {
        return { order: null, error: 'Buyurtma topilmadi' }
      }

      return { order, error: null }
    }

    // Real Supabase query
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (error) {
      return { order: null, error: error.message }
    }

    if (!order) {
      return { order: null, error: 'Buyurtma topilmadi' }
    }

    return { order: order as Order, error: null }
  } catch (error: any) {
    return { order: null, error: error.message || 'Xatolik yuz berdi' }
  }
}

// Update order
export async function updateOrder(data: UpdateOrderData): Promise<{ order: Order | null; error: string | null }> {
  try {
    const { id, ...updateData } = data

    if (!supabase) {
      // Mock mode
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      const index = orders.findIndex((o: Order) => o.id === id)
      
      if (index === -1) {
        return { order: null, error: 'Buyurtma topilmadi' }
      }

      orders[index] = {
        ...orders[index],
        ...updateData,
        updated_at: new Date().toISOString(),
      }
      localStorage.setItem('orders', JSON.stringify(orders))

      return { order: orders[index], error: null }
    }

    // Real Supabase update
    const { data: order, error } = await supabase
      .from('orders')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return { order: null, error: error.message }
    }

    return { order: order as Order, error: null }
  } catch (error: any) {
    return { order: null, error: error.message || 'Buyurtmani yangilashda xatolik' }
  }
}

// Cancel order
export async function cancelOrder(orderId: string, reason?: string): Promise<{ error: string | null }> {
  try {
    const { order, error: getError } = await getOrder(orderId)
    
    if (getError || !order) {
      return { error: getError || 'Buyurtma topilmadi' }
    }

    // Check if order can be cancelled
    if (order.status === 'delivered' || order.status === 'cancelled') {
      return { error: 'Bu buyurtmani bekor qilish mumkin emas' }
    }

    const { error } = await updateOrder({
      id: orderId,
      status: 'cancelled',
      notes: reason ? `Bekor qilish sababi: ${reason}` : order.notes,
    })

    return { error }
  } catch (error: any) {
    return { error: error.message || 'Buyurtmani bekor qilishda xatolik' }
  }
}

// List orders with filters
export async function listOrders(
  filters: OrderFilters = {},
  page: number = 1,
  limit: number = 20
): Promise<OrderListResult> {
  try {
    if (!supabase) {
      // Mock mode
      let orders = JSON.parse(localStorage.getItem('orders') || '[]')

      // Apply filters
      if (filters.customer_id) {
        orders = orders.filter((o: Order) => o.customer_id === filters.customer_id)
      }
      if (filters.status) {
        orders = orders.filter((o: Order) => o.status === filters.status)
      }
      if (filters.payment_status) {
        orders = orders.filter((o: Order) => o.payment_status === filters.payment_status)
      }
      if (filters.date_from) {
        orders = orders.filter((o: Order) => o.created_at >= filters.date_from!)
      }
      if (filters.date_to) {
        orders = orders.filter((o: Order) => o.created_at <= filters.date_to!)
      }
      if (filters.search) {
        const search = filters.search.toLowerCase()
        orders = orders.filter((o: Order) => 
          o.id.toLowerCase().includes(search) ||
          o.customer_name.toLowerCase().includes(search) ||
          o.customer_email.toLowerCase().includes(search)
        )
      }

      // Sort by created_at descending
      orders.sort((a: Order, b: Order) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )

      const total = orders.length
      const start = (page - 1) * limit
      const paginatedOrders = orders.slice(start, start + limit)

      return { orders: paginatedOrders, total, error: null }
    }

    // Real Supabase query
    let query = supabase.from('orders').select('*', { count: 'exact' })

    // Apply filters
    if (filters.customer_id) {
      query = query.eq('customer_id', filters.customer_id)
    }
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.payment_status) {
      query = query.eq('payment_status', filters.payment_status)
    }
    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from)
    }
    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to)
    }
    if (filters.search) {
      query = query.or(`id.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%`)
    }

    // Sort and paginate
    query = query.order('created_at', { ascending: false })
    const start = (page - 1) * limit
    query = query.range(start, start + limit - 1)

    const { data: orders, error, count } = await query

    if (error) {
      return { orders: [], total: 0, error: error.message }
    }

    return { orders: orders as Order[], total: count || 0, error: null }
  } catch (error: any) {
    return { orders: [], total: 0, error: error.message || 'Xatolik yuz berdi' }
  }
}

// Get customer orders
export async function getCustomerOrders(customerId: string): Promise<OrderListResult> {
  return listOrders({ customer_id: customerId })
}

// Get order statistics
export async function getOrderStatistics(customerId?: string): Promise<{
  total: number
  pending: number
  confirmed: number
  processing: number
  shipped: number
  delivered: number
  cancelled: number
  totalRevenue: number
  error: string | null
}> {
  try {
    const { orders, error } = await listOrders(
      customerId ? { customer_id: customerId } : {},
      1,
      1000
    )

    if (error) {
      return {
        total: 0,
        pending: 0,
        confirmed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalRevenue: 0,
        error,
      }
    }

    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders
        .filter(o => o.payment_status === 'paid')
        .reduce((sum, o) => sum + o.total, 0),
      error: null,
    }

    return stats
  } catch (error: any) {
    return {
      total: 0,
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      totalRevenue: 0,
      error: error.message || 'Xatolik yuz berdi',
    }
  }
}
