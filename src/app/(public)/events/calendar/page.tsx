/**
 * Events Calendar Page - UI Rebuild
 * Calendar view of upcoming events
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Hero, H2, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarEvent {
  id: string;
  name: string;
  time: string;
  venue: string;
  category: string;
}

interface CalendarData {
  calendar: Record<string, CalendarEvent[]>;
  month: string;
  year: number;
}

export default function EventsCalendarPage() {
  const [calendar, setCalendar] = React.useState<CalendarData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);

  const month = currentDate.toISOString().slice(0, 7);

  React.useEffect(() => {
    const fetchCalendar = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<{ data: CalendarData }>(`/api/events/calendar?month=${month}`);
        if (response.data?.data) {
          setCalendar(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch calendar:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, [month]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDate(null);
  };

  const getEventsForDate = (day: number): CalendarEvent[] => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calendar?.calendar?.[dateStr] || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="border-b-4 border-black bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <CalendarIcon className="w-12 h-12" />
              <Hero>EVENTS CALENDAR</Hero>
            </div>
            <Body className="max-w-2xl mx-auto text-gray-700 text-xl">
              Browse events by date and plan your schedule.
            </Body>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar Grid */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={handlePreviousMonth}>
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <H2>{monthName}</H2>
                    <Button variant="ghost" onClick={handleNextMonth}>
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center font-bold py-2">
                        <Caption>{day}</Caption>
                      </div>
                    ))}
                  </div>

                  {/* Calendar Days */}
                  <div className="grid grid-cols-7 gap-2">
                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                      <div key={`empty-${index}`} className="aspect-square" />
                    ))}

                    {/* Days of the month */}
                    {Array.from({ length: daysInMonth }).map((_, index) => {
                      const day = index + 1;
                      const events = getEventsForDate(day);
                      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const isSelected = selectedDate === dateStr;
                      const hasEvents = events.length > 0;

                      return (
                        <button
                          key={day}
                          onClick={() => setSelectedDate(dateStr)}
                          className={`aspect-square border-2 p-2 transition-all ${
                            isSelected
                              ? 'border-black bg-black text-white'
                              : hasEvents
                              ? 'border-black hover:bg-gray-100'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="text-sm font-bold">{day}</div>
                          {hasEvents && (
                            <div className={`text-xs mt-1 ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                              {events.length} event{events.length > 1 ? 's' : ''}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Selected Date Events */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>
                    {selectedDate
                      ? new Date(selectedDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Select a Date'}
                  </CardTitle>
                  <CardDescription>
                    {selectedDate && getEventsForDate(parseInt(selectedDate.split('-')[2])).length > 0
                      ? `${getEventsForDate(parseInt(selectedDate.split('-')[2])).length} events`
                      : 'No events selected'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDate ? (
                    getEventsForDate(parseInt(selectedDate.split('-')[2])).length > 0 ? (
                      <div className="space-y-4">
                        {getEventsForDate(parseInt(selectedDate.split('-')[2])).map((event) => (
                          <Link key={event.id} href={`/events/${event.id}`}>
                            <div className="p-4 border-2 border-black hover:bg-gray-50 transition-colors cursor-pointer">
                              <div className="flex items-start justify-between mb-2">
                                <H3 className="text-sm">{event.name}</H3>
                                <Badge variant="outline" className="text-xs">
                                  {event.category}
                                </Badge>
                              </div>
                              <Caption className="text-gray-600">{event.time}</Caption>
                              <Caption className="text-gray-600">{event.venue}</Caption>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Body className="text-gray-600 text-center py-12">No events on this date</Body>
                    )
                  ) : (
                    <Body className="text-gray-600 text-center py-12">
                      Click a date to see events
                    </Body>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
