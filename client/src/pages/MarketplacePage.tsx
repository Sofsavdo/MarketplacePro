import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Grid3x3, 
  List, 
  Star, 
  ShoppingCart, 
  Heart,
  ChevronDown,
  ArrowUpDown
} from 'lucide-react';
import { formatPrice, truncateText, getImageUrl, calculateDiscountPercent } from '@/lib/utils';

interface Product {
  id: number;
  title: string;
  titleUz: string;
  price: string;
  discountPrice?: string;
  stock: number;
  images: string[];
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

interface Category {
  id: number;
  name: string;
  nameUz: string;
  productCount?: number;
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        sort: sortBy
      });

      if (selectedCategory) {
        params.append('category', selectedCategory.toString());
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (priceRange.min) {
        params.append('minPrice', priceRange.min);
      }
      if (priceRange.max) {
        params.append('maxPrice', priceRange.max);
      }

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();

      if (response.ok) {
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?includeProductCount=true');
      const data = await response.json();
      
      if (response.ok) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory, sortBy, searchQuery, priceRange]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setPriceRange({ min: '', max: '' });
    setSortBy('newest');
    setCurrentPage(1);
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const discountPercent = product.discountPrice 
      ? calculateDiscountPercent(product.price, product.discountPrice)
      : 0;

    return (
      <Card className="product-card overflow-hidden">
        <div className="aspect-square relative overflow-hidden">
          <img
            src={getImageUrl(product.images?.[0])}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          {discountPercent > 0 && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              -{discountPercent}%
            </Badge>
          )}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="bg-white/80 hover:bg-white">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">{product.category.nameUz}</div>
            
            <h3 className="font-medium line-clamp-2 text-sm">
              {truncateText(product.title, 60)}
            </h3>
            
            <div className="text-xs text-muted-foreground">
              {product.seller.firstName} {product.seller.lastName}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
                <span className="text-xs text-muted-foreground">(4.2)</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {product.discountPrice ? (
                  <>
                    <span className="font-bold text-lg">
                      {formatPrice(product.discountPrice)}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="font-bold text-lg">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              
              {product.stock > 0 ? (
                <div className="text-xs text-green-600">
                  Omborda: {product.stock} dona
                </div>
              ) : (
                <div className="text-xs text-red-600">
                  Tugagan
                </div>
              )}
            </div>

            <Button className="w-full" size="sm" disabled={product.stock === 0}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Savatga
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">O'zbek Marketplace</h1>
          <p className="text-muted-foreground">
            O'zbekiston bozoriga moslashtirilgan eng yirik onlayn do'kon
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Filtrlar</CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Tozalash
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-medium mb-3">Kategoriyalar</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`block text-sm text-left w-full py-1 px-2 rounded hover:bg-accent ${!selectedCategory ? 'bg-accent font-medium' : ''}`}
                    >
                      Hammasi
                    </button>
                    {categories.slice(0, 8).map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`block text-sm text-left w-full py-1 px-2 rounded hover:bg-accent ${selectedCategory === category.id ? 'bg-accent font-medium' : ''}`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{category.nameUz}</span>
                          {category.productCount && (
                            <span className="text-xs text-muted-foreground">
                              {category.productCount}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-medium mb-3">Narx oralig'i</h3>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      placeholder="Min narx"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    />
                    <Input
                      type="number"
                      placeholder="Max narx"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Controls */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
                <form onSubmit={handleSearch} className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Mahsulotlarni qidiring..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </form>

                <div className="flex items-center gap-2">
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="newest">Eng yangilari</option>
                    <option value="oldest">Eng eskilari</option>
                    <option value="price_asc">Narx: Arzondan qimmtga</option>
                    <option value="price_desc">Narx: Qimmatdan arzonga</option>
                  </select>

                  {/* View Mode */}
                  <div className="flex border rounded-md overflow-hidden">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-none"
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <div className="aspect-square bg-muted rounded-lg skeleton" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded skeleton" />
                      <div className="h-4 bg-muted rounded skeleton w-2/3" />
                      <div className="h-6 bg-muted rounded skeleton w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-medium mb-2">Mahsulot topilmadi</h3>
                <p className="text-muted-foreground mb-4">
                  Bu filtrlar bo'yicha mahsulot mavjud emas. Boshqa so'z bilan qidiring.
                </p>
                <Button onClick={clearFilters}>
                  Filtrlarni tozalash
                </Button>
              </div>
            ) : (
              <>
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
                  {products.map((product) => (
                    <Link key={product.id} to={`/products/${product.id}`} className="group">
                      <ProductCard product={product} />
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Oldingi
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Keyingi
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}