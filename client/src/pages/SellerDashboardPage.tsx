import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  ShoppingCart,
  Plus,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Calendar,
  Users
} from 'lucide-react';

interface Product {
  id: number;
  title: string;
  price: string;
  stock: number;
  images: string[];
  isActive: boolean;
  createdAt: string;
}

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: string;
  monthlyRevenue: string;
}

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, statsRes] = await Promise.all([
        fetch('/api/products/seller/my-products', { credentials: 'include' }),
        fetch('/api/admin/dashboard', { credentials: 'include' })
      ]);

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData.slice(0, 5)); // Show only first 5
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Xush kelibsiz, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground">
          Sotuvchi kabinetingizni boshqaring va biznesingizni rivojlantiring
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami mahsulotlar</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">
              +2 o'tgan haftadan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami buyurtmalar</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              +12% o'tgan oydan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Umumiy daromad</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalRevenue ? formatPrice(stats.totalRevenue) : '0 UZS'}
            </div>
            <p className="text-xs text-muted-foreground">
              +19% o'tgan oydan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oylik daromad</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.monthlyRevenue ? formatPrice(stats.monthlyRevenue) : '0 UZS'}
            </div>
            <p className="text-xs text-muted-foreground">
              +201 o'tgan oydan
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>So'nggi mahsulotlar</CardTitle>
                <CardDescription>
                  Eng so'ngi qo'shilgan mahsulotlaringiz
                </CardDescription>
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Yangi mahsulot
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Mahsulot yo'q</h3>
                  <p className="text-muted-foreground mb-4">
                    Hali mahsulot qo'shmagansiz. Birinchi mahsulotingizni qo'shing!
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Mahsulot qo'shish
                  </Button>
                </div>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img
                      src={product.images?.[0] || '/placeholder-product.jpg'}
                      alt={product.title}
                      className="h-16 w-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(product.price)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={product.isActive ? "default" : "secondary"}>
                          {product.isActive ? "Faol" : "Nofaol"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Ombor: {product.stock}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions & Analytics */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Tezkor amallar</CardTitle>
              <CardDescription>
                Eng ko'p ishlatiladigan funksiyalar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Plus className="h-6 w-6 mb-2" />
                  Mahsulot qo'shish
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <ShoppingCart className="h-6 w-6 mb-2" />
                  Buyurtmalar
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  Hisobotlar
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  Mijozlar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Bu oyning natijalari</CardTitle>
              <CardDescription>
                {new Date().toLocaleDateString('uz-UZ', { month: 'long', year: 'numeric' })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sotilgan mahsulotlar</span>
                  <span className="font-medium">24 dona</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Yangi mijozlar</span>
                  <span className="font-medium">8 kishi</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Ko'rilgan mahsulotlar</span>
                  <span className="font-medium">1,234 marta</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Konversiya darajasi</span>
                  <span className="font-medium text-green-600">12.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Maslahatlar</CardTitle>
              <CardDescription>
                Sotuvni oshirish uchun
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <p>Mahsulot rasmlarini sifatli va yorqin qiling</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <p>Mahsulot tavsifini to'liq va aniq yozing</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                  <p>Raqobatbardosh narx belgilang</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                  <p>Mijozlar savollariga tezda javob bering</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}