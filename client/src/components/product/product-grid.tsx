import { ProductCard } from './product-card';
import { useLanguage } from '@/hooks/use-language';

interface Product {
  id: number;
  nameUz: string;
  nameRu: string;
  slug: string;
  price: string;
  originalPrice?: string;
  discount?: number;
  images: string[];
  rating?: string;
  reviewCount: number;
  fastDelivery: boolean;
}

interface ProductGridProps {
  products: Product[];
  title: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
  columns?: 'home' | 'category';
}

export function ProductGrid({ 
  products, 
  title, 
  showViewAll = false, 
  onViewAll,
  columns = 'home'
}: ProductGridProps) {
  const { t } = useLanguage();

  const gridClasses = columns === 'home' 
    ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4'
    : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';

  if (!products || products.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">{t('common.noProducts')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {showViewAll && (
          <button 
            className="text-[#2A6BFF] hover:text-blue-700 font-medium"
            onClick={onViewAll}
          >
            {t('common.viewAll')}
          </button>
        )}
      </div>
      
      <div className={gridClasses}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
