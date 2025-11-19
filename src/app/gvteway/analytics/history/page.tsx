/**
 * GVTEWAY Event History Page
 * Agent 2.5: Reverse Order Implementation - Module 8
 */

'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { Card, CardContent,  } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Calendar, MapPin, Download, Filter, Loader2, AlertCircle } from 'lucide-react';
import { useEventHistory } from '@/lib/hooks/gvteway/useAnalytics';
import { BodyText, HeroTitle, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/analytics/history

export default function EventHistoryPage() {
  const { data: events = [], isLoading, error, refetch } = useEventHistory({ limit: 50 });

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-gradient-to-br from-black via-grey-900 to-black flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <BodyText className="text-grey-400">Loading event history...</BodyText>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  if (error) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-gradient-to-br from-black via-grey-900 to-black flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <SectionHeader className="mb-2">Failed to Load History</SectionHeader>
            <p className="text-grey-400 mb-4">{error.message}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-black via-grey-900 to-black p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <HeroTitle className="text-white mb-2">Event History</HeroTitle>
            <BodyText className="text-grey-400">Your past events and experiences</BodyText>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-grey-700">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" className="border-grey-700">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-info/30">
            <CardContent className="p-6">
              <BodyText className="text-info text-body-sm">Total Events</BodyText>
              <BodyText className="text-white mt-2">24</BodyText>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-accent/30">
            <CardContent className="p-6">
              <BodyText className="text-atlvs-purple-500 text-body-sm">Total Tickets</BodyText>
              <BodyText className="text-white mt-2">47</BodyText>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-success/30">
            <CardContent className="p-6">
              <BodyText className="text-success text-body-sm">Total Spent</BodyText>
              <BodyText className="text-white mt-2">$2,450</BodyText>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-warning/30">
            <CardContent className="p-6">
              <BodyText className="text-atlvs-orange-500 text-body-sm">This Year</BodyText>
              <BodyText className="text-white mt-2">12</BodyText>
            </CardContent>
          </Card>
        </div>

        {/* Event List */}
        <div className="space-y-4">
          {events.length === 0 ? (
            <Card className="bg-grey-900/50 border-grey-800">
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-grey-600" />
                <BodyText className="text-grey-400">No event history found</BodyText>
                <Button className="mt-4 bg-gvteway-red-500 hover:bg-gvteway-red-600">
                  Explore Events
                </Button>
              </CardContent>
            </Card>
          ) : (
            events.map((event) => (
              <Card key={event.id} className="bg-grey-900/50 border-grey-800 hover:border-grey-700 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-white mb-3">{event.eventName}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-grey-400">
                          <Calendar className="w-4 h-4" />
                          <span className="text-body-sm">{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-grey-400">
                          <MapPin className="w-4 h-4" />
                          <span className="text-body-sm">{event.venue}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white mb-2">${event.amount}</p>
                      <Badge className="bg-success-light0/20 text-success border-success/50">
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
          <Button variant="outline" className="border-grey-700">
            Load More Events
          </Button>
        </div>
      </div>
    </div>
    </GvtewayLayout>
  );
}
