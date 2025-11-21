'use client';

import { GvtewayLayout } from "@/components/templates/GvtewayLayout";
import { HeroTitle, SectionHeader, CardTitle, BodyText, Metadata } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { Rating } from "@/components/atoms/Rating";
import { IntegrationBadge } from "@/components/atoms/IntegrationBadge";
import { MapPin, Phone, Globe, DollarSign, Heart, Share2 } from "lucide-react";
import Image from "next/image";

interface DestinationPageProps {
  params: {
    slug: string;
  };
}

export default function DestinationPage({ params: { slug: _slug } }: DestinationPageProps) {
  const destination = {
    name: "The Epicurean Hotel",
    category: "Accommodation",
    address: "1207 S Howard Ave, FL 33602",
    phone: "(813) 999-8700",
    website: "https://epicureanhotel.com",
    rating: 4.5,
    reviewCount: 342,
    priceLevel: 3,
    description: "A luxury hotel in the heart of the SoHo district, featuring a rooftop bar, spa, and award-winning restaurant. Perfect for event-goers looking for upscale accommodations.",
    images: ["/api/placeholder/800/600", "/api/placeholder/800/600", "/api/placeholder/800/600"],
    hours: {
      monday: "Open 24 hours",
      tuesday: "Open 24 hours",
      wednesday: "Open 24 hours",
      thursday: "Open 24 hours",
      friday: "Open 24 hours",
      saturday: "Open 24 hours",
      sunday: "Open 24 hours",
    },
    amenities: ["Free WiFi", "Pool", "Spa", "Restaurant", "Bar", "Parking", "Pet Friendly"],
    googlePlaceId: "place123",
  };

  const nearbyEvents = [
    { name: "Summer Music Festival", date: "Jun 15", distance: "0.5mi" },
    { name: "Art Walk", date: "Jun 20", distance: "0.3mi" },
  ];

  return (
    <GvtewayLayout>

      {/* Image Gallery */}
      <section className="relative">
        <div className="grid grid-cols-4 gap-2 h-[500px]">
          <div className="col-span-2 row-span-2 relative">
            <Image
              src={destination.images[0]}
              alt={destination.name}
              fill
              className="object-cover"
            />
          </div>
          {destination.images.slice(1).map((img, idx) => (
            <div key={idx} className="relative">
              <Image src={img} alt={`${destination.name} ${idx + 2}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* Destination Info */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-[2fr_1fr] gap-12">
            {/* Main Content */}
            <div className="space-y-8">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <HeroTitle className="mb-2 text-ghxst-primary">{destination.name}</HeroTitle>
                    <Metadata className="text-ghxst-text-secondary">{destination.category}</Metadata>
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

                <div className="flex items-center gap-4 mb-6">
                  <Rating rating={destination.rating} reviewCount={destination.reviewCount} />
                  <div className="flex items-center gap-1">
                    {Array.from({ length: destination.priceLevel }).map((_, i) => (
                      <DollarSign key={i} className="w-4 h-4 text-ghxst-text-primary" />
                    ))}
                  </div>
                </div>

                <BodyText className="text-ghxst-text-secondary">{destination.description}</BodyText>
              </div>

              {/* Amenities */}
              <div>
                <SectionHeader className="mb-4 uppercase text-ghxst-primary">Amenities</SectionHeader>
                <div className="flex flex-wrap gap-2">
                  {destination.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-ghxst-surface text-ghxst-text-primary -tech text-body-sm rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hours */}
              <div>
                <SectionHeader className="mb-4 uppercase text-ghxst-primary">Hours</SectionHeader>
                <div className="space-y-2">
                  {Object.entries(destination.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <Metadata className="text-ghxst-text-primary capitalize">{day}</Metadata>
                      <Metadata className="text-ghxst-text-secondary">{hours}</Metadata>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div>
                <SectionHeader className="mb-4 uppercase text-ghxst-primary">Member Reviews</SectionHeader>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="card p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-ghxst-surface" />
                          <div>
                            <CardTitle className="text-ghxst-primary">Member Name</CardTitle>
                            <Metadata className="text-ghxst-text-secondary">2 weeks ago</Metadata>
                          </div>
                        </div>
                        <Rating rating={5} showCount={false} />
                      </div>
                      <BodyText className="text-ghxst-text-secondary">
                        Perfect location for the festival! Walking distance to everything.
                      </BodyText>
                    </div>
                  ))}
                </div>
              </div>

              <IntegrationBadge provider="google" size="md" />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="card p-6 space-y-4 sticky top-24">
                <SectionHeader className="uppercase text-ghxst-primary">Contact & Info</SectionHeader>

                <div className="space-y-3">
                  <a
                    href={`tel:${destination.phone}`}
                    className="flex items-center gap-3 text-ghxst-text-secondary hover:text-ghxst-accent transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <Metadata>{destination.phone}</Metadata>
                  </a>

                  <a
                    href={destination.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-ghxst-text-secondary hover:text-ghxst-accent transition-colors"
                  >
                    <Globe className="w-5 h-5" />
                    <Metadata>Visit Website</Metadata>
                  </a>

                  <div className="flex items-start gap-3 text-ghxst-text-secondary">
                    <MapPin className="w-5 h-5 flex-shrink-0 mt-1" />
                    <Metadata>{destination.address}</Metadata>
                  </div>
                </div>

                <div className="pt-4 border-t border-ghxst-border space-y-3">
                  <Button variant="primary" size="lg" className="w-full">
                    Book Now
                  </Button>
                  <Button variant="secondary" size="lg" className="w-full">
                    Get Directions
                  </Button>
                </div>
              </div>

              {/* Nearby Events */}
              <div className="card p-6 space-y-4">
                <CardTitle className="text-ghxst-primary">Nearby Events</CardTitle>
                <div className="space-y-3">
                  {nearbyEvents.map((event, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <Metadata className="text-ghxst-text-primary">{event.name}</Metadata>
                        <Metadata className="text-ghxst-text-secondary text-caption">{event.date}</Metadata>
                      </div>
                      <Metadata className="text-ghxst-text-secondary">{event.distance}</Metadata>
                    </div>
                  ))}
                </div>
                <Button variant="secondary" size="sm" className="w-full">
                  View All Events
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </GvtewayLayout>
  );
}
