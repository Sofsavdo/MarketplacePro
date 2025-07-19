import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  DollarSign, 
  MousePointer, 
  Target,
  ExternalLink,
  Copy,
  Eye,
  Clock,
  Percent,
  ArrowUpIcon,
  BarChart3
} from 'lucide-react';
import { uzbekLocale, formatCurrency, formatNumber, formatDate, formatPercentage } from '@/components/ui/uzbek-locale';
import { useToast } from '@/hooks/use-toast';

export default function AffiliateAnalyticsPage() {
  const [period, setPeriod] = useState('30');
  const { toast } = useToast();
  
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['/api/analytics/affiliate/dashboard', period],
    queryFn: () => fetch(`/api/analytics/affiliate/dashboard?period=${period}`, {
      credentials: 'include'
    }).then(res => res.json())
  });

  const copyToClipboard = (linkCode: string) => {
    const affiliateUrl = `${window.location.origin}/products?ref=${linkCode}`;
    navigator.clipboard.writeText(affiliateUrl);
    toast({
      title: "Link nusxalandi!",
      description: "Affiliate link clipboard ga saqlandi",
    });
  };

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
  const topLinks = analytics?.topLinks || [];
  const recentClicks = analytics?.recentClicks || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Affiliate {uzbekLocale.analytics}
          </h1>
          <p className="text-muted-foreground">
            Linklar va daromadingiz bo'yicha batafsil tahlil
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card className="border-l-4 border-l-brand-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Jami Linklar
            </CardTitle>
            <ExternalLink className="h-4 w-4 text-brand-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatNumber(stats.totalLinks || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Jami Kliklar
            </CardTitle>
            <MousePointer className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatNumber(stats.totalClicks || 0)}
            </div>
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
              {formatCurrency(stats.totalEarnings || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-brand-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Konversiyalar
            </CardTitle>
            <Target className="h-4 w-4 text-brand-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatNumber(stats.totalConversions || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Konversiya Foizi
            </CardTitle>
            <Percent className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatPercentage(Number(stats.conversionRate) || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-brand-primary" />
              Eng Samarali Linklar
            </CardTitle>
            <CardDescription>
              Eng ko'p daromad keltirayotgan linklar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topLinks.length > 0 ? topLinks.map((link: any, index: number) => (
                <div key={link.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium line-clamp-1">
                          {link.product?.titleUz || link.product?.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {link.product?.affiliateCommissionRate}% komissiya
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(link.linkCode)}
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Nusxalash
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Kliklar</div>
                      <div className="font-medium">{formatNumber(link.clickCount || 0)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Sotuvlar</div>
                      <div className="font-medium">{formatNumber(link.conversionCount || 0)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Konversiya</div>
                      <div className="font-medium">{formatPercentage(Number(link.conversionRate) || 0)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Daromad</div>
                      <div className="font-medium text-brand-success">{formatCurrency(link.totalEarnings || 0)}</div>
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

        {/* Recent Clicks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-brand-secondary" />
              Oxirgi Kliklar
            </CardTitle>
            <CardDescription>
              Linklaringizga oxirgi kirishlar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentClicks.length > 0 ? recentClicks.slice(0, 10).map((click: any) => (
                <div key={click.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium line-clamp-1">
                      {click.link?.product?.titleUz || click.link?.product?.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Kod: {click.link?.linkCode}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {formatDate(click.clickedAt)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {click.ipAddress}
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

      {/* Performance Tips */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-brand-primary" />
            Samaradorlikni Oshirish Maslahatlari
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Maqsadli Auditoriya</h4>
              <p className="text-sm text-muted-foreground">
                Mahsulotlarni o'z auditoriyangizga mos ravishda tanlang va taqdim eting.
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Kontentni Optimallashtirish</h4>
              <p className="text-sm text-muted-foreground">
                Sifatli va qiziqarli kontent yarating, mahsulot haqida batafsil ma'lumot bering.
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Ijtimoiy Tarmoqlar</h4>
              <p className="text-sm text-muted-foreground">
                Barcha ijtimoiy tarmoqlarda faol bo'ling, linklaringizni keng tarqating.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}