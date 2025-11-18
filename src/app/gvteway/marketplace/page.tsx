'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, Filter, Loader2, Search, ShoppingCart, Star, Tag, TrendingUp } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Select } from '@/components/atoms/Select';
import { useProducts } from '@/lib/hooks/gvteway/useProducts';

const CATEGORIES = ['All', 'Apparel', 'Accessories', 'Collectibles', 'Music', 'Art'];

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch products with React Query
  const { data: products = [], isLoading, error, refetch } = useProducts();
  const [cartCount] = useState(3);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
      const searchMatch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [products, selectedCategory, searchQuery]);

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading products...</p>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  if (error) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load Products</h2>
            <p className="text-gray-400 mb-4">{error.message}</p>
            <Button variant="gvteway" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <header className="mb-12">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-5xl sm:text-6xl font-bebas gvteway-text-gradient" id="page-title">
                    MARKETPLACE
                  </h1>
                  <Link href="/gvteway/marketplace/cart">
                    <Button variant="gvteway" size="lg" className="relative" aria-label={`View cart with ${cartCount} items`}>
                      <ShoppingCart className="w-5 h-5 mr-2" aria-hidden="true" />
                      Cart
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-gvteway-red-500 rounded-full flex items-center justify-center text-xs font-bold" aria-label={`${cartCount} items in cart`}>
                          {cartCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                </div>
                <p className="text-xl text-gray-400 font-oswald">
                  Official merchandise and exclusive collectibles
                </p>
              </header>

              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8" role="search" aria-label="Product search and filters">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" aria-hidden="true" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12"
                    aria-label="Search products by name or description"
                  />
                </div>
                <Button variant="outline" size="lg" aria-label="Open advanced filters">
                  <Filter className="w-5 h-5 mr-2" aria-hidden="true" />
                  Filters
                </Button>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by category">
                {CATEGORIES.map((category) => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? 'gvteway' : 'outline'}
                    size="sm"
                    aria-pressed={selectedCategory === category}
                    aria-label={`Filter by ${category}`}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Featured Banner */}
              <Card variant="gvteway" className="bg-gradient-to-br from-gvteway-red-500/20 to-gvteway-blue-500/20 backdrop-blur-sm mb-12" role="region" aria-label="Featured promotion">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex-1">
                      <Badge variant="gvteway" className="mb-3">Limited Time Offer</Badge>
                      <h2 className="text-3xl font-bebas text-white mb-2">
                        Summer Collection 2025
                      </h2>
                      <p className="text-gray-300 mb-4">
                        Get 25% off on all festival merchandise. Limited quantities available!
                      </p>
                      <Button variant="gvteway" size="lg" aria-label="Shop summer collection">
                        Shop Now
                      </Button>
                    </div>
                    <div className="w-64 h-64 bg-gray-800 rounded-xl flex-shrink-0" aria-hidden="true" />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid md:grid-cols-3 gap-6 mb-12" role="region" aria-label="Marketplace statistics">
                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-gvteway-red-500 mx-auto mb-2" aria-hidden="true" />
                    <p className="text-2xl font-bebas text-white mb-1" aria-label="Over 500 products available">500+</p>
                    <p className="text-gray-400 text-sm">Products Available</p>
                  </CardContent>
                </Card>
                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <Star className="w-8 h-8 text-warning mx-auto mb-2" aria-hidden="true" />
                    <p className="text-2xl font-bebas text-white mb-1" aria-label="Average rating 4.8 out of 5">4.8/5</p>
                    <p className="text-gray-400 text-sm">Average Rating</p>
                  </CardContent>
                </Card>
                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <Tag className="w-8 h-8 text-success mx-auto mb-2" aria-hidden="true" />
                    <p className="text-2xl font-bebas text-white mb-1" aria-label="25 percent sale items">25%</p>
                    <p className="text-gray-400 text-sm">Sale Items</p>
                  </CardContent>
                </Card>
              </div>

              {/* Products Grid */}
              <div role="region" aria-labelledby="products-heading">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bebas text-white" id="products-heading">Featured Products</h2>
                  <Select variant="gvteway" aria-label="Sort products by">
                    <option>Sort by: Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Best Selling</option>
                    <option>Newest</option>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Link href={`/gvteway/marketplace/products/${product.id}`}>
                        <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                          <div className="relative aspect-square bg-gray-800">
                            {(product as any).badge && (
                              <Badge variant="gvteway" className="absolute top-4 right-4 z-10">
                                {(product as any).badge}
                              </Badge>
                            )}
                          </div>
                          <CardContent className="p-6">
                            <div className="mb-2">
                              <p className="text-gray-400 text-xs mb-1">{product.category}</p>
                              <h3 className="text-lg font-bebas text-white mb-2">{product.name}</h3>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 fill-yellow-500 text-warning" />
                                <span className="text-sm text-white ml-1">{(product as any).rating || '4.5'}</span>
                              </div>
                              <span className="text-sm text-gray-400">({(product as any).reviews || '0'} reviews)</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-2xl font-bebas text-gvteway-red-500">
                                  ${product.price}
                                </span>
                                {(product as any).originalPrice && (
                                  <span className="text-sm text-gray-500 line-through ml-2">
                                    ${(product as any).originalPrice}
                                  </span>
                                )}
                              </div>
                              <Button variant="gvteway" size="sm">
                                Add to Cart
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
