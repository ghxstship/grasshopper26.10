'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { FormField } from '@/components/molecules/FormField';
import { useCart } from '@/lib/hooks/gvteway';

export default function MarketplaceCheckoutPage() {
  const { isLoading, error } = useCart();

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-gvteway-red-500" />
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
            <p className="text-gray-400">{error.message}</p>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-5xl font-bebas mb-8 gvteway-text-gradient">CHECKOUT</h1>
              <Card variant="gvteway" className="bg-gray-900/50">
                <CardHeader>
                  <CardTitle className="text-white">Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <FormField label="Card Number">
                      <Input placeholder="1234 5678 9012 3456" variant="gvteway" />
                    </FormField>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Expiry">
                        <Input placeholder="MM/YY" variant="gvteway" />
                      </FormField>
                      <FormField label="CVV">
                        <Input placeholder="123" variant="gvteway" />
                      </FormField>
                    </div>
                    <Button variant="gvteway" size="lg" className="w-full">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Complete Purchase
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
