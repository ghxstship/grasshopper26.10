'use client';

import { GvtewayLayout } from "@/components/templates/GvtewayLayout";
import { BodyText, CardTitle, PageTitle, SectionHeader } from "@/components/atoms/Typography";
import { DestinationCard } from "@/components/molecules/DestinationCard";
import { CategoryTab } from "@/components/atoms/CategoryTab";
import { SearchBar } from "@/components/atoms/SearchBar";
import { IntegrationBadge } from "@/components/atoms/IntegrationBadge";
import { Button } from "@/components/atoms/Button";
import { Hotel, UtensilsCrossed, ShoppingBag, Sparkles } from "lucide-react";

const _metadata = {
  title: 'Destinations | Plan Your Trip | GVTEWAY',
  description: 'Discover stays, dining, shopping, and wellness near venues. Make every event an adventure.',
  keywords: 'hotels, restaurants, attractions, event planning',
};

export default function DestinationsPage() {
  const featuredDestinations = [
    {
      id: "1",
      name: "The Epicurean Hotel",
      category: "stay" as const,
      image: "/api/placeholder/400/300",
      address: "1207 S Howard Ave, FL",
      distance: "0.5mi",
      priceLevel: 3,
      rating: 4.5,
      reviewCount: 342,
      slug: "epicurean-hotel",
      googlePlaceId: "place123",
    },
    {
      id: "2",
      name: "Ulele Restaurant",
      category: "dining" as const,
      image: "/api/placeholder/400/300",
      address: "1810 N Highland Ave, FL",
      distance: "0.8mi",
      priceLevel: 2,
      rating: 4.7,
      reviewCount: 1256,
      slug: "ulele-restaurant",
      googlePlaceId: "place456",
    },
  ];

  return (
    <GvtewayLayout>

      <section className="section-padding bg-ghxst-surface">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <PageTitle className="mb-4 uppercase text-ghxst-primary">Plan Your Trip</PageTitle>
          <BodyText className="text-ghxst-text-secondary max-w-2xl mx-auto mb-8">
            Make every event an adventure. Discover nearby stays, dining, shopping, 
            and wellness spots curated by locals and members.
          </BodyText>

          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar placeholder="Search destinations, neighborhoods..." />
          </div>

          <IntegrationBadge provider="google" size="md" />
        </div>
      </section>

      <section className="border-b-2 border-ghxst-border">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-wrap gap-4 py-4">
            <CategoryTab active>All Destinations</CategoryTab>
            <CategoryTab icon={<Hotel className="w-4 h-4" />}>Stays</CategoryTab>
            <CategoryTab icon={<UtensilsCrossed className="w-4 h-4" />}>Dining</CategoryTab>
            <CategoryTab icon={<ShoppingBag className="w-4 h-4" />}>Shopping</CategoryTab>
            <CategoryTab icon={<Sparkles className="w-4 h-4" />}>Wellness</CategoryTab>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          <SectionHeader className="mb-8 uppercase text-ghxst-primary">Featured Destinations</SectionHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {featuredDestinations.map((destination) => (
              <DestinationCard key={destination.id} {...destination} />
            ))}
          </div>

          <div className="text-center">
            <Button variant="primary" size="lg">
              Explore All Destinations
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding bg-ghxst-surface">
        <div className="max-w-7xl mx-auto px-8">
          <SectionHeader className="mb-8 uppercase text-center text-ghxst-primary">Explore By Category</SectionHeader>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-8 text-center space-y-4 hover:border-ghxst-black transition-colors cursor-pointer">
              <div className="w-16 h-16 bg-ghxst-black rounded-full flex items-center justify-center mx-auto">
                <Hotel className="w-8 h-8 text-ghxst-white" />
              </div>
              <CardTitle className="text-ghxst-primary">Stays</CardTitle>
              <BodyText className="-tech text-body-sm text-ghxst-text-secondary">
                Hotels, Airbnbs, and unique accommodations
              </BodyText>
            </div>

            <div className="card p-8 text-center space-y-4 hover:border-ghxst-black transition-colors cursor-pointer">
              <div className="w-16 h-16 bg-ghxst-black rounded-full flex items-center justify-center mx-auto">
                <UtensilsCrossed className="w-8 h-8 text-ghxst-white" />
              </div>
              <CardTitle className="text-ghxst-primary">Dining</CardTitle>
              <BodyText className="-tech text-body-sm text-ghxst-text-secondary">
                Restaurants, bars, and local food spots
              </BodyText>
            </div>

            <div className="card p-8 text-center space-y-4 hover:border-ghxst-black transition-colors cursor-pointer">
              <div className="w-16 h-16 bg-ghxst-black rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8 text-ghxst-white" />
              </div>
              <CardTitle className="text-ghxst-primary">Shopping</CardTitle>
              <BodyText className="-tech text-body-sm text-ghxst-text-secondary">
                Local shops, boutiques, and markets
              </BodyText>
            </div>

            <div className="card p-8 text-center space-y-4 hover:border-ghxst-black transition-colors cursor-pointer">
              <div className="w-16 h-16 bg-ghxst-black rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-ghxst-white" />
              </div>
              <CardTitle className="text-ghxst-primary">Wellness</CardTitle>
              <BodyText className="-tech text-body-sm text-ghxst-text-secondary">
                Spas, yoga studios, and health centers
              </BodyText>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <SectionHeader className="uppercase text-ghxst-primary">Going to a Show?</SectionHeader>
            <BodyText className="text-ghxst-text-secondary">
              Find nearby spots perfect for pre-show dinner or post-show drinks
            </BodyText>
            <SearchBar placeholder="Search events to find nearby destinations..." />
          </div>
        </div>
      </section>

      <section className="section-padding bg-ghxst-surface">
        <div className="max-w-7xl mx-auto px-8">
          <SectionHeader className="mb-8 uppercase text-ghxst-primary">Member Recommendations</SectionHeader>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-ghxst-surface" />
                  <div className="flex-1">
                    <CardTitle className="text-ghxst-primary">Member Name</CardTitle>
                    <BodyText className="-tech-mono text-body-sm text-ghxst-text-secondary">
                      &ldquo;Amazing spot for pre-show dinner! Great atmosphere and close to the venue.&rdquo;
                    </BodyText>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="secondary" size="md">
              Add Your Recommendation
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding bg-ghxst-black text-ghxst-white">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <SectionHeader className="mb-4 uppercase">Save Your Favorite Spots</SectionHeader>
          <BodyText className="text-grey-300 max-w-2xl mx-auto mb-8">
            Create trip itineraries and share plans with friends
          </BodyText>
          <Button variant="primary" size="lg">
            Sign Up to Save
          </Button>
        </div>
      </section>

    </GvtewayLayout>
  );
}
