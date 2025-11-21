/**
 * Calendar Page - ATLVS Production Calendar
 * Schedule and manage production events
 */

'use client';

import * as React from 'react';
import { H1, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'PRODUCTION' | 'REHEARSAL' | 'MEETING' | 'DEADLINE';
  startDate: string;
  endDate?: string;
  location?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export default function CalendarPage() {
  const [loading, setLoading] = React.useState(true);
  const [events, setEvents] = React.useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [view, setView] = React.useState<'month' | 'week' | 'day'>('month');

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ events: CalendarEvent[] }>('/api/atlvs/calendar', {
          params: {
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear(),
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
  }, [currentDate]);

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'PRODUCTION': return 'bg-green-600';
      case 'REHEARSAL': return 'bg-blue-600';
      case 'MEETING': return 'bg-purple-600';
      case 'DEADLINE': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar variant="atlvs" />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="atlvs" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <H1 className="mb-4">Production Calendar</H1>
          <Body className="text-gray-600">
            Schedule and manage all production events
          </Body>
        </div>

        {/* Calendar Controls */}
        <Card variant="atlvs" className="mb-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <H3>
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </H3>
                <Button variant="ghost" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={view === 'month' ? 'atlvs' : 'ghost'} 
                  size="sm"
                  onClick={() => setView('month')}
                >
                  Month
                </Button>
                <Button 
                  variant={view === 'week' ? 'atlvs' : 'ghost'} 
                  size="sm"
                  onClick={() => setView('week')}
                >
                  Week
                </Button>
                <Button 
                  variant={view === 'day' ? 'atlvs' : 'ghost'} 
                  size="sm"
                  onClick={() => setView('day')}
                >
                  Day
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <div className="space-y-4">
          {events.length === 0 ? (
            <Card variant="atlvs">
              <CardContent className="py-24 text-center">
                <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <H3 className="mb-4">No events scheduled</H3>
                <Body className="text-gray-600 mb-6">
                  Add events to your production calendar
                </Body>
                <Button variant="atlvs">Create Event</Button>
              </CardContent>
            </Card>
          ) : (
            events.map((event) => (
              <Card key={event.id} variant="atlvs">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`} />
                        <Badge variant="outline">{event.type}</Badge>
                        <Badge>{event.status}</Badge>
                      </div>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>
                        {new Date(event.startDate).toLocaleString()}
                        {event.endDate && ` - ${new Date(event.endDate).toLocaleString()}`}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                {event.location && (
                  <CardContent>
                    <Caption className="text-gray-600">Location: {event.location}</Caption>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
