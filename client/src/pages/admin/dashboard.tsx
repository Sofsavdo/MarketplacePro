import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Settings,
  BarChart3,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Jami Foydalanuvchilar",
      value: "1,234",
      icon: Users,
      description: "Ro'yxatdan o'tgan foydalanuvchilar",
      color: "text-blue-600",
      change: "+12.5%",
      changeType: "positive"
    },
    {
      title: "Jami Savdo",
      value: "156,420,000 so'm",
      icon: DollarSign,
      description: "Platforma bo'ylab jami savdo",
      color: "text-green-600",
      change: "+18.3%",
      changeType: "positive"
    },
    {
      title: "Mahsulotlar",
      value: "456",
      icon: Package,
      description: "Faol mahsulotlar",
      color: "text-purple-600",
      change: "+5.2%",
      changeType: "positive"
    },
    {
      title: "Buyurtmalar",
      value: "2,890",
      icon: TrendingUp,
      description: "Bu oydagi buyurtmalar",
      color: "text-orange-600",
      change: "+8.7%",
      changeType: "positive"
    }
  ];

  const quickActions = [
    {
      title: "Foydalanuvchilar",
      description: "Barcha foydalanuvchilarni boshqarish",
      icon: Users,
      href: "/admin/users",
      color: "bg-blue-500"
    },
    {
      title: "Analitika",
      description: "Platforma analitikasi",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "bg-green-500"
    },
    {
      title: "Xavfsizlik",
      description: "Xavfsizlik sozlamalari",
      icon: Shield,
      href: "/admin/security",
      color: "bg-red-500"
    },
    {
      title: "Sozlamalar",
      description: "Platforma sozlamalari",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-purple-500"
    }
  ];

  const recentUsers = [
    {
      id: 1,
      name: "Aziz Karimov",
      email: "aziz@example.com",
      role: "customer",
      status: "active",
      date: "2024-01-15"
    },
    {
      id: 2,
      name: "Malika Yusupova",
      email: "malika@example.com",
      role: "merchant",
      status: "pending",
      date: "2024-01-14"
    },
    {
      id: 3,
      name: "Jasur Toshmatov",
      email: "jasur@example.com",
      role: "blogger",
      status: "active",
      date: "2024-01-13"
    }
  ];

  const systemAlerts = [
    {
      id: 1,
      type: "warning",
      title: "Yuqori server yuki",
      description: "Server yuki 85% ga yetdi",
      time: "5 daqiqa oldin"
    },
    {
      id: 2,
      type: "info",
      title: "Yangi foydalanuvchi",
      description: "Yangi merchant ro'yxatdan o'tdi",
      time: "15 daqiqa oldin"
    },
    {
      id: 3,
      type: "success",
      title: "To'lov muvaffaqiyatli",
      description: "Blogger to'lovi amalga oshirildi",
      time: "1 soat oldin"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      pending: "secondary",
      suspended: "destructive"
    };
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      customer: "bg-blue-100 text-blue-800",
      merchant: "bg-green-100 text-green-800",
      blogger: "bg-purple-100 text-purple-800",
      admin: "bg-red-100 text-red-800"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[role as keyof typeof colors]}`}>
        {role}
      </span>
    );
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "info":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Platforma boshqaruvi va monitoring
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

      {/* Recent Users and System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>So'nggi foydalanuvchilar</CardTitle>
            <CardDescription>
              Eng so'nggi ro'yxatdan o'tgan foydalanuvchilar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getRoleBadge(user.role)}
                    {getStatusBadge(user.status)}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Barcha foydalanuvchilarni ko'rish
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tizim ogohlantirishlari</CardTitle>
            <CardDescription>
              Platforma holati va ogohlantirishlar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm text-gray-500">{alert.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Barcha ogohlantirishlarni ko'rish
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Platform Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Server holati</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>CPU yuki</span>
                <span className="text-green-600">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Xotira</span>
                <span className="text-yellow-600">78%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Disk</span>
                <span className="text-green-600">32%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '32%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Faol foydalanuvchilar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Online</span>
                <span className="text-green-600">234</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Bugun</span>
                <span className="text-blue-600">1,567</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Bu hafta</span>
                <span className="text-purple-600">8,234</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Bu oy</span>
                <span className="text-orange-600">32,456</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>So'nggi faoliyat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Yangi buyurtma #1234</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Yangi merchant ro'yxatdan o'tdi</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">Blogger to'lovi amalga oshirildi</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Yangi mahsulot qo'shildi</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}