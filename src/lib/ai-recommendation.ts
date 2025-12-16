/**
 * AI Recommendation Engine
 * 
 * Mahsulotlarni turli parametrlar bo'yicha baholaydi va eng yaxshilarini yuqoriga ko'taradi:
 * - Rating (Reyting)
 * - Sales Speed (Sotilish tezligi)
 * - Price Competitiveness (Narx raqobatbardoshligi)
 * - Stock Availability (Omborda mavjudligi)
 * - Seller Performance (Sotuvchi ko'rsatkichi)
 */

export interface AISettings {
  ratingWeight: number        // 0-100: Reyting og'irligi
  salesSpeedWeight: number     // 0-100: Sotilish tezligi og'irligi
  priceWeight: number          // 0-100: Narx og'irligi
  stockWeight: number          // 0-100: Ombor og'irligi
  sellerWeight: number         // 0-100: Sotuvchi og'irligi
  
  // Thresholds
  minRating: number            // Minimal reyting (0-5)
  minSalesPerDay: number       // Minimal kunlik sotuvlar
  maxPriceDeviation: number    // Maksimal narx farqi (%)
  minStockLevel: number        // Minimal ombor darajasi
  
  // Boost factors
  newProductBoost: number      // Yangi mahsulot boost (%)
  trendingBoost: number        // Trend mahsulot boost (%)
  seasonalBoost: number        // Mavsumiy mahsulot boost (%)
}

export interface Product {
  id: string
  title: string
  price: number
  rating: number
  reviewCount: number
  salesCount: number
  salesLastWeek: number
  stock: number
  createdAt: string
  categoryId: string
  sellerId: string
  views: number
  trending: boolean
  seasonal: boolean
}

export interface ScoredProduct extends Product {
  aiScore: number
  scoreBreakdown: {
    ratingScore: number
    salesSpeedScore: number
    priceScore: number
    stockScore: number
    sellerScore: number
    boostScore: number
  }
}

// Default AI settings
export const defaultAISettings: AISettings = {
  ratingWeight: 25,
  salesSpeedWeight: 30,
  priceWeight: 20,
  stockWeight: 15,
  sellerWeight: 10,
  
  minRating: 3.5,
  minSalesPerDay: 1,
  maxPriceDeviation: 30,
  minStockLevel: 5,
  
  newProductBoost: 10,
  trendingBoost: 15,
  seasonalBoost: 20,
}

/**
 * Calculate rating score (0-100)
 */
function calculateRatingScore(product: Product, settings: AISettings): number {
  if (product.rating < settings.minRating) return 0
  
  // Rating score based on rating and review count
  const ratingScore = (product.rating / 5) * 100
  const reviewBonus = Math.min(product.reviewCount / 100, 1) * 20 // Max 20% bonus
  
  return Math.min(ratingScore + reviewBonus, 100)
}

/**
 * Calculate sales speed score (0-100)
 */
function calculateSalesSpeedScore(product: Product, settings: AISettings, avgSalesSpeed: number): number {
  const salesPerDay = product.salesLastWeek / 7
  
  if (salesPerDay < settings.minSalesPerDay) return 0
  
  // Compare to average sales speed
  const relativeSpeed = salesPerDay / (avgSalesSpeed || 1)
  const score = Math.min(relativeSpeed * 50, 100)
  
  return score
}

/**
 * Calculate price competitiveness score (0-100)
 */
function calculatePriceScore(product: Product, settings: AISettings, avgPrice: number): number {
  if (!avgPrice) return 50 // Neutral if no comparison
  
  const priceDeviation = ((product.price - avgPrice) / avgPrice) * 100
  
  // Lower price = higher score
  if (priceDeviation < -settings.maxPriceDeviation) {
    // Too cheap, might be suspicious
    return 30
  } else if (priceDeviation > settings.maxPriceDeviation) {
    // Too expensive
    return 20
  } else {
    // Linear score: cheaper = better
    const score = 100 - ((priceDeviation + settings.maxPriceDeviation) / (settings.maxPriceDeviation * 2)) * 100
    return Math.max(0, Math.min(100, score))
  }
}

/**
 * Calculate stock availability score (0-100)
 */
function calculateStockScore(product: Product, settings: AISettings): number {
  if (product.stock < settings.minStockLevel) return 0
  
  // Logarithmic scale: having 100 items is not 10x better than having 10
  const score = Math.min((Math.log10(product.stock) / Math.log10(1000)) * 100, 100)
  
  return score
}

/**
 * Calculate seller performance score (0-100)
 * This would typically use seller metrics from database
 */
function calculateSellerScore(product: Product): number {
  // Placeholder: In real implementation, fetch seller metrics
  // For now, use product metrics as proxy
  const conversionRate = product.salesCount / (product.views || 1)
  const score = Math.min(conversionRate * 1000, 100)
  
  return score
}

/**
 * Calculate boost score based on special factors
 */
function calculateBoostScore(product: Product, settings: AISettings): number {
  let boost = 0
  
  // New product boost (within 30 days)
  const daysSinceCreated = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  if (daysSinceCreated <= 30) {
    boost += settings.newProductBoost
  }
  
  // Trending boost
  if (product.trending) {
    boost += settings.trendingBoost
  }
  
  // Seasonal boost
  if (product.seasonal) {
    boost += settings.seasonalBoost
  }
  
  return boost
}

/**
 * Main AI recommendation function
 * Scores and sorts products based on AI settings
 */
export function scoreProducts(
  products: Product[],
  settings: AISettings = defaultAISettings
): ScoredProduct[] {
  // Calculate category averages for comparison
  const avgPrice = products.reduce((sum, p) => sum + p.price, 0) / products.length
  const avgSalesSpeed = products.reduce((sum, p) => sum + (p.salesLastWeek / 7), 0) / products.length
  
  // Score each product
  const scoredProducts: ScoredProduct[] = products.map(product => {
    const ratingScore = calculateRatingScore(product, settings)
    const salesSpeedScore = calculateSalesSpeedScore(product, settings, avgSalesSpeed)
    const priceScore = calculatePriceScore(product, settings, avgPrice)
    const stockScore = calculateStockScore(product, settings)
    const sellerScore = calculateSellerScore(product)
    const boostScore = calculateBoostScore(product, settings)
    
    // Calculate weighted total score
    const baseScore = (
      (ratingScore * settings.ratingWeight) +
      (salesSpeedScore * settings.salesSpeedWeight) +
      (priceScore * settings.priceWeight) +
      (stockScore * settings.stockWeight) +
      (sellerScore * settings.sellerWeight)
    ) / (
      settings.ratingWeight +
      settings.salesSpeedWeight +
      settings.priceWeight +
      settings.stockWeight +
      settings.sellerWeight
    )
    
    // Apply boost
    const aiScore = Math.min(baseScore + boostScore, 100)
    
    return {
      ...product,
      aiScore,
      scoreBreakdown: {
        ratingScore,
        salesSpeedScore,
        priceScore,
        stockScore,
        sellerScore,
        boostScore,
      },
    }
  })
  
  // Sort by AI score (highest first)
  return scoredProducts.sort((a, b) => b.aiScore - a.aiScore)
}

/**
 * Get recommended products for homepage
 */
export function getRecommendedProducts(
  products: Product[],
  settings: AISettings = defaultAISettings,
  limit: number = 12
): ScoredProduct[] {
  const scored = scoreProducts(products, settings)
  return scored.slice(0, limit)
}

/**
 * Get similar products based on category and price range
 */
export function getSimilarProducts(
  product: Product,
  allProducts: Product[],
  settings: AISettings = defaultAISettings,
  limit: number = 6
): ScoredProduct[] {
  // Filter by same category and similar price range
  const priceRange = product.price * 0.3 // ±30%
  const similar = allProducts.filter(p => 
    p.id !== product.id &&
    p.categoryId === product.categoryId &&
    Math.abs(p.price - product.price) <= priceRange
  )
  
  const scored = scoreProducts(similar, settings)
  return scored.slice(0, limit)
}

/**
 * Get trending products (high sales speed + views)
 */
export function getTrendingProducts(
  products: Product[],
  settings: AISettings = defaultAISettings,
  limit: number = 8
): ScoredProduct[] {
  // Boost trending weight temporarily
  const trendingSettings = {
    ...settings,
    salesSpeedWeight: 50,
    trendingBoost: 30,
  }
  
  const scored = scoreProducts(products, trendingSettings)
  return scored.slice(0, limit)
}

/**
 * Get best deals (good rating + low price)
 */
export function getBestDeals(
  products: Product[],
  settings: AISettings = defaultAISettings,
  limit: number = 8
): ScoredProduct[] {
  // Boost price weight temporarily
  const dealSettings = {
    ...settings,
    priceWeight: 50,
    ratingWeight: 30,
  }
  
  const scored = scoreProducts(products, dealSettings)
  return scored.slice(0, limit)
}
