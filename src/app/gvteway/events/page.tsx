'use client';

import { GvtewayLayout } from "@/components/templates/GvtewayLayout";
import { ContentLayout } from "@/components/templates/ContentLayout";
import { SectionHeader, CardTitle, Metadata } from "@/components/atoms/Typography";
import { CategoryTab } from "@/components/atoms/CategoryTab";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Calendar, Clock, Users, Music, Ticket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const _metadata = {
  title: 'Events | Discover Live Experiences | GVTEWAY',
  description: 'Find concerts, festivals, and live entertainment. Your membership unlocks exclusive access.',
  keywords: 'events, concerts, festivals, live music, entertainment',
};

export default function EventsPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/gvteway' },
    { label: 'Events', href: '/gvteway/events' },
  ];

  const events = [
    {
      id: "1",
      name: "Summer Music Festival",
      venue: "Curtis Hixon Park",
      date: "Jun 15, 2025",
      time: "2:00 PM",
      image: "/api/placeholder/400/300",
      priceRange: "$45 - $125",
      category: "Festival",
      going: 234,
      featured: true,
    },
    {
      id: "2",
      name: "Electronic Night",
      venue: "The Ritz Ybor",
      date: "Nov 30, 2025",
      time: "9:00 PM",
      image: "/api/placeholder/400/300",
      priceRange: "$35 - $65",
      category: "Concert",
      going: 89,
      featured: false,
    },
  ];

  return (
    <GvtewayLayout>
      <ContentLayout
        title="Discover Events"
        description="Find your next unforgettable experience. Concerts, festivals, and live entertainment with exclusive member access."
        variant="gvteway"
        breadcrumbs={breadcrumbs}
        searchPlaceholder="Search events, artists, venues..."
        onSearch={(value) => console.log('Search:', value)}
      >

      <section className="border-b-2 border-ghxst-border">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-wrap gap-4 py-4">
            <CategoryTab active>All Events</CategoryTab>
            <CategoryTab icon={<Music className="w-4 h-4" />}>Concerts</CategoryTab>
            <CategoryTab icon={<Ticket className="w-4 h-4" />}>Festivals</CategoryTab>
            <CategoryTab icon={<Users className="w-4 h-4" />}>Nightlife</CategoryTab>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          <SectionHeader className="mb-8 uppercase text-ghxst-primary">Upcoming Events</SectionHeader>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/gvteway/events/${event.id}`}
                className="card bg-ghxst-white border-2 border-ghxst-border hover:border-ghxst-black transition-colors group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="default">{event.category}</Badge>
                    {event.featured && <Badge variant="warning">FEATURED</Badge>}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <CardTitle className="text-ghxst-primary mb-2 line-clamp-2">
                      {event.name}
                    </CardTitle>
                    <Metadata className="text-ghxst-text-secondary">{event.venue}</Metadata>
                  </div>

                  <div className="space-y-2">
                    <Metadata className="flex items-center gap-2 text-ghxst-text-secondary">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </Metadata>
                    <Metadata className="flex items-center gap-2 text-ghxst-text-secondary">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </Metadata>
                    <Metadata className="flex items-center gap-2 text-ghxst-text-secondary">
                      <Users className="w-4 h-4" />
                      {event.going} going
                    </Metadata>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-ghxst-border">
                    <Metadata className="text-ghxst-text-primary">
                      {event.priceRange}
                    </Metadata>
                    <Button variant="primary" size="sm">Get Tickets</Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      </ContentLayout>
    </GvtewayLayout>
  );
}
