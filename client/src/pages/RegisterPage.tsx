import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Store, Eye, EyeOff, User, TrendingUp, ShoppingCart } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'buyer' as 'buyer' | 'seller' | 'affiliate'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Xatolik",
        description: "Parollar mos kelmaydi",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Xatolik",
        description: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      
      toast({
        title: "Muvaffaqiyat",
        description: "Hisobingiz muvaffaqiyatli yaratildi!",
        variant: "success",
      });
      
      // Redirect based on role
      if (formData.role === 'seller') {
        navigate('/seller/dashboard');
      } else if (formData.role === 'affiliate') {
        navigate('/affiliate/dashboard');
      } else {
        navigate('/marketplace');
      }
    } catch (error) {
      toast({
        title: "Xatolik",
        description: error instanceof Error ? error.message : "Ro'yxatdan o'tish muvaffaqiyatsiz",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    {
      value: 'buyer',
      title: 'Xaridor',
      description: 'Mahsulotlarni sotib olish uchun',
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      value: 'seller',
      title: 'Sotuvchi',
      description: 'Mahsulotlaringizni sotish uchun',
      icon: Store,
      color: 'text-green-600'
    },
    {
      value: 'affiliate',
      title: 'Blogger',
      description: 'Affiliate marketing orqali daromad qilish uchun',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
            <div className="h-12 w-12 marketplace-gradient rounded-lg flex items-center justify-center">
              <Store className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">O'zbek</h1>
              <p className="text-sm text-brand-primary">Marketplace</p>
            </div>
          </Link>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Ro'yxatdan O'ting
            </CardTitle>
            <CardDescription className="text-center">
              O'zbek Marketplace'ga xush kelibsiz!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div>
                <Label className="text-base font-medium">Kim sifatida ro'yxatdan o'tmoqchisiz?</Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value) => handleChange('role', value)}
                  className="mt-3"
                >
                  {roleOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <label
                        htmlFor={option.value}
                        className="flex items-center space-x-3 cursor-pointer flex-1 p-3 rounded-lg border border-transparent hover:border-border transition-colors"
                      >
                        <option.icon className={`h-5 w-5 ${option.color}`} />
                        <div>
                          <div className="font-medium">{option.title}</div>
                          <div className="text-sm text-muted-foreground">{option.description}</div>
                        </div>
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Ism</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    placeholder="Ismingiz"
                    required
                    disabled={loading}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Familiya</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    placeholder="Familiyangiz"
                    required
                    disabled={loading}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email manzili</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="sizning@email.uz"
                  required
                  disabled={loading}
                  className="mt-1"
                />
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone">Telefon raqami (ixtiyoriy)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+998 (90) 123-45-67"
                  disabled={loading}
                  className="mt-1"
                />
              </div>

              {/* Password Fields */}
              <div>
                <Label htmlFor="password">Parol</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Kamida 6 ta belgi"
                    required
                    disabled={loading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Parolni tasdiqlang</Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder="Parolni qayta kiriting"
                    required
                    disabled={loading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Yaratilmoqda...
                  </>
                ) : (
                  'Hisobni Yaratish'
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Allaqachon hisobingiz bormi?{' '}
                <Link
                  to="/login"
                  className="font-medium text-brand-primary hover:text-brand-primary/80"
                >
                  Kirish
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Ro'yxatdan o'tish orqali siz bizning{' '}
            <Link to="/terms" className="text-brand-primary hover:text-brand-primary/80">
              Foydalanish shartlari
            </Link>{' '}
            va{' '}
            <Link to="/privacy" className="text-brand-primary hover:text-brand-primary/80">
              Maxfiylik siyosati
            </Link>
            ga rozilik bildirasiz.
          </p>
        </div>
      </div>
    </div>
  );
}