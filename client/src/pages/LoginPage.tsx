import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Store, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || '/marketplace';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Muvaffaqiyat",
        description: "Tizimga muvaffaqiyatli kirdingiz!",
        variant: "success",
      });
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        title: "Xatolik",
        description: error instanceof Error ? error.message : "Kirish muvaffaqiyatsiz",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
              Hisobingizga Kiring
            </CardTitle>
            <CardDescription className="text-center">
              Email va parolingizni kiriting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email manzili</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sizning@email.uz"
                    required
                    disabled={loading}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Parol</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Parolingizni kiriting"
                      required
                      disabled={loading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                    Meni eslab qoling
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-brand-primary hover:text-brand-primary/80"
                  >
                    Parolni unutdingizmi?
                  </Link>
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
                    Kirish...
                  </>
                ) : (
                  'Kirish'
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Hisobingiz yo'qmi?{' '}
                <Link
                  to="/register"
                  className="font-medium text-brand-primary hover:text-brand-primary/80"
                >
                  Ro'yxatdan o'ting
                </Link>
              </div>
            </form>

            {/* Demo Accounts */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="text-center text-sm text-muted-foreground mb-4">
                Demo hisoblar:
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-muted rounded text-center">
                  <strong>Admin:</strong> admin@uzbek-marketplace.uz / admin123
                </div>
                <div className="text-center text-muted-foreground">
                  Ro'yxatdan o'tish orqali yangi hisob ochishingiz mumkin
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Birinchi marta tashrif buyuryapsizmi?{' '}
            <Link to="/" className="text-brand-primary hover:text-brand-primary/80 font-medium">
              Bosh sahifaga qaytish
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}