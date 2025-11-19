'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { Calendar, Clock, Filter, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useTeamAvailability } from '@/lib/hooks/compvss/useTeamMembers';
import { BodyText, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/team/availability

export default function TeamAvailabilityPage() {
  const { data: availability = [], isLoading, error, refetch } = useTeamAvailability();

  if (isLoading) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Team Availability"
          description="Track crew schedules and availability"
          variant="compvss"
          showToolbar={false}
          
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
              <BodyText className="text-grey-400">Loading availability...</BodyText>
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
          title="Team Availability"
          description="Track crew schedules and availability"
          variant="compvss"
          showToolbar={false}
          
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <SectionHeader className="mb-2">Failed to Load Availability</SectionHeader>
              <p className="text-grey-400 mb-4">{error.message}</p>
              <Button variant="compvss" onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </ContentLayout>
      </CompvssLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    return status === 'available' 
      ? <Badge variant="compvss" className="bg-success-light text-success border-success/30">Available</Badge>
      : <Badge variant="compvss-outline" className="border-destructive/30 text-error">Unavailable</Badge>;
  };

  return (
    <CompvssLayout>
      <ContentLayout
        title="Team Availability"
        description="Track crew schedules and availability"
        variant="compvss"
        showToolbar={true}
        
        actions={[
          {
            label: 'Filter',
            icon: <Filter className="w-4 h-4" />,
            onClick: () => {},
            variant: 'outline'
          }
        ]}
      >
        <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-compvss-cyan-500" />
              Today&apos;s Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availability.map((person, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-white mb-1">{person.name}</h3>
                      <p className="text-body-sm text-grey-400 -tech mb-2">{person.role}</p>
                      <div className="flex items-center gap-2 text-caption text-grey-500 -tech">
                        <Clock className="w-3 h-3" />
                        <span>{person.shift}</span>
                      </div>
                    </div>
                    {getStatusBadge(person.status)}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </ContentLayout>
    </CompvssLayout>
  );
}
