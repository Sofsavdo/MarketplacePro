import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Link2, 
  DollarSign, 
  TrendingUp, 
  MousePointer,
  Copy,
  Eye,
  BarChart3,
  Calendar,
  Target,
  Percent
} from 'lucide-react';

interface AffiliateLink {
  id: number;
  linkCode: string;
  productId: number;
  product: {
    title: string;
    price: string;
    images: string[];
  };
  clickCount: number;
  conversionCount: number;
  totalEarnings: string;
  isActive: boolean;
  createdAt: string;
}

interface AffiliateStats {
  totalClicks: number;
  totalConversions: number;
  totalEarnings: string;
  monthlyEarnings: string;
  conversionRate: number;
  activeLinks: number;
}

export default function AffiliateDashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [newLinkProductId, setNewLinkProductId] = useState('');

  useEffect(() => {
    fetchAffiliateData();
  }, []);

  const fetchAffiliateData = async () => {
    try {
      const [linksRes, statsRes] = await Promise.all([
        fetch('/api/affiliate/links', { credentials: 'include' }),
        fetch('/api/affiliate/stats', { credentials: 'include' })
      ]);

      if (linksRes.ok) {
        const linksData = await linksRes.json();
        setLinks(linksData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Failed to fetch affiliate data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAffiliateLink = async (productId: string) => {
    try {
      const response = await fetch('/api/affiliate/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: parseInt(productId) }),
        credentials: 'include'
      });

      if (response.ok) {
        toast({
          title: "Affiliate havola yaratildi!",
          description: "Yangi havolangiz tayyor.",
        });
        fetchAffiliateData();
        setNewLinkProductId('');
      } else {
        const error = await response.json();
        toast({
          title: "Xatolik",
          description: error.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Havola yaratishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async (linkCode: string) => {
    const fullUrl = `${window.location.origin}/aff/${linkCode}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast({
        title: "Nusxalandi!",
        description: "Havola vaqtinchalik xotiraga nusxalandi.",
      });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Nusxalashda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  const calculateCommission = (price: string, rate: number = 15) => {
    const commission = (parseFloat(price) * rate) / 100;
    return formatPrice(commission.toString());
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
          Affiliate Dashboard
        </h1>
        <p className="text-muted-foreground">
          Affiliate havolalaringizni boshqaring va daromadingizni kuzating
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami kliklar</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalClicks || 0}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% o'tgan oydan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Konversiyalar</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalConversions || 0}</div>
            <p className="text-xs text-muted-foreground">
              +12% o'tgan oydan
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
              {stats?.totalEarnings ? formatPrice(stats.totalEarnings) : '0 UZS'}
            </div>
            <p className="text-xs text-muted-foreground">
              +19% o'tgan oydan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Konversiya foizi</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.conversionRate?.toFixed(1) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              +0.5% o'tgan oydan
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Affiliate Links */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Affiliate havolalar</CardTitle>
                  <CardDescription>
                    Sizning affiliate havolalaringiz va ularning natijalari
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  {stats?.activeLinks || 0} faol havola
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Create New Link */}
              <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                <h3 className="font-medium mb-3">Yangi havola yaratish</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Mahsulot ID kiriting"
                    value={newLinkProductId}
                    onChange={(e) => setNewLinkProductId(e.target.value)}
                    type="number"
                  />
                  <Button 
                    onClick={() => createAffiliateLink(newLinkProductId)}
                    disabled={!newLinkProductId}
                  >
                    Yaratish
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {links.length === 0 ? (
                  <div className="text-center py-8">
                    <Link2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Havola yo'q</h3>
                    <p className="text-muted-foreground mb-4">
                      Hali affiliate havola yaratmagansiz. Birinchi havolangizni yarating!
                    </p>
                  </div>
                ) : (
                  links.map((link) => (
                    <div key={link.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">{link.product.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            Narx: {formatPrice(link.product.price)} | 
                            Komissiya: {calculateCommission(link.product.price)}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Kliklar: {link.clickCount}</span>
                            <span>Sotuvlar: {link.conversionCount}</span>
                            <span>Daromad: {formatPrice(link.totalEarnings)}</span>
                          </div>
                        </div>
                        <Badge variant={link.isActive ? "default" : "secondary"}>
                          {link.isActive ? "Faol" : "Nofaol"}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex-1 p-2 bg-muted rounded text-sm font-mono">
                          {window.location.origin}/aff/{link.linkCode}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(link.linkCode)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Monthly Performance */}
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
                  <span className="text-sm">Daromad</span>
                  <span className="font-medium">
                    {stats?.monthlyEarnings ? formatPrice(stats.monthlyEarnings) : '0 UZS'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Kliklar</span>
                  <span className="font-medium">1,234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sotuvlar</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Konversiya</span>
                  <span className="font-medium text-green-600">
                    {stats?.conversionRate?.toFixed(1) || 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top mahsulotlar</CardTitle>
              <CardDescription>
                Eng ko'p sotilgan mahsulotlar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-sm font-medium">
                      {i}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        iPhone 15 Pro Max
                      </p>
                      <p className="text-xs text-muted-foreground">
                        15% komissiya
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">195,000 UZS</p>
                      <p className="text-xs text-muted-foreground">8 sotildi</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Marketing Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Marketing maslahatlari</CardTitle>
              <CardDescription>
                Daromadni oshirish uchun
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <p>Ijtimoiy tarmoqlarda faol bo'ling</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <p>Mahsulot haqida chin fikr bildiring</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                  <p>Video kontent yarating</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                  <p>Yaqin do'stlaringiz bilan bo'lishing</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}