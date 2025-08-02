'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  UsersIcon, 
  ShoppingBagIcon,
  ClockIcon,
  TrendingUpIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AdminStats } from './AdminStats';
import { UserManagement } from './UserManagement';
import { ProductManagement } from './ProductManagement';
import { OrderManagement } from './OrderManagement';
import { Analytics } from './Analytics';
import { SmartRewardsStats } from './SmartRewardsStats';
import { ExcelExport } from '../shared/ExcelExport';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
    { id: 'users', name: 'Foydalanuvchilar', icon: UsersIcon },
    { id: 'products', name: 'Mahsulotlar', icon: ShoppingBagIcon },
    { id: 'orders', name: 'Buyurtmalar', icon: ClockIcon },
    { id: 'analytics', name: 'Analitika', icon: TrendingUpIcon },
    { id: 'smart-rewards', name: 'Aqlli mukofotlar', icon: TrendingUpIcon },
    { id: 'reports', name: 'Hisobotlar', icon: DocumentArrowDownIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <AdminStats />
            <Analytics />
          </div>
        );
      case 'users':
        return <UserManagement />;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'analytics':
        return <Analytics />;
      case 'smart-rewards':
        return <SmartRewardsStats />;
      case 'reports':
        return <ExcelExport data={[]} filename="admin_reports" type="analytics" />;
      default:
        return <AdminStats />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        tabs={tabs}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader 
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