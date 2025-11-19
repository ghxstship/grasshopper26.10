'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { useIssues } from '@/lib/hooks/compvss/useIssues';
import { BodyText, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/issues/track

export default function IssueTrackingPage() {
  const { data, isLoading, error, refetch } = useIssues({ type: 'tracking' });
  const metrics = data?.metrics || [];

  if (isLoading) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Issue Tracking"
          description="Loading metrics..."
          variant="compvss"
          showToolbar={false}
          
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
              <BodyText className="text-grey-400">Loading issue tracking...</BodyText>
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
          title="Issue Tracking"
          description="Error loading metrics"
          variant="compvss"
          showToolbar={false}
          
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <SectionHeader className="mb-2">Failed to Load Tracking Data</SectionHeader>
              <p className="text-grey-400 mb-4">{error.message}</p>
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
        title="Issue Tracking"
        description="Monitor issue resolution metrics"
        variant="compvss"
        showToolbar={false}
        
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="compvss" className="bg-grey-900/50">
                <CardContent className="pt-6">
                  <div className="p-2 bg-compvss-cyan-500/10 rounded-lg text-compvss-cyan-500 w-fit mb-2">
                    {metric.icon}
                  </div>
                  <div className="text-white mb-1">{metric.value}</div>
                  <div className="text-body-sm text-grey-400 mb-1">{metric.label}</div>
                  <div className="text-caption text-success -tech">{metric.trend}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </ContentLayout>
    </CompvssLayout>
  );
}
