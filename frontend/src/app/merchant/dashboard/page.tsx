'use client';

import { useState, useEffect } from 'react';
import { MerchantDashboard } from '@/components/merchant/MerchantDashboard';

export default function MerchantDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MerchantDashboard />
    </div>
  );
} 