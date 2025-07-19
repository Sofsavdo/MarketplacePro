import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Package,
  Users,
  Eye,
  Clock,
  Star,
  ArrowUpIcon,
  ArrowDownIcon
} from 'lucide-react';
import { uzbekLocale, formatCurrency, formatNumber, formatDate } from '@/components/ui/uzbek-locale';

export default function SellerAnalyticsPage() {
  const [period, setPeriod] = useState('30');
  
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['/api/analytics/seller/dashboard', period],
    queryFn: () => fetch(`/api/analytics/seller/dashboard?period=${period}`, {
      credentials: 'include'
    }).then(res => res.json())
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{uzbekLocale.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">{uzbekLocale.error}</h1>
          <p className="text-muted-foreground">{uzbekLocale.networkError}</p>
        </div>
      </div>
    );
  }

  const stats = analytics?.stats || {};
  const recentOrders = analytics?.recentOrders || [];
  const topProducts = analytics?.topProducts || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {uzbekLocale.analytics}
          </h1>
          <p className="text-muted-foreground">
            Sotuvlaringiz va mahsulotlaringiz bo'yicha batafsil tahlil
          </p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Oxirgi 7 kun</SelectItem>
              <SelectItem value="30">Oxirgi 30 kun</SelectItem>
              <SelectItem value="90">Oxirgi 3 oy</SelectItem>
              <SelectItem value="365">Oxirgi yil</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-brand-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Jami Mahsulotlar
            </CardTitle>
            <Package className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatNumber(stats.totalProducts || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-brand-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Jami Buyurtmalar
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-brand-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatNumber(stats.totalOrders || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Oxirgi {stats.period} kun ichida
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-brand-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Jami Daromad
            </CardTitle>
            <DollarSign className="h-4 w-4 text-brand-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCurrency(stats.totalRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Oxirgi {stats.period} kun ichida
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              O'rtacha Buyurtma
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.totalOrders > 0 
                ? formatCurrency(Number(stats.totalRevenue) / stats.totalOrders)
                : formatCurrency(0)
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-brand-primary" />
              Oxirgi Buyurtmalar
            </CardTitle>
            <CardDescription>
              Eng yangi buyurtmalaringiz ro'yxati
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length > 0 ? recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">
                      Buyurtma #{order.id}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order.buyer?.firstName} {order.buyer?.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {formatCurrency(order.totalAmount)}
                    </div>
                    <Badge 
                      variant={
                        order.status === 'delivered' ? 'default' :
                        order.status === 'shipped' ? 'secondary' :
                        order.status === 'confirmed' ? 'outline' : 'destructive'
                      }
                      className="text-xs"
                    >
                      {order.status === 'pending' && 'Kutilmoqda'}
                      {order.status === 'confirmed' && 'Tasdiqlangan'}
                      {order.status === 'shipped' && 'Yuborilgan'}
                      {order.status === 'delivered' && 'Yetkazilgan'}
                      {order.status === 'cancelled' && 'Bekor qilingan'}
                    </Badge>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  {uzbekLocale.noData}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-brand-secondary" />
              Eng Ko'p Sotilgan Mahsulotlar
            </CardTitle>
            <CardDescription>
              Oxirgi {stats.period} kun ichida eng ko'p sotilgan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.length > 0 ? topProducts.map((product: any, index: number) => (
                <div key={product.productId} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium line-clamp-1">
                      {product.titleUz || product.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(product.price)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-brand-primary">
                      {formatNumber(product.totalSold || 0)} dona
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(product.totalRevenue || 0)}
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  {uzbekLocale.noData}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}