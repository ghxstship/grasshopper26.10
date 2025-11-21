/**
 * Products Page - Redirect to main marketplace
 * This route serves the same content as /marketplace
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, H2, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { SearchBar } from '@/components/ui-rebuild/molecules/SearchBar';
import { Select } from '@/components/ui-rebuild/atoms/Select';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl?: string;
  category?: string;
  stock: number;
  featured: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('all');

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params: Record<string, string> = {};
        if (searchQuery) params.search = searchQuery;
        if (categoryFilter !== 'all') params.category = categoryFilter;
        
        const response = await apiClient.get<{ products: Product[] }>('/api/products', {
          params,
        });

        if (response.data?.products) {
          setProducts(response.data.products);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, categoryFilter]);

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'APPAREL', label: 'Apparel' },
    { value: 'ACCESSORIES', label: 'Accessories' },
    { value: 'COLLECTIBLES', label: 'Collectibles' },
    { value: 'MUSIC', label: 'Music' },
    { value: 'ART', label: 'Art' },
  ];

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  };

  const addToCart = async (productId: string) => {
    try {
      await apiClient.post('/api/cart/items', {
        productId,
        quantity: 1,
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">All Products</H1>
          <Body className="text-gray-600">
            Browse our complete collection of merchandise and collectibles.
          </Body>
        </div>

        <div className="mb-8 space-y-4">
          <SearchBar
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            loading={loading}
          />

          <Select
            options={categoryOptions}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Spinner size="xl" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <H3 className="mb-4">No products found</H3>
            <Body className="text-gray-600">
              Try adjusting your search or filters.
            </Body>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Card key={product.id}>
                <div className="aspect-square bg-gray-200 border-b-2 border-black">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="h-16 w-16 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    {product.category && (
                      <Badge variant="outline">{product.category}</Badge>
                    )}
                    {product.featured && <Badge>Featured</Badge>}
                  </div>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <H2>
                      {formatPrice(product.price, product.currency)}
                    </H2>
                    <Caption className={product.stock > 0 ? 'text-gray-600' : 'text-gray-900'}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </Caption>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Link href={`/marketplace/products/${product.id}`} className="flex-1">
                    <Button variant="secondary" fullWidth>
                      View
                    </Button>
                  </Link>
                  <Button
                    onClick={() => addToCart(product.id)}
                    disabled={product.stock === 0}
                    className="flex-1"
                  >
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
