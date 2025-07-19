import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  XCircle,
  Eye,
  ArrowRight
} from 'lucide-react';

interface Order {
  id: number;
  totalAmount: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  trackingNumber?: string;
  items: {
    id: number;
    quantity: number;
    price: string;
    product: {
      id: number;
      title: string;
      images: string[];
    };
  }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders/my-orders', { 
        credentials: 'include' 
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      minimumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <Package className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Kutilmoqda';
      case 'confirmed':
        return 'Tasdiqlangan';
      case 'shipped':
        return 'Yo\'lda';
      case 'delivered':
        return 'Yetkazilgan';
      case 'cancelled':
        return 'Bekor qilingan';
      default:
        return status;
    }
  };

  const getPaymentStatusText = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'pending':
        return 'Kutilmoqda';
      case 'paid':
        return 'To\'langan';
      case 'failed':
        return 'Muvaffaqiyatsiz';
      case 'refunded':
        return 'Qaytarilgan';
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
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
        <h1 className="text-3xl font-bold mb-2">Buyurtmalarim</h1>
        <p className="text-muted-foreground">
          Barcha buyurtmalaringizni kuzating va boshqaring
        </p>
      </div>

      {/* Status Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {Object.entries(statusCounts).map(([status, count]) => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(status)}
                className="flex items-center gap-2"
              >
                {status !== 'all' && getStatusIcon(status as Order['status'])}
                <span>
                  {status === 'all' ? 'Barchasi' : getStatusText(status as Order['status'])}
                </span>
                <Badge variant="secondary" className="ml-1">
                  {count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">
            {selectedStatus === 'all' ? 'Buyurtma yo\'q' : 'Bu holatda buyurtma yo\'q'}
          </h2>
          <p className="text-muted-foreground mb-8">
            {selectedStatus === 'all' 
              ? 'Hozircha buyurtma bermadingiz. Keling, xarid qilishni boshlaylik!'
              : `${getStatusText(selectedStatus as Order['status'])} holatida buyurtma mavjud emas.`
            }
          </p>
          {selectedStatus === 'all' && (
            <Button>
              Xarid qilishni boshlash
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Buyurtma #{order.id}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('uz-UZ', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">
                      {formatPrice(order.totalAmount)}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{getStatusText(order.status)}</span>
                      </Badge>
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                        {getPaymentStatusText(order.paymentStatus)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.product.images?.[0] || '/placeholder-product.jpg'}
                        alt={item.product.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.product.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatPrice((parseFloat(item.price) * item.quantity).toString())}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking & Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    {order.trackingNumber && (
                      <p className="text-sm text-muted-foreground">
                        Kuzatuv raqami: <span className="font-mono">{order.trackingNumber}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Batafsil
                    </Button>
                    {order.status === 'delivered' && order.paymentStatus === 'paid' && (
                      <Button variant="outline" size="sm">
                        Qayta buyurtma berish
                      </Button>
                    )}
                    {order.status === 'pending' && (
                      <Button variant="outline" size="sm" className="text-red-600">
                        Bekor qilish
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}