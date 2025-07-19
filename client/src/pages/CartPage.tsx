import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus,
  ArrowRight,
  Heart
} from 'lucide-react';

interface CartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    title: string;
    price: string;
    discountPrice?: string;
    images: string[];
    stock: number;
    seller: {
      firstName: string;
      lastName: string;
    };
  };
}

export default function CartPage() {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
        credentials: 'include'
      });

      if (response.ok) {
        setCartItems(items => 
          items.map(item => 
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Miqdorni yangilashda xatolik",
        variant: "destructive",
      });
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setCartItems(items => items.filter(item => item.id !== itemId));
        toast({
          title: "O'chirildi",
          description: "Mahsulot savatdan o'chirildi",
        });
      }
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "O'chirishda xatolik yuz berdi",
        variant: "destructive",
      });
    }
  };

  const moveToWishlist = async (productId: number, itemId: number) => {
    try {
      const response = await fetch('/api/cart/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
        credentials: 'include'
      });

      if (response.ok) {
        await removeItem(itemId);
        toast({
          title: "Sevimli ro'yxatga ko'chirildi",
          description: "Mahsulot sevimli ro'yxatga ko'chirildi",
        });
      }
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Ko'chirishda xatolik yuz berdi",
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

  const calculateItemTotal = (item: CartItem) => {
    const price = item.product.discountPrice || item.product.price;
    return parseFloat(price) * item.quantity;
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  const calculateSavings = () => {
    return cartItems.reduce((savings, item) => {
      if (item.product.discountPrice) {
        const originalPrice = parseFloat(item.product.price);
        const discountPrice = parseFloat(item.product.discountPrice);
        return savings + ((originalPrice - discountPrice) * item.quantity);
      }
      return savings;
    }, 0);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Savat</h1>
        <p className="text-muted-foreground">
          {cartItems.length} ta mahsulot savatda
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Savatcha bo'sh</h2>
          <p className="text-muted-foreground mb-8">
            Hozircha siz hech narsa tanlamadingiz. Keling, mahsulotlarni ko'rib chiqaylik!
          </p>
          <Link to="/marketplace">
            <Button size="lg">
              Xarid qilishni boshlash
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.product.images?.[0] || '/placeholder-product.jpg'}
                      alt={item.product.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-lg mb-1 line-clamp-2">
                        {item.product.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Sotuvchi: {item.product.seller.firstName} {item.product.seller.lastName}
                      </p>
                      
                      <div className="flex items-center gap-4 mb-4">
                        {item.product.discountPrice ? (
                          <>
                            <span className="text-xl font-bold text-red-600">
                              {formatPrice(item.product.discountPrice)}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                              {formatPrice(item.product.price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold">
                            {formatPrice(item.product.price)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-4 py-2 min-w-[60px] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveToWishlist(item.product.id, item.id)}
                          >
                            <Heart className="h-4 w-4 mr-1" />
                            Sevimli
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            O'chirish
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold">
                        {formatPrice(calculateItemTotal(item).toString())}
                      </div>
                      {item.product.stock < 10 && (
                        <div className="text-sm text-orange-600 mt-1">
                          Faqat {item.product.stock} ta qoldi!
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Buyurtma xulosasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="truncate pr-2">
                        {item.product.title} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        {formatPrice(calculateItemTotal(item).toString())}
                      </span>
                    </div>
                  ))}
                </div>

                <hr />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Mahsulotlar narxi:</span>
                    <span>{formatPrice(calculateTotal().toString())}</span>
                  </div>
                  
                  {calculateSavings() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Chegirma:</span>
                      <span>-{formatPrice(calculateSavings().toString())}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Yetkazib berish:</span>
                    <span className="text-green-600">Bepul</span>
                  </div>
                </div>

                <hr />

                <div className="flex justify-between text-xl font-bold">
                  <span>Jami:</span>
                  <span>{formatPrice(calculateTotal().toString())}</span>
                </div>

                <div className="space-y-2 pt-4">
                  <Link to="/checkout" className="block">
                    <Button className="w-full" size="lg">
                      Buyurtma berish
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/marketplace" className="block">
                    <Button variant="outline" className="w-full">
                      Xaridni davom ettirish
                    </Button>
                  </Link>
                </div>

                <div className="text-center text-sm text-muted-foreground pt-4">
                  <p>✓ Xavfsiz to'lov</p>
                  <p>✓ 14 kun ichida qaytarish</p>
                  <p>✓ Kafolat</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}