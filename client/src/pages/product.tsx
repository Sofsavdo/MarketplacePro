import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Heart, ShoppingCart, Star, Truck, Share2, Shield, ArrowLeft, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Product {
  id: number;
  nameUz: string;
  nameRu: string;
  descriptionUz?: string;
  descriptionRu?: string;
  slug: string;
  price: string;
  originalPrice?: string;
  discount?: number;
  images: string[];
  rating?: string;
  reviewCount: number;
  fastDelivery: boolean;
  stock: number;
  categoryId: number;
}

interface Review {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

export default function Product() {
  const [location, navigate] = useLocation();
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const productSlug = location.split('/')[2];

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ['/api/products', productSlug],
    enabled: !!productSlug,
  });

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ['/api/products', product?.id, 'reviews'],
    enabled: !!product?.id,
  });

  const addToCartMutation = useMutation({
    mutationFn: () => 
      apiRequest('POST', '/api/cart', { productId: product!.id, quantity }),
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
        description: 'Please login to add items to cart',
        variant: 'destructive',
      });
    },
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: () => 
      isFavorited 
        ? apiRequest('DELETE', `/api/favorites/${product!.id}`, {})
        : apiRequest('POST', '/api/favorites', { productId: product!.id }),
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
        description: 'Please login to add to favorites',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-8 w-32 rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 h-96 rounded-xl"></div>
              <div className="space-y-4">
                <div className="bg-gray-200 h-8 rounded"></div>
                <div className="bg-gray-200 h-6 rounded w-3/4"></div>
                <div className="bg-gray-200 h-10 rounded w-1/2"></div>
                <div className="bg-gray-200 h-32 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const name = language === 'uz' ? product.nameUz : product.nameRu;
  const description = language === 'uz' ? product.descriptionUz : product.descriptionRu;
  const mainImage = product.images[selectedImageIndex] || product.images[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600';

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('uz-UZ').format(parseInt(price)) + ' so\'m';
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(product.stock, prev + delta)));
  };

  const handleAddToCart = () => {
    addToCartMutation.mutate();
  };

  const handleToggleFavorite = () => {
    toggleFavoriteMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-[#2A6BFF]"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('common.back')}</span>
        </Button>

        {/* Product details */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product images */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={mainImage}
                  alt={name}
                  className="w-full h-96 object-cover rounded-xl"
                />
                {product.discount && product.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-[#FF8C38] text-white px-3 py-1 rounded-lg font-semibold">
                    -{product.discount}%
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                  onClick={handleToggleFavorite}
                  disabled={toggleFavoriteMutation.isPending}
                >
                  <Heart 
                    className={`w-5 h-5 ${
                      isFavorited ? 'text-red-500 fill-current' : 'text-gray-600'
                    }`} 
                  />
                </Button>
              </div>
              
              {/* Thumbnail images */}
              {product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === index ? 'border-[#2A6BFF]' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        src={image}
                        alt={`${name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
                
                {/* Rating */}
                {product.rating && parseFloat(product.rating) > 0 && (
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(parseFloat(product.rating || "0"))
                              ? 'fill-current'
                              : 'text-gray-300 fill-current'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-lg font-medium">
                      {product.rating}
                    </span>
                    <span className="text-gray-500">
                      ({product.reviewCount} {t('product.reviews')})
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl font-bold text-[#2A6BFF]">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {product.discount && product.discount > 0 && (
                    <div className="text-green-600 font-semibold">
                      {t('product.discount')}: {product.discount}%
                    </div>
                  )}
                </div>

                {/* Delivery info */}
                <div className="flex items-center space-x-2 text-green-600 mb-6">
                  <Truck className="w-5 h-5" />
                  <span className="font-medium">
                    {product.fastDelivery ? t('product.delivery.fast') : t('product.delivery.standard')}
                  </span>
                </div>

                {/* Stock */}
                <div className="mb-6">
                  {product.stock > 0 ? (
                    <span className="text-green-600 font-medium">
                      {t('product.inStock')} ({product.stock} {t('product.available')})
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">
                      {t('product.outOfStock')}
                    </span>
                  )}
                </div>

                {/* Quantity selector */}
                <div className="flex items-center space-x-4 mb-6">
                  <span className="font-medium">{t('cart.quantity')}:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex space-x-4">
                  <Button
                    className="flex-1 btn-texno-primary py-3 px-6 text-lg font-semibold flex items-center justify-center space-x-2"
                    onClick={handleAddToCart}
                    disabled={addToCartMutation.isPending || product.stock === 0}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{t('product.addToCart')}</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="p-3"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Shield className="w-5 h-5" />
                    <span>{t('product.warranty')}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Truck className="w-5 h-5" />
                    <span>{t('product.delivery.free')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product description */}
          {description && (
            <div className="border-t border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('product.description')}
              </h3>
              <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <div className="border-t border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('product.reviews')} ({reviews.length})
              </h3>
              <div className="space-y-4">
                {reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'fill-current' : 'text-gray-300 fill-current'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium">
                        {review.user.firstName} {review.user.lastName}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-gray-600">{review.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
