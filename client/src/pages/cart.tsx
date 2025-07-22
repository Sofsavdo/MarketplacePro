import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { processPayment } from '@/lib/payment';

interface CartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    nameUz: string;
    nameRu: string;
    slug: string;
    price: string;
    images: string[];
    fastDelivery: boolean;
    stock: number;
  };
}

export default function Cart() {
  const [, navigate] = useLocation();
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'click' | 'payme' | 'cash'>('click');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [phone, setPhone] = useState('');

  const { data: cartItems = [], isLoading } = useQuery<CartItem[]>({
    queryKey: ['/api/cart'],
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      apiRequest('PUT', `/api/cart/${id}`, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: 'Failed to update quantity',
        variant: 'destructive',
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest('DELETE', `/api/cart/${id}`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: t('common.success'),
        description: 'Item removed from cart',
      });
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: 'Failed to remove item',
        variant: 'destructive',
      });
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: (orderData: any) =>
      apiRequest('POST', '/api/orders', orderData),
    onSuccess: async (response) => {
      const order = await response.json();
      
      // Process payment
      if (selectedPaymentMethod !== 'cash') {
        try {
          const paymentResult = await processPayment({
            method: selectedPaymentMethod,
            amount: totalAmount,
            orderId: order.id,
          });
          
          if (paymentResult.success) {
            toast({
              title: t('payment.success'),
              description: 'Order placed successfully!',
            });
            navigate('/orders');
          } else {
            toast({
              title: t('payment.failed'),
              description: paymentResult.error || 'Payment failed',
              variant: 'destructive',
            });
          }
        } catch (error) {
          toast({
            title: t('payment.failed'),
            description: 'Payment processing failed',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: t('common.success'),
          description: 'Order placed successfully!',
        });
        navigate('/orders');
      }
    },
    onError: () => {
      toast({
        title: t('common.error'),
        description: 'Failed to place order',
        variant: 'destructive',
      });
    },
  });

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantityMutation.mutate({ id: itemId, quantity: newQuantity });
  };

  const handleRemoveItem = (itemId: number) => {
    removeItemMutation.mutate(itemId);
  };

  const handleCheckout = () => {
    if (!deliveryAddress || !phone) {
      toast({
        title: t('common.error'),
        description: 'Please fill in delivery address and phone number',
        variant: 'destructive',
      });
      return;
    }

    const orderItems = cartItems.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    checkoutMutation.mutate({
      totalAmount: totalAmount.toString(),
      paymentMethod: selectedPaymentMethod,
      deliveryAddress,
      phone,
      items: orderItems,
    });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('uz-UZ').format(parseInt(price)) + ' so\'m';
  };

  const totalAmount = cartItems.reduce((total, item) => {
    return total + (parseInt(item.product.price) * item.quantity);
  }, 0);

  const deliveryCost = cartItems.some(item => item.product.fastDelivery) ? 0 : 25000;
  const finalTotal = totalAmount + deliveryCost;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="bg-gray-200 h-8 w-48 rounded"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6">
                <div className="flex space-x-4">
                  <div className="bg-gray-200 h-20 w-20 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                    <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('cart.empty')}</h1>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <Button
            onClick={() => navigate('/')}
            className="btn-texno-primary"
          >
            {t('cart.continue')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-[#2A6BFF]"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('common.back')}</span>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {t('cart.title')} ({cartItems.length})
            </h1>

            <div className="space-y-4">
              {cartItems.map((item) => {
                const productName = language === 'uz' ? item.product.nameUz : item.product.nameRu;
                const mainImage = item.product.images[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200';
                
                return (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <img
                          src={mainImage}
                          alt={productName}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {productName}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {item.product.fastDelivery ? t('product.delivery.fast') : t('product.delivery.standard')}
                          </p>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || updateQuantityMutation.isPending}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="px-4 py-2 font-medium">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.stock || updateQuantityMutation.isPending}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={removeItemMutation.isPending}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">
                            {formatPrice((parseInt(item.product.price) * item.quantity).toString())}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatPrice(item.product.price)} each
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{t('cart.checkout')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Delivery Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2A6BFF] focus:border-transparent"
                    rows={3}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your full delivery address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#2A6BFF] focus:border-transparent"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 XX XXX XX XX"
                    required
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('payment.methods')}
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="click"
                        checked={selectedPaymentMethod === 'click'}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value as any)}
                        className="mr-2"
                      />
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-5 bg-[#2A6BFF] rounded flex items-center justify-center text-white text-xs font-bold">
                          Click
                        </div>
                        <span>Click</span>
                      </div>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="payme"
                        checked={selectedPaymentMethod === 'payme'}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value as any)}
                        className="mr-2"
                      />
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-5 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold">
                          Payme
                        </div>
                        <span>Payme</span>
                      </div>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={selectedPaymentMethod === 'cash'}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value as any)}
                        className="mr-2"
                      />
                      <span>{t('payment.cash')}</span>
                    </label>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPrice(totalAmount.toString())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span>{deliveryCost === 0 ? 'Free' : formatPrice(deliveryCost.toString())}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>{t('cart.total')}:</span>
                    <span className="text-[#2A6BFF]">{formatPrice(finalTotal.toString())}</span>
                  </div>
                </div>

                <Button
                  className="w-full btn-texno-primary py-3 text-lg"
                  onClick={handleCheckout}
                  disabled={checkoutMutation.isPending || !deliveryAddress || !phone}
                >
                  {checkoutMutation.isPending 
                    ? t('payment.processing') 
                    : `${t('cart.checkout')} - ${formatPrice(finalTotal.toString())}`
                  }
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  {t('cart.continue')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
