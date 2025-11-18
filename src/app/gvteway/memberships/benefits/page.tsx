'use client';



export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { Star, Gift, Zap, Crown, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Card, CardContent } from '@/components/atoms/Card';
import { useMemberships } from '@/lib/hooks/gvteway/useMemberships';

export default function BenefitsPage() {
  const { data: membershipsData, isLoading, error } = useMemberships();
  const _memberships = (membershipsData as any)?.memberships || [];
  
  const benefits = [
    { icon: Star, title: 'Priority Access', desc: 'Early ticket sales and exclusive pre-sales' },
    { icon: Gift, title: 'Special Rewards', desc: 'Birthday gifts and anniversary bonuses' },
    { icon: Zap, title: 'Fast Track', desc: 'Skip the line at venues and events' },
    { icon: Crown, title: 'VIP Treatment', desc: 'Exclusive lounges and premium seating' },
  ];

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading benefits...</p>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  if (error) {
    return (
      <GvtewayLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load Benefits</h2>
            <p className="text-gray-400">Unable to load membership benefits</p>
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
              <h1 className="text-5xl font-bebas mb-8 gvteway-text-gradient">MEMBERSHIP BENEFITS</h1>

              <div className="grid md:grid-cols-2 gap-6">
                {benefits.map((benefit, i) => {
                  const Icon = benefit.icon;
                  return (
                    <Card key={i} variant="gvteway" className="bg-gray-900/50">
                      <CardContent className="p-8">
                        <Icon className="w-12 h-12 text-gvteway-red-500 mb-4" />
                        <h3 className="text-2xl font-bebas text-white mb-2">{benefit.title}</h3>
                        <p className="text-gray-400">{benefit.desc}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
