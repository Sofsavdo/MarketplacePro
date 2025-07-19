import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  Sun,
  Moon,
  Laptop,
  Store,
  TrendingUp,
  Settings,
  LogOut,
  Package,
  BarChart3
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/marketplace';
    switch (user.role) {
      case 'seller':
        return '/seller/dashboard';
      case 'affiliate':
        return '/affiliate/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/marketplace';
    }
  };

  const roleText = {
    seller: 'Sotuvchi',
    affiliate: 'Blogger',
    admin: 'Admin',
    buyer: 'Xaridor'
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 marketplace-gradient rounded-lg flex items-center justify-center">
            <Store className="h-5 w-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-foreground">O'zbek</h1>
            <p className="text-xs text-brand-primary">Marketplace</p>
          </div>
        </Link>

        {/* Search - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Mahsulotlarni qidiring..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </form>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link to="/marketplace" className="text-sm font-medium hover:text-brand-primary transition-colors">
            Bozor
          </Link>
          
          {!user && (
            <>
              <Link to="/seller/onboarding" className="text-sm font-medium hover:text-brand-primary transition-colors">
                Sotuvchi bo'ling
              </Link>
              <Link to="/affiliate/onboarding" className="text-sm font-medium hover:text-brand-primary transition-colors">
                Blogger bo'ling
              </Link>
            </>
          )}
          
          {user && (
            <Link to={getDashboardLink()} className="text-sm font-medium hover:text-brand-primary transition-colors">
              Boshqaruv paneli
            </Link>
          )}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                {theme === 'light' && <Sun className="h-4 w-4" />}
                {theme === 'dark' && <Moon className="h-4 w-4" />}
                {theme === 'system' && <Laptop className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <Sun className="mr-2 h-4 w-4" />
                Yorug'
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <Moon className="mr-2 h-4 w-4" />
                Qorong'i
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('system')}>
                <Laptop className="mr-2 h-4 w-4" />
                Tizim
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Cart and Wishlist - Only for logged in users */}
          {user && (
            <>
              <Button variant="ghost" size="sm" asChild className="relative">
                <Link to="/wishlist">
                  <Heart className="h-4 w-4" />
                </Link>
              </Button>
              
              <Button variant="ghost" size="sm" asChild className="relative">
                <Link to="/cart">
                  <ShoppingCart className="h-4 w-4" />
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs">
                    0
                  </Badge>
                </Link>
              </Button>
            </>
          )}

          {/* User Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium">{user.firstName}</p>
                    <p className="text-xs text-muted-foreground">{roleText[user.role as keyof typeof roleText]}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders">
                    <Package className="mr-2 h-4 w-4" />
                    Buyurtmalar
                  </Link>
                </DropdownMenuItem>
                
                {user.role === 'seller' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/seller/dashboard">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Sotuvchi paneli
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                
                {user.role === 'affiliate' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/affiliate/dashboard">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Blogger paneli
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                
                {user.role === 'admin' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin paneli
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Chiqish
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Kirish</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Ro'yxatdan o'tish</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-6">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="md:hidden">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Mahsulotlarni qidiring..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4"
                    />
                  </div>
                </form>

                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-2">
                  <Link 
                    to="/marketplace" 
                    className="block px-3 py-2 text-sm font-medium hover:bg-accent rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Bozor
                  </Link>
                  
                  {!user && (
                    <>
                      <Link 
                        to="/seller/onboarding" 
                        className="block px-3 py-2 text-sm font-medium hover:bg-accent rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sotuvchi bo'ling
                      </Link>
                      <Link 
                        to="/affiliate/onboarding" 
                        className="block px-3 py-2 text-sm font-medium hover:bg-accent rounded-md"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Blogger bo'ling
                      </Link>
                    </>
                  )}
                  
                  {user && (
                    <Link 
                      to={getDashboardLink()} 
                      className="block px-3 py-2 text-sm font-medium hover:bg-accent rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Boshqaruv paneli
                    </Link>
                  )}
                </nav>

                {/* Mobile Auth Buttons */}
                {!user && (
                  <div className="flex flex-col space-y-2 pt-4 border-t sm:hidden">
                    <Button variant="ghost" asChild onClick={() => setMobileMenuOpen(false)}>
                      <Link to="/login">Kirish</Link>
                    </Button>
                    <Button asChild onClick={() => setMobileMenuOpen(false)}>
                      <Link to="/register">Ro'yxatdan o'tish</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}