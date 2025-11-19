'use client';

import { GvtewayLayout } from "@/components/templates/GvtewayLayout";
import { BodyText, CardTitle, PageTitle, SectionHeader } from "@/components/atoms/Typography";
import { ShopCard } from "@/components/molecules/ShopCard";
import { CategoryTab } from "@/components/atoms/CategoryTab";
import { SearchBar } from "@/components/atoms/SearchBar";
import { IntegrationBadge } from "@/components/atoms/IntegrationBadge";
import { Button } from "@/components/atoms/Button";
import { Store, Sparkles } from "lucide-react";
import Image from "next/image";

const metadata = {
  title: 'Shops | Artist Merch & Exclusive Drops | GVTEWAY',
  description: 'Shop exclusive merch, vinyl, and apparel from your favorite artists, venues, labels, and local brands.',
  keywords: 'merch, vinyl, apparel, artist merchandise, shopify',
};

export default function ShopsPage() {
  const featuredStores = [
    {
      id: "1",
      name: "The Midnight Collective Store",
      type: "artist" as const,
      logo: "/api/placeholder/200/200",
      description: "Official merch, vinyl, and exclusive drops",
      featuredProducts: ["/api/placeholder/100/100", "/api/placeholder/100/100", "/api/placeholder/100/100"],
      slug: "midnight-collective",
      shopifyStoreId: "store123",
    },
    {
      id: "2",
      name: "The Ritz Ybor Merch",
      type: "venue" as const,
      logo: "/api/placeholder/200/200",
      description: "Venue apparel and collectibles",
      featuredProducts: ["/api/placeholder/100/100", "/api/placeholder/100/100"],
      slug: "ritz-ybor",
      shopifyStoreId: "store456",
    },
  ];

  return (
    <GvtewayLayout>

      <section className="section-padding bg-ghxst-surface">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <PageTitle className="mb-4 uppercase text-ghxst-primary">Shop The Scene</PageTitle>
          <BodyText className="text-ghxst-text-secondary max-w-2xl mx-auto mb-8">
            Exclusive merch, vinyl, apparel, and experiences from your favorite 
            artists, venues, labels, and brands—all in one place.
          </BodyText>

          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar placeholder="Search shops, products, brands..." showLocationSelector={false} />
          </div>

          <IntegrationBadge provider="shopify" size="md" />
        </div>
      </section>

      <section className="border-b-2 border-ghxst-border">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-wrap gap-4 py-4">
            <CategoryTab active>All Shops</CategoryTab>
            <CategoryTab icon={<Store className="w-4 h-4" />}>Artist Stores</CategoryTab>
            <CategoryTab icon={<Store className="w-4 h-4" />}>Venues</CategoryTab>
            <CategoryTab icon={<Store className="w-4 h-4" />}>Record Labels</CategoryTab>
            <CategoryTab icon={<Store className="w-4 h-4" />}>Local Brands</CategoryTab>
            <CategoryTab icon={<Sparkles className="w-4 h-4" />}>Exclusive Drops</CategoryTab>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          <SectionHeader className="mb-8 uppercase text-ghxst-primary">Featured Stores</SectionHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {featuredStores.map((store) => (
              <ShopCard key={store.id} {...store} />
            ))}
          </div>

          <div className="text-center">
            <Button variant="primary" size="lg">
              Browse All Shops
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between mb-8">
            <SectionHeader className="uppercase text-ghxst-primary">New Arrivals</SectionHeader>
            <Button variant="secondary" size="md">
              View All
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card overflow-hidden">
                <div className="relative aspect-square bg-ghxst-surface">
                  <Image
                    src="/api/placeholder/400/400"
                    alt="Product"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <BodyText className="-tech-mono text-caption text-ghxst-text-secondary">Artist Name</BodyText>
                  <CardTitle className="text-ghxst-primary">Limited Edition Tee</CardTitle>
                  <BodyText className="-tech-mono text-body text-ghxst-primary">$35.00</BodyText>
                  <Button variant="primary" size="sm" className="w-full">
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-ghxst-black text-ghxst-white">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <SectionHeader className="mb-4 uppercase">Exclusive Member Drops</SectionHeader>
          <BodyText className="text-grey-300 max-w-2xl mx-auto mb-8">
            Get early access to limited edition releases and exclusive collaborations
          </BodyText>
          <Button variant="primary" size="lg">
            Join Membership
          </Button>
        </div>
      </section>

    </GvtewayLayout>
  );
}
