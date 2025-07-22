import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { ProductGrid } from '@/components/product/product-grid';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Filter, SlidersHorizontal } from 'lucide-react';

export default function Category() {
  const [location] = useLocation();
  const { language, t } = useLanguage();
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    rating: '',
    fastDelivery: false,
  });

  const categorySlug = location.split('/')[2];

  const { data: category } = useQuery({
    queryKey: ['/api/categories', categorySlug],
    enabled: !!categorySlug,
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['/api/products', { categorySlug, ...filters }],
    enabled: !!categorySlug,
  });

  const categoryName = category && typeof category === 'object' && 'nameUz' in category && 'nameRu' in category
    ? (language === 'uz' ? category.nameUz : category.nameRu)
    : categorySlug;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <div className="bg-gray-200 h-8 w-48 rounded animate-pulse"></div>
            <div className="bg-gray-200 h-10 w-32 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-80 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-gray-200 h-4 rounded"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-6 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm">
            <li><a href="/" className="text-[#2A6BFF] hover:underline">{t('common.home')}</a></li>
            <li className="text-gray-500">/</li>
            <li><a href="/categories" className="text-[#2A6BFF] hover:underline">{t('common.categories')}</a></li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-900 font-medium">{categoryName}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
          <Button
            variant="outline"
            className="flex items-center space-x-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{t('common.filters')}</span>
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('product.priceMin')}
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2A6BFF] focus:border-transparent"
                placeholder="0"
                value={filters.priceMin}
                onChange={(e) => setFilters(prev => ({ ...prev, priceMin: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('product.priceMax')}
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2A6BFF] focus:border-transparent"
                placeholder="1000000"
                value={filters.priceMax}
                onChange={(e) => setFilters(prev => ({ ...prev, priceMax: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('product.rating')}
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2A6BFF] focus:border-transparent"
                value={filters.rating}
                onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
              >
                <option value="">{t('common.all')}</option>
                <option value="4">4+ ⭐</option>
                <option value="3">3+ ⭐</option>
                <option value="2">2+ ⭐</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#2A6BFF] border-gray-300 rounded focus:ring-[#2A6BFF]"
                  checked={filters.fastDelivery}
                  onChange={(e) => setFilters(prev => ({ ...prev, fastDelivery: e.target.checked }))}
                />
                <span className="text-sm font-medium text-gray-700">{t('product.fastDelivery')}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Products */}
        <ProductGrid
          products={Array.isArray(products) ? products : []}
          title={`${categoryName} (${Array.isArray(products) ? products.length : 0})`}
          columns="category"
        />
      </div>
    </div>
  );
}
