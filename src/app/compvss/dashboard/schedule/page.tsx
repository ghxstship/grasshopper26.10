'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users2, Filter } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useCompvssSchedule } from '@/lib/hooks/compvss/useOperations';

export default function SchedulePage() {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Schedule', href: '/compvss/dashboard/schedule' },
  ];

  return (
    <CompvssLayout breadcrumbs={breadcrumbs}>
      <ScheduleContent />
    </CompvssLayout>
  );
}

function ScheduleContent() { 
  const { data: scheduleData,  } = useCompvssSchedule();
  
  const schedule = scheduleData || [
    {
      time: '14:00',
      title: 'Load-In Begins',
      location: 'Main Entrance',
      crew: 'All Crew',
      status: 'completed',
    },
    {
      time: '15:00',
      title: 'Stage Setup',
      location: 'Main Stage',
      crew: 'Stage Crew (12)',
      status: 'in_progress',
    },
    {
      time: '16:00',
      title: 'Sound Check',
      location: 'Main Stage',
      crew: 'Audio Team (5)',
      status: 'upcoming',
    },
    {
      time: '17:00',
      title: 'Lighting Test',
      location: 'Main Stage',
      crew: 'Lighting Team (4)',
      status: 'upcoming',
    },
    {
      time: '18:00',
      title: 'Doors Open',
      location: 'All Entrances',
      crew: 'Security & Ushers (20)',
      status: 'upcoming',
    },
    {
      time: '19:00',
      title: 'Opening Act',
      location: 'Main Stage',
      crew: 'Full Production',
      status: 'upcoming',
    },
    {
      time: '20:30',
      title: 'Main Performance',
      location: 'Main Stage',
      crew: 'Full Production',
      status: 'upcoming',
    },
    {
      time: '22:00',
      title: 'Event End',
      location: 'Venue',
      crew: 'All Crew',
      status: 'upcoming',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="compvss" className="bg-success-light text-success border-green-500/30">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="compvss" className="bg-info-light text-info border-blue-500/30 animate-pulse">In Progress</Badge>;
      case 'upcoming':
        return <Badge variant="compvss-outline" className="border-gray-500/30 text-gray-400">Upcoming</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-black via-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bebas compvss-text-gradient">Event Schedule</h1>
              <p className="text-gray-400 font-oswald mt-1">Summer Music Festival 2025</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="compvss-ghost" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <div className="text-right">
                <div className="text-2xl font-bebas text-white">15:32</div>
                <div className="text-xs text-gray-400 font-share-tech">Current Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="compvss" className="bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-compvss-cyan-500" />
                Today&apos;s Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schedule.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative pl-8 pb-8 ${index === schedule.length - 1 ? 'pb-0' : ''}`}
                  >
                    {/* Timeline Line */}
                    {index !== schedule.length - 1 && (
                      <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-compvss-cyan-500/20" />
                    )}
                    
                    {/* Timeline Dot */}
                    <div className={`absolute left-0 top-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      item.status === 'completed' 
                        ? 'bg-green-500 border-green-500' 
                        : item.status === 'in_progress'
                        ? 'bg-info border-blue-500 animate-pulse'
                        : 'bg-black border-compvss-cyan-500/30'
                    }`}>
                      {item.status === 'completed' && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-2xl font-bebas text-compvss-cyan-500">
                              {item.time}
                            </div>
                            {getStatusBadge(item.status)}
                          </div>
                          <h3 className="text-xl font-bebas text-white mb-2">{item.title}</h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 font-share-tech">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {item.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users2 className="w-4 h-4" />
                              {item.crew}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
