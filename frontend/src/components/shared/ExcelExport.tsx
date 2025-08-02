'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DocumentArrowDownIcon,
  TableCellsIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface ExcelExportProps {
  data: any[];
  filename: string;
  type: 'orders' | 'products' | 'earnings' | 'analytics' | 'users';
}

export function ExcelExport({ data, filename, type }: ExcelExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('excel');

  const exportToExcel = async () => {
    setIsExporting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create CSV content
      const headers = getHeaders(type);
      const csvContent = createCSVContent(data, headers);
      
      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getHeaders = (type: string) => {
    switch (type) {
      case 'orders':
        return ['ID', 'Mahsulot', 'Mijoz', 'Narxi', 'Holat', 'Sana'];
      case 'products':
        return ['ID', 'Nomi', 'Kategoriya', 'Narxi', 'Sotuvlar', 'Reyting'];
      case 'earnings':
        return ['ID', 'Mahsulot', 'Daromad', 'Komissiya', 'Holat', 'Sana'];
      case 'analytics':
        return ['Sana', 'Ko\'rishlar', 'Sotuvlar', 'Daromad', 'Konversiya'];
      case 'users':
        return ['ID', 'Ism', 'Email', 'Rol', 'Holat', 'Ro\'yxatdan o\'tgan'];
      default:
        return ['ID', 'Nomi', 'Sana'];
    }
  };

  const createCSVContent = (data: any[], headers: string[]) => {
    const csvHeaders = headers.join(',');
    const csvRows = data.map(item => {
      switch (type) {
        case 'orders':
          return `${item.id},${item.product},${item.customer},${item.price},${item.status},${item.date}`;
        case 'products':
          return `${item.id},${item.name},${item.category},${item.price},${item.sales},${item.rating}`;
        case 'earnings':
          return `${item.id},${item.product},${item.amount},${item.commission},${item.status},${item.date}`;
        case 'analytics':
          return `${item.date},${item.views},${item.sales},${item.revenue},${item.conversion}`;
        case 'users':
          return `${item.id},${item.name},${item.email},${item.role},${item.status},${item.createdAt}`;
        default:
          return `${item.id},${item.name},${item.date}`;
      }
    });
    
    return [csvHeaders, ...csvRows].join('\n');
  };

  const getExportOptions = () => {
    switch (type) {
      case 'orders':
        return [
          { id: 'all', name: 'Barcha buyurtmalar', icon: TableCellsIcon },
          { id: 'completed', name: 'Bajarilgan buyurtmalar', icon: CheckCircleIcon },
          { id: 'pending', name: 'Kutilayotgan buyurtmalar', icon: ClockIcon },
          { id: 'recent', name: 'So\'nggi 30 kun', icon: ChartBarIcon }
        ];
      case 'earnings':
        return [
          { id: 'all', name: 'Barcha daromadlar', icon: CurrencyDollarIcon },
          { id: 'monthly', name: 'Oylik hisobot', icon: ChartBarIcon },
          { id: 'yearly', name: 'Yillik hisobot', icon: ChartBarIcon },
          { id: 'by-product', name: 'Mahsulot bo\'yicha', icon: TableCellsIcon }
        ];
      case 'analytics':
        return [
          { id: 'daily', name: 'Kunlik statistikalar', icon: ChartBarIcon },
          { id: 'weekly', name: 'Haftalik hisobot', icon: ChartBarIcon },
          { id: 'monthly', name: 'Oylik hisobot', icon: ChartBarIcon },
          { id: 'custom', name: 'Maxsus davr', icon: ClockIcon }
        ];
      default:
        return [
          { id: 'all', name: 'Barcha ma\'lumotlar', icon: TableCellsIcon },
          { id: 'recent', name: 'So\'nggi ma\'lumotlar', icon: ClockIcon }
        ];
    }
  };

  const exportOptions = getExportOptions();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Ma'lumotlarni yuklab olish</h3>
          <p className="text-gray-600">Excel yoki CSV formatda hisobotlarni yuklab oling</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="excel">Excel (.xlsx)</option>
            <option value="csv">CSV (.csv)</option>
          </select>
        </div>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {exportOptions.map((option) => {
          const Icon = option.icon;
          return (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={exportToExcel}
              disabled={isExporting}
              className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 disabled:opacity-50"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icon className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{option.name}</p>
                  <p className="text-xs text-gray-500">{data.length} ta ma'lumot</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Quick Export */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="text-sm font-medium text-gray-900">Tezkor yuklab olish</p>
          <p className="text-xs text-gray-500">Barcha ma'lumotlarni bir zumda yuklab oling</p>
        </div>
        <button
          onClick={exportToExcel}
          disabled={isExporting}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50"
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Yuklanmoqda...
            </>
          ) : (
            <>
              <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
              Yuklab olish
            </>
          )}
        </button>
      </div>

      {/* Export History */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">So'nggi yuklab olinganlar</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center space-x-2">
              <DocumentArrowDownIcon className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Buyurtmalar hisoboti</span>
            </div>
            <span className="text-xs text-gray-500">2 soat oldin</span>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center space-x-2">
              <DocumentArrowDownIcon className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Daromadlar hisoboti</span>
            </div>
            <span className="text-xs text-gray-500">1 kun oldin</span>
          </div>
        </div>
      </div>
    </div>
  );
} 