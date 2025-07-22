import { useQuery } from '@tanstack/react-query';
import { HeroSlider } from '@/components/home/hero-slider';
import { CategoryMenu } from '@/components/home/category-menu';
import { ProductGrid } from '@/components/product/product-grid';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';

export default function Home() {
  const { t } = useLanguage();

  const { data: popularProducts = [], isLoading: loadingPopular } = useQuery({
    queryKey: ['/api/products/popular'],
  });

  const { data: newProducts = [], isLoading: loadingNew } = useQuery({
    queryKey: ['/api/products/new'],
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Hero Slider */}
      <HeroSlider />
      
      {/* Category Menu */}
      <CategoryMenu />
      
      {/* Popular Products */}
      {loadingPopular ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-80 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-gray-200 h-4 rounded"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-6 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <ProductGrid
          products={Array.isArray(popularProducts) ? popularProducts : []}
          title={t('home.popularProducts')}
          showViewAll
          onViewAll={() => window.location.href = '/products?filter=popular'}
        />
      )}
      
      {/* New Products */}
      {loadingNew ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-80 animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-gray-200 h-4 rounded"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-6 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <ProductGrid
          products={Array.isArray(newProducts) ? newProducts : []}
          title={t('home.newProducts')}
          showViewAll
          onViewAll={() => window.location.href = '/products?filter=new'}
        />
      )}
      
      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-[#2A6BFF] to-blue-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">{t('home.heroTitle')}</h2>
          <p className="text-xl mb-6 opacity-90">{t('home.heroSubtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="btn-texno-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all"
              onClick={() => window.location.href = '/seller/register'}
            >
              {t('common.becomeSeller')}
            </Button>
            <Button 
              variant="secondary"
              className="bg-white text-[#2A6BFF] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
              onClick={() => window.location.href = '/partner/register'}
            >
              {t('common.becomePartner')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
