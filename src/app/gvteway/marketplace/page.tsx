'use client';

import { GvtewayLayout } from "@/components/templates/GvtewayLayout";
import { PageTitle, SectionHeader, CardTitle, BodyText, Metadata } from "@/components/atoms/Typography";
import { CategoryTab } from "@/components/atoms/CategoryTab";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Ticket, ShoppingBag, Sparkles, Calendar, MapPin, Users, TrendingUp, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const metadata = {
  title: 'Marketplace | GVTEWAY Community',
  description: 'Buy, sell, and trade tickets, merch, and exclusive experiences in the GVTEWAY community marketplace.',
  keywords: 'marketplace, tickets, merch, experiences, buy, sell, trade',
};

export default function MarketplacePage() {
  // Demo marketplace items - would come from API
  const marketplaceItems = [
    {
      id: "1",
      type: "ticket",
      title: "Summer Music Festival - 2 GA Tickets",
      event: "Summer Music Festival",
      seller: "@musiclover23",
      sellerRating: 4.9,
      image: "/api/placeholder/400/300",
      price: 120,
      originalPrice: 150,
      quantity: 2,
      pricePerItem: 60,
      date: "Jun 15, 2025",
      venue: "Curtis Hixon Park",
      verified: true,
      featured: true,
    },
    {
      id: "2",
      type: "merch",
      title: "Limited Edition Festival Hoodie",
      event: "Sunset Music Festival 2024",
      seller: "@festivalfan",
      sellerRating: 5.0,
      image: "/api/placeholder/400/300",
      price: 65,
      originalPrice: null,
      quantity: 1,
      condition: "New with tags",
      size: "Large",
      verified: true,
      featured: false,
    },
    {
      id: "3",
      type: "experience",
      title: "VIP Meet & Greet Package",
      event: "Artist Name Concert",
      seller: "@vipaccess",
      sellerRating: 4.8,
      image: "/api/placeholder/400/300",
      price: 250,
      originalPrice: 300,
      quantity: 1,
      includes: ["Backstage tour", "Photo opportunity", "Signed merchandise"],
      date: "Jul 20, 2025",
      verified: true,
      featured: true,
    },
    {
      id: "4",
      type: "ticket",
      title: "The Ritz Ybor - Single Ticket",
      event: "Electronic Night",
      seller: "@raverlife",
      sellerRating: 4.7,
      image: "/api/placeholder/400/300",
      price: 35,
      originalPrice: 45,
      quantity: 1,
      pricePerItem: 35,
      date: "Nov 30, 2025",
      venue: "The Ritz Ybor",
      verified: true,
      featured: false,
    },
    {
      id: "5",
      type: "merch",
      title: "Signed Artist Poster",
      event: "World Tour 2025",
      seller: "@collector99",
      sellerRating: 5.0,
      image: "/api/placeholder/400/300",
      price: 85,
      originalPrice: null,
      quantity: 1,
      condition: "Mint condition",
      verified: true,
      featured: false,
    },
    {
      id: "6",
      type: "experience",
      title: "Festival Camping Package",
      event: "Summer Music Festival",
      seller: "@campingpro",
      sellerRating: 4.9,
      image: "/api/placeholder/400/300",
      price: 180,
      originalPrice: 220,
      quantity: 2,
      includes: ["Premium camping spot", "2 festival passes", "Parking pass"],
      date: "Jun 15-17, 2025",
      verified: true,
      featured: false,
    },
  ];

  return (
    <GvtewayLayout>

      {/* Hero Section */}
      <section className="section-padding bg-ghxst-surface">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <PageTitle className="mb-4 uppercase text-ghxst-primary">Marketplace</PageTitle>
          <BodyText className="text-h6 text-ghxst-text-secondary max-w-2xl mx-auto">
            Buy, sell, and trade tickets, merch, and exclusive experiences. 
            Secure payments. Authenticity guaranteed. Community-driven.
          </BodyText>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="border-b-2 border-ghxst-border">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-wrap gap-4 py-4">
            <CategoryTab active>All Items</CategoryTab>
            <CategoryTab icon={<Ticket className="w-4 h-4" />}>Tickets</CategoryTab>
            <CategoryTab icon={<ShoppingBag className="w-4 h-4" />}>Merch</CategoryTab>
            <CategoryTab icon={<Sparkles className="w-4 h-4" />}>Experiences</CategoryTab>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="section-padding bg-ghxst-white border-b-2 border-ghxst-border">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <Shield className="w-8 h-8 text-ghxst-accent mx-auto" />
              <Metadata className="text-ghxst-text-primary">Secure Payments</Metadata>
              <Metadata className="text-ghxst-text-secondary text-caption">Protected transactions</Metadata>
            </div>
            <div className="text-center space-y-2">
              <Ticket className="w-8 h-8 text-ghxst-accent mx-auto" />
              <Metadata className="text-ghxst-text-primary">Authenticity Guaranteed</Metadata>
              <Metadata className="text-ghxst-text-secondary text-caption">Verified tickets only</Metadata>
            </div>
            <div className="text-center space-y-2">
              <Users className="w-8 h-8 text-ghxst-accent mx-auto" />
              <Metadata className="text-ghxst-text-primary">Buyer Protection</Metadata>
              <Metadata className="text-ghxst-text-secondary text-caption">Full refund guarantee</Metadata>
            </div>
            <div className="text-center space-y-2">
              <TrendingUp className="w-8 h-8 text-ghxst-accent mx-auto" />
              <Metadata className="text-ghxst-text-primary">Instant Transfer</Metadata>
              <Metadata className="text-ghxst-text-secondary text-caption">Immediate delivery</Metadata>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Grid */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between mb-8">
            <SectionHeader className="uppercase text-ghxst-primary">Featured Listings</SectionHeader>
            <Button variant="secondary" size="sm">
              List an Item
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketplaceItems.map((item) => (
              <Link 
                key={item.id} 
                href={`/gvteway/marketplace/${item.id}`}
                className="card bg-ghxst-white border-2 border-ghxst-border hover:border-ghxst-black transition-colors group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="default">{item.type.toUpperCase()}</Badge>
                    {item.featured && <Badge variant="warning">FEATURED</Badge>}
                    {item.verified && (
                      <Badge variant="success" className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <CardTitle className="text-ghxst-primary mb-2 line-clamp-2">
                      {item.title}
                    </CardTitle>
                    <Metadata className="text-ghxst-text-secondary">
                      {item.event}
                    </Metadata>
                  </div>

                  {/* Type-specific info */}
                  {item.type === "ticket" && (
                    <div className="space-y-2">
                      <Metadata className="flex items-center gap-2 text-ghxst-text-secondary">
                        <Calendar className="w-4 h-4" />
                        {item.date}
                      </Metadata>
                      <Metadata className="flex items-center gap-2 text-ghxst-text-secondary">
                        <MapPin className="w-4 h-4" />
                        {item.venue}
                      </Metadata>
                      <Metadata className="text-ghxst-text-secondary">
                        {item.quantity} {item.quantity === 1 ? 'ticket' : 'tickets'} • ${item.pricePerItem} each
                      </Metadata>
                    </div>
                  )}

                  {item.type === "merch" && (
                    <div className="space-y-2">
                      <Metadata className="text-ghxst-text-secondary">
                        Condition: {item.condition}
                      </Metadata>
                      {item.size && (
                        <Metadata className="text-ghxst-text-secondary">
                          Size: {item.size}
                        </Metadata>
                      )}
                    </div>
                  )}

                  {item.type === "experience" && item.includes && (
                    <div className="space-y-2">
                      <Metadata className="text-ghxst-text-secondary">Includes:</Metadata>
                      <ul className="space-y-1">
                        {item.includes.slice(0, 2).map((include, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-ghxst-accent mt-2 flex-shrink-0" />
                            <Metadata className="text-ghxst-text-secondary text-caption">{include}</Metadata>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Seller Info */}
                  <div className="flex items-center justify-between pt-3 border-t border-ghxst-border">
                    <div>
                      <Metadata className="text-ghxst-text-secondary text-caption">Seller</Metadata>
                      <Metadata className="text-ghxst-text-primary">{item.seller}</Metadata>
                      <Metadata className="text-ghxst-text-secondary text-caption">⭐ {item.sellerRating}</Metadata>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-h4 font-bebas text-ghxst-primary">
                          ${item.price}
                        </span>
                      </div>
                      {item.originalPrice && (
                        <Metadata className="text-ghxst-text-secondary text-caption line-through">
                          ${item.originalPrice}
                        </Metadata>
                      )}
                    </div>
                  </div>

                  <Button variant="primary" size="sm" className="w-full">
                    View Details
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-ghxst-surface">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <SectionHeader className="uppercase text-ghxst-primary">Have Something to Sell?</SectionHeader>
            <BodyText className="text-ghxst-text-secondary">
              List your tickets, merch, or experiences in minutes. Reach thousands of GVTEWAY members 
              and turn your extras into cash or trade for something better.
            </BodyText>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="primary" size="lg">
                List an Item
              </Button>
              <Button variant="secondary" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </GvtewayLayout>
  );
}
