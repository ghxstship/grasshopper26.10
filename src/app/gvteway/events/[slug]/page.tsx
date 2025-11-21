'use client';

import { GvtewayLayout } from "@/components/templates/GvtewayLayout";
import { HeroTitle, SectionHeader, CardTitle, BodyText, Metadata } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Calendar, Clock, MapPin, Users, Heart, Share2, Ticket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface EventPageProps {
  params: {
    slug: string;
  };
}

export default function EventPage({ params: { slug: _slug } }: EventPageProps) {
  const event = {
    title: "Summer Music Festival 2025",
    venue: "Curtis Hixon Waterfront Park",
    address: "600 N Ashley Dr, Tampa, FL 33602",
    date: "June 15, 2025",
    time: "6:00 PM - 11:00 PM",
    image: "/api/placeholder/1200/600",
    priceMin: 45,
    priceMax: 125,
    attendeeCount: 234,
    description: "Join us for an unforgettable evening of live music featuring the best electronic artists. Experience world-class performances, food trucks, and stunning waterfront views.",
    category: "Festival",
    featured: true,
  };

  return (
    <GvtewayLayout>

      <section className="relative h-[400px]">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ghxst-black/80 to-transparent" />
      </section>

      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-[2fr_1fr] gap-12">
            <div className="space-y-8">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <Badge variant="default">{event.category}</Badge>
                      {event.featured && <Badge variant="warning">FEATURED</Badge>}
                    </div>
                    <HeroTitle className="mb-3 text-ghxst-primary">{event.title}</HeroTitle>
                    <CardTitle className="text-ghxst-text-secondary mb-2">{event.venue}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" iconOnly>
                      <Heart className="w-5 h-5" />
                    </Button>
                    <Button variant="secondary" size="sm" iconOnly>
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 p-6 bg-ghxst-surface rounded-lg">
                  <Metadata className="flex items-center gap-3 text-ghxst-text-secondary">
                    <Calendar className="w-5 h-5" />
                    {event.date}
                  </Metadata>
                  <Metadata className="flex items-center gap-3 text-ghxst-text-secondary">
                    <Clock className="w-5 h-5" />
                    {event.time}
                  </Metadata>
                  <Metadata className="flex items-center gap-3 text-ghxst-text-secondary">
                    <MapPin className="w-5 h-5" />
                    {event.address}
                  </Metadata>
                  <Metadata className="flex items-center gap-3 text-ghxst-text-secondary">
                    <Users className="w-5 h-5" />
                    {event.attendeeCount} going
                  </Metadata>
                </div>
              </div>

              <div>
                <SectionHeader className="mb-4 uppercase text-ghxst-primary">About This Event</SectionHeader>
                <BodyText className="text-ghxst-text-secondary">
                  {event.description}
                </BodyText>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card p-6 space-y-4 sticky top-24">
                <div className="space-y-2">
                  <Metadata className="text-ghxst-text-secondary">Tickets from</Metadata>
                  <div className="flex items-baseline gap-2">
                    <span className="text-ghxst-primary">
                      ${event.priceMin}
                    </span>
                    <Metadata className="text-ghxst-text-secondary">
                      - ${event.priceMax}
                    </Metadata>
                  </div>
                </div>

                <div className="pt-4 border-t border-ghxst-border space-y-3">
                  <Button variant="primary" size="lg" className="w-full">
                    <Ticket className="w-4 h-4 mr-2" />
                    Get Tickets
                  </Button>
                  <Button variant="secondary" size="md" className="w-full">
                    View Seating Chart
                  </Button>
                </div>

                <div className="pt-4 border-t border-ghxst-border">
                  <Metadata className="text-ghxst-text-secondary text-caption">
                    {event.attendeeCount} people are going
                  </Metadata>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <SectionHeader className="mb-6 uppercase text-ghxst-primary">Related Events</SectionHeader>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Link key={i} href={`/gvteway/events/${i}`} className="card p-6">
                  <div className="h-32 bg-ghxst-surface rounded-lg mb-4" />
                  <CardTitle className="text-ghxst-primary mb-2">Event Title {i}</CardTitle>
                  <Metadata className="text-ghxst-text-secondary">Venue Name</Metadata>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

    </GvtewayLayout>
  );
}
