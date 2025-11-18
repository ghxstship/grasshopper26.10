'use client';

import { GvtewayLayout } from "@/components/templates/GvtewayLayout";
import { PageTitle, SectionHeader, CardTitle, BodyText, Metadata } from "@/components/atoms/Typography";
import { CategoryTab } from "@/components/atoms/CategoryTab";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Sparkles, MapPin, Clock, Users, Star, Compass } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const metadata = {
  title: 'Adventures | Experiences & Tours | GVTEWAY',
  description: 'Discover tours, excursions, and points of interest. Turn every event into an unforgettable experience.',
  keywords: 'adventures, tours, excursions, experiences, activities',
};

export default function AdventuresPage() {
  const adventures = [
    {
      id: "1",
      title: "VIP Backstage Tour",
      category: "VIP Experience",
      image: "/api/placeholder/400/300",
      duration: "2 hours",
      price: 150,
      rating: 4.9,
      reviewCount: 45,
      location: "Various Venues",
      description: "Get exclusive backstage access and meet the artists.",
      featured: true,
    },
    {
      id: "2",
      title: "Tampa Bay Sunset Cruise",
      category: "Tour",
      image: "/api/placeholder/400/300",
      duration: "3 hours",
      price: 75,
      rating: 4.8,
      reviewCount: 128,
      location: "Tampa Bay",
      description: "Experience stunning sunset views while cruising the bay.",
      featured: true,
    },
    {
      id: "3",
      title: "Ybor City Food & Culture Walk",
      category: "Tour",
      image: "/api/placeholder/400/300",
      duration: "2.5 hours",
      price: 45,
      rating: 4.7,
      reviewCount: 89,
      location: "Ybor City",
      description: "Explore historic Ybor City with tastings at local spots.",
      featured: false,
    },
    {
      id: "4",
      title: "Artist Meet & Greet Package",
      category: "Meet & Greet",
      image: "/api/placeholder/400/300",
      duration: "1 hour",
      price: 200,
      rating: 5.0,
      reviewCount: 67,
      location: "Event Dependent",
      description: "Personal meet and greet with photo opportunity.",
      featured: true,
    },
  ];

  return (
    <GvtewayLayout>

      <section className="section-padding bg-ghxst-surface">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <PageTitle className="mb-4 uppercase text-ghxst-primary">Find Adventures</PageTitle>
          <BodyText className="text-h6 text-ghxst-text-secondary max-w-2xl mx-auto">
            Turn every event into an experience. Discover nearby points of interest, tours, 
            excursions, and activities to make your trip unforgettable.
          </BodyText>
        </div>
      </section>

      <section className="border-b-2 border-ghxst-border">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-wrap gap-4 py-4">
            <CategoryTab active>All Adventures</CategoryTab>
            <CategoryTab icon={<Sparkles className="w-4 h-4" />}>VIP Experiences</CategoryTab>
            <CategoryTab icon={<Users className="w-4 h-4" />}>Meet & Greets</CategoryTab>
            <CategoryTab icon={<Compass className="w-4 h-4" />}>Tours</CategoryTab>
            <CategoryTab icon={<Star className="w-4 h-4" />}>Workshops</CategoryTab>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between mb-8">
            <SectionHeader className="uppercase text-ghxst-primary">Featured Adventures</SectionHeader>
            <Button variant="secondary" size="sm">Submit Adventure</Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adventures.map((adventure) => (
              <Link
                key={adventure.id}
                href={`/gvteway/adventures/${adventure.id}`}
                className="card bg-ghxst-white border-2 border-ghxst-border hover:border-ghxst-black transition-colors group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={adventure.image}
                    alt={adventure.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="default">{adventure.category}</Badge>
                    {adventure.featured && <Badge variant="warning">FEATURED</Badge>}
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <div className="flex items-center gap-1 bg-ghxst-black/80 text-ghxst-white px-2 py-1 rounded">
                      <Star className="w-3 h-3 fill-yellow-500 text-warning" />
                      <Metadata className="text-caption text-ghxst-white">{adventure.rating}</Metadata>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <CardTitle className="text-ghxst-primary mb-2 line-clamp-2">
                      {adventure.title}
                    </CardTitle>
                    <BodyText className="text-ghxst-text-secondary text-body-sm line-clamp-2">
                      {adventure.description}
                    </BodyText>
                  </div>

                  <div className="space-y-2">
                    <Metadata className="flex items-center gap-2 text-ghxst-text-secondary">
                      <Clock className="w-4 h-4" />
                      {adventure.duration}
                    </Metadata>
                    <Metadata className="flex items-center gap-2 text-ghxst-text-secondary">
                      <MapPin className="w-4 h-4" />
                      {adventure.location}
                    </Metadata>
                    <Metadata className="text-ghxst-text-secondary text-caption">
                      {adventure.reviewCount} reviews
                    </Metadata>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-ghxst-border">
                    <span className="text-h4 font-bebas text-ghxst-primary">
                      ${adventure.price}
                    </span>
                    <Button variant="primary" size="sm">View Details</Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-ghxst-surface">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <SectionHeader className="uppercase text-ghxst-primary">Adventure Sources</SectionHeader>
            <BodyText className="text-ghxst-text-secondary">
              Our adventures come from verified partners, member submissions, and curated local experiences.
            </BodyText>
            <div className="grid md:grid-cols-4 gap-6 mt-8">
              <div className="text-center">
                <Metadata className="text-ghxst-text-primary">Google Places</Metadata>
                <Metadata className="text-ghxst-text-secondary text-caption">Points of Interest</Metadata>
              </div>
              <div className="text-center">
                <Metadata className="text-ghxst-text-primary">Local Partners</Metadata>
                <Metadata className="text-ghxst-text-secondary text-caption">Tour Operators</Metadata>
              </div>
              <div className="text-center">
                <Metadata className="text-ghxst-text-primary">Member Curated</Metadata>
                <Metadata className="text-ghxst-text-secondary text-caption">Community Picks</Metadata>
              </div>
              <div className="text-center">
                <Metadata className="text-ghxst-text-primary">Event Packages</Metadata>
                <Metadata className="text-ghxst-text-secondary text-caption">Bundled Experiences</Metadata>
              </div>
            </div>
          </div>
        </div>
      </section>

    </GvtewayLayout>
  );
}
