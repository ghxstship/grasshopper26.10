'use client';

import { GvtewayLayout } from "@/components/templates/GvtewayLayout";
import { HeroTitle, SectionHeader, CardTitle, BodyText, Metadata } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { PriceTag } from "@/components/atoms/PriceTag";
import { Clock, MapPin, Users, Calendar, Heart, Share2 } from "lucide-react";
import Image from "next/image";

interface AdventurePageProps {
  params: {
    slug: string;
  };
}

async function generateMetadata({ params: _params }: AdventurePageProps) {
  return {
    title: `Adventure Name | GVTEWAY Adventures`,
    description: `Book Adventure Name - an unforgettable experience.`,
  };
}

export default function AdventurePage({ params: { slug: _slug } }: AdventurePageProps) {
  const adventure = {
    name: "Riverwalk Tour",
    category: "Guided Tour",
    description: "Explore the stunning waterfront on this guided walking tour. Discover historic landmarks, public art installations, and breathtaking bay views. Perfect for visitors and locals alike who want to experience the best of downtown.",
    duration: "2 hours",
    price: 25,
    images: ["/api/placeholder/800/600", "/api/placeholder/800/600", "/api/placeholder/800/600"],
    highlights: [
      "Professional local guide",
      "Historic landmarks and architecture",
      "Public art installations",
      "Stunning waterfront views",
      "Photo opportunities",
      "Small group experience",
    ],
    included: [
      "Expert tour guide",
      "Water bottle",
      "Digital photo package",
    ],
    meetingPoint: "Curtis Hixon Waterfront Park, 600 N Ashley Dr",
    availability: ["Daily at 10:00 AM", "Daily at 2:00 PM", "Daily at 5:00 PM"],
  };

  const nearbyEvents = [
    { name: "Summer Music Festival", date: "Jun 15", distance: "0.2mi" },
    { name: "Art Walk", date: "Jun 20", distance: "0.5mi" },
  ];

  return (
    <GvtewayLayout>

      {/* Image Gallery */}
      <section className="relative">
        <div className="grid grid-cols-4 gap-2 h-[500px]">
          <div className="col-span-2 row-span-2 relative">
            <Image
              src={adventure.images[0]}
              alt={adventure.name}
              fill
              className="object-cover"
            />
          </div>
          {adventure.images.slice(1).map((img, idx) => (
            <div key={idx} className="relative">
              <Image src={img} alt={`${adventure.name} ${idx + 2}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* Adventure Info */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-[2fr_1fr] gap-12">
            {/* Main Content */}
            <div className="space-y-8">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <HeroTitle className="mb-2 text-ghxst-primary">{adventure.name}</HeroTitle>
                    <Metadata className="text-ghxst-text-secondary">{adventure.category}</Metadata>
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

                <div className="flex items-center gap-6 mb-6">
                  <Metadata className="flex items-center gap-2 text-ghxst-text-secondary">
                    <Clock className="w-5 h-5" />
                    {adventure.duration}
                  </Metadata>
                  <PriceTag amount={adventure.price} />
                </div>

                <BodyText className="text-ghxst-text-secondary">{adventure.description}</BodyText>
              </div>

              {/* Highlights */}
              <div>
                <SectionHeader className="mb-4 uppercase text-ghxst-primary">Highlights</SectionHeader>
                <div className="grid md:grid-cols-2 gap-3">
                  {adventure.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-ghxst-accent mt-2 flex-shrink-0" />
                      <BodyText className="text-ghxst-text-secondary">{highlight}</BodyText>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's Included */}
              <div>
                <SectionHeader className="mb-4 uppercase text-ghxst-primary">What&apos;s Included</SectionHeader>
                <div className="space-y-2">
                  {adventure.included.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-ghxst-accent flex items-center justify-center flex-shrink-0">
                        <span className="text-ghxst-white text-caption">✓</span>
                      </div>
                      <BodyText className="text-ghxst-text-secondary">{item}</BodyText>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meeting Point */}
              <div>
                <SectionHeader className="mb-4 uppercase text-ghxst-primary">Meeting Point</SectionHeader>
                <div className="card p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-ghxst-accent flex-shrink-0 mt-1" />
                    <div>
                      <BodyText className="text-ghxst-text-primary">{adventure.meetingPoint}</BodyText>
                      <Button variant="secondary" size="sm" className="mt-2">
                        Get Directions
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div>
                <SectionHeader className="mb-4 uppercase text-ghxst-primary">Member Reviews</SectionHeader>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="card p-6 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-ghxst-surface" />
                        <div>
                          <CardTitle className="text-ghxst-primary">Member Name</CardTitle>
                          <Metadata className="text-ghxst-text-secondary">3 weeks ago</Metadata>
                        </div>
                      </div>
                      <BodyText className="text-ghxst-text-secondary">
                        Amazing tour! Our guide was knowledgeable and the views were spectacular. Highly recommend!
                      </BodyText>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Card */}
              <div className="card p-6 space-y-4 sticky top-24">
                <SectionHeader className="uppercase text-ghxst-primary">Book This Adventure</SectionHeader>

                <div className="space-y-4">
                  <div>
                    <Metadata className="text-ghxst-text-secondary mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Select Date & Time
                    </Metadata>
                    <select className="w-full p-3 border-2 border-ghxst-border bg-ghxst-white -tech">
                      <option>Choose availability...</option>
                      {adventure.availability.map((slot, idx) => (
                        <option key={idx}>{slot}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Metadata className="text-ghxst-text-secondary mb-2 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Number of Guests
                    </Metadata>
                    <select className="w-full p-3 border-2 border-ghxst-border bg-ghxst-white -tech">
                      <option>1 Guest</option>
                      <option>2 Guests</option>
                      <option>3 Guests</option>
                      <option>4 Guests</option>
                      <option>5+ Guests</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-ghxst-border">
                    <div className="flex items-center justify-between mb-4">
                      <Metadata className="text-ghxst-text-secondary">Total</Metadata>
                      <PriceTag amount={adventure.price} />
                    </div>
                    <Button variant="primary" size="lg" className="w-full">
                      Book Now
                    </Button>
                  </div>

                  <Metadata className="text-ghxst-text-secondary text-caption text-center">
                    Free cancellation up to 24 hours before
                  </Metadata>
                </div>
              </div>

              {/* Nearby Events */}
              <div className="card p-6 space-y-4">
                <CardTitle className="text-ghxst-primary">Pair with Events</CardTitle>
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
