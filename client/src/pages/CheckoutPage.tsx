import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  Smartphone, 
  Truck, 
  MapPin,
  ArrowLeft,
  CheckCircle
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
  };
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('click');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    zipCode: '',
    notes: ''
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
        
        if (data.length === 0) {
          navigate('/cart');
        }
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.discountPrice || item.product.price
        })),
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.region}, ${formData.zipCode}`,
        phone: formData.phone,
        paymentMethod,
        notes: formData.notes
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
        credentials: 'include'
      });

      if (response.ok) {
        const order = await response.json();
        
        // Clear cart
        await fetch('/api/cart', {
          method: 'DELETE',
          credentials: 'include'
        });

        toast({
          title: "Buyurtma muvaffaqiyatli berildi!",
          description: `Buyurtma raqami: #${order.id}`,
        });

        navigate('/orders');
      } else {
        const error = await response.json();
        toast({
          title: "Xatolik",
          description: error.error || "Buyurtma berishda xatolik",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Xatolik",
        description: "Buyurtma berishda xatolik yuz berdi",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded" />
              ))}
            </div>
            <div className="h-96 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => navigate('/cart')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Savatga qaytish
        </Button>
        <h1 className="text-3xl font-bold mb-2">Buyurtma rasmiylashtirish</h1>
        <p className="text-muted-foreground">
          Ma'lumotlaringizni to'ldiring va buyurtmani tasdiqlang
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Yetkazib berish ma'lumotlari
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <Label htmlFor="phone">Telefon raqam</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+998901234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address">Manzil</Label>
                  <Input
                    id="address"
                    placeholder="Ko'cha, uy raqami"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Shahar</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="region">Viloyat</Label>
                    <Input
                      id="region"
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Qo'shimcha izoh (ixtiyoriy)</Label>
                  <Input
                    id="notes"
                    placeholder="Maxsus so'rovlar yoki izohlar"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  To'lov usuli
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="click" id="click" />
                    <Label htmlFor="click" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Click</div>
                          <div className="text-sm text-muted-foreground">
                            Bank kartalari orqali to'lov
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="payme" id="payme" />
                    <Label htmlFor="payme" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium">Payme</div>
                          <div className="text-sm text-muted-foreground">
                            Payme orqali to'lov
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-orange-600" />
                        <div>
                          <div className="font-medium">Naqd pul</div>
                          <div className="text-sm text-muted-foreground">
                            Yetkazib berish vaqtida to'lov
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
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
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.product.images?.[0] || '/placeholder-product.jpg'}
                        alt={item.product.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × {formatPrice(item.product.discountPrice || item.product.price)}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        {formatPrice(calculateItemTotal(item).toString())}
                      </div>
                    </div>
                  ))}
                </div>

                <hr />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Mahsulotlar:</span>
                    <span>{formatPrice(calculateTotal().toString())}</span>
                  </div>
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

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? (
                    'Buyurtma berilmoqda...'
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Buyurtmani tasdiqlash
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  <p>✓ Xavfsiz to'lov kafolati</p>
                  <p>✓ 14 kun ichida qaytarish</p>
                  <p>✓ Sifat kafolati</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}