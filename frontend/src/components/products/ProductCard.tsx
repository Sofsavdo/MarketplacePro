'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  HeartIcon,
  ShoppingCartIcon,
  StarIcon,
  EyeIcon,
  MapPinIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  isNew: boolean;
  discount: number;
  inStock: boolean;
  merchant: string;
  location: string;
  description: string;
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode }) => {
  const [isLiked, setIsLiked] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex">
          {/* Product Image */}
          <div className="relative w-48 h-48 flex-shrink-0">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
            {product.isNew && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                Yangi
              </div>
            )}
            {product.discount > 0 && (
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                -{product.discount}%
              </div>
            )}
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="absolute bottom-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
            >
              {isLiked ? (
                <HeartSolidIcon className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* Product Info */}
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <div className="flex items-center space-x-1">
                    <UserIcon className="h-4 w-4" />
                    <span>{product.merchant}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{product.location}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({formatNumber(product.reviews)})</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(product.price)}
                </div>
                {product.originalPrice > product.price && (
                  <div className="text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded ${
                  product.inStock 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {product.inStock ? 'Sotuvda' : 'Tugagan'}
                </span>
                <span className="text-sm text-gray-500">{product.category}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                  <EyeIcon className="h-5 w-5" />
                </button>
                <button 
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                      const response = await fetch('/api/cart/add', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          productId: product.id,
                          quantity: 1
                        }),
                      });
                      
                      if (response.ok) {
                        // Show success message or update cart count
                        console.log('Mahsulot savatga qo\'shildi');
                      }
                    } catch (error) {
                      console.error('Savatga qo\'shishda xatolik:', error);
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <ShoppingCartIcon className="h-4 w-4" />
                  <span>Savatga qo'shish</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid view
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-gray-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-gray-900">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
              Yangi
            </div>
          )}
          {product.discount > 0 && (
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
              -{product.discount}%
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center pb-4 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex items-center space-x-2">
            <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl">
              <EyeIcon className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isLiked ? (
                <HeartSolidIcon className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5 text-gray-700" />
              )}
            </button>
                         <button 
               onClick={async (e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 try {
                   const response = await fetch('/api/cart/add', {
                     method: 'POST',
                     headers: {
                       'Content-Type': 'application/json',
                     },
                     body: JSON.stringify({
                       productId: product.id,
                       quantity: 1
                     }),
                   });
                   
                   if (response.ok) {
                     console.log('Mahsulot savatga qo\'shildi');
                   }
                 } catch (error) {
                   console.error('Savatga qo\'shishda xatolik:', error);
                 }
               }}
               className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
             >
               <ShoppingCartIcon className="h-5 w-5" />
             </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category & Rating */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
            {product.category}
          </span>
          <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full">
            <StarIcon className="h-3 w-3 text-yellow-500 fill-current" />
            <span className="ml-1 text-xs font-medium text-yellow-700 dark:text-yellow-300">
              {product.rating}
            </span>
            <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
              ({formatNumber(product.reviews)})
            </span>
          </div>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 text-sm leading-tight">
          {product.name}
        </h3>

        {/* Merchant */}
        <div className="flex items-center space-x-1 mb-3">
          <UserIcon className="h-3 w-3 text-gray-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400">{product.merchant}</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{product.location}</span>
        </div>

        {/* Price & Stock */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </div>
            {product.originalPrice > product.price && (
              <div className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>
          
          <span className={`px-3 py-1 text-xs rounded-full font-medium ${
            product.inStock 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {product.inStock ? 'Sotuvda' : 'Tugagan'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard; 