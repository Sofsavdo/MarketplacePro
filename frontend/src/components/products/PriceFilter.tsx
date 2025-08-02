'use client';

import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface PriceFilterProps {
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  priceRange,
  onPriceChange
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [minPrice, setMinPrice] = React.useState(priceRange[0]);
  const [maxPrice, setMaxPrice] = React.useState(priceRange[1]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleApply = () => {
    onPriceChange([minPrice, maxPrice]);
  };

  const handleReset = () => {
    setMinPrice(0);
    setMaxPrice(10000000);
    onPriceChange([0, 10000000]);
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-white mb-3"
      >
        <span>Narx</span>
        <ChevronDownIcon 
          className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {isExpanded && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Minimal narx
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="0"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                Maksimal narx
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="10,000,000"
              />
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {formatPrice(minPrice)} - {formatPrice(maxPrice)}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleApply}
              className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Qo'llash
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Tozalash
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceFilter; 