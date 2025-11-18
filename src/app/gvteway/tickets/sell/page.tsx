'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { Button } from '@/components/atoms/Button';

import { Input } from '@/components/atoms/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { FormField } from '@/components/molecules/FormField';

export default function SellTicketPage() {
  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Link href="/gvteway/tickets">
                <Button variant="ghost" size="sm" className="mb-6">← Back</Button>
              </Link>

              <h1 className="text-h1 font-bebas mb-4 gvteway-text-gradient">SELL TICKET</h1>

              <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Set Your Price</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <FormField label="Asking Price">
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input type="number" placeholder="89.99" variant="gvteway" className="pl-10" />
                      </div>
                    </FormField>

                    <FormField label="Quantity">
                      <Input type="number" placeholder="1" variant="gvteway" />
                    </FormField>

                    <Button variant="gvteway" size="lg" className="w-full">
                      List for Sale
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
