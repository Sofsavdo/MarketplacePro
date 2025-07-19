import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Target,
  Gift,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  BarChart3
} from 'lucide-react';

export default function AffiliateOnboardingPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    socialMedia: '',
    audienceSize: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: 'affiliate'
      });

      toast({
        title: "Muvaffaqiyatli ro'yxatdan o'tdingiz!",
        description: "Affiliate kabinetingizga xush kelibsiz.",
      });

      navigate('/affiliate/dashboard');
    } catch (error: any) {
      toast({
        title: "Xatolik",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "20% gacha komissiya",
      description: "Eng yuqori darajadagi komissiya stavkalari"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Real-time analytics",
      description: "Har bir klik va sotuvni kuzating"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Tez to'lovlar",
      description: "Haftada ikki marta to'lov olish"
    },
    {
      icon: <Gift className="h-6 w-6" />,
      title: "Marketing materiallari",
      description: "Tayyor bannerlar va matnlar"
    }
  ];

  const commissionRates = [
    { category: "Elektronika", rate: "15-20%", color: "bg-blue-500" },
    { category: "Kiyim-kechak", rate: "12-18%", color: "bg-purple-500" },
    { category: "Uy-ro'zg'or", rate: "10-15%", color: "bg-green-500" },
    { category: "Sport", rate: "8-12%", color: "bg-orange-500" },
    { category: "Kitoblar", rate: "5-10%", color: "bg-red-500" },
  ];

  const features = [
    "Shaxsiy affiliate havolalar",
    "Click va conversion tracking",
    "Real-time hisobotlar",
    "Mobil-optimized dashboard",
    "API integratsiyasi",
    "24/7 yordam"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900 px-4 py-2 rounded-full text-purple-700 dark:text-purple-300 text-sm font-medium mb-4">
            <Users className="h-4 w-4" />
            Affiliate marketing
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-purple-600">20% gacha</span> komissiya oling
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            O'zbekistondagi eng yirik marketplace bilan hamkorlik qiling. 
            Har bir sotuvdan yuqori komissiya oling!
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Bepul ro'yxat</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Darhol pul topish</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Professional yordam</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Benefits & Info */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Nima uchun bizning affiliate dasturimiz?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                  <div className="text-purple-600 dark:text-purple-400">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Commission Rates */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  Komissiya stavkalari
                </CardTitle>
                <CardDescription>
                  Kategoriya bo'yicha komissiya miqdorlari
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {commissionRates.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="font-medium">{item.category}</span>
                      </div>
                      <Badge variant="secondary" className="font-bold">
                        {item.rate}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Professional vositalar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-purple-600">5K+</div>
                <div className="text-sm text-muted-foreground">Faol affiliatelar</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-green-600">$2M+</div>
                <div className="text-sm text-muted-foreground">To'langan komissiya</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-blue-600">98%</div>
                <div className="text-sm text-muted-foreground">Mamnunlik darajasi</div>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Affiliate bo'lish uchun ro'yxatdan o'ting</CardTitle>
              <CardDescription>
                Darhol pul topishni boshlang
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Ism</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Familiya</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefon raqam</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+998901234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="socialMedia">Ijtimoiy tarmoq profili (ixtiyoriy)</Label>
                  <Input
                    id="socialMedia"
                    type="url"
                    placeholder="https://instagram.com/username"
                    value={formData.socialMedia}
                    onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="password">Parol</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading} size="lg">
                  {loading ? (
                    'Ro\'yxatdan o\'tmoqda...'
                  ) : (
                    <>
                      Affiliate bo'lish
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Ro'yxatdan o'tish orqali siz bizning{' '}
                  <a href="#" className="text-purple-600 hover:underline">
                    affiliate shartlari
                  </a>{' '}
                  va{' '}
                  <a href="#" className="text-purple-600 hover:underline">
                    maxfiylik siyosati
                  </a>{' '}
                  ga rozilik bildirgan bo'lasiz.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}