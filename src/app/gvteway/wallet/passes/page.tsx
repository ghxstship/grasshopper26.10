'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { Smartphone, Download, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { useTickets } from '@/lib/hooks/gvteway/useTickets';

export default function PassesPage() {
  const { data: ticketsData, isLoading, error, refetch } = useTickets({ status: 'VALID' });

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading digital passes...</p>
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
            <h2 className="text-xl font-bebas mb-2">Failed to Load Passes</h2>
            <p className="text-gray-400 mb-4">{error.message}</p>
            <Button variant="gvteway" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  const passes = ticketsData?.tickets || [];

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-5xl font-bebas mb-8 gvteway-text-gradient">DIGITAL PASSES</h1>
              <div className="grid md:grid-cols-2 gap-6">
                {passes.map((pass: any) => (
                  <Card key={pass.id} variant="gvteway" className="bg-gray-900/50">
                    <CardContent className="p-6">
                      <Smartphone className="w-12 h-12 text-gvteway-red-500 mb-4" />
                      <h3 className="text-xl font-bebas text-white mb-2">{pass.event?.title || 'Event Pass'}</h3>
                      <p className="text-gray-400 text-sm mb-4">{pass.ticketType?.name || 'Ticket'}</p>
                      <Button variant="gvteway" size="sm" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download Pass
                      </Button>
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
