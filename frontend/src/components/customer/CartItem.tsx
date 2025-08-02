'use client';

import React from 'react';
import Image from 'next/image';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

interface CartItemProps {
  item: {
    id: number;
    product_id: number;
    quantity: number;
    product_name: string;
    product_price: number;
    product_image: string;
    stock_quantity: number;
    discount_percentage?: number;
    merchant_name: string;
  };
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateDiscountedPrice = (price: number, discount?: number) => {
    if (!discount) return price;
    return price - (price * discount / 100);
  };

  const discountedPrice = calculateDiscountedPrice(item.product_price, item.discount_percentage);
  const totalPrice = discountedPrice * item.quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= item.stock_quantity) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
          <Image
            src={item.product_image || '/images/placeholder-product.jpg'}
            alt={item.product_name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {item.product_name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {item.merchant_name}
          </p>
          
          {/* Price */}
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(discountedPrice)}
            </span>
            {item.discount_percentage && (
              <>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(item.product_price)}
                </span>
                <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
                  -{item.discount_percentage}%
                </span>
              </>
            )}
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          
          <span className="w-12 text-center font-semibold text-gray-900 dark:text-white">
            {item.quantity}
          </span>
          
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= item.stock_quantity}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Total Price */}
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {formatPrice(totalPrice)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {item.quantity} dona
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item.id)}
          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Stock Warning */}
      {item.quantity >= item.stock_quantity && (
        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ Maksimal miqdor: {item.stock_quantity} dona
          </p>
        </div>
      )}
    </div>
  );
};

export default CartItem; 