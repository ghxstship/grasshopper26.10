'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { Package, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { useOrders } from '@/lib/hooks/gvteway';

export default function MarketplaceOrdersPage() {
  const { data: ordersData, isLoading, error } = useOrders();
  const orders = ordersData?.orders || [];

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 pb-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gvteway-red-500" />
        </div>
      </GvtewayLayout>
    );
  }

  if (error || !orders) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 pb-16 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
            <p className="text-white mb-4">Failed to load orders</p>
            <Button variant="gvteway" onClick={() => window.location.reload()}>
              Retry
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
              <h1 className="text-5xl font-bebas mb-8 gvteway-text-gradient">MY ORDERS</h1>
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} variant="gvteway" className="bg-gray-900/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Package className="w-8 h-8 text-gvteway-blue-500" />
                          <div>
                            <h3 className="text-xl font-bebas text-white">Order #{order.orderNumber}</h3>
                            <p className="text-gray-400 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={order.status === 'COMPLETED' ? 'gvteway' : 'default'}>
                            {order.status}
                          </Badge>
                          <p className="text-2xl font-bebas text-gvteway-red-500 mt-2">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
