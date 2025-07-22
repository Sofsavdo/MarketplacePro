import { useState } from 'react';
import { Link } from 'wouter';
import { Heart, ShoppingCart, Star, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

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

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFavorited, setIsFavorited] = useState(false);

  const name = language === 'uz' ? product.nameUz : product.nameRu;
  const mainImage = product.images[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500';
  
  const addToCartMutation = useMutation({
    mutationFn: (productId: number) => 
      apiRequest('POST', '/api/cart', { productId, quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: t('common.success'),
        description: t('product.addToCart'),
      });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: 'Failed to add to cart',
        variant: 'destructive',
      });
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: (productId: number) => 
      isFavorited 
        ? apiRequest('DELETE', `/api/favorites/${productId}`, {})
        : apiRequest('POST', '/api/favorites', { productId }),
    onSuccess: () => {
      setIsFavorited(!isFavorited);
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      toast({
        title: t('common.success'),
        description: isFavorited ? t('product.removeFromFavorites') : t('product.addToFavorites'),
      });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: 'Failed to update favorites',
        variant: 'destructive',
      });
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCartMutation.mutate(product.id);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavoriteMutation.mutate(product.id);
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('uz-UZ').format(parseInt(price)) + ' so\'m';
  };

  return (
    <div className="product-card bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit">
      <Link href={`/product/${product.slug}`}>
        <div className="relative mb-4 group">
          <img
            src={mainImage}
            alt={name}
            className="w-full h-48 object-cover rounded-lg"
            loading="lazy"
          />
          
          {/* Favorite button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleToggleFavorite}
            disabled={toggleFavoriteMutation.isPending}
          >
            <Heart 
              className={`w-4 h-4 transition-colors ${
                isFavorited ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'
              }`} 
            />
          </Button>
          
          {/* Discount badge */}
          {product.discount && product.discount > 0 && (
            <div className="absolute top-2 left-2 bg-[#FF8C38] text-white px-2 py-1 rounded-md text-xs font-semibold">
              -{product.discount}%
            </div>
          )}
        </div>
      </Link>
      
      {/* Product details */}
      <div className="space-y-2">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 hover:text-[#2A6BFF] transition-colors cursor-pointer">
            {name}
          </h3>
        </Link>
        
        {/* Rating */}
        {product.rating && parseFloat(product.rating) > 0 && (
          <div className="flex items-center space-x-1">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(parseFloat(product.rating || "0"))
                      ? 'fill-current'
                      : 'text-gray-300 fill-current'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({product.reviewCount} {t('product.reviews')})
            </span>
          </div>
        )}
        
        {/* Price */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
          </div>
          {product.originalPrice && (
            <div className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </div>
          )}
        </div>
        
        {/* Delivery info */}
        <div className="flex items-center space-x-1 text-xs text-green-600">
          <Truck className="w-3 h-3" />
          <span>
            {product.fastDelivery ? t('product.fastDelivery') : t('product.standardDelivery')}
          </span>
        </div>
        
        {/* Add to cart button */}
        <Button
          className="w-full btn-texno-primary py-2 px-4 rounded-lg text-sm font-medium mt-3 flex items-center justify-center space-x-2"
          onClick={handleAddToCart}
          disabled={addToCartMutation.isPending}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{t('product.addToCart')}</span>
        </Button>
      </div>
    </div>
  );
}
