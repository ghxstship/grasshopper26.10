/**
 * GVTEWAY Event History Page
 * Agent 2.5: Reverse Order Implementation - Module 8
 */

'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Card, CardContent,  } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Calendar, MapPin, Download, Filter, Loader2, AlertCircle } from 'lucide-react';
import { useEventHistory } from '@/lib/hooks/gvteway/useAnalytics';

export default function EventHistoryPage() {
  const { data: events = [], isLoading, error, refetch } = useEventHistory({ limit: 50 });

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading event history...</p>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  if (error) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load History</h2>
            <p className="text-gray-400 mb-4">{error.message}</p>
            <Button variant="gvteway" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  return (
    <GvtewayLayout>
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Event History</h1>
            <p className="text-gray-400">Your past events and experiences</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-gray-700">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" className="border-gray-700">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30">
            <CardContent className="p-6">
              <p className="text-info text-sm font-medium">Total Events</p>
              <p className="text-3xl font-bold text-white mt-2">24</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30">
            <CardContent className="p-6">
              <p className="text-atlvs-purple-500 text-sm font-medium">Total Tickets</p>
              <p className="text-3xl font-bold text-white mt-2">47</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30">
            <CardContent className="p-6">
              <p className="text-green-400 text-sm font-medium">Total Spent</p>
              <p className="text-3xl font-bold text-white mt-2">$2,450</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-orange-500/30">
            <CardContent className="p-6">
              <p className="text-atlvs-orange-500 text-sm font-medium">This Year</p>
              <p className="text-3xl font-bold text-white mt-2">12</p>
            </CardContent>
          </Card>
        </div>

        {/* Event List */}
        <div className="space-y-4">
          {events.length === 0 ? (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">No event history found</p>
                <Button className="mt-4 bg-gvteway-red-500 hover:bg-gvteway-red-600">
                  Explore Events
                </Button>
              </CardContent>
            </Card>
          ) : (
            events.map((event) => (
              <Card key={event.id} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-3">{event.eventName}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{event.venue}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white mb-2">${event.amount}</p>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                        {event.category}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Load More */}
        <div className="flex justify-center">
          <Button variant="outline" className="border-gray-700">
            Load More Events
          </Button>
        </div>
      </div>
    </div>
    </GvtewayLayout>
  );
}
