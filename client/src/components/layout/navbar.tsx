import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, Heart, ShoppingCart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { useLanguage } from '@/hooks/use-language';
import { useQuery } from '@tanstack/react-query';

export function Navbar() {
  const [location] = useLocation();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: cartItems = [] } = useQuery({
    queryKey: ['/api/cart'],
    enabled: false, // Enable when user is logged in
  });

  const cartCount = Array.isArray(cartItems) ? cartItems.length : 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Categories */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-[#2A6BFF] cursor-pointer">
                TexnoGrand
              </h1>
            </Link>
            
            {/* Categories Button */}
            <Button
              variant="ghost"
              className="flex items-center space-x-1 text-gray-700 hover:text-[#2A6BFF] transition-colors"
            >
              <Menu className="w-5 h-5" />
              <span>{t('nav.categories')}</span>
            </Button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder={t('nav.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A6BFF] focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </form>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-6">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Become Seller/Partner */}
            <Link href="/seller/register">
              <Button
                variant="ghost"
                className="text-sm text-gray-700 hover:text-[#2A6BFF] transition-colors"
              >
                {t('nav.becomeSeller')}
              </Button>
            </Link>
            <Link href="/partner/register">
              <Button
                variant="ghost"
                className="text-sm text-gray-700 hover:text-[#2A6BFF] transition-colors"
              >
                {t('nav.becomePartner')}
              </Button>
            </Link>
            
            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Favorites */}
              <Link href="/favorites">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative p-2 text-gray-600 hover:text-[#2A6BFF] transition-colors"
                >
                  <Heart className="w-6 h-6" />
                </Button>
              </Link>
              
              {/* Cart */}
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative p-2 text-gray-600 hover:text-[#2A6BFF] transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#FF8C38] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
              
              {/* Profile */}
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 text-gray-600 hover:text-[#2A6BFF] transition-colors"
                >
                  <User className="w-6 h-6" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
