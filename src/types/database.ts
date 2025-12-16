export type UserRole = 'admin' | 'seller' | 'blogger' | 'customer'
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending'
export type ProductStatus = 'pending' | 'approved' | 'rejected' | 'out_of_stock'
export type OrderStatus = 'pending' | 'confirmed' | 'warehouse' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type PaymentMethod = 'click' | 'payme' | 'uzum' | 'cash'
export type EarningStatus = 'pending' | 'available' | 'paid'

export interface User {
  id: string
  email: string
  phone: string
  password_hash: string
  full_name: string
  role: UserRole
  status: UserStatus
  avatar_url?: string
  telegram_id?: number
  telegram_username?: string
  email_verified: boolean
  phone_verified: boolean
  created_at: string
  updated_at: string
  last_login_at?: string
}

export interface Seller {
  id: string
  user_id: string
  company_name: string
  inn?: string
  legal_address?: string
  bank_name?: string
  bank_account?: string
  mfo?: string
  commission_rate: number
  total_sales: number
  total_products: number
  rating: number
  verified: boolean
  verified_at?: string
  created_at: string
  updated_at: string
}

export interface Blogger {
  id: string
  user_id: string
  promo_code: string
  commission_rate: number
  telegram_channel?: string
  telegram_followers: number
  instagram_username?: string
  instagram_followers: number
  total_clicks: number
  total_conversions: number
  total_earnings: number
  pending_earnings: number
  paid_earnings: number
  rating: number
  verified: boolean
  verified_at?: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parent_id?: string
  image_url?: string
  icon?: string
  sort_order: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  seller_id: string
  category_id: string
  title: string
  slug: string
  description: string
  short_description?: string
  images: string[]
  video_url?: string
  cost_price: number
  base_price: number
  bonus_value: number
  blogger_commission: number
  platform_fee: number
  final_price: number
  stock: number
  sku?: string
  barcode?: string
  weight?: number
  dimensions?: string
  status: ProductStatus
  ai_verified: boolean
  ai_verification_score?: number
  ai_verification_notes?: string
  admin_notes?: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string[]
  views: number
  clicks: number
  sales: number
  rating: number
  reviews_count: number
  warehouse_location?: string
  warehouse_received_at?: string
  created_at: string
  updated_at: string
  published_at?: string
}

export interface PromoCode {
  id: string
  blogger_id: string
  code: string
  discount_type: string
  discount_value: number
  min_order_amount: number
  max_usage?: number
  usage_count: number
  active: boolean
  expires_at?: string
  created_at: string
}

export interface ReferralLink {
  id: string
  blogger_id: string
  product_id?: string
  short_code: string
  full_url: string
  clicks: number
  conversions: number
  created_at: string
}

export interface Order {
  id: string
  order_number: string
  customer_id: string
  blogger_id?: string
  promo_code?: string
  subtotal: number
  delivery_fee: number
  discount: number
  total: number
  delivery_address: string
  delivery_city: string
  delivery_region?: string
  delivery_phone: string
  delivery_notes?: string
  tracking_number?: string
  status: OrderStatus
  payment_status: PaymentStatus
  payment_method?: PaymentMethod
  confirmed_at?: string
  warehouse_at?: string
  shipped_at?: string
  delivered_at?: string
  cancelled_at?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  seller_id: string
  product_title: string
  product_image?: string
  quantity: number
  unit_price: number
  subtotal: number
  blogger_commission: number
  platform_fee: number
  seller_amount: number
  created_at: string
}

export interface Payment {
  id: string
  order_id: string
  amount: number
  method: PaymentMethod
  status: PaymentStatus
  transaction_id?: string
  provider_response?: any
  paid_at?: string
  created_at: string
}

export interface BloggerEarning {
  id: string
  blogger_id: string
  order_id: string
  order_item_id: string
  amount: number
  status: EarningStatus
  available_at?: string
  paid_at?: string
  payment_method?: string
  payment_reference?: string
  created_at: string
}

export interface SellerPayout {
  id: string
  seller_id: string
  order_id: string
  order_item_id: string
  amount: number
  status: EarningStatus
  available_at?: string
  paid_at?: string
  payment_method?: string
  payment_reference?: string
  created_at: string
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  order_id?: string
  rating: number
  title?: string
  comment?: string
  images?: string[]
  verified_purchase: boolean
  helpful_count: number
  created_at: string
  updated_at: string
}

export interface WarehouseInventory {
  id: string
  product_id: string
  seller_id: string
  quantity: number
  location?: string
  received_at: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  data?: any
  read: boolean
  read_at?: string
  created_at: string
}

export interface ActivityLog {
  id: string
  user_id?: string
  action: string
  entity_type?: string
  entity_id?: string
  ip_address?: string
  user_agent?: string
  metadata?: any
  created_at: string
}
