'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users2, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { useOperationsSchedule } from '@/lib/hooks/compvss/useOperations';
import { BodyText, HeroTitle, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/operations/schedule

export default function OperationsSchedulePage() {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Operations', href: '/compvss/operations/hub' },
    { label: 'Schedule', href: '/compvss/operations/schedule' },
  ];

  const { data: shifts = [], isLoading, error, refetch } = useOperationsSchedule();

  if (isLoading) {
    return (
      <CompvssLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
            <BodyText className="text-grey-400">Loading schedule...</BodyText>
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
            <SectionHeader className="mb-2">Failed to Load Schedule</SectionHeader>
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
          <HeroTitle className="compvss-text-gradient">Operations Schedule</HeroTitle>
          <BodyText className="text-grey-400 mt-1">Manage crew shifts and schedules</BodyText>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card variant="compvss" className="bg-grey-900/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-compvss-cyan-500" />
              Today&apos;s Shifts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shifts.map((shift, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-compvss-cyan-500">
                        <Clock className="w-5 h-5" />
                        <span >{shift.time}</span>
                      </div>
                      <div>
                        <h3 className="text-white">{shift.role}</h3>
                        <div className="flex items-center gap-2 text-body-sm text-grey-400 -tech">
                          <Users2 className="w-4 h-4" />
                          <span>{shift.count} crew members</span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant="compvss" 
                      className={shift.status === 'active' ? 'bg-success-light text-success animate-pulse' : 'bg-grey-500/20 text-grey-400'}
                    >
                      {shift.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </CompvssLayout>
  );
}
