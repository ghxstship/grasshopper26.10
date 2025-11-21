/**
 * Events Calendar View - UI Rebuild
 * Calendar view of events by month
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, H3, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface Event {
  id: string;
  name: string;
  startDate: string;
  category: string;
  venue: string;
}

export default function EventsCalendarPage() {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        
        const response = await apiClient.get<{ events: Event[] }>('/api/events', {
          params: {
            startDate: startOfMonth.toISOString(),
            endDate: endOfMonth.toISOString(),
          },
        });
        
        if (response.data?.events) {
          setEvents(response.data.events);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentMonth]);

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const getEventsForDay = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.getDate() === day &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear();
    });
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth();
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <H1>Events Calendar</H1>
          <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={previousMonth}>
              Previous
            </Button>
            <H3>{monthName}</H3>
            <Button variant="secondary" onClick={nextMonth}>
              Next
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-bold p-2">
                  <Caption>{day}</Caption>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square border-2 border-gray-200" />
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const dayEvents = getEventsForDay(day);
                const isToday = new Date().getDate() === day &&
                               new Date().getMonth() === currentMonth.getMonth() &&
                               new Date().getFullYear() === currentMonth.getFullYear();

                return (
                  <div
                    key={day}
                    className={`aspect-square border-2 border-black p-2 ${
                      isToday ? 'bg-black text-white' : 'bg-white'
                    }`}
                  >
                    <div className="font-bold mb-1">
                      <Caption className={isToday ? 'text-white' : ''}>{day}</Caption>
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <Link key={event.id} href={`/events/${event.id}`}>
                          <div className="text-xs p-1 bg-gray-100 border border-black truncate hover:bg-gray-200">
                            {event.name}
                          </div>
                        </Link>
                      ))}
                      {dayEvents.length > 2 && (
                        <Caption className="text-xs">+{dayEvents.length - 2} more</Caption>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {events.length > 0 && (
          <div className="mt-8">
            <H3 className="mb-4">All Events This Month</H3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map(event => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge>{event.category}</Badge>
                    </div>
                    <CardTitle>{event.name}</CardTitle>
                    <CardDescription>
                      {new Date(event.startDate).toLocaleDateString()} • {event.venue}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/events/${event.id}`}>
                      <Button fullWidth variant="secondary">View Details</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
