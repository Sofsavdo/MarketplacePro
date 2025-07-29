import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Link, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Plus,
  BarChart3,
  Share2,
  Star,
  Copy,
  ExternalLink
} from "lucide-react";
import { Link as WouterLink } from "wouter";
import { useState } from "react";

export default function BloggerDashboard() {
  const { user } = useAuth();
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const stats = [
    {
      title: "Jami Daromad",
      value: `${user?.totalEarnings || "0"} so'm`,
      icon: DollarSign,
      description: "Jami qilingan daromad",
      color: "text-green-600",
      change: "+15.3%",
      changeType: "positive"
    },
    {
      title: "Affiliate Havolalar",
      value: "8",
      icon: Link,
      description: "Faol havolalar",
      color: "text-blue-600",
      change: "+2",
      changeType: "positive"
    },
    {
      title: "O'tishlar",
      value: "1,234",
      icon: TrendingUp,
      description: "Bu oydagi o'tishlar",
      color: "text-purple-600",
      change: "+8.7%",
      changeType: "positive"
    },
    {
      title: "Konversiya",
      value: "3.2%",
      icon: Users,
      description: "O'tish-konversiya nisbati",
      color: "text-orange-600",
      change: "+0.5%",
      changeType: "positive"
    }
  ];

  const quickActions = [
    {
      title: "Havola yaratish",
      description: "Yangi affiliate havola yaratish",
      icon: Plus,
      href: "/blogger/links",
      color: "bg-green-500"
    },
    {
      title: "Analitika",
      description: "Batafsil tahlillar",
      icon: BarChart3,
      href: "/blogger/analytics",
      color: "bg-blue-500"
    },
    {
      title: "Daromadlar",
      description: "Daromad va to'lovlar",
      icon: DollarSign,
      href: "/blogger/earnings",
      color: "bg-purple-500"
    },
    {
      title: "Materiallar",
      description: "Marketing materiallari",
      icon: Share2,
      href: "/blogger/materials",
      color: "bg-orange-500"
    }
  ];

  const recentLinks = [
    {
      id: "LINK-001",
      product: "iPhone 14 Pro Max",
      clicks: 45,
      conversions: 3,
      earnings: "450,000 so'm",
      code: "BLOG123"
    },
    {
      id: "LINK-002",
      product: "MacBook Pro 16\"",
      clicks: 32,
      conversions: 2,
      earnings: "380,000 so'm",
      code: "BLOG456"
    },
    {
      id: "LINK-003",
      product: "AirPods Pro",
      clicks: 67,
      conversions: 5,
      earnings: "250,000 so'm",
      code: "BLOG789"
    }
  ];

  const topEarnings = [
    {
      month: "Yanvar 2024",
      earnings: "2,450,000 so'm",
      clicks: 1234,
      conversions: 23,
      change: "+12.5%"
    },
    {
      month: "Dekabr 2023",
      earnings: "2,180,000 so'm",
      clicks: 1089,
      conversions: 19,
      change: "+8.2%"
    },
    {
      month: "Noyabr 2023",
      earnings: "2,015,000 so'm",
      clicks: 987,
      conversions: 17,
      change: "+5.1%"
    }
  ];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(text);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const getFullAffiliateLink = (code: string) => {
    return `${window.location.origin}/ref/${code}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Blogger Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Affiliate marketing faoliyatingizni boshqaring
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
            <WouterLink key={index} href={action.href}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
              </Card>
            </WouterLink>
          ))}
        </div>
      </div>

      {/* Recent Links and Top Earnings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>So'nggi havolalar</CardTitle>
            <CardDescription>
              Eng so'nggi affiliate havolalaringiz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLinks.map((link) => (
                <div key={link.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Link className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">{link.product}</p>
                        <p className="text-sm text-gray-500">Kod: {link.code}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{link.earnings}</p>
                      <p className="text-sm text-gray-500">{link.conversions}/{link.clicks}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(getFullAffiliateLink(link.code))}
                      className="flex-1"
                    >
                      {copiedLink === getFullAffiliateLink(link.code) ? (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Nusxalandi!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Nusxalash
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Barcha havolalarni ko'rish
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Oylik daromadlar</CardTitle>
            <CardDescription>
              So'nggi 3 oylik daromadlar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topEarnings.map((earning, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{earning.month}</p>
                      <p className="text-sm text-gray-500">
                        {earning.clicks} o'tish, {earning.conversions} konversiya
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{earning.earnings}</p>
                    <span className="text-sm text-green-600">{earning.change}</span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Batafsil hisobot
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Faoliyat dinamikasi</CardTitle>
          <CardDescription>
            So'nggi 30 kunlik o'tishlar va konversiyalar
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

      {/* Referral Code */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Referral kodingiz</CardTitle>
          <CardDescription>
            Do'stlaringizni taklif qiling va bonus oling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1 p-3 bg-gray-50 rounded-lg border">
              <p className="font-mono text-lg">{user?.referralCode || "BLOG123"}</p>
            </div>
            <Button onClick={() => copyToClipboard(user?.referralCode || "BLOG123")}>
              {copiedLink === user?.referralCode ? "Nusxalandi!" : "Nusxalash"}
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Har bir do'stingiz ro'yxatdan o'tganda sizga bonus beriladi
          </p>
        </CardContent>
      </Card>
    </div>
  );
}