'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon,
  Bars3Icon,
  ChartBarIcon,
  UsersIcon,
  ShoppingBagIcon,
  ClockIcon,
  TrendingUpIcon,
  CogIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  MegaphoneIcon,
  Cog6ToothIcon,
  BellIcon
} from '@heroicons/react/24/outline';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  tabs: Array<{
    id: string;
    name: string;
    icon: any;
  }>;
}

export function AdminSidebar({ 
  activeTab, 
  setActiveTab, 
  sidebarOpen, 
  setSidebarOpen,
  tabs 
}: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    ...tabs,
    { id: 'financials', name: 'Moliyaviy', icon: CurrencyDollarIcon },
    { id: 'reports', name: 'Hisobotlar', icon: DocumentTextIcon },
    { id: 'marketing', name: 'Marketing', icon: MegaphoneIcon },
    { id: 'settings', name: 'Sozlamalar', icon: CogIcon },
    { id: 'security', name: 'Xavfsizlik', icon: ShieldCheckIcon },
    { id: 'support', name: 'Qo\'llab-quvvatlash', icon: QuestionMarkCircleIcon },
  ];

  return (
    <>
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 20 }}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-gray-900 to-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="h-5 w-5 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold text-white">
              AFFILIMART
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-3 ${
                    isActive ? 'text-white' : 'text-gray-400'
                  }`} />
                  <span>{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute right-0 w-1 h-8 bg-white rounded-l-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* Quick Stats */}
        <div className="absolute bottom-20 left-0 right-0 px-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Platforma holati</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Online foydalanuvchilar</span>
                <span className="text-xs text-green-400 font-medium">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Bugungi buyurtmalar</span>
                <span className="text-xs text-blue-400 font-medium">89</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Daromad</span>
                <span className="text-xs text-yellow-400 font-medium">$45.2K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                Admin User
              </p>
              <p className="text-xs text-gray-400 truncate">
                Super Admin
              </p>
            </div>
            <button className="p-1 text-gray-400 hover:text-white">
              <Cog6ToothIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
} 