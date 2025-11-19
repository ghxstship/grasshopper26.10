'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { useOrders } from '@/lib/hooks/gvteway/useOrders';
import { BodyText, HeroTitle } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/tickets/orders

export default function OrdersPage() {
  const { data, isLoading, error, refetch } = useOrders();
  const orders = data?.orders || [];

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <BodyText className="text-grey-400">Loading orders...</BodyText>
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
            <p className="text-grey-400 mb-4">{error.message}</p>
            <Button variant="gvteway" onClick={() => refetch()}>Try Again</Button>
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
              <HeroTitle className="mb-8 gvteway-text-gradient">MY ORDERS</HeroTitle>

              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id} variant="gvteway" className="bg-grey-900/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-white">Order #{order.orderNumber}</h3>
                            <Badge variant={order.status === 'COMPLETED' ? 'gvteway' : 'default'}>
                              {order.status}
                            </Badge>
                          </div>
                          <div className="flex gap-4 text-body-sm text-grey-400">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {order.items.length} items
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-grey-400 text-body-sm">{order.currency}</p>
                          <p className="text-gvteway-red-500">${Number(order.total).toFixed(2)}</p>
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
