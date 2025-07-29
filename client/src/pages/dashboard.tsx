import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, 
  Heart, 
  Package, 
  CreditCard, 
  User, 
  Settings,
  TrendingUp,
  Star
} from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Buyurtmalar",
      value: "12",
      icon: Package,
      description: "Jami buyurtmalar",
      color: "text-blue-600"
    },
    {
      title: "Sevimlilar",
      value: "8",
      icon: Heart,
      description: "Saqlangan mahsulotlar",
      color: "text-red-600"
    },
    {
      title: "Balans",
      value: `${user?.balance || "0"} so'm`,
      icon: CreditCard,
      description: "Joriy balans",
      color: "text-green-600"
    },
    {
      title: "Reyting",
      value: "4.8",
      icon: Star,
      description: "O'rtacha reyting",
      color: "text-yellow-600"
    }
  ];

  const quickActions = [
    {
      title: "Buyurtmalarim",
      description: "Barcha buyurtmalaringizni ko'ring",
      icon: Package,
      href: "/orders",
      color: "bg-blue-500"
    },
    {
      title: "Sevimlilar",
      description: "Saqlangan mahsulotlaringiz",
      icon: Heart,
      href: "/favorites",
      color: "bg-red-500"
    },
    {
      title: "Profil",
      description: "Shaxsiy ma'lumotlaringiz",
      icon: User,
      href: "/profile",
      color: "bg-green-500"
    },
    {
      title: "Sozlamalar",
      description: "Hisob sozlamalari",
      icon: Settings,
      href: "/profile",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Xush kelibsiz, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mt-2">
          Sizning shaxsiy kabinetingizga xush kelibsiz
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
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>So'nggi buyurtmalar</CardTitle>
            <CardDescription>
              Eng so'nggi 5 ta buyurtmangiz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((order) => (
                <div key={order} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Buyurtma #{order}</p>
                      <p className="text-sm text-gray-500">2024-01-{order.toString().padStart(2, '0')}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Jarayonda</Badge>
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
            <CardTitle>Sevimli mahsulotlar</CardTitle>
            <CardDescription>
              Sizning sevimli mahsulotlaringiz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <p className="font-medium">Mahsulot {item}</p>
                    <p className="text-sm text-gray-500">1,500,000 so'm</p>
                  </div>
                  <Heart className="h-5 w-5 text-red-500" />
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Barcha sevimlilarni ko'rish
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}