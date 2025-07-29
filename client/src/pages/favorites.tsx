import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

export default function Favorites() {
  const favorites = [
    {
      id: 1,
      name: "iPhone 14 Pro Max",
      price: "8,999,000 so'm",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"
    },
    {
      id: 2,
      name: "MacBook Pro 16\"",
      price: "24,999,000 so'm",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"
    },
    {
      id: 3,
      name: "AirPods Pro",
      price: "1,500,000 so'm",
      image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sevimlilarim</h1>
        <p className="text-gray-600 mt-2">Saqlangan mahsulotlaringiz</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <CardTitle className="text-lg">{item.name}</CardTitle>
              <CardDescription className="text-lg font-semibold text-green-600">
                {item.price}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button className="flex-1">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Savatga qo'shish
                </Button>
                <Button variant="outline" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}