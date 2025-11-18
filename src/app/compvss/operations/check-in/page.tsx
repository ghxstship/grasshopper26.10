'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock, Loader2, Search, UserCheck, XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Input } from '@/components/atoms/Input';
import { useCheckIns, useCheckInStats } from '@/lib/hooks/compvss/useCheckIns';

export default function CheckInSystemPage() {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Operations', href: '/compvss/operations/hub' },
    { label: 'Check-In System', href: '/compvss/operations/check-in' },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch check-ins with React Query
  const { data: checkIns = [], isLoading, error, refetch } = useCheckIns();
  const { data: statsData } = useCheckInStats();

  const filteredCheckIns = useMemo(() => {
    return checkIns.filter((c: any) =>
      c.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [checkIns, searchQuery]);

  const stats = useMemo(() => {
    if (statsData) return statsData;
    
    return {
      total: checkIns.length,
      checkedIn: checkIns.filter((c: any) => c.status === 'checked-in').length,
      notCheckedIn: checkIns.filter((c: any) => c.status === 'pending').length,
      late: checkIns.filter((c: any) => c.status === 'late').length,
    };
  }, [checkIns, statsData]);

  if (isLoading) {
    return (
      <CompvssLayout breadcrumbs={breadcrumbs}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-blue-500" />
            <p className="text-gray-400">Loading check-ins...</p>
          </div>
        </div>
      </CompvssLayout>
    );
  }

  if (error) {
    return (
      <CompvssLayout breadcrumbs={breadcrumbs}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load Check-Ins</h2>
            <p className="text-gray-400 mb-4">{error.message}</p>
            <Button variant="compvss" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </CompvssLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: 'success' | 'default' | 'error'; label: string; icon: any }> = {
      'checked-in': { variant: 'success' as const, label: 'Checked In', icon: CheckCircle2 },
      'pending': { variant: 'default' as const, label: 'Pending', icon: Clock },
      'late': { variant: 'error' as const, label: 'Late', icon: XCircle },
    };
    const statusConfig = config[status] || config['pending'];
    const { variant, label, icon: Icon } = statusConfig;
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  return (
    <CompvssLayout breadcrumbs={breadcrumbs}>
      <div className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-8 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-8">
              <Link href="/compvss/operations/dashboard">
                <h1 className="compvss-text-gradient text-4xl font-anton mb-2 cursor-pointer">
                  Check-In System
                </h1>
              </Link>
              <p className="text-gray-400 font-oswald">Real-time crew attendance tracking</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card variant="compvss" className="bg-gray-900/80 border-compvss-cyan-500/20">
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bebas text-white">{stats.total}</p>
                  <p className="text-sm text-gray-400 font-oswald">Total</p>
                </CardContent>
              </Card>
              <Card variant="compvss" className="bg-green-500/10 border-green-500/30">
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bebas text-success">{stats.checkedIn}</p>
                  <p className="text-sm text-gray-400 font-oswald">Checked In</p>
                </CardContent>
              </Card>
              <Card variant="compvss" className="bg-gray-900/80 border-gray-700">
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bebas text-gray-400">{stats.notCheckedIn}</p>
                  <p className="text-sm text-gray-400 font-oswald">Pending</p>
                </CardContent>
              </Card>
              <Card variant="compvss" className="bg-error/10 border-red-500/30">
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bebas text-error">{stats.late}</p>
                  <p className="text-sm text-gray-400 font-oswald">Late</p>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <Card variant="compvss" className="mb-6 bg-gray-900/80 backdrop-blur-sm border-2 border-compvss-cyan-500/20">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or role..."
                    className="pl-10 bg-black/50 border-compvss-cyan-500/30 focus:border-compvss-cyan-500 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Check-Ins List */}
            <div className="space-y-3">
              {filteredCheckIns.map((checkIn: any) => (
                <Card key={checkIn.id} variant="compvss" className="bg-gray-900/80 backdrop-blur-sm border-2 border-compvss-cyan-500/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-compvss-cyan-500/20 flex items-center justify-center">
                          <UserCheck className="w-6 h-6 text-compvss-cyan-500" />
                        </div>
                        <div>
                          <h3 className="font-oswald text-white">{checkIn.user?.name || 'Unknown'}</h3>
                          <p className="text-sm text-gray-400 font-share-tech">
                            {checkIn.location}
                          </p>
                          {checkIn.checkedInAt && (
                            <p className="text-xs text-gray-500 font-share-tech mt-1">
                              Checked in at {new Date(checkIn.checkedInAt).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(checkIn.status)}
                        {checkIn.status === 'pending' && (
                          <Button variant="compvss" size="sm">
                            Check In
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </CompvssLayout>
  );
}
