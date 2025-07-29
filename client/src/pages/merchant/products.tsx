import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

export default function MerchantProducts() {
  const products = [
    {
      id: 1,
      name: "iPhone 14 Pro Max",
      price: "8,999,000 so'm",
      stock: 10,
      status: "active",
      sales: 15
    },
    {
      id: 2,
      name: "MacBook Pro 16\"",
      price: "24,999,000 so'm",
      stock: 5,
      status: "active",
      sales: 8
    },
    {
      id: 3,
      name: "AirPods Pro",
      price: "1,500,000 so'm",
      stock: 20,
      status: "inactive",
      sales: 25
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mahsulotlarim</h1>
            <p className="text-gray-600 mt-2">Barcha mahsulotlaringizni boshqaring</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Yangi mahsulot
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-lg font-semibold text-green-600">{product.price}</span>
                      <span className="text-sm text-gray-500">Omborda: {product.stock}</span>
                      <span className="text-sm text-gray-500">Sotilgan: {product.sales}</span>
                    </div>
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                    {product.status}
                  </Badge>
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}