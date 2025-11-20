'use client';

import { HeroSection } from "@/components/organisms/HeroSection";
import { JourneyStep } from "@/components/organisms/JourneyStep";
import { BodyText, CardTitle, PageTitle, SectionHeader } from "@/components/atoms/Typography";
import { EventCard } from "@/components/molecules/EventCard";
import { ArtistCard } from "@/components/molecules/ArtistCard";
import { CategoryTab } from "@/components/atoms/CategoryTab";
import { Button } from "@/components/atoms/Button";
import { Card } from "@/components/atoms/Card";
import { GvtewayLayout } from "@/components/templates/GvtewayLayout";
import { 
  Calendar, Music, ShoppingBag, MapPin, Compass, 
  Users, TrendingUp, Heart, Sparkles 
} from "lucide-react";

const _metadata = {
  title: "GVTEWAY | Community First Experiences • Experience First Communities",
  description: "Community First Experiences • Experience First Communities. Join 5,000+ members discovering and experiencing the best events. Membership-based access to concerts, festivals, and exclusive experiences.",
  keywords: "tickets, events, concerts, festivals, membership, community",
};

export default function LandingPage() {
  // Demo data - replace with actual API calls
  const demoEvents = [
    {
      id: "1",
      title: "Summer Music Festival 2025",
      venue: "Curtis Hixon Waterfront Park",
      date: "June 15, 2025",
      time: "6:00 PM",
      image: "/api/placeholder/400/300",
      priceMin: 45,
      priceMax: 125,
      attendeeCount: 234,
      slug: "summer-music-festival-2025",
    },
  ];

  const demoArtists = [
    {
      id: "1",
      name: "The Midnight Collective",
      genre: "Electronic • House",
      image: "/api/placeholder/400/400",
      followers: 50000,
      upcomingShows: 3,
      slug: "the-midnight-collective",
      spotifyId: "abc123",
    },
  ];

  return (
    <GvtewayLayout>
      
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Content Carousel */}
      <section className="section-padding bg-ghxst-surface">
        <div className="max-w-7xl mx-auto px-8">
          <SectionHeader className="mb-4 uppercase text-ghxst-primary">Happening Now</SectionHeader>
          <BodyText className="text-ghxst-text-secondary mb-8">
            Curated picks across events, music, brands, and experiences
          </BodyText>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-4 mb-8">
            <CategoryTab active icon={<Calendar className="w-4 h-4" />}>
              All
            </CategoryTab>
            <CategoryTab icon={<Calendar className="w-4 h-4" />}>
              Events
            </CategoryTab>
            <CategoryTab icon={<Music className="w-4 h-4" />}>
              Music
            </CategoryTab>
            <CategoryTab icon={<ShoppingBag className="w-4 h-4" />}>
              Brands
            </CategoryTab>
            <CategoryTab icon={<MapPin className="w-4 h-4" />}>
              Destinations
            </CategoryTab>
            <CategoryTab icon={<Compass className="w-4 h-4" />}>
              Adventures
            </CategoryTab>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {demoEvents.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
            {demoArtists.map((artist) => (
              <ArtistCard key={artist.id} {...artist} />
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <Button variant="primary" size="lg">
              Browse Events
            </Button>
            <Button variant="secondary" size="lg">
              Explore Music
            </Button>
          </div>
        </div>
      </section>

      {/* 5-Step Journey */}
      <section className="bg-ghxst-white">
        <div className="max-w-7xl mx-auto px-8 py-16 text-center">
          <PageTitle className="mb-4 uppercase text-ghxst-primary">How GVTEWAY Works</PageTitle>
          <BodyText className="text-ghxst-text-secondary max-w-2xl mx-auto">
            Five steps to becoming part of the premier live entertainment community
          </BodyText>
        </div>

        {/* Step 01: JOIN */}
        <JourneyStep
          step={1}
          title="Join The Community"
          description="GVTEWAY membership is your all-access pass to the entertainment ecosystem. Discover events, explore music, shop exclusive drops, and plan unforgettable experiences—all in one membership."
          image="/api/placeholder/600/400"
          imagePosition="left"
          features={[
            {
              icon: <Sparkles className="w-5 h-5" />,
              title: "Early Access",
              description: "Get first dibs on tickets, drops, and reservations",
            },
            {
              icon: <TrendingUp className="w-5 h-5" />,
              title: "Member Pricing",
              description: "Exclusive discounts across events, brands, experiences",
            },
            {
              icon: <Users className="w-5 h-5" />,
              title: "Priority Entry",
              description: "Skip lines with dedicated member entrance",
            },
            {
              icon: <Heart className="w-5 h-5" />,
              title: "Exclusive Events",
              description: "Access member-only shows and secret experiences",
            },
          ]}
          stats="30-day money-back guarantee • Cancel anytime"
          ctaText="Explore All Membership Benefits"
          ctaLink="/membership"
        />

        {/* Step 02: DISCOVER */}
        <JourneyStep
          step={2}
          title="Discover Your World"
          description="One powerful search, infinite possibilities. Find events, discover artists, explore brands, plan trips, and book adventures—all personalized to your taste."
          image="/api/placeholder/600/400"
          imagePosition="right"
          features={[
            {
              icon: <Calendar className="w-5 h-5" />,
              title: "Unified Search",
              description: "Search across all categories from one place",
            },
            {
              icon: <Music className="w-5 h-5" />,
              title: "Smart Filters",
              description: "Date, genre, price, distance, vibe, interests",
            },
            {
              icon: <Sparkles className="w-5 h-5" />,
              title: "AI Recommendations",
              description: "Spotify-powered suggestions & preferences",
            },
          ]}
          ctaText="See Discovery Features"
          ctaLink="/discover"
        />

        {/* Step 03: CONNECT */}
        <JourneyStep
          step={3}
          title="Connect With Your People"
          description="Events are better with friends. Build your crew, discover what others are attending, shop together, and make new connections through shared experiences."
          image="/api/placeholder/600/400"
          imagePosition="left"
          features={[
            {
              icon: <Users className="w-5 h-5" />,
              title: "Find Your Crew",
              description: "Follow friends, see their plans, get alerted",
            },
            {
              icon: <Heart className="w-5 h-5" />,
              title: "Group Planning",
              description: "Create squads, split payments, coordinate",
            },
          ]}
          stats="5,000+ Active Members • 15,000+ Connections Made • 2,000+ Group Outings This Month"
          ctaText="Explore Community Features"
          ctaLink="/community"
        />

        {/* Step 04: EXPERIENCE */}
        <JourneyStep
          step={4}
          title="Experience Everything"
          description="Your ticket is just the beginning. Shop exclusive merch, book nearby stays, discover local spots, and plan adventures that transform events into journeys."
          image="/api/placeholder/600/400"
          imagePosition="right"
          features={[
            {
              icon: <ShoppingBag className="w-5 h-5" />,
              title: "Brands",
              description: "Venues, labels, artist brands, communities & stores",
            },
            {
              icon: <MapPin className="w-5 h-5" />,
              title: "Destinations",
              description: "Nearby stays, dining, shopping, wellness spots",
            },
            {
              icon: <Compass className="w-5 h-5" />,
              title: "Adventures",
              description: "Excursions, tours, points of interest",
            },
          ]}
          ctaText="Explore Brands"
          ctaLink="/brands"
        />

        {/* Step 05: IMPACT */}
        <JourneyStep
          step={5}
          title="Make An Impact"
          description="Go from attendee to insider. GVTEWAY opens doors to participate in the events you love—volunteer, collaborate, create, and shape culture."
          image="/api/placeholder/600/400"
          imagePosition="left"
          features={[
            {
              icon: <Heart className="w-5 h-5" />,
              title: "Volunteer",
              description: "Work events you care about. Get free entry, meet artists, build experience",
            },
            {
              icon: <Users className="w-5 h-5" />,
              title: "Collaborate",
              description: "Join production teams as a freelance collaborator",
            },
            {
              icon: <Sparkles className="w-5 h-5" />,
              title: "Create",
              description: "Launch your own events and experiences",
            },
          ]}
          stats="500+ Opportunities Posted • 2,000+ Volunteer Hours • 100+ Active Collaborators"
          ctaText="Explore All Opportunities"
          ctaLink="/opportunities"
        />
      </section>

      {/* Community Hub Preview */}
      <section className="section-padding bg-ghxst-black text-ghxst-white">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <PageTitle className="mb-4 uppercase">The GVTEWAY Community</PageTitle>
          <BodyText className="text-grey-300 max-w-2xl mx-auto mb-12">
            More than tickets. More than brands. More than trips. A thriving community of creators, collaborators, and culture enthusiasts.
          </BodyText>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card variant="default" className="bg-grey-900 border-grey-800 text-white p-8 space-y-4">
              <Users className="w-12 h-12 mx-auto" />
              <CardTitle className="text-center">Social Feed</CardTitle>
              <BodyText className="-tech text-body-sm text-grey-400 text-center">
                Connect with members, share experiences, reviews, finds
              </BodyText>
              <div className="flex justify-center">
                <Button variant="secondary" size="sm">
                  Explore Feed
                </Button>
              </div>
            </Card>

            <Card variant="default" className="bg-grey-900 border-grey-800 text-white p-8 space-y-4">
              <ShoppingBag className="w-12 h-12 mx-auto" />
              <CardTitle className="text-center">Marketplace</CardTitle>
              <BodyText className="-tech text-body-sm text-grey-400 text-center">
                Buy, sell, and trade tickets, merch, and exclusive items
              </BodyText>
              <div className="flex justify-center">
                <Button variant="secondary" size="sm">
                  Browse Market
                </Button>
              </div>
            </Card>

            <Card variant="default" className="bg-grey-900 border-grey-800 text-white p-8 space-y-4">
              <Sparkles className="w-12 h-12 mx-auto" />
              <CardTitle className="text-center">Opportunities</CardTitle>
              <BodyText className="-tech text-body-sm text-grey-400 text-center">
                Volunteer, collaborate, and create opportunities
              </BodyText>
              <div className="flex justify-center">
                <Button variant="secondary" size="sm">
                  Get Involved
                </Button>
              </div>
            </Card>
          </div>

          <BodyText className="-tech-mono text-body-sm text-grey-400 mb-8">
            5,000+ Active Members • 15,000+ Connections • 2,000+ Monthly Transactions • 500+ Open Opportunities
          </BodyText>

          <Button variant="primary" size="lg">
            Join the Community
          </Button>
        </div>
      </section>

    </GvtewayLayout>
  );
}
