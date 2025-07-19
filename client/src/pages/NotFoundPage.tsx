import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-muted-foreground opacity-50">
            404
          </div>
        </div>

        {/* Content */}
        <div className="max-w-md mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Sahifa topilmadi
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan bo'lishi mumkin.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            size="lg"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Orqaga qaytish
          </Button>
          
          <Link to="/">
            <Button size="lg">
              <Home className="h-5 w-5 mr-2" />
              Bosh sahifaga o'tish
            </Button>
          </Link>
        </div>

        {/* Popular Links */}
        <div className="mt-12 pt-8 border-t">
          <h3 className="text-lg font-medium mb-4">
            Mashhur sahifalar
          </h3>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/marketplace" className="text-blue-600 hover:underline">
              Marketplace
            </Link>
            <Link to="/seller/onboarding" className="text-blue-600 hover:underline">
              Sotuvchi bo'lish
            </Link>
            <Link to="/affiliate/onboarding" className="text-blue-600 hover:underline">
              Affiliate bo'lish
            </Link>
            <Link to="/login" className="text-blue-600 hover:underline">
              Kirish
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-sm text-muted-foreground">
          <p>
            Agar muammo davom etsa,{' '}
            <a href="mailto:support@marketplace.uz" className="text-blue-600 hover:underline">
              qo'llab-quvvatlash xizmati
            </a>{' '}
            bilan bog'laning.
          </p>
        </div>
      </div>
    </div>
  );
}