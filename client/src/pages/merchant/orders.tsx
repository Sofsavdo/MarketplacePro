import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, DollarSign, User } from "lucide-react";

export default function MerchantOrders() {
  const orders = [
    {
      id: "ORD-001",
      customer: "Aziz Karimov",
      date: "2024-01-15",
      total: "2,450,000 so'm",
      status: "confirmed",
      items: 3
    },
    {
      id: "ORD-002",
      customer: "Malika Yusupova",
      date: "2024-01-14",
      total: "1,890,000 so'm",
      status: "shipped",
      items: 2
    },
    {
      id: "ORD-003",
      customer: "Jasur Toshmatov",
      date: "2024-01-13",
      total: "3,120,000 so'm",
      status: "pending",
      items: 1
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      confirmed: "default",
      shipped: "default",
      delivered: "default",
      cancelled: "destructive"
    };
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Buyurtmalar</h1>
        <p className="text-gray-600 mt-2">Barcha buyurtmalarni boshqaring</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-gray-500" />
                  <div>
                    <CardTitle className="text-lg">{order.id}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{order.customer}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{order.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>{order.total}</span>
                        </div>
                      </div>
                    </CardDescription>
                  </div>
                </div>
                {getStatusBadge(order.status)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{order.items} ta mahsulot</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}