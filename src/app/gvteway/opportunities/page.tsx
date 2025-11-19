'use client';

import { GvtewayLayout } from "@/components/templates/GvtewayLayout";
import { PageTitle, SectionHeader, CardTitle, BodyText, Metadata } from "@/components/atoms/Typography";
import { CategoryTab } from "@/components/atoms/CategoryTab";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Heart, Users, Sparkles, Briefcase, Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const metadata = {
  title: 'Opportunities | GVTEWAY',
  description: 'Volunteer, collaborate, and create opportunities in the entertainment scene.',
  keywords: 'volunteer, opportunities, collaborate, freelance, events',
};

export default function OpportunitiesPage() {
  const opportunities = [
    {
      id: "1",
      type: "volunteer",
      title: "Festival Staff Needed",
      organization: "Sunset Music Festival",
      logo: "/api/placeholder/100/100",
      date: "Nov 25-26, 2025",
      location: "Curtis Hixon Park",
      roles: ["Stage Crew", "Hospitality", "Photography"],
      urgent: true,
      perks: ["Free festival pass", "Meals provided", "GVTEWAY reward points"],
      description: "Looking for 20 volunteers for stage crew, hospitality, and photographer roles.",
    },
    {
      id: "2",
      type: "freelance",
      title: "Sound Engineer",
      organization: "The Ritz Ybor",
      logo: "/api/placeholder/100/100",
      date: "Ongoing",
      location: "Ybor City",
      roles: ["Technical"],
      urgent: false,
      perks: ["Paid position", "Industry connections", "Flexible schedule"],
      description: "Experienced sound engineer needed for live shows. Must have own equipment.",
    },
    {
      id: "3",
      type: "create",
      title: "Host Your Event",
      organization: "GVTEWAY Platform",
      logo: "/api/placeholder/100/100",
      date: "Anytime",
      location: "Your Choice",
      roles: ["Creator"],
      urgent: false,
      perks: ["ATLVS platform access", "Marketing support", "Venue partnerships"],
      description: "Launch your own events with full platform support and resources.",
    },
  ];

  return (
    <GvtewayLayout>

      <section className="section-padding bg-ghxst-surface">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <PageTitle className="mb-4 uppercase text-ghxst-primary">Opportunities</PageTitle>
          <BodyText className="text-ghxst-text-secondary max-w-2xl mx-auto">
            Go from attendee to insider. Volunteer, collaborate, create, and shape the culture.
            Integrated with COMPVSS for professional opportunities.
          </BodyText>
        </div>
      </section>

      <section className="border-b-2 border-ghxst-border">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-wrap gap-4 py-4">
            <CategoryTab active>All Opportunities</CategoryTab>
            <CategoryTab icon={<Heart className="w-4 h-4" />}>Volunteer</CategoryTab>
            <CategoryTab icon={<Briefcase className="w-4 h-4" />}>Freelance</CategoryTab>
            <CategoryTab icon={<Sparkles className="w-4 h-4" />}>Create</CategoryTab>
            <CategoryTab icon={<Users className="w-4 h-4" />}>Mentorship</CategoryTab>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          <div className="space-y-6">
            {opportunities.map((opp) => (
              <Link 
                key={opp.id} 
                href={`/gvteway/opportunities/${opp.id}`}
                className="card bg-ghxst-white p-6 border-2 border-ghxst-border hover:border-ghxst-black transition-colors block"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-ghxst-surface">
                      <Image
                        src={opp.logo}
                        alt={opp.organization}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <CardTitle className="text-ghxst-primary">{opp.title}</CardTitle>
                          {opp.urgent && (
                            <Badge variant="error">URGENT</Badge>
                          )}
                          <Badge variant="default">{opp.type.toUpperCase()}</Badge>
                        </div>
                        <Metadata className="text-ghxst-text-secondary">
                          {opp.organization}
                        </Metadata>
                      </div>
                    </div>

                    <BodyText className="text-ghxst-text-secondary">
                      {opp.description}
                    </BodyText>

                    <div className="flex flex-wrap gap-4">
                      <Metadata className="flex items-center gap-2 text-ghxst-text-secondary">
                        <Calendar className="w-4 h-4" />
                        {opp.date}
                      </Metadata>
                      <Metadata className="flex items-center gap-2 text-ghxst-text-secondary">
                        <MapPin className="w-4 h-4" />
                        {opp.location}
                      </Metadata>
                    </div>

                    {/* Roles */}
                    <div className="flex flex-wrap gap-2">
                      {opp.roles.map((role, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-ghxst-surface text-ghxst-text-primary -tech-mono text-caption rounded-full"
                        >
                          {role}
                        </span>
                      ))}
                    </div>

                    {/* Perks */}
                    <div className="space-y-2">
                      <Metadata className="text-ghxst-text-secondary uppercase">
                        Perks:
                      </Metadata>
                      <div className="flex flex-wrap gap-2">
                        {opp.perks.map((perk, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-ghxst-accent" />
                            <Metadata className="text-ghxst-text-secondary">{perk}</Metadata>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <Button variant="primary" size="md">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-ghxst-surface">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-ghxst-black rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-ghxst-white" />
              </div>
              <CardTitle className="text-ghxst-primary">Volunteer</CardTitle>
              <BodyText className="text-ghxst-text-secondary">
                Work events you care about. Get free entry, meet artists, build experience.
              </BodyText>
              <Button variant="secondary" size="sm">
                See Positions
              </Button>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-ghxst-black rounded-full flex items-center justify-center mx-auto">
                <Briefcase className="w-8 h-8 text-ghxst-white" />
              </div>
              <CardTitle className="text-ghxst-primary">Collaborate</CardTitle>
              <BodyText className="text-ghxst-text-secondary">
                Join production teams as a freelance collaborator. Turn skills into paid gigs.
              </BodyText>
              <Button variant="secondary" size="sm">
                Join COMPVSS
              </Button>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-ghxst-black rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-ghxst-white" />
              </div>
              <CardTitle className="text-ghxst-primary">Create</CardTitle>
              <BodyText className="text-ghxst-text-secondary">
                Launch your own events. Access tools, resources, and community support.
              </BodyText>
              <Button variant="secondary" size="sm">
                Start Creating
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-ghxst-black text-ghxst-white">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <SectionHeader className="mb-4 uppercase">Impact Stats</SectionHeader>
          <div className="grid md:grid-cols-4 gap-8 mt-8">
            <div>
              <div className="mb-2">500+</div>
              <Metadata className="text-grey-400">Opportunities Posted</Metadata>
            </div>
            <div>
              <div className="mb-2">2,000+</div>
              <Metadata className="text-grey-400">Volunteer Hours</Metadata>
            </div>
            <div>
              <div className="mb-2">100+</div>
              <Metadata className="text-grey-400">Active Collaborators</Metadata>
            </div>
            <div>
              <div className="mb-2">50+</div>
              <Metadata className="text-grey-400">Member-Created Events</Metadata>
            </div>
          </div>
        </div>
      </section>

    </GvtewayLayout>
  );
}
