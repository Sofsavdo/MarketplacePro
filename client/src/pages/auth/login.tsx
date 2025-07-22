import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface LoginResponse {
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  token: string;
}

export default function Login() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const loginMutation = useMutation({
    mutationFn: (data: typeof formData) => 
      apiRequest('POST', '/api/auth/login', data),
    onSuccess: async (response) => {
      const result: LoginResponse = await response.json();
      localStorage.setItem('texnogrand-token', result.token);
      localStorage.setItem('texnogrand-user', JSON.stringify(result.user));
      
      toast({
        title: t('auth.loginSuccess'),
        description: `Welcome back, ${result.user.firstName}!`,
      });
      
      navigate('/');
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: t('auth.invalidCredentials'),
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast({
        title: t('common.error'),
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }
    loginMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#2A6BFF]">TexnoGrand</CardTitle>
          <CardDescription>{t('auth.login')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                required
                className="focus:ring-2 focus:ring-[#2A6BFF] focus:border-transparent"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  required
                  className="focus:ring-2 focus:ring-[#2A6BFF] focus:border-transparent pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full btn-texno-primary py-2"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? t('common.loading') : t('auth.login')}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <Button
              variant="link"
              className="text-[#2A6BFF] hover:underline"
            >
              {t('auth.forgotPassword')}
            </Button>
            
            <div className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Button
                variant="link"
                className="text-[#2A6BFF] hover:underline p-0"
                onClick={() => navigate('/register')}
              >
                {t('auth.register')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
