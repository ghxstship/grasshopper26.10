'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, DollarSign, Ticket, BarChart3, PieChart, Loader2 } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useTickets } from '@/lib/hooks/gvteway/useTickets';
import { useOrders } from '@/lib/hooks/gvteway/useOrders';
import { useLoyaltyPoints } from '@/lib/hooks/gvteway/useLoyalty';
import { useMemo } from 'react';

export default function AnalyticsPage() {
  const { data: tickets, isLoading: ticketsLoading } = useTickets();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: loyalty, isLoading: loyaltyLoading } = useLoyaltyPoints();
  
  const isLoading = ticketsLoading || ordersLoading || loyaltyLoading;
  
  const stats = useMemo(() => {
    const ticketsArray = (tickets as any)?.tickets || [];
    const ordersArray = (orders as any)?.orders || [];
    const eventsAttended = ticketsArray.filter((t: any) => t.status === 'USED').length || 0;
    const totalSpent = ordersArray.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0) || 0;
    const loyaltyPoints = loyalty?.totalPoints || 0;
    
    return {
      eventsAttended,
      totalSpent,
      loyaltyPoints,
      avgSpent: ordersArray.length ? (totalSpent / ordersArray.length) : 0
    };
  }, [tickets, orders, loyalty]);
  
  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading analytics...</p>
          </div>
        </div>
      </GvtewayLayout>
    );
  }
  
  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <header className="mb-12">
                <h1 className="text-5xl sm:text-6xl font-bebas mb-4 gvteway-text-gradient" id="page-title">
                  ANALYTICS
                </h1>
                <p className="text-xl text-gray-400 font-oswald">
                  Your event insights and spending trends
                </p>
              </header>

              {/* Stats Grid */}
              <div className="grid md:grid-cols-4 gap-6 mb-12" role="region" aria-label="Analytics statistics">
                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Ticket className="w-8 h-8 text-gvteway-red-500" aria-hidden="true" />
                      <Badge variant="gvteway">+12%</Badge>
                    </div>
                    <p className="text-3xl font-bebas text-white mb-1" aria-label={`${stats.eventsAttended} events attended, up 12 percent`}>{stats.eventsAttended}</p>
                    <p className="text-gray-400 text-sm">Events Attended</p>
                  </CardContent>
                </Card>

                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <DollarSign className="w-8 h-8 text-success" aria-hidden="true" />
                      <Badge variant="default">This Year</Badge>
                    </div>
                    <p className="text-3xl font-bebas text-white mb-1" aria-label={`${stats.totalSpent} dollars total spent this year`}>${stats.totalSpent.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">Total Spent</p>
                  </CardContent>
                </Card>

                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="w-8 h-8 text-gvteway-blue-500" aria-hidden="true" />
                      <Badge variant="gvteway-outline">+8%</Badge>
                    </div>
                    <p className="text-3xl font-bebas text-white mb-1" aria-label={`${stats.loyaltyPoints} loyalty points, up 8 percent`}>{stats.loyaltyPoints.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">Loyalty Points</p>
                  </CardContent>
                </Card>

                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Calendar className="w-8 h-8 text-atlvs-purple-500" aria-hidden="true" />
                      <Badge variant="default">Upcoming</Badge>
                    </div>
                    <p className="text-3xl font-bebas text-white mb-1" aria-label="5 upcoming events booked">5</p>
                    <p className="text-gray-400 text-sm">Events Booked</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid lg:grid-cols-2 gap-8 mb-12" role="region" aria-label="Data visualizations">
                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center" id="spending-chart-title">
                      <BarChart3 className="w-5 h-5 mr-2 text-gvteway-red-500" aria-hidden="true" />
                      Spending Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end justify-between gap-2" role="img" aria-labelledby="spending-chart-title" aria-label="Bar chart showing monthly spending from January to December">
                      {[65, 45, 80, 55, 70, 90, 75, 85, 60, 95, 70, 80].map((height, i) => (
                        <div key={i} className="flex-1 flex flex-col justify-end">
                          <div 
                            className="bg-gradient-to-t from-gvteway-red-500 to-gvteway-blue-500 rounded-t"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-500">
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                      <span>Jul</span>
                      <span>Aug</span>
                      <span>Sep</span>
                      <span>Oct</span>
                      <span>Nov</span>
                      <span>Dec</span>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <PieChart className="w-5 h-5 mr-2 text-gvteway-blue-500" />
                      Event Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: 'Music', percentage: 45, color: 'bg-gvteway-red-500' },
                        { name: 'Sports', percentage: 25, color: 'bg-gvteway-blue-500' },
                        { name: 'Comedy', percentage: 15, color: 'bg-purple-500' },
                        { name: 'Theater', percentage: 10, color: 'bg-green-500' },
                        { name: 'Other', percentage: 5, color: 'bg-gray-500' },
                      ].map((category) => (
                        <div key={category.name}>
                          <div className="flex justify-between mb-2">
                            <span className="text-white text-sm">{category.name}</span>
                            <span className="text-gray-400 text-sm">{category.percentage}%</span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${category.color}`}
                              style={{ width: `${category.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { event: 'Summer Music Festival', date: 'Jul 15, 2025', amount: '$179.98', type: 'purchase' },
                      { event: 'Comedy Night Live', date: 'Jun 10, 2025', amount: '$90.00', type: 'attended' },
                      { event: 'Tech Conference 2025', date: 'May 20, 2025', amount: '$299.99', type: 'purchase' },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.type === 'purchase' ? 'bg-green-500' : 'bg-gvteway-blue-500'
                          }`} />
                          <div>
                            <p className="text-white font-medium">{activity.event}</p>
                            <p className="text-gray-400 text-sm">{activity.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">{activity.amount}</p>
                          <Badge variant={activity.type === 'purchase' ? 'gvteway' : 'default'} className="text-xs">
                            {activity.type}
                          </Badge>
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
    </GvtewayLayout>
  );
}
