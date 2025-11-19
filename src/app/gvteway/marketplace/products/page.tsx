'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Loader2, AlertCircle } from 'lucide-react';
import { useProducts } from '@/lib/hooks/gvteway/useProducts';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { Card, CardContent } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { BodyText, HeroTitle, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/marketplace/products

export default function ProductsPage() {
  const { data: products = [], isLoading, error, refetch } = useProducts();

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <BodyText className="text-grey-400">Loading products...</BodyText>
          </div>
        </div>
      </GvtewayLayout>
    );
  }
  
  if (error) {
    return (
      <GvtewayLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <SectionHeader className="mb-2">Failed to Load Products</SectionHeader>
            <p className="text-grey-400 mb-4">{error.message}</p>
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <HeroTitle className="mb-8 gvteway-text-gradient">ALL PRODUCTS</HeroTitle>
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <BodyText className="text-grey-400">No products available at this time.</BodyText>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product: any) => (
                  <Link key={product.id} href={`/gvteway/marketplace/products/${product.id}`}>
                    <Card variant="gvteway" className="bg-grey-900/50 hover:scale-105 transition-transform cursor-pointer">
                      <div className="aspect-square bg-grey-800" />
                      <CardContent className="p-4">
                        <h3 className="text-white mb-2">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-500 text-warning" />
                            <span className="text-body-sm text-white ml-1">{product.rating || 4.5}</span>
                          </div>
                          <span className="text-gvteway-red-500">${product.price}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
