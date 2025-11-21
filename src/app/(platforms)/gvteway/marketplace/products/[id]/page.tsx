/**
 * Product Details Page - UI Rebuild
 * Detailed product view with purchase options
 */

'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Hero, H2, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Separator } from '@/components/ui-rebuild/atoms/Separator';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  category?: string;
  imageUrl?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [quantity, setQuantity] = React.useState(1);

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<Product>(`/api/products/${params.id}`);
        if (response.data) {
          setProduct(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleAddToCart = async () => {
    try {
      await apiClient.post('/api/cart/items', {
        productId: product?.id,
        quantity,
      });
      router.push('/marketplace/cart');
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

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <H2 className="mb-4">Product Not Found</H2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="aspect-square bg-gray-200 border-4 border-black mb-6">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="h-24 w-24 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div>
            {product.category && <Badge className="mb-4">{product.category}</Badge>}
            <Hero className="mb-6">{product.name}</Hero>
            <Body className="text-gray-700 text-lg mb-8">{product.description}</Body>

            <Card>
              <CardHeader>
                <CardTitle>Purchase</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Caption className="text-gray-500 mb-1">Price</Caption>
                  <H2>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: product.currency,
                    }).format(product.price)}
                  </H2>
                </div>
                <Separator />
                <div>
                  <Caption className="text-gray-500 mb-2">Quantity</Caption>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="secondary"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      −
                    </Button>
                    <span className="font-share-tech text-xl w-12 text-center">{quantity}</span>
                    <Button
                      variant="secondary"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </Button>
                  </div>
                  <Caption className="text-gray-500 mt-2">{product.stock} in stock</Caption>
                </div>
              </CardContent>
              <CardContent>
                <Button
                  fullWidth
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
