'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { Lock, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { useMembership } from '@/lib/hooks/gvteway/useMemberships';
import { BodyText, HeroTitle, SectionHeader, SubsectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/memberships/exclusive

export default function ExclusiveContentPage() {
  const { data: membershipData, isLoading, error, refetch } = useMembership('current');

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <BodyText className="text-grey-400">Loading exclusive content...</BodyText>
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
            <SectionHeader className="mb-2">Failed to Load Content</SectionHeader>
            <p className="text-grey-400 mb-4">{error.message}</p>
            <Button variant="gvteway" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  // Mock content based on membership tier
  const userTier = (membershipData as any)?.tier?.name || 'Free';
  const content = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: `Exclusive Content ${i + 1}`,
    type: i % 2 === 0 ? 'Video' : 'Article',
    tier: i % 3 === 0 ? 'Platinum' : 'Gold',
    locked: !membershipData || (i % 3 === 0 && userTier !== 'Platinum'),
  }));

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <HeroTitle className="mb-8 gvteway-text-gradient">EXCLUSIVE CONTENT</HeroTitle>

              {!membershipData ? (
                <div className="text-center py-12">
                  <Lock className="w-16 h-16 mx-auto mb-4 text-grey-600" />
                  <SubsectionHeader className="text-white mb-2">Membership Required</SubsectionHeader>
                  <BodyText className="text-grey-400 mb-6">
                    Subscribe to a membership tier to access exclusive content
                  </BodyText>
                  <Button variant="gvteway">View Membership Plans</Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {content.map((item: any) => (
                    <Card key={item.id} variant="gvteway" className="bg-grey-900/50">
                      <div className="h-48 bg-grey-800 flex items-center justify-center relative">
                        {item.locked && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Lock className="w-12 h-12 text-grey-400" />
                          </div>
                        )}
                        {!item.locked && (
                          <div className="text-grey-600 text-body-sm">Content Preview</div>
                        )}
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="gvteway-outline">{item.type}</Badge>
                          <Badge variant="gvteway">{item.tier}</Badge>
                        </div>
                        <h3 className="text-white">{item.title}</h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
