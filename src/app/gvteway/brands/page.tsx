'use client';

import { GvtewayLayout } from "@/components/templates/GvtewayLayout";
import { BodyText, CardTitle, PageTitle, SectionHeader, SubsectionHeader } from "@/components/atoms/Typography";
import { BrandCard } from "@/components/molecules/BrandCard";
import { CategoryTab } from "@/components/atoms/CategoryTab";
import { SearchBar } from "@/components/atoms/SearchBar";
import { IntegrationBadge } from "@/components/atoms/IntegrationBadge";
import { Button } from "@/components/atoms/Button";
import { Store, Music, Building2, Users, Sparkles } from "lucide-react";
import Image from "next/image";

const metadata = {
  title: 'Brands | Venues, Record Labels, Artist Brands & Communities | GVTEWAY',
  description: 'Shop exclusive merch, vinyl, and apparel from your favorite venues, record labels, artist brands, communities, and local stores.',
  keywords: 'merch, vinyl, apparel, artist merchandise, venue merch, record labels, communities, shopify',
};

export default function BrandsPage() {
  const featuredBrands = [
    {
      id: "1",
      name: "The Midnight Collective",
      type: "artist" as const,
      logo: "/api/placeholder/200/200",
      description: "Official merch, vinyl, and exclusive drops from the synthwave legends",
      featuredProducts: ["/api/placeholder/100/100", "/api/placeholder/100/100", "/api/placeholder/100/100"],
      slug: "midnight-collective",
      shopifyStoreId: "store123",
    },
    {
      id: "2",
      name: "The Ritz Ybor",
      type: "venue" as const,
      logo: "/api/placeholder/200/200",
      description: "Historic venue apparel, collectibles, and exclusive event merch",
      featuredProducts: ["/api/placeholder/100/100", "/api/placeholder/100/100"],
      slug: "ritz-ybor",
      shopifyStoreId: "store456",
    },
    {
      id: "3",
      name: "Sunset Sound Records",
      type: "label" as const,
      logo: "/api/placeholder/200/200",
      description: "Independent label featuring the finest electronic and indie artists",
      featuredProducts: ["/api/placeholder/100/100", "/api/placeholder/100/100", "/api/placeholder/100/100"],
      slug: "sunset-sound",
      shopifyStoreId: "store789",
    },
    {
      id: "4",
      name: "Bay Music Collective",
      type: "community" as const,
      logo: "/api/placeholder/200/200",
      description: "Community-driven merch supporting local artists and venues",
      featuredProducts: ["/api/placeholder/100/100", "/api/placeholder/100/100"],
      slug: "bay-collective",
      shopifyStoreId: "store012",
    },
  ];

  return (
    <GvtewayLayout>

      {/* Hero Section */}
      <section className="section-padding bg-ghxst-surface">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <PageTitle className="mb-4 uppercase text-ghxst-primary">Shop The Scene</PageTitle>
          <BodyText className="text-ghxst-text-secondary max-w-3xl mx-auto mb-8">
            Exclusive merch, vinyl, apparel, and experiences from your favorite 
            venues, record labels, artist brands, communities, and local stores—all in one place.
          </BodyText>

          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar placeholder="Search brands, products, artists..." showLocationSelector={false} />
          </div>

          <IntegrationBadge provider="shopify" size="md" />
        </div>
      </section>

      {/* Category Tabs */}
      <section className="border-b-2 border-ghxst-border">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-wrap gap-4 py-4">
            <CategoryTab active>All Brands</CategoryTab>
            <CategoryTab icon={<Music className="w-4 h-4" />}>Artist Brands</CategoryTab>
            <CategoryTab icon={<Building2 className="w-4 h-4" />}>Venues</CategoryTab>
            <CategoryTab icon={<Store className="w-4 h-4" />}>Record Labels</CategoryTab>
            <CategoryTab icon={<Users className="w-4 h-4" />}>Communities</CategoryTab>
            <CategoryTab icon={<Store className="w-4 h-4" />}>Local Stores</CategoryTab>
            <CategoryTab icon={<Sparkles className="w-4 h-4" />}>Exclusive Drops</CategoryTab>
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          <SectionHeader className="mb-8 uppercase text-ghxst-primary">Featured Brands</SectionHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {featuredBrands.map((brand) => (
              <BrandCard key={brand.id} {...brand} />
            ))}
          </div>

          <div className="text-center">
            <Button variant="primary" size="lg">
              Browse All Brands
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Categories Showcase */}
      <section className="section-padding bg-ghxst-surface">
        <div className="max-w-7xl mx-auto px-8">
          <SectionHeader className="mb-8 uppercase text-ghxst-primary text-center">
            Shop By Category
          </SectionHeader>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: Music, title: "Artist Brands", count: "50+ Brands", color: "bg-info-light" },
              { icon: Building2, title: "Venues", count: "25+ Venues", color: "bg-accent/20" },
              { icon: Store, title: "Record Labels", count: "30+ Labels", color: "bg-success-light" },
              { icon: Users, title: "Communities", count: "15+ Collectives", color: "bg-warning-light" },
              { icon: Store, title: "Local Stores", count: "40+ Shops", color: "bg-pink-100" },
            ].map((category, idx) => (
              <button
                key={idx}
                className="card p-6 text-center hover:shadow-lg transition-shadow group"
              >
                <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <category.icon className="w-8 h-8 text-ghxst-primary" />
                </div>
                <h3 className="text-ghxst-primary mb-2">{category.title}</h3>
                <p className="-tech-mono text-body-sm text-ghxst-text-secondary">{category.count}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
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
              <div key={i} className="card overflow-hidden group">
                <div className="relative aspect-square bg-ghxst-surface">
                  <Image
                    src="/api/placeholder/400/400"
                    alt="Product"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-ghxst-black text-ghxst-white px-3 py-1 text-body-sm">NEW</span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <BodyText className="-tech-mono text-caption text-ghxst-text-secondary">Brand Name</BodyText>
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

      {/* Exclusive Member Drops */}
      <section className="section-padding bg-ghxst-black text-ghxst-white">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <SectionHeader className="mb-4 uppercase">Exclusive Member Drops</SectionHeader>
          <BodyText className="text-grey-300 max-w-2xl mx-auto mb-8">
            Get early access to limited edition releases, exclusive collaborations, 
            and member-only products from your favorite brands
          </BodyText>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="primary" size="lg">
              Join Membership
            </Button>
            <Button variant="secondary" size="lg" className="bg-ghxst-white text-ghxst-black hover:bg-grey-200">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Features */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-ghxst-surface rounded-full flex items-center justify-center mx-auto">
                <Store className="w-8 h-8 text-ghxst-primary" />
              </div>
              <SubsectionHeader className="text-ghxst-primary">Authentic Merch</SubsectionHeader>
              <BodyText className="text-ghxst-text-secondary">
                100% official products directly from venues, labels, and artists
              </BodyText>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-ghxst-surface rounded-full flex items-center justify-center mx-auto">
                <Music className="w-8 h-8 text-ghxst-primary" />
              </div>
              <SubsectionHeader className="text-ghxst-primary">Support Artists</SubsectionHeader>
              <BodyText className="text-ghxst-text-secondary">
                Every purchase directly supports the local music scene and creators
              </BodyText>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-ghxst-surface rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-ghxst-primary" />
              </div>
              <SubsectionHeader className="text-ghxst-primary">Exclusive Access</SubsectionHeader>
              <BodyText className="text-ghxst-text-secondary">
                Member-only drops, early releases, and limited edition collaborations
              </BodyText>
            </div>
          </div>
        </div>
      </section>

    </GvtewayLayout>
  );
}
