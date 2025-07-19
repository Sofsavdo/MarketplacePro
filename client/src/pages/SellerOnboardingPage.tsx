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
  Store, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Shield,
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';

export default function SellerOnboardingPage() {
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
    businessName: '',
    businessType: '',
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
        role: 'seller'
      });

      toast({
        title: "Muvaffaqiyatli ro'yxatdan o'tdingiz!",
        description: "Sotuvchi kabinetingizga xush kelibsiz.",
      });

      navigate('/seller/dashboard');
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
      icon: <Store className="h-6 w-6" />,
      title: "Bepul do'kon ochish",
      description: "O'z biznesingizni onlayn olib boring"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Yuqori daromad",
      description: "Millionlab xaridorlar bilan aloqa"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Keng auditoriya",
      description: "Butun O'zbekiston bo'ylab sotish"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Xavfsiz to'lovlar",
      description: "Kafolatlangan to'lov tizimi"
    }
  ];

  const features = [
    "Bepul mahsulot yuklash",
    "Professional analytics",
    "24/7 texnik yordam",
    "Marketing yordami",
    "Tez to'lov olish",
    "Mobil ilova"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
            <Store className="h-4 w-4" />
            Sotuvchilar uchun maxsus
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Biznesingizni <span className="text-blue-600">online</span> olib boring
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            O'zbekistondagi eng yirik marketplace'da sotuvchi bo'ling. 
            Millionlab xaridorlar sizni kutmoqda!
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>100% bepul boshlash</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Darhol to'lov olish</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>24/7 yordam</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Benefits */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Nima uchun bizni tanlash kerak?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                  <div className="text-blue-600 dark:text-blue-400">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Features List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Premium imkoniyatlar
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
                <div className="text-2xl font-bold text-blue-600">50K+</div>
                <div className="text-sm text-muted-foreground">Faol sotuvchilar</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-green-600">95%</div>
                <div className="text-sm text-muted-foreground">Mamnun mijozlar</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-muted-foreground">Texnik yordam</div>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Sotuvchi bo'lish uchun ro'yxatdan o'ting</CardTitle>
              <CardDescription>
                Bir necha daqiqada o'z do'koningizni oching
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
                      Sotuvchi bo'lish
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Ro'yxatdan o'tish orqali siz bizning{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    foydalanish shartlari
                  </a>{' '}
                  va{' '}
                  <a href="#" className="text-blue-600 hover:underline">
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