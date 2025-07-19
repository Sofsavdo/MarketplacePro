import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Phone, 
  Lock,
  Save,
  Camera
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (response.ok) {
        toast({
          title: "Profil yangilandi!",
          description: "Ma'lumotlaringiz muvaffaqiyatli yangilandi.",
        });
      } else {
        const error = await response.json();
        toast({
          title: "Xatolik",
          description: error.error || "Profilni yangilashda xatolik",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Profilni yangilashda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Xatolik",
        description: "Yangi parollar mos kelmaydi",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Xatolik",
        description: "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
        credentials: 'include'
      });

      if (response.ok) {
        toast({
          title: "Parol yangilandi!",
          description: "Parolingiz muvaffaqiyatli yangilandi.",
        });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        const error = await response.json();
        toast({
          title: "Xatolik",
          description: error.error || "Parolni yangilashda xatolik",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Parolni yangilashda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profil sozlamalari</h1>
        <p className="text-muted-foreground">
          Shaxsiy ma'lumotlaringizni boshqaring va parolingizni yangilang
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Profil ma'lumotlari</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-1 -right-1 rounded-full w-8 h-8"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <h3 className="text-xl font-bold">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-muted-foreground mb-2">{user?.email}</p>
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                {user?.role === 'buyer' && 'Xaridor'}
                {user?.role === 'seller' && 'Sotuvchi'}
                {user?.role === 'affiliate' && 'Affiliate'}
                {user?.role === 'admin' && 'Administrator'}
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">24</div>
                    <div className="text-xs text-muted-foreground">Buyurtmalar</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">5</div>
                    <div className="text-xs text-muted-foreground">Sevimli</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm">Hisob xavfsizligi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Ikki faktorli autentifikatsiya</span>
                <span className="text-red-600">O'chiq</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>So'nggi kirish</span>
                <span className="text-muted-foreground">Bugun, 14:30</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Faol seanslar</span>
                <span className="text-muted-foreground">2 ta qurilma</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form & Password */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Asosiy ma'lumotlar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Ism</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Familiya</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Telefon raqam</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10"
                      placeholder="+998901234567"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saqlanmoqda...' : 'O\'zgarishlarni saqlash'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Parolni o'zgartirish
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Joriy parol</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="newPassword">Yangi parol</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Kamida 6 ta belgi bo'lishi kerak
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Yangi parolni tasdiqlang</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>

                <Button type="submit" disabled={loading} variant="outline" className="w-full">
                  <Lock className="h-4 w-4 mr-2" />
                  {loading ? 'Yangilanmoqda...' : 'Parolni yangilash'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Hisob sozlamalari</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email bildirishnomalari</h4>
                  <p className="text-sm text-muted-foreground">
                    Yangi buyurtmalar va takliflar haqida xabar olish
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Sozlash
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">SMS bildirishnomalari</h4>
                  <p className="text-sm text-muted-foreground">
                    Buyurtma holati haqida SMS orqali xabar olish
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Sozlash
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Maxfiylik sozlamalari</h4>
                  <p className="text-sm text-muted-foreground">
                    Ma'lumotlaringizning maxfiyligi va foydalanilishi
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Ko'rish
                </Button>
              </div>

              <hr />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-red-600">Hisobni o'chirish</h4>
                  <p className="text-sm text-muted-foreground">
                    Hisobingizni butunlay o'chirish (qaytarib bo'lmaydi)
                  </p>
                </div>
                <Button variant="outline" size="sm" className="text-red-600 border-red-600">
                  O'chirish
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}