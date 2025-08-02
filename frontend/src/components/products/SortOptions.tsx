'use client';

import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface SortOptionsProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({
  sortBy,
  onSortChange
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const sortOptions = [
    { value: 'popular', label: 'Mashhur' },
    { value: 'newest', label: 'Yangi' },
    { value: 'price-low', label: 'Narx: pastdan yuqoriga' },
    { value: 'price-high', label: 'Narx: yuqoridan pastga' },
    { value: 'rating', label: 'Baho' },
    { value: 'discount', label: 'Chegirma' }
  ];

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-white mb-3"
      >
        <span>Tartiblash</span>
        <ChevronDownIcon 
          className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {isExpanded && (
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="sort"
                value={option.value}
                checked={sortBy === option.value}
                onChange={(e) => onSortChange(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortOptions; 