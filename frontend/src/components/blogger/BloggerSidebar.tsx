'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon,
  Bars3Icon,
  ChartBarIcon,
  MegaphoneIcon,
  ClockIcon,
  TrendingUpIcon,
  CogIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  BellIcon
} from '@heroicons/react/24/outline';

interface BloggerSidebarProps {
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

export function BloggerSidebar({ 
  activeTab, 
  setActiveTab, 
  sidebarOpen, 
  setSidebarOpen,
  tabs 
}: BloggerSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    ...tabs,
    { id: 'earnings', name: 'Daromadlar', icon: CurrencyDollarIcon },
    { id: 'reports', name: 'Hisobotlar', icon: DocumentTextIcon },
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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-purple-900 to-purple-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-purple-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <MegaphoneIcon className="h-5 w-5 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold text-white">
              Blogger Panel
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-purple-400 hover:text-white hover:bg-purple-700"
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
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                      : 'text-purple-300 hover:bg-purple-700 hover:text-white'
                  }`}
                >
                  <Icon className={`h-5 w-5 mr-3 ${
                    isActive ? 'text-white' : 'text-purple-400'
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
          <div className="bg-purple-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-purple-300 mb-3">Blogger holati</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-400">Obunachilar</span>
                <span className="text-xs text-green-400 font-medium">12,500</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-400">Bugungi daromad</span>
                <span className="text-xs text-yellow-400 font-medium">$850K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-400">Konversiya</span>
                <span className="text-xs text-blue-400 font-medium">3.2%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-purple-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">B</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                Blogger User
              </p>
              <p className="text-xs text-purple-400 truncate">
                Premium Blogger
              </p>
            </div>
            <button className="p-1 text-purple-400 hover:text-white">
              <Cog6ToothIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
} 