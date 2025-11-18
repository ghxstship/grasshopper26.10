'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useEvents } from '@/lib/hooks/gvteway/useEvents';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function EventsCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data: events, isLoading, error, refetch } = useEvents();

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (date: Date) => {
    console.log('Date clicked:', date);
    // TODO: Navigate to events for this date or show modal
  };

  // Calculate events per date from real data
  const eventsOnDate: Record<number, number> = useMemo(() => {
    if (!events?.events) return {};
    
    const counts: Record<number, number> = {};
    events.events.forEach((event) => {
      if (event.startDate) {
        const eventDate = new Date(event.startDate);
        if (eventDate.getMonth() === currentDate.getMonth() && 
            eventDate.getFullYear() === currentDate.getFullYear()) {
          const day = eventDate.getDate();
          counts[day] = (counts[day] || 0) + 1;
        }
      }
    });
    return counts;
  }, [events, currentDate]);

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading calendar...</p>
          </div>
        </div>
      </GvtewayLayout>
    );
  }
  
  if (error) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load Calendar</h2>
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
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl sm:text-6xl font-bebas mb-4 gvteway-text-gradient">
                EVENT CALENDAR
              </h1>
              <p className="text-xl text-gray-400 font-oswald mb-12">
                Plan your schedule with upcoming events
              </p>

              <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bebas text-white">
                      {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={previousMonth}>
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <Button variant="gvteway-outline" size="sm">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Today
                      </Button>
                      <Button variant="outline" size="sm" onClick={nextMonth}>
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {/* Day Headers */}
                    {DAYS.map((day) => (
                      <div key={day} className="text-center py-3 text-gray-400 font-medium text-sm">
                        {day}
                      </div>
                    ))}

                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: firstDay }).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-square" />
                    ))}

                    {/* Calendar days */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const hasEvents = eventsOnDate[day];
                      const isToday = day === new Date().getDate() && 
                                     currentDate.getMonth() === new Date().getMonth() &&
                                     currentDate.getFullYear() === new Date().getFullYear();

                      return (
                        <Button
                          key={day}
                          variant="ghost"
                          className={`aspect-square p-2 rounded-lg border-2 transition-all ${
                            isToday
                              ? 'border-gvteway-red-500 bg-gvteway-red-500/20'
                              : hasEvents
                              ? 'border-gvteway-blue-500/50 bg-gvteway-blue-500/10 hover:bg-gvteway-blue-500/20'
                              : 'border-gray-800 hover:border-gray-700'
                          }`}
                          onClick={() => handleDateClick(currentDate)}
                        >
                          <div className="flex flex-col h-full">
                            <span className={`text-sm font-medium ${isToday ? 'text-gvteway-red-500' : 'text-white'}`}>
                              {day}
                            </span>
                            {hasEvents && (
                              <div className="mt-auto">
                                <Badge variant="gvteway" className="text-xs px-1 py-0">
                                  {hasEvents}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </Button>
                      );
                    })}
                  </div>

                  {/* Legend */}
                  <div className="mt-8 pt-6 border-t border-gray-800 flex items-center justify-center gap-6 text-sm">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded border-2 border-gvteway-red-500 bg-gvteway-red-500/10 mr-2" />
                      <span className="text-gray-400">Today</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded border-2 border-gray-700 bg-gray-800/50 mr-2" />
                      <span className="text-gray-400">Has Events</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events This Month */}
              <div className="mt-8">
                <h2 className="text-2xl font-bebas text-white mb-6">
                  Upcoming This Month
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <Badge variant="gvteway-outline" className="mb-3">Music</Badge>
                        <h3 className="text-xl font-bebas text-white mb-2">Event Title {i}</h3>
                        <p className="text-gray-400 text-sm mb-4">
                          {MONTHS[currentDate.getMonth()]} {5 * i}, {currentDate.getFullYear()}
                        </p>
                        <Button variant="gvteway" size="sm" className="w-full" rounded="full">
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
