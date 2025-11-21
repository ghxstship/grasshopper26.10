'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, QrCode, Download, Share2, Ticket as TicketIcon } from 'lucide-react';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { SectionHeader, CardTitle, BodyText, Metadata } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { CategoryTab } from '@/components/atoms/CategoryTab';

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/tickets

export default function TicketsPage() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  
  const breadcrumbs = [
    { label: 'Home', href: '/gvteway' },
    { label: 'My Tickets', href: '/gvteway/tickets' },
  ];
  
  // Demo tickets - replace with actual API call
  const tickets = [
    {
      id: '1',
      eventName: 'Summer Music Festival 2025',
      date: 'June 15, 2025',
      time: '6:00 PM',
      venue: 'Curtis Hixon Park',
      location: 'Tampa, FL',
      ticketType: 'General Admission',
      quantity: 2,
      status: 'active' as const,
      qrCode: 'QR123456',
    },
  ];

  return (
    <GvtewayLayout>
      <ContentLayout
        title="My Tickets"
        description="View and manage your event tickets"
        variant="gvteway"
        breadcrumbs={breadcrumbs}
      >
        <section>

          <div className="flex flex-wrap gap-4 mb-8">
            <CategoryTab active={filter === 'all'} onClick={() => setFilter('all')}>
              All Tickets
            </CategoryTab>
            <CategoryTab active={filter === 'upcoming'} onClick={() => setFilter('upcoming')}>
              Upcoming
            </CategoryTab>
            <CategoryTab active={filter === 'past'} onClick={() => setFilter('past')}>
              Past Events
            </CategoryTab>
          </div>

          <div className="space-y-6">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="card p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <CardTitle className="mb-2 text-ghxst-primary">
                          {ticket.eventName}
                        </CardTitle>
                        <div className="space-y-1">
                          <Metadata className="flex items-center gap-2 text-ghxst-text-secondary">
                            <Calendar className="w-4 h-4" />
                            {ticket.date} at {ticket.time}
                          </Metadata>
                          <Metadata className="flex items-center gap-2 text-ghxst-text-secondary">
                            <MapPin className="w-4 h-4" />
                            {ticket.venue}, {ticket.location}
                          </Metadata>
                        </div>
                      </div>
                      <Badge variant={ticket.status === 'active' ? 'success' : 'default'}>
                        {ticket.status === 'active' ? 'Active' : 'Used'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-ghxst-border">
                      <Metadata className="text-ghxst-text-secondary">
                        {ticket.ticketType} • Qty: {ticket.quantity}
                      </Metadata>
                    </div>
                  </div>

                  <div className="lg:w-48 flex flex-col gap-3">
                    <div className="aspect-square bg-ghxst-surface rounded-lg flex items-center justify-center">
                      <QrCode className="w-24 h-24 text-ghxst-primary" />
                    </div>
                    <Button variant="primary" size="sm" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="secondary" size="sm" className="w-full">
                      <Share2 className="w-4 h-4 mr-2" />
                      Transfer
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {tickets.length === 0 && (
            <div className="text-center py-16">
              <TicketIcon className="w-16 h-16 mx-auto mb-4 text-ghxst-text-secondary" />
              <SectionHeader className="mb-2 text-ghxst-text-secondary">
                No Tickets Yet
              </SectionHeader>
              <BodyText className="text-ghxst-text-secondary mb-6">
                Start exploring events and book your first ticket
              </BodyText>
              <Link href="/gvteway/events">
                <Button variant="primary" size="lg">
                  Browse Events
                </Button>
              </Link>
            </div>
          )}
        </section>
      </ContentLayout>
    </GvtewayLayout>
  );
}
