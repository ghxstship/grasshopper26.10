'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { useDayOfShow } from '@/lib/hooks/compvss/useOperations';
import { Loader2 } from 'lucide-react';

import { motion } from 'framer-motion';
import { Radio, Users2, CheckCircle2, Clock, AlertTriangle, MapPin, Calendar, Activity, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { BodyText, HeroTitle } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/dashboard/day-of-show

export default function DayOfShowDashboardPage() {
  const { data: _dayOfShowData, isLoading } = useDayOfShow();
  
  if (isLoading) {
    return (
      <CompvssLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-compvss-purple-500" />
        </div>
      </CompvssLayout>
    );
  }
  
  const breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Day-of-Show', href: '/compvss/dashboard/day-of-show' },
  ];

  return (
    <CompvssLayout>
      <DayOfShowContent />
    </CompvssLayout>
  );
}

function DayOfShowContent() {
  const eventInfo = {
    name: 'Summer Music Festival 2025',
    date: 'June 15, 2025',
    venue: 'Central Park Arena',
    status: 'in_progress',
    startTime: '14:00',
    currentTime: '16:32',
  };

  const liveMetrics = [
    { label: 'Crew On-Site', value: '142/150', icon: <Users2 className="w-5 h-5" />, status: 'good' },
    { label: 'Tasks Complete', value: '87%', icon: <CheckCircle2 className="w-5 h-5" />, status: 'good' },
    { label: 'Active Issues', value: '3', icon: <AlertTriangle className="w-5 h-5" />, status: 'warning' },
    { label: 'Event Progress', value: '64%', icon: <TrendingUp className="w-5 h-5" />, status: 'good' },
  ];

  const myTasks = [
    { id: 1, task: 'Setup main stage lighting', zone: 'Main Stage', status: 'completed', time: '14:30' },
    { id: 2, task: 'Test audio system', zone: 'Main Stage', status: 'completed', time: '15:15' },
    { id: 3, task: 'Final sound check', zone: 'Main Stage', status: 'in_progress', time: '16:00' },
    { id: 4, task: 'Prepare backstage area', zone: 'Backstage', status: 'pending', time: '17:00' },
  ];

  const upcomingSchedule = [
    { time: '17:00', event: 'Doors Open', status: 'upcoming' },
    { time: '18:00', event: 'Opening Act', status: 'upcoming' },
    { time: '19:30', event: 'Main Performance', status: 'upcoming' },
    { time: '21:00', event: 'Event End', status: 'upcoming' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-grey-800 bg-gradient-to-r from-black via-grey-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <HeroTitle className="compvss-text-gradient">Day-of-Show Dashboard</HeroTitle>
                <Badge variant="compvss" className="bg-success-light text-success border-success/30 animate-pulse">
                  <Radio className="w-3 h-3 mr-1" />
                  LIVE
                </Badge>
              </div>
              <p className="text-grey-400">{eventInfo.name}</p>
            </div>
            <div className="text-right">
              <div className="text-white">{eventInfo.currentTime}</div>
              <div className="text-caption text-grey-400 -tech">Event Time</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card variant="compvss" className="bg-grey-900/50 border-compvss-cyan-500/30">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-compvss-cyan-500" />
                  <div>
                    <BodyText className="text-caption text-grey-400 -tech">Date</BodyText>
                    <p className="text-white">{eventInfo.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-compvss-cyan-500" />
                  <div>
                    <BodyText className="text-caption text-grey-400 -tech">Venue</BodyText>
                    <p className="text-white">{eventInfo.venue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-compvss-cyan-500" />
                  <div>
                    <BodyText className="text-caption text-grey-400 -tech">Start Time</BodyText>
                    <p className="text-white">{eventInfo.startTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-compvss-cyan-500" />
                  <div>
                    <BodyText className="text-caption text-grey-400 -tech">Status</BodyText>
                    <Badge variant="compvss" className="bg-success-light text-success border-success/30">
                      In Progress
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Live Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {liveMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="compvss" className="bg-grey-900/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${ metric.status === 'good' ? 'bg-success-light0/10 text-success' : 'bg-warning/10 text-warning' }`}>
                      {metric.icon}
                    </div>
                    <div className={`w-2 h-2 rounded-full ${ metric.status === 'good' ? 'bg-success-light0' : 'bg-warning' } animate-pulse`} />
                  </div>
                  <div className="text-white mb-1">{metric.value}</div>
                  <div className="text-body-sm text-grey-400">{metric.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* My Tasks */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-compvss-cyan-500" />
                    My Tasks
                  </CardTitle>
                  <Link href="/compvss/operations/tasks">
                    <Button variant="compvss-ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {myTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-white mb-1">{task.task}</h3>
                          <p className="text-body-sm text-grey-400 -tech">{task.zone}</p>
                        </div>
                        <Badge 
                          variant={task.status === 'completed' ? 'compvss' : 'compvss-outline'}
                          className={
                            task.status === 'completed' ? 'bg-success-light text-success border-success/30' :
                            task.status === 'in_progress' ? 'bg-info-light text-info border-info/30' :
                            'bg-grey-500/20 text-grey-500 border-grey-500/30'
                          }
                        >
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-caption text-grey-500 -tech">Scheduled: {task.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Schedule */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-compvss-cyan-500" />
                  Upcoming Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingSchedule.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-compvss-cyan-500 mb-1">
                            {item.time}
                          </div>
                          <p className="text-white">{item.event}</p>
                        </div>
                        <Clock className="w-5 h-5 text-grey-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
