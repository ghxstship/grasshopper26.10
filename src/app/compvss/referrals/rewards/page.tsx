'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { motion } from 'framer-motion';
import { Gift, Star, Lock, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { useReferralRewards } from '@/lib/hooks/compvss/useReferrals';
import { BodyText, HeroTitle, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/referrals/rewards

export default function ReferralRewardsPage() {
  const _breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Referrals', href: '/compvss/referrals/dashboard' },
    { label: 'Rewards', href: '/compvss/referrals/rewards' },
  ];

  const { data: tiers = [], isLoading, error, refetch } = useReferralRewards();

  if (isLoading) {
    return (
      <CompvssLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
            <BodyText className="text-grey-400">Loading rewards...</BodyText>
          </div>
        </div>
      </CompvssLayout>
    );
  }

  if (error) {
    return (
      <CompvssLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <SectionHeader className="mb-2">Failed to Load Rewards</SectionHeader>
            <p className="text-grey-400 mb-4">{error.message}</p>
            <Button variant="compvss" onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      </CompvssLayout>
    );
  }

  return (
    <CompvssLayout>
      <div className="border-b border-grey-800 bg-gradient-to-r from-black via-grey-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <HeroTitle className="compvss-text-gradient">Rewards & Tiers</HeroTitle>
          <BodyText className="text-grey-400 mt-1">Unlock rewards as you refer more people</BodyText>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="compvss" className={`bg-grey-900/50 ${tier.unlocked ? '' : 'opacity-60'}`}>
                <CardContent className="pt-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${tier.color} flex items-center justify-center text-white mb-4 relative`}>
                    {tier.unlocked ? <Star className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-white">{tier.name}</h3>
                    {tier.unlocked && (
                      <Badge variant="compvss" className="bg-success-light text-success border-success/30">
                        Unlocked
                      </Badge>
                    )}
                  </div>
                  <p className="text-body-sm text-grey-400 -tech mb-4">
                    {tier.referrals} referrals required
                  </p>
                  <div className="flex items-center gap-2 p-3 bg-black/50 rounded-lg border border-compvss-cyan-500/20">
                    <Gift className="w-5 h-5 text-compvss-cyan-500" />
                    <span className="text-white">{tier.reward}</span>
                    <span className="text-body-sm text-grey-400 -tech">bonus</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </CompvssLayout>
  );
}
