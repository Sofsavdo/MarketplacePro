import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  DollarSign,
  Shield,
  Clock,
  Truck,
  Star,
  ArrowRight,
  CheckCircle,
  Target,
  BarChart3
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>🛒 O'zbek Marketplace</h1>
          <p>O'zbekiston Eng Yirik Onlayn Bozori</p>
          <div className="flex" style={{gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <a href="/marketplace" className="button button-primary">
              🛍️ Xarid Qilish
            </a>
            <a href="/seller/onboarding" className="button button-secondary">
              💼 Sotuvchi Bo'lish
            </a>
            <a href="/affiliate/onboarding" className="button button-primary">
              📊 Blogger Bo'lish
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{padding: '4rem 0', backgroundColor: '#f9fafb'}}>
        <div className="container">
          <h2 className="text-center text-3xl font-bold mb-6">
            Nima Uchun O'zbek Marketplace?
          </h2>
          <div className="grid grid-3">
            <div className="card">
              <div style={{fontSize: '2rem', marginBottom: '1rem'}}>🏪</div>
              <h3 className="text-xl font-bold mb-6 uzbek-green">
                Professional Sotuvchi Kabineti
              </h3>
              <p className="text-gray-600">
                Uzum Market kabi professional kabinet bilan mahsulotlaringizni boshqaring
              </p>
            </div>
            
            <div className="card">
              <div style={{fontSize: '2rem', marginBottom: '1rem'}}>📈</div>
              <h3 className="text-xl font-bold mb-6 uzbek-orange">
                Blogger Affiliate Tizimi
              </h3>
              <p className="text-gray-600">
                20% gacha komissiya va real vaqtda tahlillar bilan daromad qiling
              </p>
            </div>
            
            <div className="card">
              <div style={{fontSize: '2rem', marginBottom: '1rem'}}>🛒</div>
              <h3 className="text-xl font-bold mb-6 uzbek-green">
                Qulay Xaridor Interfeysi
              </h3>
              <p className="text-gray-600">
                Noon kabi sodda va intuitive shopping tajribasi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{padding: '4rem 0'}}>
        <div className="container">
          <div className="grid grid-3">
            <div className="text-center">
              <div className="text-3xl font-bold uzbek-green">10,000+</div>
              <div className="text-gray-600">Faol Sotuvchilar</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold uzbek-orange">50,000+</div>
              <div className="text-gray-600">Mahsulotlar</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold uzbek-green">1M+</div>
              <div className="text-gray-600">Xaridorlar</div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section style={{padding: '4rem 0', backgroundColor: '#f9fafb'}}>
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">To'lov Tizimlari</h2>
          <div className="flex" style={{gap: '2rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <div className="card" style={{padding: '1.5rem', minWidth: '150px'}}>
              <div style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>💳</div>
              <div className="font-bold">Click.uz</div>
            </div>
            <div className="card" style={{padding: '1.5rem', minWidth: '150px'}}>
              <div style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>💰</div>
              <div className="font-bold">Payme.uz</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const stats = [
    { label: "Faol Sotuvchilar", value: "1000+", icon: Users },
    { label: "Mahsulotlar", value: "50,000+", icon: Store },
    { label: "Yillik Aylanma", value: "$10M+", icon: DollarSign },
    { label: "Reyting", value: "4.9/5", icon: Star }
  ];

  const benefits = {
    sellers: [
      "Professional dashboard va analytics",
      "Real vaqtda sotuvlar hisoboti",
      "Mahsulot boshqaruv tizimlari",
      "Click, Payme to'lov integratsiyasi",
      "24/7 texnik yordam"
    ],
    affiliates: [
      "20% gacha yuqori komissiya",
      "Har bir mahsulot uchun unique link",
      "Real vaqtda click va sotuvlar tracking",
      "Professional marketing materiallari",
      "Tezkor to'lovlar"
    ]
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="marketplace-gradient text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-6 text-white border-white/20">
              O'zbekiston Eng Yirik Marketplace
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              O'zbek
              <span className="block text-brand-secondary">Marketplace</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
              Sotuvchilar, blogerlar va xaridorlar uchun professional e-commerce platforma. 
              Uzum Market sifatida, premium funksiyalar bilan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/marketplace">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Mahsulotlarni Ko'rish
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-brand-primary" asChild>
                <Link to="/seller/onboarding">
                  <Store className="mr-2 h-5 w-5" />
                  Sotuvchi Bo'ling
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary/10 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-brand-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Nima Uchun O'zbek Marketplace?
            </h2>
            <p className="text-xl text-muted-foreground">
              O'zbekiston bozoriga moslashtirilgan, dunyo standartlaridagi e-commerce platforma
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary/10 rounded-full mb-4 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Sellers */}
            <Card className="p-8">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center">
                    <Store className="w-8 h-8 text-brand-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Sotuvchilar Uchun</CardTitle>
                    <CardDescription>Professional kabinet va boshqaruv tizimlari</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {benefits.sellers.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-success flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
                <div className="pt-6">
                  <Button className="w-full" asChild>
                    <Link to="/seller/onboarding">
                      Sotuvchi Sifatida Boshlash
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Affiliates */}
            <Card className="p-8">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-brand-secondary/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-brand-secondary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Blogerlar Uchun</CardTitle>
                    <CardDescription>Affiliate marketing va yuqori komissiyalar</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {benefits.affiliates.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-brand-success flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
                <div className="pt-6">
                  <Button className="w-full" variant="secondary" asChild>
                    <Link to="/affiliate/onboarding">
                      Blogger Sifatida Boshlash
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Ishonch va Sifat Kafolati
            </h2>
            <p className="text-xl text-muted-foreground">
              O'zbekiston bozoriga moslashtirilgan, xalqaro standartlar asosida
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary/10 rounded-full mb-6">
                <Shield className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">100% Xavfsiz</h3>
              <p className="text-muted-foreground">
                Bank darajasida xavfsizlik va ma'lumotlar himoyasi
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary/10 rounded-full mb-6">
                <Clock className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">24/7 Yordam</h3>
              <p className="text-muted-foreground">
                Doimo mavjud texnik yordam va qo'llab-quvvatlash
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary/10 rounded-full mb-6">
                <Truck className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Tez Yetkazish</h3>
              <p className="text-muted-foreground">
                O'zbekiston bo'ylab tez va ishonchli yetkazib berish
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 marketplace-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Bugundan Boshlaymizmi?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            O'zbek Marketplace bilan biznesingizni rivojlantiring yoki 
            blogger sifatida daromad qilishni boshlang
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/marketplace">
                Xarid Qilish
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white hover:text-brand-primary" asChild>
              <Link to="/register">
                Ro'yxatdan O'tish
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}