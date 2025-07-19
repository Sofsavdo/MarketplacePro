import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalAffiliates: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: string;
  monthlyRevenue: string;
  pendingOrders: number;
}

interface RecentActivity {
  id: number;
  type: 'user_registration' | 'order_placed' | 'product_added' | 'affiliate_signup';
  message: string;
  timestamp: string;
  user?: {
    firstName: string;
    lastName: string;
  };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activitiesRes] = await Promise.all([
        fetch('/api/admin/dashboard', { credentials: 'include' }),
        fetch('/api/admin/logs', { credentials: 'include' })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json();
        setActivities(activitiesData.slice(0, 10));
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

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_registration':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'order_placed':
        return <ShoppingCart className="h-4 w-4 text-green-600" />;
      case 'product_added':
        return <Package className="h-4 w-4 text-purple-600" />;
      case 'affiliate_signup':
        return <TrendingUp className="h-4 w-4 text-orange-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_registration':
        return 'bg-blue-50 border-blue-200';
      case 'order_placed':
        return 'bg-green-50 border-green-200';
      case 'product_added':
        return 'bg-purple-50 border-purple-200';
      case 'affiliate_signup':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
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
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Marketplace boshqaruv paneli va analitika
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami foydalanuvchilar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> o'tgan oydan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami mahsulotlar</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5%</span> o'tgan haftadan
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
              <span className="text-green-600">+23%</span> o'tgan oydan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami daromad</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalRevenue ? formatPrice(stats.totalRevenue) : '0 UZS'}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+19%</span> o'tgan oydan
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* System Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Asosiy ko'rsatkichlar</CardTitle>
              <CardDescription>Platformaning umumiy holati</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats?.totalSellers || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Sotuvchilar</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats?.totalAffiliates || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Affiliatelar</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-950">
                  <div className="text-2xl font-bold text-orange-600">
                    {stats?.pendingOrders || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Kutilayotgan</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950">
                  <div className="text-2xl font-bold text-green-600">
                    {stats?.monthlyRevenue ? formatPrice(stats.monthlyRevenue) : '0'}
                  </div>
                  <div className="text-sm text-muted-foreground">Oylik daromad</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>So'nggi faoliyat</CardTitle>
              <CardDescription>Platformadagi eng so'nggi hodisalar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Hozircha faoliyat yo'q</p>
                  </div>
                ) : (
                  activities.map((activity) => (
                    <div 
                      key={activity.id} 
                      className={`flex items-start gap-3 p-3 rounded-lg border ${getActivityColor(activity.type)}`}
                    >
                      {getActivityIcon(activity.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString('uz-UZ')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Tezkor amallar</CardTitle>
              <CardDescription>Boshqaruv funksiyalari</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Foydalanuvchilarni boshqarish
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Package className="h-4 w-4 mr-2" />
                Mahsulotlarni tekshirish
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Buyurtmalarni ko'rish
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Hisobotlar
              </Button>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>Tizim holati</CardTitle>
              <CardDescription>Servislar va xizmatlar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Ma'lumotlar bazasi</span>
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Faol
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">To'lov tizimi</span>
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Faol
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email xizmati</span>
                <Badge variant="secondary">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Tekshirilmoqda
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">SMS xizmati</span>
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Faol
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Bildirishnomalar</CardTitle>
              <CardDescription>Muhim xabarlar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Server yangilanishi
                    </p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                      Ertaga 02:00 da texnik ishlar
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Yangi rekord
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Bugun 500+ buyurtma
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Backup tugallandi
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Ma'lumotlar xavfsiz saqlandi
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}