'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { UserCheck, Search, Filter, CheckCircle2, Clock, Users2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Input } from '@/components/atoms/Input';
import { useCheckIns, CheckIn } from '@/lib/hooks/compvss/useCheckIns';

export default function CheckInPage() {
  const { data: checkInsData = [], isLoading, error, refetch } = useCheckIns();
  const crew = checkInsData;
  
  const checkedInCount = crew.filter((c: any) => c.status === 'checked-in').length;
  const pendingCount = crew.filter((c: any) => c.status === 'pending').length;
  const totalCount = crew.length;
  const checkInRate = totalCount > 0 ? Math.round((checkedInCount / totalCount) * 100) : 0;
  
  const stats = [
    { label: 'Checked In', value: checkedInCount.toString(), icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-success' },
    { label: 'Expected', value: totalCount.toString(), icon: <Users2 className="w-5 h-5" />, color: 'text-info' },
    { label: 'Pending', value: pendingCount.toString(), icon: <Clock className="w-5 h-5" />, color: 'text-warning' },
    { label: 'Check-in Rate', value: `${checkInRate}%`, icon: <UserCheck className="w-5 h-5" />, color: 'text-compvss-cyan-500' },
  ];
  const breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Operations', href: '/compvss/operations/hub' },
    { label: 'Check-In', href: '/compvss/operations/checkin' },
  ];

  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading) {
    return (
      <CompvssLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
            <p className="text-gray-400">Loading check-ins...</p>
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
            <h2 className="text-h5 font-bebas mb-2">Failed to Load Check-Ins</h2>
            <p className="text-gray-400 mb-4">{error.message}</p>
            <Button variant="compvss" onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      </CompvssLayout>
    );
  }

  const filteredCrew = crew.filter((member: CheckIn) =>
    member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.organization?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    if (status === 'checked_in') {
      return <Badge variant="compvss" className="bg-success-light text-success border-success/30">Checked In</Badge>;
    }
    return <Badge variant="compvss-outline" className="border-warning/30 text-warning">Pending</Badge>;
  };

  return (
    <CompvssLayout>
      {/* Header */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-black via-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-h3 font-bebas compvss-text-gradient">Crew Check-In</h1>
              <p className="text-gray-400 font-oswald mt-1">Track crew arrival and attendance</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="compvss-ghost" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="compvss" size="lg">
                <UserCheck className="w-5 h-5 mr-2" />
                Manual Check-In
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="compvss" className="bg-gray-900/50">
                <CardContent className="pt-6">
                  <div className={`p-2 bg-black/50 rounded-lg ${stat.color} w-fit mb-2`}>
                    {stat.icon}
                  </div>
                  <div className="text-h3 font-bebas text-white mb-1">{stat.value}</div>
                  <div className="text-body-sm text-gray-400 font-oswald">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search crew by name, role, or organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-gray-900/50 border-compvss-cyan-500/30 h-12"
            />
          </div>
        </motion.div>

        {/* Crew List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card variant="compvss" className="bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users2 className="w-5 h-5 text-compvss-cyan-500" />
                Crew Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredCrew.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-compvss-cyan-500 to-compvss-teal-500 flex items-center justify-center font-bebas text-black text-h6">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-oswald text-white mb-1">{member.name}</h3>
                          <p className="text-body-sm text-gray-400 font-share-tech">
                            {member.role} • {member.organization}
                          </p>
                          <p className="text-caption text-gray-500 font-share-tech mt-1">
                            Zone: {member.zone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {member.checkInTime && (
                          <div className="text-right mr-4">
                            <div className="text-body-sm text-compvss-cyan-500 font-share-tech">
                              {member.checkInTime}
                            </div>
                            <div className="text-caption text-gray-500 font-share-tech">
                              Check-in time
                            </div>
                          </div>
                        )}
                        {getStatusBadge(member.status)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </CompvssLayout>
  );
}
