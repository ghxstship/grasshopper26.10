'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { useCart } from '@/lib/hooks/gvteway';

export default function CartPage() {
  const { cart, isLoading, error, removeItem } = useCart();

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 pb-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gvteway-red-500" />
        </div>
      </GvtewayLayout>
    );
  }

  if (error || !cart) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 pb-16 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
            <p className="text-white mb-4">Failed to load cart</p>
            <Button variant="gvteway" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  const items = cart.items || [];
  const total = cart.total || 0;

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-5xl font-bebas mb-8 gvteway-text-gradient">SHOPPING CART</h1>
              <div className="space-y-4 mb-8">
                {items.map((item) => (
                  <Card key={item.id} variant="gvteway" className="bg-gray-900/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 bg-gray-800 rounded" />
                          <div>
                            <h3 className="text-lg font-bebas text-white">{item.name}</h3>
                            <p className="text-gray-400">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xl font-bebas text-gvteway-red-500">${(item.price * item.quantity).toFixed(2)}</span>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-5 h-5 text-error" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card variant="gvteway" className="bg-gray-900/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-bebas text-white">Total</span>
                    <span className="text-3xl font-bebas text-gvteway-red-500">${total.toFixed(2)}</span>
                  </div>
                  <Link href="/gvteway/marketplace/checkout">
                    <Button variant="gvteway" size="lg" className="w-full">
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      Proceed to Checkout
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
