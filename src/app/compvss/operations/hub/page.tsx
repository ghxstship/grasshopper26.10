'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { Users2, MapPin, Clock, AlertTriangle, CheckCircle2, Activity, Loader2, AlertCircle as AlertCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useCheckIns } from '@/lib/hooks/compvss/useCheckIns';
import { useCompvssTasks } from '@/lib/hooks/compvss/useTasks';
import { useIssues } from '@/lib/hooks/compvss/useIssues';
import { useMemo } from 'react';

export default function OperationsHubPage() {
  const { data: checkIns = [], isLoading: checkInsLoading, error: checkInsError, refetch: refetchCheckIns } = useCheckIns();
  const { data: tasksData, isLoading: tasksLoading } = useCompvssTasks();
  const { data: issuesData, isLoading: issuesLoading } = useIssues();

  const isLoading = checkInsLoading || tasksLoading || issuesLoading;

  const liveStats = useMemo(() => {
    const tasks = tasksData?.tasks || [];
    const issues = Array.isArray(issuesData) ? issuesData : issuesData?.issues || [];
    
    const activePersonnel = checkIns.filter(c => c.status === 'active').length;
    const completedTasks = tasks.filter((t: any) => t.status === 'completed').length;
    const totalTasks = tasks.length;
    const tasksPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const activeIssues = issues.filter((i: any) => i.status === 'open').length;

    return [
      { label: 'Active Personnel', value: activePersonnel.toString(), icon: <Users2 className="w-5 h-5" />, status: 'good' },
      { label: 'Tasks Completed', value: `${tasksPercentage}%`, icon: <CheckCircle2 className="w-5 h-5" />, status: tasksPercentage > 80 ? 'good' : 'warning' },
      { label: 'Active Issues', value: activeIssues.toString(), icon: <AlertTriangle className="w-5 h-5" />, status: activeIssues > 5 ? 'warning' : 'good' },
      { label: 'Event Progress', value: `${tasksPercentage}%`, icon: <Activity className="w-5 h-5" />, status: 'good' },
    ];
  }, [checkIns, tasksData, issuesData]);

  if (isLoading) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Operations Hub"
          description="Real-time event operations monitoring"
          variant="compvss"
          showToolbar={false}
          
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
              <p className="text-gray-400">Loading operations data...</p>
            </div>
          </div>
        </ContentLayout>
      </CompvssLayout>
    );
  }

  if (checkInsError) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Operations Hub"
          description="Real-time event operations monitoring"
          variant="compvss"
          showToolbar={false}
          
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircleIcon className="w-12 h-12 mx-auto mb-4 text-error" />
              <h2 className="text-h5 font-bebas mb-2">Failed to Load Operations</h2>
              <p className="text-gray-400 mb-4">{checkInsError.message || 'An error occurred'}</p>
              <Button variant="compvss" onClick={() => refetchCheckIns()}>
                Try Again
              </Button>
            </div>
          </div>
        </ContentLayout>
      </CompvssLayout>
    );
  }

  const activeZones = [
    { name: 'Main Stage', personnel: 45, status: 'operational', issues: 0 },
    { name: 'Backstage', personnel: 28, status: 'operational', issues: 1 },
    { name: 'VIP Area', personnel: 15, status: 'operational', issues: 0 },
    { name: 'Food Court', personnel: 32, status: 'attention', issues: 2 },
    { name: 'Parking', personnel: 22, status: 'operational', issues: 0 },
  ];

  const recentUpdates = [
    { time: '2 min ago', message: 'Stage setup completed in Zone A', type: 'success' },
    { time: '5 min ago', message: 'Power issue reported in Food Court', type: 'warning' },
    { time: '8 min ago', message: '15 crew members checked in', type: 'info' },
    { time: '12 min ago', message: 'Equipment delivery confirmed', type: 'success' },
  ];

  return (
    <CompvssLayout>
      <ContentLayout
        title="Operations Hub"
        description="Real-time event operations monitoring"
        variant="compvss"
        showToolbar={false}
        
        actions={[
          {
            label: 'LIVE',
            onClick: () => {},
            variant: 'compvss' as const,
            disabled: true
          }
        ]}
      >
        {/* Live Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {liveStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="compvss" className="bg-gray-900/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${
                      stat.status === 'good' ? 'bg-success-light0/10 text-success' : 'bg-warning/10 text-warning'
                    }`}>
                      {stat.icon}
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      stat.status === 'good' ? 'bg-success-light0' : 'bg-warning'
                    } animate-pulse`} />
                  </div>
                  <div className="text-h3 font-bebas text-white mb-1">{stat.value}</div>
                  <div className="text-body-sm text-gray-400 font-oswald">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Active Zones */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="compvss" className="bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-compvss-cyan-500" />
                    Active Zones
                  </CardTitle>
                  <Link href="/compvss/operations/map">
                    <Button variant="compvss-ghost" size="sm">
                      View Map
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeZones.map((zone, index) => (
                    <motion.div
                      key={zone.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20 hover:border-compvss-cyan-500/40 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-oswald text-white">{zone.name}</h3>
                        <Badge 
                          variant={zone.status === 'operational' ? 'compvss' : 'compvss-outline'}
                          className={zone.status === 'operational' 
                            ? 'bg-success-light text-success border-success/30' 
                            : 'bg-warning-light text-warning border-warning/30'
                          }
                        >
                          {zone.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-body-sm text-gray-400 font-share-tech">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Users2 className="w-4 h-4" />
                            {zone.personnel} personnel
                          </span>
                          {zone.issues > 0 && (
                            <span className="flex items-center gap-1 text-warning">
                              <AlertTriangle className="w-4 h-4" />
                              {zone.issues} issue{zone.issues > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Live Updates */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card variant="compvss" className="bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-compvss-cyan-500" />
                  Live Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentUpdates.map((update, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-black/50 border border-compvss-cyan-500/20"
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        update.type === 'success' ? 'bg-success-light0' :
                        update.type === 'warning' ? 'bg-warning' :
                        'bg-info'
                      }`} />
                      <div className="flex-1">
                        <p className="text-white font-oswald text-body-sm">{update.message}</p>
                        <p className="text-caption text-gray-500 font-share-tech mt-1">{update.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <h2 className="text-h4 font-bebas text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/compvss/operations/checkin">
              <Card variant="compvss" className="bg-gray-900/50 hover:bg-gray-900/70 transition-all cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <CheckCircle2 className="w-8 h-8 text-compvss-cyan-500 mx-auto mb-3" />
                  <p className="font-oswald text-white">Check In</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/compvss/issues/new">
              <Card variant="compvss" className="bg-gray-900/50 hover:bg-gray-900/70 transition-all cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <AlertTriangle className="w-8 h-8 text-compvss-cyan-500 mx-auto mb-3" />
                  <p className="font-oswald text-white">Report Issue</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/compvss/operations/tasks">
              <Card variant="compvss" className="bg-gray-900/50 hover:bg-gray-900/70 transition-all cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <Activity className="w-8 h-8 text-compvss-cyan-500 mx-auto mb-3" />
                  <p className="font-oswald text-white">View Tasks</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/compvss/operations/schedule">
              <Card variant="compvss" className="bg-gray-900/50 hover:bg-gray-900/70 transition-all cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <Clock className="w-8 h-8 text-compvss-cyan-500 mx-auto mb-3" />
                  <p className="font-oswald text-white">Schedule</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </motion.div>
      </ContentLayout>
    </CompvssLayout>
  );
}
