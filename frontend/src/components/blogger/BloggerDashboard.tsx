'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  LinkIcon, 
  ShoppingBagIcon,
  CurrencyDollarIcon,
  TrendingUpIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  MegaphoneIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { BloggerSidebar } from './BloggerSidebar';
import { BloggerHeader } from './BloggerHeader';
import { BloggerStats } from './BloggerStats';
import { AffiliateLinks } from './AffiliateLinks';
import { ProductCatalog } from './ProductCatalog';
import { BloggerAnalytics } from './BloggerAnalytics';
import { Earnings } from './Earnings';
import { BloggerOffers } from './BloggerOffers';
import { ExcelExport } from '../shared/ExcelExport';

export function BloggerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
    { id: 'links', name: 'Affiliate Linklar', icon: LinkIcon },
    { id: 'catalog', name: 'Mahsulotlar', icon: ShoppingBagIcon },
    { id: 'earnings', name: 'Daromadlar', icon: CurrencyDollarIcon },
    { id: 'analytics', name: 'Analitika', icon: TrendingUpIcon },
    { id: 'offers', name: 'Takliflar', icon: MegaphoneIcon },
    { id: 'reports', name: 'Hisobotlar', icon: DocumentArrowDownIcon },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <BloggerStats />
            <BloggerAnalytics />
          </div>
        );
      case 'links':
        return <AffiliateLinks />;
      case 'catalog':
        return <ProductCatalog />;
      case 'earnings':
        return <Earnings />;
      case 'analytics':
        return <BloggerAnalytics />;
      case 'offers':
        return <BloggerOffers />;
      case 'reports':
        return <ExcelExport data={[]} filename="blogger_reports" type="earnings" />;
      default:
        return <BloggerStats />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <BloggerSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        tabs={tabs}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <BloggerHeader 
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