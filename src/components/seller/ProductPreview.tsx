'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AIProductScanResult } from '@/lib/ai-scanner'

interface ProductPreviewProps {
  scanResult: AIProductScanResult
  imageUrl: string
  onConfirm: (finalPrice: number) => void
  onRetake: () => void
}

export default function ProductPreview({
  scanResult,
  imageUrl,
  onConfirm,
  onRetake
}: ProductPreviewProps) {
  const [sellingPrice, setSellingPrice] = useState(
    scanResult.suggestedPrice?.toString() || ''
  )
  const [priceBreakdown, setPriceBreakdown] = useState(
    scanResult.priceBreakdown
  )

  const handlePriceChange = (value: string) => {
    setSellingPrice(value)
    const price = parseFloat(value)
    if (!isNaN(price) && price > 0) {
      const breakdown = {
        sellingPrice: price,
        basePrice: price / 1.4,
        bloggerCommission: (price / 1.4) * 0.2,
        platformFee: (price / 1.4) * 0.2
      }
      setPriceBreakdown(breakdown)
    }
  }

  const handleConfirm = () => {
    const price = parseFloat(sellingPrice)
    if (!isNaN(price) && price > 0) {
      onConfirm(price)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Image Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Image</h3>
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={imageUrl}
                alt="Product preview"
                fill
                className="object-cover"
              />
            </div>
            <button
              onClick={onRetake}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Retake Photo
            </button>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">AI-Generated Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={scanResult.productCard.name}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={scanResult.productCard.category}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={scanResult.productCard.description}
                readOnly
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            {scanResult.productCard.specifications && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specifications
                </label>
                <div className="space-y-1 text-sm">
                  {Object.entries(scanResult.productCard.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Price Section */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Set Final Price</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selling Price (UZS)
              </label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => handlePriceChange(e.target.value)}
                placeholder="Enter selling price"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-500">
                Suggested: {scanResult.suggestedPrice?.toLocaleString()} UZS
              </p>
            </div>

            {priceBreakdown && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Breakdown
                </label>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Price:</span>
                    <span className="font-medium">
                      {priceBreakdown.basePrice.toLocaleString()} UZS
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blogger Commission (20%):</span>
                    <span className="font-medium">
                      {priceBreakdown.bloggerCommission.toLocaleString()} UZS
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Platform Fee (20%):</span>
                    <span className="font-medium">
                      {priceBreakdown.platformFee.toLocaleString()} UZS
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-300">
                    <span className="font-semibold">Total Selling Price:</span>
                    <span className="font-semibold text-blue-600">
                      {priceBreakdown.sellingPrice.toLocaleString()} UZS
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-4">
            <button
              onClick={onRetake}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!sellingPrice || parseFloat(sellingPrice) <= 0}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Confirm & Create Product
            </button>
          </div>
        </div>
      </div>

      {/* AI Confidence Score */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-900">
              AI Confidence Score
            </p>
            <p className="text-xs text-blue-700 mt-1">
              {scanResult.confidence >= 0.8
                ? 'High confidence - Product details are accurate'
                : scanResult.confidence >= 0.6
                ? 'Medium confidence - Please review details'
                : 'Low confidence - Manual verification recommended'}
            </p>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(scanResult.confidence * 100)}%
          </div>
        </div>
      </div>
    </div>
  )
}
