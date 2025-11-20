'use client';

import { GvtewayLayout } from "@/components/templates/GvtewayLayout";
import { HeroTitle, SectionHeader, CardTitle, BodyText, Metadata } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Rating } from "@/components/atoms/Rating";
import { Ticket, Sparkles, Calendar, MapPin, Clock, Shield, Heart, Share2, MessageCircle, AlertTriangle } from "lucide-react";
import Image from "next/image";

interface MarketplaceItemPageProps {
  params: {
    id: string;
  };
}

export default function MarketplaceItemPage({ params: { id: _id } }: MarketplaceItemPageProps) {
  // Demo data - replace with actual API call using id
  const item = {
    id: "1",
    type: "ticket", // ticket, merch, experience
    title: "Summer Music Festival - 2 GA Tickets",
    event: "Summer Music Festival 2025",
    eventSlug: "summer-music-festival-2025",
    images: ["/api/placeholder/800/600", "/api/placeholder/800/600", "/api/placeholder/800/600"],
    price: 120,
    originalPrice: 150,
    quantity: 2,
    pricePerItem: 60,
    
    // Ticket-specific
    date: "Jun 15, 2025",
    time: "2:00 PM - 11:00 PM",
    venue: "Curtis Hixon Park",
    venueAddress: "600 N Ashley Dr, FL 33602",
    section: "General Admission",
    ticketType: "Mobile Transfer",
    
    // Seller info
    seller: {
      username: "@musiclover23",
      displayName: "Music Lover",
      memberSince: "2023",
      rating: 4.9,
      reviewCount: 47,
      verified: true,
      responseTime: "Within 1 hour",
      completedSales: 52,
    },
    
    description: `Selling 2 GA tickets to Summer Music Festival! Can't make it anymore due to work conflict. These are legitimate tickets purchased directly from the festival website.

Tickets will be transferred via mobile app immediately after payment. You'll receive them in your email within minutes.

Price is below face value - originally $75 each, selling both for $120 total ($60 each). Great deal for an amazing festival!`,
    
    postedDate: "Nov 10, 2025",
    lastUpdated: "Nov 12, 2025",
    views: 234,
    saves: 18,
    verified: true,
    featured: true,
    
    // Transfer details
    transferMethod: "Mobile app instant transfer",
    paymentMethods: ["Credit Card", "PayPal", "Apple Pay"],
    buyerProtection: true,
    instantDelivery: true,
  };

  const sellerListings = [
    { title: "Festival Parking Pass", type: "ticket", price: 25 },
    { title: "VIP Upgrade Available", type: "experience", price: 150 },
  ];

  const similarListings = [
    { title: "Summer Festival - VIP Tickets", type: "ticket", price: 250, seller: "@vipdeals" },
    { title: "Festival Camping Package", type: "experience", price: 180, seller: "@campingpro" },
  ];

  return (
    <GvtewayLayout>

      {/* Image Gallery */}
      <section className="relative">
        <div className="grid grid-cols-4 gap-2 h-[500px]">
          <div className="col-span-2 row-span-2 relative">
            <Image
              src={item.images[0]}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>
          {item.images.slice(1).map((img, idx) => (
            <div key={idx} className="relative">
              <Image src={img} alt={`${item.title} ${idx + 2}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* Item Details */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-[2fr_1fr] gap-12">
            {/* Main Content */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <Badge variant="default">{item.type.toUpperCase()}</Badge>
                      {item.featured && <Badge variant="warning">FEATURED</Badge>}
                      {item.verified && (
                        <Badge variant="success" className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    <HeroTitle className="mb-3 text-ghxst-primary">{item.title}</HeroTitle>
                    <CardTitle className="text-ghxst-text-secondary mb-2">{item.event}</CardTitle>
                    
                    <div className="flex items-center gap-4 text-ghxst-text-secondary">
                      <Metadata>Posted {item.postedDate}</Metadata>
                      <Metadata>•</Metadata>
                      <Metadata>{item.views} views</Metadata>
                      <Metadata>•</Metadata>
                      <Metadata>{item.saves} saves</Metadata>
                    </div>
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

                {/* Quick Info - Ticket specific */}
                {item.type === "ticket" && (
                  <div className="grid md:grid-cols-2 gap-4 p-6 bg-ghxst-surface rounded-lg">
                    <Metadata className="flex items-center gap-3 text-ghxst-text-secondary">
                      <Calendar className="w-5 h-5" />
                      {item.date}
                    </Metadata>
                    <Metadata className="flex items-center gap-3 text-ghxst-text-secondary">
                      <Clock className="w-5 h-5" />
                      {item.time}
                    </Metadata>
                    <Metadata className="flex items-center gap-3 text-ghxst-text-secondary">
                      <MapPin className="w-5 h-5" />
                      {item.venue}
                    </Metadata>
                    <Metadata className="flex items-center gap-3 text-ghxst-text-secondary">
                      <Ticket className="w-5 h-5" />
                      {item.quantity} {item.quantity === 1 ? 'ticket' : 'tickets'} • {item.section}
                    </Metadata>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <SectionHeader className="mb-4 uppercase text-ghxst-primary">Description</SectionHeader>
                <BodyText className="text-ghxst-text-secondary whitespace-pre-line">
                  {item.description}
                </BodyText>
              </div>

              {/* Ticket Details */}
              {item.type === "ticket" && (
                <div>
                  <SectionHeader className="mb-4 uppercase text-ghxst-primary">Ticket Details</SectionHeader>
                  <div className="card p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <Metadata className="text-ghxst-text-secondary">Ticket Type</Metadata>
                      <Metadata className="text-ghxst-text-primary">{item.ticketType}</Metadata>
                    </div>
                    <div className="flex items-center justify-between">
                      <Metadata className="text-ghxst-text-secondary">Section</Metadata>
                      <Metadata className="text-ghxst-text-primary">{item.section}</Metadata>
                    </div>
                    <div className="flex items-center justify-between">
                      <Metadata className="text-ghxst-text-secondary">Quantity</Metadata>
                      <Metadata className="text-ghxst-text-primary">{item.quantity}</Metadata>
                    </div>
                    <div className="flex items-center justify-between">
                      <Metadata className="text-ghxst-text-secondary">Price per ticket</Metadata>
                      <Metadata className="text-ghxst-text-primary">${item.pricePerItem}</Metadata>
                    </div>
                    <div className="flex items-center justify-between">
                      <Metadata className="text-ghxst-text-secondary">Transfer Method</Metadata>
                      <Metadata className="text-ghxst-text-primary">{item.transferMethod}</Metadata>
                    </div>
                  </div>
                </div>
              )}

              {/* Buyer Protection */}
              <div className="card p-6 bg-ghxst-surface">
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-ghxst-accent flex-shrink-0" />
                  <div className="space-y-3">
                    <CardTitle className="text-ghxst-primary">Buyer Protection Included</CardTitle>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-ghxst-accent mt-2 flex-shrink-0" />
                        <BodyText className="text-ghxst-text-secondary text-body-sm">
                          Full refund if tickets are invalid or not as described
                        </BodyText>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-ghxst-accent mt-2 flex-shrink-0" />
                        <BodyText className="text-ghxst-text-secondary text-body-sm">
                          Secure payment processing through GVTEWAY
                        </BodyText>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-ghxst-accent mt-2 flex-shrink-0" />
                        <BodyText className="text-ghxst-text-secondary text-body-sm">
                          24/7 customer support for any issues
                        </BodyText>
                      </div>
                      {item.instantDelivery && (
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-ghxst-accent mt-2 flex-shrink-0" />
                          <BodyText className="text-ghxst-text-secondary text-body-sm">
                            Instant delivery after payment confirmation
                          </BodyText>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Link */}
              {item.eventSlug && (
                <div className="card p-6 bg-ghxst-white border-2 border-ghxst-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-ghxst-primary mb-2">Going to this event?</CardTitle>
                      <BodyText className="text-ghxst-text-secondary text-body-sm">
                        View full event details, lineup, and venue information
                      </BodyText>
                    </div>
                    <Button variant="secondary" size="sm">
                      View Event
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Purchase Card */}
              <div className="card p-6 space-y-4 sticky top-24">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-ghxst-primary">
                      ${item.price}
                    </span>
                    {item.originalPrice && (
                      <Metadata className="text-ghxst-text-secondary line-through">
                        ${item.originalPrice}
                      </Metadata>
                    )}
                  </div>
                  {item.originalPrice && (
                    <Metadata className="text-success">
                      Save ${item.originalPrice - item.price} ({Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off)
                    </Metadata>
                  )}
                  {item.pricePerItem && (
                    <Metadata className="text-ghxst-text-secondary">
                      ${item.pricePerItem} per ticket
                    </Metadata>
                  )}
                </div>

                <div className="pt-4 border-t border-ghxst-border space-y-3">
                  <Button variant="primary" size="lg" className="w-full">
                    Buy Now
                  </Button>
                  <Button variant="secondary" size="md" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message Seller
                  </Button>
                  <Button variant="secondary" size="md" className="w-full">
                    Make an Offer
                  </Button>
                </div>

                <div className="pt-4 border-t border-ghxst-border space-y-2">
                  <div className="flex items-center gap-2 text-ghxst-text-secondary">
                    <Shield className="w-4 h-4" />
                    <Metadata className="text-caption">Buyer protection included</Metadata>
                  </div>
                  {item.instantDelivery && (
                    <div className="flex items-center gap-2 text-ghxst-text-secondary">
                      <Sparkles className="w-4 h-4" />
                      <Metadata className="text-caption">Instant delivery</Metadata>
                    </div>
                  )}
                </div>
              </div>

              {/* Seller Info */}
              <div className="card p-6 space-y-4">
                <SectionHeader className="uppercase text-ghxst-primary">Seller Information</SectionHeader>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-ghxst-surface" />
                  <div className="flex-1">
                    <CardTitle className="text-ghxst-primary">{item.seller.displayName}</CardTitle>
                    <Metadata className="text-ghxst-text-secondary">{item.seller.username}</Metadata>
                  </div>
                  {item.seller.verified && (
                    <Badge variant="success" className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Metadata className="text-ghxst-text-secondary">Rating</Metadata>
                    <div className="flex items-center gap-2">
                      <Rating rating={item.seller.rating} showCount={false} />
                      <Metadata className="text-ghxst-text-primary">
                        {item.seller.rating} ({item.seller.reviewCount})
                      </Metadata>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Metadata className="text-ghxst-text-secondary">Member Since</Metadata>
                    <Metadata className="text-ghxst-text-primary">{item.seller.memberSince}</Metadata>
                  </div>
                  <div className="flex items-center justify-between">
                    <Metadata className="text-ghxst-text-secondary">Completed Sales</Metadata>
                    <Metadata className="text-ghxst-text-primary">{item.seller.completedSales}</Metadata>
                  </div>
                  <div className="flex items-center justify-between">
                    <Metadata className="text-ghxst-text-secondary">Response Time</Metadata>
                    <Metadata className="text-ghxst-text-primary">{item.seller.responseTime}</Metadata>
                  </div>
                </div>

                <Button variant="secondary" size="sm" className="w-full">
                  View Seller Profile
                </Button>
              </div>

              {/* More from Seller */}
              {sellerListings.length > 0 && (
                <div className="card p-6 space-y-4">
                  <CardTitle className="text-ghxst-primary">More from this Seller</CardTitle>
                  <div className="space-y-3">
                    {sellerListings.map((listing, idx) => (
                      <div key={idx} className="pb-3 border-b border-ghxst-border last:border-0 last:pb-0">
                        <Metadata className="text-ghxst-text-primary mb-1">{listing.title}</Metadata>
                        <div className="flex items-center justify-between">
                          <Metadata className="text-ghxst-text-secondary text-caption">
                            {listing.type.toUpperCase()}
                          </Metadata>
                          <Metadata className="text-ghxst-text-primary">
                            ${listing.price}
                          </Metadata>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Report Listing */}
              <div className="card p-4 bg-ghxst-surface">
                <button className="flex items-center gap-2 text-ghxst-text-secondary hover:text-ghxst-accent transition-colors">
                  <AlertTriangle className="w-4 h-4" />
                  <Metadata className="text-caption">Report this listing</Metadata>
                </button>
              </div>
            </div>
          </div>

          {/* Similar Listings */}
          <div className="mt-16">
            <SectionHeader className="mb-6 uppercase text-ghxst-primary">Similar Listings</SectionHeader>
            <div className="grid md:grid-cols-3 gap-6">
              {similarListings.map((listing, idx) => (
                <div key={idx} className="card p-6 space-y-4">
                  <div className="h-32 bg-ghxst-surface rounded-lg" />
                  <div>
                    <CardTitle className="text-ghxst-primary mb-2">{listing.title}</CardTitle>
                    <Metadata className="text-ghxst-text-secondary text-caption mb-2">
                      {listing.type.toUpperCase()} • {listing.seller}
                    </Metadata>
                    <div className="flex items-center justify-between">
                      <span className="text-ghxst-primary">${listing.price}</span>
                      <Button variant="secondary" size="sm">View</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </GvtewayLayout>
  );
}
