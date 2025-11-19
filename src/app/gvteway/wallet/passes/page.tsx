'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { Smartphone, Download, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { useTickets } from '@/lib/hooks/gvteway/useTickets';
import { BodyText, HeroTitle, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/wallet/passes

export default function PassesPage() {
  const { data: ticketsData, isLoading, error, refetch } = useTickets({ status: 'VALID' });

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <BodyText className="text-grey-400">Loading digital passes...</BodyText>
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
            <SectionHeader className="mb-2">Failed to Load Passes</SectionHeader>
            <p className="text-grey-400 mb-4">{error.message}</p>
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
              <HeroTitle className="mb-8 gvteway-text-gradient">DIGITAL PASSES</HeroTitle>
              <div className="grid md:grid-cols-2 gap-6">
                {passes.map((pass: any) => (
                  <Card key={pass.id} variant="gvteway" className="bg-grey-900/50">
                    <CardContent className="p-6">
                      <Smartphone className="w-12 h-12 text-gvteway-red-500 mb-4" />
                      <h3 className="text-white mb-2">{pass.event?.title || 'Event Pass'}</h3>
                      <p className="text-grey-400 text-body-sm mb-4">{pass.ticketType?.name || 'Ticket'}</p>
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
