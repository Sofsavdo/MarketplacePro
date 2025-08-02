'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  ShoppingBagIcon, 
  ClockIcon,
  CurrencyDollarIcon,
  TrendingUpIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MegaphoneIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { MerchantSidebar } from './MerchantSidebar';
import { MerchantHeader } from './MerchantHeader';
import { MerchantStats } from './MerchantStats';
import { ProductList } from './ProductList';
import { AddProductForm } from './AddProductForm';
import { OrderList } from './OrderList';
import { MerchantAnalytics } from './MerchantAnalytics';
import { PromotionServices } from './PromotionServices';
import { ExcelExport } from '../shared/ExcelExport';

export function MerchantDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
    { id: 'products', name: 'Mahsulotlar', icon: ShoppingBagIcon },
    { id: 'orders', name: 'Buyurtmalar', icon: ClockIcon },
    { id: 'analytics', name: 'Analitika', icon: TrendingUpIcon },
    { id: 'promotion', name: 'Promotion', icon: MegaphoneIcon },
    { id: 'reports', name: 'Hisobotlar', icon: DocumentArrowDownIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <MerchantStats />
            <MerchantAnalytics />
          </div>
        );
      case 'products':
        return <ProductList />;
      case 'orders':
        return <OrderList />;
      case 'analytics':
        return <MerchantAnalytics />;
      case 'promotion':
        return <PromotionServices />;
      case 'reports':
        return <ExcelExport data={[]} filename="merchant_reports" type="orders" />;
      default:
        return <MerchantStats />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <MerchantSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        tabs={tabs}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <MerchantHeader 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        
        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
} 