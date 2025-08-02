'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  HeartIcon,
  StarIcon,
  FilterIcon,
  SortAscendingIcon,
  ViewGridIcon,
  ViewListIcon
} from '@heroicons/react/24/outline';
import ProductCard from '@/components/products/ProductCard';
import CategoryFilter from '@/components/products/CategoryFilter';
import PriceFilter from '@/components/products/PriceFilter';
import SortOptions from '@/components/products/SortOptions';

const MarketplacePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [sortBy, setSortBy] = useState<string>('popular');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // API functions
  const fetchProducts = async (page = 1, reset = false) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        sort_by: sortBy,
        min_price: priceRange[0].toString(),
        max_price: priceRange[1].toString()
      });

      if (selectedCategory !== 'all') {
        params.append('category_id', selectedCategory);
      }

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/marketplace/products?${params}`);
      const data = await response.json();

      if (data.success) {
        if (reset) {
          setProducts(data.data.products);
        } else {
          setProducts(prev => [...prev, ...data.data.products]);
        }
        setHasMore(data.data.pagination.page < data.data.pagination.pages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Mahsulotlarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/marketplace/categories');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Kategoriyalarni yuklashda xatolik:', error);
    }
  };

  // Load more products
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchProducts(currentPage + 1);
    }
  };

  // Search function
  const handleSearch = () => {
    setCurrentPage(1);
    fetchProducts(1, true);
  };

  // Effects
  useEffect(() => {
    fetchProducts(1, true);
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(1, true);
  }, [selectedCategory, sortBy, priceRange]);

  // Mock data fallback
  const mockProducts = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max 256GB',
      price: 15000000,
      originalPrice: 18000000,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
      rating: 4.8,
      reviews: 1250,
      category: 'Electronics',
      isNew: true,
      discount: 17,
      inStock: true,
      merchant: 'Apple Store',
      location: 'Toshkent',
      description: 'Eng yangi iPhone 15 Pro Max, 256GB xotira, Titanium dizayn'
    },
    // ... other mock products
  ];

  const mockCategories = [
    { id: 'all', name: 'Barcha kategoriyalar', count: products.length },
    { id: 'electronics', name: 'Elektronika', count: 8 },
    { id: 'fashion', name: 'Moda', count: 4 },
    { id: 'home', name: 'Uy va bog\'', count: 0 },
    { id: 'sports', name: 'Sport', count: 0 },
    { id: 'beauty', name: 'Go\'zallik', count: 0 },
    { id: 'books', name: 'Kitoblar', count: 0 },
    { id: 'toys', name: 'O\'yinchoqlar', count: 0 }
  ];

  // Use real data or fallback to mock
  const displayProducts = products.length > 0 ? products : mockProducts;
  const displayCategories = categories.length > 0 ? categories : mockCategories;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              AFFILIMART Marketplace
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              O'zbekistondagi eng yirik marketplace. 10,000+ mahsulot, 500+ sotuvchi, eng yaxshi narxlar!
            </motion.p>
          </div>

          {/* Search Bar */}
          <motion.div 
            className="max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                             <input
                 type="text"
                 placeholder="Mahsulot, brend yoki kategoriya qidiring..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                 className="w-full pl-16 pr-6 py-5 bg-white/95 backdrop-blur-sm text-gray-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-white/50 text-lg shadow-2xl"
               />
               <button 
                 onClick={handleSearch}
                 className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold"
               >
                 Qidirish
               </button>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">10,000+</div>
              <div className="text-sm opacity-80">Mahsulotlar</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
              <div className="text-sm opacity-80">Sotuvchilar</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">50,000+</div>
              <div className="text-sm opacity-80">Mamnun mijozlar</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
              <div className="text-sm opacity-80">Qo'llab-quvvatlash</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-4 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <FilterIcon className="h-5 w-5 mr-2 text-blue-600" />
                Filtrlar
              </h3>

                             {/* Categories */}
               <CategoryFilter
                 categories={displayCategories}
                 selectedCategory={selectedCategory}
                 onCategoryChange={setSelectedCategory}
               />

              {/* Price Range */}
              <PriceFilter
                priceRange={priceRange}
                onPriceChange={setPriceRange}
              />

              {/* Sort Options */}
              <SortOptions
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                                 <span className="text-gray-600 dark:text-gray-300 font-medium">
                   {displayProducts.length} mahsulot topildi
                 </span>
                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Eng yaxshi narxlarda
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <ViewGridIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <ViewListIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

                         {/* Products Grid */}
             {loading && displayProducts.length === 0 ? (
               <div className="flex items-center justify-center py-12">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
               </div>
             ) : (
               <div className={`grid gap-6 ${
                 viewMode === 'grid' 
                   ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                   : 'grid-cols-1'
               }`}>
                 {displayProducts.map((product) => (
                   <ProductCard
                     key={product.id}
                     product={product}
                     viewMode={viewMode}
                   />
                 ))}
               </div>
             )}

                         {/* Load More */}
             {hasMore && (
               <div className="text-center mt-12">
                 <button 
                   onClick={loadMore}
                   disabled={loading}
                   className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   {loading ? 'Yuklanmoqda...' : 'Ko\'proq mahsulotlar yuklash'}
                 </button>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage; 