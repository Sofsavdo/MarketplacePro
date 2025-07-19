import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Truck, 
  Shield, 
  ArrowLeft,
  Share2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Product {
  id: number;
  title: string;
  titleUz: string;
  description: string;
  descriptionUz: string;
  price: string;
  discountPrice?: string;
  stock: number;
  images: string[];
  specifications?: string;
  affiliateCommissionRate: string;
  seller: {
    id: number;
    firstName: string;
    lastName: string;
  };
  category: {
    id: number;
    name: string;
    nameUz: string;
  };
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        toast({
          title: "Xatolik",
          description: "Mahsulot topilmadi",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Mahsulotni yuklashda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product?.id,
          quantity
        }),
        credentials: 'include'
      });

      if (response.ok) {
        toast({
          title: "Savatga qo'shildi!",
          description: `${product?.title} savatga qo'shildi`,
        });
      } else {
        const error = await response.json();
        toast({
          title: "Xatolik",
          description: error.error || "Savatga qo'shishda xatolik",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Savatga qo'shishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const addToWishlist = async () => {
    try {
      const response = await fetch('/api/cart/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product?.id
        }),
        credentials: 'include'
      });

      if (response.ok) {
        toast({
          title: "Sevimli ro'yxatga qo'shildi!",
          description: `${product?.title} sevimli ro'yxatga qo'shildi`,
        });
      }
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Sevimli ro'yxatga qo'shishda xatolik",
        variant: "destructive",
      });
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  const calculateDiscountPercent = (originalPrice: string, discountPrice: string) => {
    const original = parseFloat(originalPrice);
    const discount = parseFloat(discountPrice);
    return Math.round(((original - discount) / original) * 100);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-6 bg-muted rounded w-1/3" />
              <div className="h-12 bg-muted rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Mahsulot topilmadi</h1>
          <Link to="/marketplace">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Marketplace'ga qaytish
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const discountPercent = product.discountPrice 
    ? calculateDiscountPercent(product.price, product.discountPrice)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">Bosh sahifa</Link>
        <span>/</span>
        <Link to="/marketplace" className="hover:text-foreground">Marketplace</Link>
        <span>/</span>
        <Link to={`/marketplace?category=${product.category.id}`} className="hover:text-foreground">
          {product.category.nameUz}
        </Link>
        <span>/</span>
        <span className="text-foreground">{product.title}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="aspect-square relative mb-4 rounded-lg overflow-hidden bg-muted">
            <img
              src={product.images?.[selectedImageIndex] || '/placeholder-product.jpg'}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {discountPercent > 0 && (
              <Badge variant="destructive" className="absolute top-4 left-4">
                -{discountPercent}%
              </Badge>
            )}
            
            {/* Image Navigation */}
            {product.images && product.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                  disabled={selectedImageIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={() => setSelectedImageIndex(Math.min(product.images.length - 1, selectedImageIndex + 1))}
                  disabled={selectedImageIndex === product.images.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index ? 'border-primary' : 'border-muted'
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="text-sm text-muted-foreground mb-2">
              {product.category.nameUz}
            </div>
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
                <span className="text-sm text-muted-foreground ml-2">(4.2) • 127 ta sharh</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-4">
                {product.discountPrice ? (
                  <>
                    <span className="text-3xl font-bold text-red-600">
                      {formatPrice(product.discountPrice)}
                    </span>
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              
              {product.stock > 0 ? (
                <div className="text-green-600 font-medium">
                  ✓ Omborda mavjud ({product.stock} dona)
                </div>
              ) : (
                <div className="text-red-600 font-medium">
                  ✗ Omborda tugagan
                </div>
              )}
            </div>
          </div>

          {/* Seller Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Sotuvchi</div>
                  <div className="font-medium">
                    {product.seller.firstName} {product.seller.lastName}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Profil
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Maksimal: {product.stock} dona
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                className="flex-1" 
                size="lg" 
                onClick={addToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Savatga qo'shish
              </Button>
              <Button variant="outline" size="lg" onClick={addToWishlist}>
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="h-4 w-4 text-blue-600" />
              <span>Bepul yetkazib berish</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Kafolat</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-yellow-600" />
              <span>Sifat nazorati</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description and Specifications */}
      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Mahsulot haqida</h2>
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {product.specifications && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Texnik xususiyatlari</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {product.specifications}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}