import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Plus,
  BarChart3,
  ShoppingCart,
  Star
} from "lucide-react";
import { Link } from "wouter";

export default function MerchantDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Jami Savdo",
      value: "15,420,000 so'm",
      icon: DollarSign,
      description: "Bu oydagi jami savdo",
      color: "text-green-600",
      change: "+12.5%",
      changeType: "positive"
    },
    {
      title: "Mahsulotlar",
      value: "24",
      icon: Package,
      description: "Faol mahsulotlar",
      color: "text-blue-600",
      change: "+3",
      changeType: "positive"
    },
    {
      title: "Buyurtmalar",
      value: "156",
      icon: ShoppingCart,
      description: "Bu oydagi buyurtmalar",
      color: "text-purple-600",
      change: "+8.2%",
      changeType: "positive"
    },
    {
      title: "Mijozlar",
      value: "89",
      icon: Users,
      description: "Faol mijozlar",
      color: "text-orange-600",
      change: "+5.1%",
      changeType: "positive"
    }
  ];

  const quickActions = [
    {
      title: "Mahsulot qo'shish",
      description: "Yangi mahsulot qo'shish",
      icon: Plus,
      href: "/merchant/products",
      color: "bg-green-500"
    },
    {
      title: "Buyurtmalar",
      description: "Barcha buyurtmalarni ko'rish",
      icon: ShoppingCart,
      href: "/merchant/orders",
      color: "bg-blue-500"
    },
    {
      title: "Analitika",
      description: "Batafsil tahlillar",
      icon: BarChart3,
      href: "/merchant/analytics",
      color: "bg-purple-500"
    },
    {
      title: "Reytinglar",
      description: "Mijozlar reytinglari",
      icon: Star,
      href: "/merchant/reviews",
      color: "bg-yellow-500"
    }
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "Aziz Karimov",
      amount: "2,450,000 so'm",
      status: "confirmed",
      date: "2024-01-15"
    },
    {
      id: "ORD-002",
      customer: "Malika Yusupova",
      amount: "1,890,000 so'm",
      status: "shipped",
      date: "2024-01-14"
    },
    {
      id: "ORD-003",
      customer: "Jasur Toshmatov",
      amount: "3,120,000 so'm",
      status: "pending",
      date: "2024-01-13"
    }
  ];

  const topProducts = [
    {
      name: "iPhone 14 Pro Max",
      sales: 12,
      revenue: "8,640,000 so'm",
      rating: 4.8
    },
    {
      name: "MacBook Pro 16\"",
      sales: 8,
      revenue: "19,920,000 so'm",
      rating: 4.9
    },
    {
      name: "AirPods Pro",
      sales: 15,
      revenue: "2,250,000 so'm",
      rating: 4.7
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      confirmed: "default",
      shipped: "default",
      delivered: "default",
      cancelled: "destructive"
    };
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Merchant Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Sizning biznes faoliyatingizni boshqaring
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <span className={`text-xs ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Tezkor amallar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>So'nggi buyurtmalar</CardTitle>
            <CardDescription>
              Eng so'nggi buyurtmalar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ShoppingCart className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-gray-500">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.amount}</p>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Barcha buyurtmalarni ko'rish
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Eng yaxshi mahsulotlar</CardTitle>
            <CardDescription>
              Eng ko'p sotiladigan mahsulotlar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-500">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{product.revenue}</p>
                    <p className="text-sm text-gray-500">{product.sales} ta sotilgan</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Barcha mahsulotlarni ko'rish
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart Placeholder */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Savdo dinamikasi</CardTitle>
          <CardDescription>
            So'nggi 30 kunlik savdo dinamikasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Grafik ko'rsatiladi</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}