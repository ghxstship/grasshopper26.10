'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Loader2, AlertCircle } from 'lucide-react';
import { useProduct } from '@/lib/hooks/gvteway/useProducts';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/marketplace/products/[id]

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { data: product, isLoading, error } = useProduct(params.id);

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-gvteway-red-500" />
        </div>
      </GvtewayLayout>
    );
  }

  if (error || !product) {
    return (
      <GvtewayLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <AlertCircle className="w-12 h-12 text-error mb-4" />
          <SectionHeader className="text-white mb-2">Product Not Found</SectionHeader>
          <p className="text-grey-400">{error?.message || 'This product could not be loaded'}</p>
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
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="aspect-square bg-grey-800 rounded-2xl" />
                <div>
                  <h1 className="text-white mb-4">{product.name}</h1>
                  <div className="flex items-center gap-2 mb-6">
                    <Star className="w-5 h-5 fill-yellow-500 text-warning" />
                    <span className="text-white">4.8</span>
                    <span className="text-grey-400">(156 reviews)</span>
                  </div>
                  <p className="text-gvteway-red-500 mb-6">${product.price}</p>
                  <p className="text-grey-300 mb-8">{product.description || 'Premium quality festival merchandise.'}</p>
                  <Button variant="gvteway" size="lg" className="w-full">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
