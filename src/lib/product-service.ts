import { supabase } from './supabase-client'

export interface Product {
  id: string
  seller_id: string
  title: string
  description: string
  price: number
  discount_price?: number
  category: string
  subcategory?: string
  brand?: string
  images: string[]
  stock: number
  sku?: string
  specifications?: Record<string, any>
  tags?: string[]
  status: 'active' | 'draft' | 'archived'
  views: number
  sales: number
  rating: number
  reviews_count: number
  created_at: string
  updated_at: string
}

export interface CreateProductData {
  title: string
  description: string
  price: number
  discount_price?: number
  category: string
  subcategory?: string
  brand?: string
  images: string[]
  stock: number
  sku?: string
  specifications?: Record<string, any>
  tags?: string[]
  status?: 'active' | 'draft'
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string
}

export interface ProductFilters {
  category?: string
  subcategory?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  status?: string
  search?: string
}

export interface ProductListResult {
  products: Product[]
  total: number
  error: string | null
}

// Create product
export async function createProduct(
  sellerId: string,
  data: CreateProductData
): Promise<{ product: Product | null; error: string | null }> {
  try {
    // Validate required fields
    if (!data.title || data.title.trim().length === 0) {
      return { product: null, error: 'Mahsulot nomi kiritilishi shart' }
    }

    if (!data.price || data.price <= 0) {
      return { product: null, error: 'Narx 0 dan katta bo\'lishi kerak' }
    }

    if (!data.category) {
      return { product: null, error: 'Kategoriya tanlanishi shart' }
    }

    if (!data.images || data.images.length === 0) {
      return { product: null, error: 'Kamida bitta rasm yuklash kerak' }
    }

    // Check if Supabase is configured
    if (!supabase) {
      // Mock mode
      const mockProduct: Product = {
        id: Date.now().toString(),
        seller_id: sellerId,
        ...data,
        status: data.status || 'draft',
        views: 0,
        sales: 0,
        rating: 0,
        reviews_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Store in localStorage
      const products = JSON.parse(localStorage.getItem('products') || '[]')
      products.push(mockProduct)
      localStorage.setItem('products', JSON.stringify(products))

      return { product: mockProduct, error: null }
    }

    // Real Supabase insert
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        seller_id: sellerId,
        ...data,
        status: data.status || 'draft',
        views: 0,
        sales: 0,
        rating: 0,
        reviews_count: 0,
      })
      .select()
      .single()

    if (error) {
      return { product: null, error: error.message }
    }

    return { product: product as Product, error: null }
  } catch (error: any) {
    return { product: null, error: error.message || 'Mahsulot yaratishda xatolik' }
  }
}

// Get product by ID
export async function getProduct(productId: string): Promise<{ product: Product | null; error: string | null }> {
  try {
    if (!supabase) {
      // Mock mode
      const products = JSON.parse(localStorage.getItem('products') || '[]')
      const product = products.find((p: Product) => p.id === productId)
      
      if (!product) {
        return { product: null, error: 'Mahsulot topilmadi' }
      }

      // Increment views
      product.views += 1
      localStorage.setItem('products', JSON.stringify(products))

      return { product, error: null }
    }

    // Real Supabase query
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (error) {
      return { product: null, error: error.message }
    }

    if (!product) {
      return { product: null, error: 'Mahsulot topilmadi' }
    }

    // Increment views
    await supabase
      .from('products')
      .update({ views: product.views + 1 })
      .eq('id', productId)

    return { product: { ...product, views: product.views + 1 } as Product, error: null }
  } catch (error: any) {
    return { product: null, error: error.message || 'Xatolik yuz berdi' }
  }
}

// Update product
export async function updateProduct(data: UpdateProductData): Promise<{ product: Product | null; error: string | null }> {
  try {
    const { id, ...updateData } = data

    if (!supabase) {
      // Mock mode
      const products = JSON.parse(localStorage.getItem('products') || '[]')
      const index = products.findIndex((p: Product) => p.id === id)
      
      if (index === -1) {
        return { product: null, error: 'Mahsulot topilmadi' }
      }

      products[index] = {
        ...products[index],
        ...updateData,
        updated_at: new Date().toISOString(),
      }
      localStorage.setItem('products', JSON.stringify(products))

      return { product: products[index], error: null }
    }

    // Real Supabase update
    const { data: product, error } = await supabase
      .from('products')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return { product: null, error: error.message }
    }

    return { product: product as Product, error: null }
  } catch (error: any) {
    return { product: null, error: error.message || 'Mahsulotni yangilashda xatolik' }
  }
}

// Delete product
export async function deleteProduct(productId: string): Promise<{ error: string | null }> {
  try {
    if (!supabase) {
      // Mock mode
      const products = JSON.parse(localStorage.getItem('products') || '[]')
      const filtered = products.filter((p: Product) => p.id !== productId)
      localStorage.setItem('products', JSON.stringify(filtered))
      return { error: null }
    }

    // Real Supabase delete
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (error: any) {
    return { error: error.message || 'Mahsulotni o\'chirishda xatolik' }
  }
}

// List products with filters
export async function listProducts(
  filters: ProductFilters = {},
  page: number = 1,
  limit: number = 20
): Promise<ProductListResult> {
  try {
    if (!supabase) {
      // Mock mode
      let products = JSON.parse(localStorage.getItem('products') || '[]')

      // Apply filters
      if (filters.category) {
        products = products.filter((p: Product) => p.category === filters.category)
      }
      if (filters.subcategory) {
        products = products.filter((p: Product) => p.subcategory === filters.subcategory)
      }
      if (filters.brand) {
        products = products.filter((p: Product) => p.brand === filters.brand)
      }
      if (filters.minPrice !== undefined) {
        products = products.filter((p: Product) => p.price >= filters.minPrice!)
      }
      if (filters.maxPrice !== undefined) {
        products = products.filter((p: Product) => p.price <= filters.maxPrice!)
      }
      if (filters.inStock) {
        products = products.filter((p: Product) => p.stock > 0)
      }
      if (filters.status) {
        products = products.filter((p: Product) => p.status === filters.status)
      }
      if (filters.search) {
        const search = filters.search.toLowerCase()
        products = products.filter((p: Product) => 
          p.title.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search)
        )
      }

      const total = products.length
      const start = (page - 1) * limit
      const paginatedProducts = products.slice(start, start + limit)

      return { products: paginatedProducts, total, error: null }
    }

    // Real Supabase query
    let query = supabase.from('products').select('*', { count: 'exact' })

    // Apply filters
    if (filters.category) {
      query = query.eq('category', filters.category)
    }
    if (filters.subcategory) {
      query = query.eq('subcategory', filters.subcategory)
    }
    if (filters.brand) {
      query = query.eq('brand', filters.brand)
    }
    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice)
    }
    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice)
    }
    if (filters.inStock) {
      query = query.gt('stock', 0)
    }
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    // Pagination
    const start = (page - 1) * limit
    query = query.range(start, start + limit - 1)

    const { data: products, error, count } = await query

    if (error) {
      return { products: [], total: 0, error: error.message }
    }

    return { products: products as Product[], total: count || 0, error: null }
  } catch (error: any) {
    return { products: [], total: 0, error: error.message || 'Xatolik yuz berdi' }
  }
}

// Get seller products
export async function getSellerProducts(sellerId: string): Promise<ProductListResult> {
  try {
    if (!supabase) {
      // Mock mode
      const products = JSON.parse(localStorage.getItem('products') || '[]')
      const sellerProducts = products.filter((p: Product) => p.seller_id === sellerId)
      return { products: sellerProducts, total: sellerProducts.length, error: null }
    }

    // Real Supabase query
    const { data: products, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false })

    if (error) {
      return { products: [], total: 0, error: error.message }
    }

    return { products: products as Product[], total: count || 0, error: null }
  } catch (error: any) {
    return { products: [], total: 0, error: error.message || 'Xatolik yuz berdi' }
  }
}
