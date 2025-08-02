'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FunnelIcon,
  XMarkIcon,
  StarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface ProductFiltersProps {
  filters: any;
  setFilters: (filters: any) => void;
}

export function ProductFilters({ filters, setFilters }: ProductFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = [
    'Elektronika',
    'Kiyim-kechak',
    'Uy va bog\'',
    'Go\'zallik va sog\'liq',
    'Sport va dam olish',
    'Avtomobil',
    'Kitoblar',
    'O\'yinchoqlar'
  ];

  const brands = [
    'Apple',
    'Samsung',
    'Nike',
    'Adidas',
    'Sony',
    'LG',
    'Canon',
    'Dell'
  ];

  const priceRanges = [
    { label: '0 - 100,000 UZS', min: 0, max: 100000 },
    { label: '100,000 - 500,000 UZS', min: 100000, max: 500000 },
    { label: '500,000 - 1,000,000 UZS', min: 500000, max: 1000000 },
    { label: '1,000,000+ UZS', min: 1000000, max: null }
  ];

  const ratings = [5, 4, 3, 2, 1];

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: [0, 1000000],
      rating: 0,
      brand: '',
      sortBy: 'newest'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Filtrlash
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FunnelIcon className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <div className={`space-y-6 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        {/* Categories */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Kategoriyalar</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={filters.category === category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Brendlar</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.brand === brand}
                  onChange={(e) => handleFilterChange('brand', e.target.checked ? brand : '')}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Narx diapazoni</h4>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <label key={range.label} className="flex items-center">
                <input
                  type="radio"
                  name="priceRange"
                  checked={filters.priceRange[0] === range.min && filters.priceRange[1] === range.max}
                  onChange={() => handleFilterChange('priceRange', [range.min, range.max])}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
          
          {/* Custom Price Range */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange[0]}
                onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange[1]}
                onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 1000000])}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Rating */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Reyting</h4>
          <div className="space-y-2">
            {ratings.map((rating) => (
              <label key={rating} className="flex items-center">
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={filters.rating === rating}
                  onChange={(e) => handleFilterChange('rating', parseInt(e.target.value))}
                  className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                />
                <div className="ml-2 flex items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-4 w-4 ${
                        i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-700">va undan yuqori</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Sort By */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Saralash</h4>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="newest">Eng yangi</option>
            <option value="price_low">Narx: pastdan yuqoriga</option>
            <option value="price_high">Narx: yuqoridan pastga</option>
            <option value="rating">Reyting</option>
            <option value="popularity">Mashhurlik</option>
          </select>
        </div>

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <XMarkIcon className="h-4 w-4 mr-2" />
          Filtrlarni tozalash
        </button>
      </div>
    </div>
  );
} 