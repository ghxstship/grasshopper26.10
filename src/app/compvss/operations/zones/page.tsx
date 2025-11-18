'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { MapPin, Users2, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { useOperationsZones } from '@/lib/hooks/compvss/useOperations';

export default function OperationsZonesPage() {
  const { data: zones = [], isLoading, error, refetch } = useOperationsZones();

  if (isLoading) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Zone Management"
          description="Monitor all operational zones"
          variant="compvss"
          showToolbar={false}
          
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
              <p className="text-gray-400">Loading zones...</p>
            </div>
          </div>
        </ContentLayout>
      </CompvssLayout>
    );
  }

  if (error) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Zone Management"
          description="Monitor all operational zones"
          variant="compvss"
          showToolbar={false}
          
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <h2 className="text-h5 font-bebas mb-2">Failed to Load Zones</h2>
              <p className="text-gray-400 mb-4">{error.message}</p>
              <Button variant="compvss" onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </ContentLayout>
      </CompvssLayout>
    );
  }

  return (
    <CompvssLayout>
      <ContentLayout
        title="Zone Management"
        description="Monitor all operational zones"
        variant="compvss"
        showToolbar={false}
        
      >
        <div className="grid md:grid-cols-2 gap-6">
          {zones.map((zone, index) => (
            <motion.div
              key={zone.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="compvss" className="bg-gray-900/50">
                <CardContent className="pt-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${zone.color} flex items-center justify-center text-white mb-4`}>
                    <MapPin className="w-8 h-8" />
                  </div>
                  <h3 className="text-h4 font-bebas text-white mb-3">{zone.name}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Users2 className="w-4 h-4" />
                        <span className="text-body-sm font-share-tech">Crew</span>
                      </div>
                      <span className="font-bebas text-white">{zone.crew} / {zone.capacity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-body-sm text-gray-400 font-share-tech">Status</span>
                      <Badge 
                        variant="compvss" 
                        className={zone.status === 'operational' ? 'bg-success-light text-success' : 'bg-warning-light text-warning'}
                      >
                        {zone.status}
                      </Badge>
                    </div>
                    {zone.alerts > 0 && (
                      <div className="flex items-center gap-2 text-warning text-body-sm font-share-tech">
                        <AlertCircle className="w-4 h-4" />
                        <span>{zone.alerts} active alert{zone.alerts > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </ContentLayout>
    </CompvssLayout>
  );
}
