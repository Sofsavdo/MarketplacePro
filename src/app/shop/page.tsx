'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import MainLayout from '@/components/layout/MainLayout'
import { 
  Search, Filter, Star, Heart, ShoppingCart, Grid, List, 
  SlidersHorizontal, X, Check, TrendingUp, Zap, Award, ChevronDown
} from 'lucide-react'
import { useCartStore } from '@/store/cart'

interface Product {
  id: number
  title: string
  image: string
  price: number
  oldPrice?: number
  rating: number
  reviews: number
  category: string
  brand: string
  inStock: boolean
  discount?: number
  isFeatured?: boolean
  isNew?: boolean
}

export default function ShopPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 50000000])
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('popular')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(true)
  const [inStockOnly, setInStockOnly] = useState(false)
  const { addItem } = useCartStore()

  const categories = [
    { id: 'electronics', name: 'Elektronika', count: 245 },
    { id: 'fashion', name: 'Kiyim', count: 189 },
    { id: 'home', name: 'Uy-ro\'zg\'or', count: 156 },
    { id: 'sports', name: 'Sport', count: 98 },
    { id: 'beauty', name: 'Go\'zallik', count: 134 },
    { id: 'books', name: 'Kitoblar', count: 87 },
  ]

  const brands = [
    { id: 'apple', name: 'Apple', count: 45 },
    { id: 'samsung', name: 'Samsung', count: 38 },
    { id: 'nike', name: 'Nike', count: 52 },
    { id: 'adidas', name: 'Adidas', count: 41 },
    { id: 'sony', name: 'Sony', count: 29 },
  ]

  const products: Product[] = [
    {
      id: 1,
      title: 'iPhone 15 Pro Max 256GB',
      image: 'https://images.unsplash.com/photo-1696446702183-cbd50c2a2476?w=400',
      price: 15500000,
      oldPrice: 17000000,
      rating: 4.8,
      reviews: 124,
      category: 'electronics',
      brand: 'apple',
      inStock: true,
      discount: 9,
      isFeatured: true,
    },
    {
      id: 2,
      title: 'Samsung Galaxy S24 Ultra 512GB',
      image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
      price: 13200000,
      oldPrice: 14500000,
      rating: 4.7,
      reviews: 89,
      category: 'electronics',
      brand: 'samsung',
      inStock: true,
      discount: 9,
      isNew: true,
    },
    {
      id: 3,
      title: 'MacBook Pro 14" M3 Pro',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      price: 28000000,
      oldPrice: 31000000,
      rating: 4.9,
      reviews: 156,
      category: 'electronics',
      brand: 'apple',
      inStock: true,
      discount: 10,
      isFeatured: true,
    },
    {
      id: 4,
      title: 'Sony WH-1000XM5 Headphones',
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400',
      price: 4500000,
      oldPrice: 5200000,
      rating: 4.6,
      reviews: 78,
      category: 'electronics',
      brand: 'sony',
      inStock: true,
      discount: 13,
    },
    {
      id: 5,
      title: 'Nike Air Max 270',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      price: 1800000,
      oldPrice: 2200000,
      rating: 4.5,
      reviews: 92,
      category: 'fashion',
      brand: 'nike',
      inStock: true,
      discount: 18,
    },
    {
      id: 6,
      title: 'Adidas Ultraboost 23',
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
      price: 2100000,
      oldPrice: 2500000,
      rating: 4.7,
      reviews: 67,
      category: 'fashion',
      brand: 'adidas',
      inStock: false,
    },
  ]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory.length === 0 || selectedCategory.includes(product.category)
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesRating = product.rating >= minRating
    const matchesStock = !inStockOnly || product.inStock
    
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesRating && matchesStock
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price
      case 'price-high': return b.price - a.price
      case 'rating': return b.rating - a.rating
      case 'newest': return b.id - a.id
      default: return b.reviews - a.reviews
    }
  })

  const toggleCategory = (categoryId: string) => {
    setSelectedCategory(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const toggleBrand = (brandId: string) => {
    setSelectedBrands(prev =>
      prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    )
  }

  const clearFilters = () => {
    setSelectedCategory([])
    setSelectedBrands([])
    setPriceRange([0, 50000000])
    setMinRating(0)
    setInStockOnly(false)
    setSearchQuery('')
  }

  const activeFiltersCount = selectedCategory.length + selectedBrands.length + 
    (minRating > 0 ? 1 : 0) + (inStockOnly ? 1 : 0)

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Do'kon</h1>
            <p className="text-gray-600">
              {filteredProducts.length} ta mahsulot topildi
            </p>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Mahsulot qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="popular">Mashhur</option>
                <option value="newest">Yangi</option>
                <option value="price-low">Arzon</option>
                <option value="price-high">Qimmat</option>
                <option value="rating">Reyting</option>
              </select>

              {/* View Mode */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Toggle Filters */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span>Filtrlar</span>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-1 bg-primary-600 text-white text-xs rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Filters Sidebar */}
            {showFilters && (
              <div className="w-80 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Filtrlar</h3>
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Tozalash
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {/* Categories */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Kategoriyalar</h4>
                      <div className="space-y-2">
                        {categories.map(category => (
                          <label key={category.id} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedCategory.includes(category.id)}
                              onChange={() => toggleCategory(category.id)}
                              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                            />
                            <span className="flex-1 text-gray-700">{category.name}</span>
                            <span className="text-sm text-gray-500">({category.count})</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Brands */}
                    <div className="pt-6 border-t">
                      <h4 className="font-semibold text-gray-900 mb-3">Brendlar</h4>
                      <div className="space-y-2">
                        {brands.map(brand => (
                          <label key={brand.id} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(brand.id)}
                              onChange={() => toggleBrand(brand.id)}
                              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                            />
                            <span className="flex-1 text-gray-700">{brand.name}</span>
                            <span className="text-sm text-gray-500">({brand.count})</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="pt-6 border-t">
                      <h4 className="font-semibold text-gray-900 mb-3">Narx oralig'i</h4>
                      <div className="space-y-4">
                        <input
                          type="range"
                          min="0"
                          max="50000000"
                          step="100000"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                          className="w-full"
                        />
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>0 so'm</span>
                          <span>{(priceRange[1] / 1000000).toFixed(1)}M so'm</span>
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="pt-6 border-t">
                      <h4 className="font-semibold text-gray-900 mb-3">Reyting</h4>
                      <div className="space-y-2">
                        {[4, 3, 2, 1].map(rating => (
                          <label key={rating} className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="radio"
                              name="rating"
                              checked={minRating === rating}
                              onChange={() => setMinRating(rating)}
                              className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                            />
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="text-sm text-gray-600 ml-2">va yuqori</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* In Stock */}
                    <div className="pt-6 border-t">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={inStockOnly}
                          onChange={(e) => setInStockOnly(e.target.checked)}
                          className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                        />
                        <span className="text-gray-700">Faqat mavjud mahsulotlar</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid/List */}
            <div className="flex-1">
              {sortedProducts.length === 0 ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Mahsulot topilmadi</h3>
                  <p className="text-gray-600 mb-6">Qidiruv parametrlarini o'zgartiring</p>
                  <button
                    onClick={clearFilters}
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Filtrlarni tozalash
                  </button>
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
                }>
                  {sortedProducts.map(product => (
                    <div
                      key={product.id}
                      className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      <Link 
                        href={`/product/${product.id}`}
                        className={viewMode === 'list' ? 'w-48 flex-shrink-0' : 'relative aspect-square'}
                      >
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                        {product.discount && (
                          <div className="absolute top-3 left-3 px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-lg">
                            -{product.discount}%
                          </div>
                        )}
                        {product.isNew && (
                          <div className="absolute top-3 right-3 px-3 py-1 bg-green-600 text-white text-sm font-bold rounded-lg">
                            YANGI
                          </div>
                        )}
                        {product.isFeatured && (
                          <div className="absolute top-12 right-3 p-2 bg-yellow-400 text-white rounded-lg">
                            <Award className="w-4 h-4" />
                          </div>
                        )}
                      </Link>

                      <div className="p-4 flex-1">
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary-600">
                            {product.title}
                          </h3>
                        </Link>

                        <div className="flex items-center space-x-2 mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {product.rating} ({product.reviews})
                          </span>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-primary-600">
                              {product.price.toLocaleString('uz-UZ')} so'm
                            </span>
                          </div>
                          {product.oldPrice && (
                            <span className="text-sm text-gray-500 line-through">
                              {product.oldPrice.toLocaleString('uz-UZ')} so'm
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => addItem({
                              id: product.id,
                              title: product.title,
                              price: product.price,
                              image: product.image,
                            })}
                            disabled={!product.inStock}
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>{product.inStock ? 'Savatga' : 'Tugagan'}</span>
                          </button>
                          <button className="p-2 border border-gray-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors">
                            <Heart className="w-5 h-5 text-gray-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
