/**
 * Marketplace Page - UI Rebuild
 * Shop official merchandise and collectibles
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Hero, H2, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui-rebuild/molecules/Tabs';
import { apiClient } from '@/lib/api/client';
import { Search, ShoppingCart, Star } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured: boolean;
}

export default function MarketplacePage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<{ success: boolean; data: { products: Product[] } }>('/api/marketplace');
        if (response.data?.data?.products) {
          setProducts(response.data.data.products);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'apparel', label: 'Apparel' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'collectibles', label: 'Collectibles' },
    { id: 'posters', label: 'Posters & Art' },
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = async (productId: string) => {
    try {
      await apiClient.post('/api/cart/add', { productId, quantity: 1 });
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="border-b-4 border-black bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-6">
            <Hero>MARKETPLACE</Hero>
            <Body className="max-w-2xl mx-auto text-gray-700 text-xl">
              Shop official merchandise, collectibles, and exclusive items from your favorite events.
            </Body>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="border-b-4 border-black bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} defaultValue="all">
            <TabsList>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <H2>{filteredProducts.length} Products</H2>
            <Link href="/cart">
              <Button variant="secondary">
                <ShoppingCart className="w-4 h-4 mr-2" />
                View Cart
              </Button>
            </Link>
          </div>

          {filteredProducts.length === 0 ? (
            <Card>
              <CardContent className="py-24 text-center">
                <H3 className="mb-4">No Products Found</H3>
                <Body className="text-gray-600">Try adjusting your search or filters</Body>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <Card 
                  key={product.id}
                  className="hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]] transition-all"
                >
                  {product.imageUrl && (
                    <div className="aspect-square bg-gray-100 border-b-4 border-black overflow-hidden">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      {product.featured && (
                        <Badge>Featured</Badge>
                      )}
                      <div className="flex items-center gap-1 ml-auto">
                        <Star className="w-4 h-4 fill-black" />
                        <Caption className="font-bold">{product.rating}</Caption>
                        <Caption className="text-gray-500">({product.reviewCount})</Caption>
                      </div>
                    </div>
                    <CardTitle className="text-base">{product.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <H2 className="text-xl">${product.price.toFixed(2)}</H2>
                    {!product.inStock && (
                      <Caption className="text-red-600 mt-2">Out of Stock</Caption>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      fullWidth
                      disabled={!product.inStock}
                      onClick={() => handleAddToCart(product.id)}
                    >
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t-4 border-black bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">🎨</div>
                <H3 className="mb-3">Official Merchandise</H3>
                <Body className="text-gray-600">
                  Authentic products from your favorite artists and events.
                </Body>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">🚚</div>
                <H3 className="mb-3">Fast Shipping</H3>
                <Body className="text-gray-600">
                  Free shipping on orders over $50. Delivered to your door.
                </Body>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">↩️</div>
                <H3 className="mb-3">Easy Returns</H3>
                <Body className="text-gray-600">
                  30-day return policy on all merchandise purchases.
                </Body>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}