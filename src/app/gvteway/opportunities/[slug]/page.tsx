'use client';

import { GvtewayLayout } from "@/components/templates/GvtewayLayout";
import { HeroTitle, SectionHeader, CardTitle, BodyText, Metadata } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Heart, Briefcase, Calendar, MapPin, Clock, DollarSign, Share2 } from "lucide-react";
import Image from "next/image";

interface OpportunityPageProps {
  params: {
    slug: string;
  };
}

async function generateMetadata({ params: _params }: OpportunityPageProps) {
  return {
    title: `Opportunity Name | GVTEWAY Opportunities`,
    description: `Apply for this opportunity - volunteer, collaborate, or create with GVTEWAY.`,
  };
}

export default function OpportunityPage({ params: { slug: _slug } }: OpportunityPageProps) {
  // Demo data - replace with actual API call using slug
  // This would integrate with COMPVSS listings (RFPs, Careers, Sponsorship, Staffing)
  const opportunity = {
    id: "1",
    type: "volunteer", // volunteer, freelance, rfp, career, sponsorship, staffing
    title: "Festival Staff Needed - Summer Music Festival",
    organization: "Sunset Music Festival",
    organizationType: "Event Producer",
    logo: "/api/placeholder/200/200",
    coverImage: "/api/placeholder/1200/400",
    location: "Curtis Hixon Park, FL",
    date: "Nov 25-26, 2025",
    compensation: "Free festival pass + meals + GVTEWAY points",
    timeCommitment: "2 days, 8 hours per day",
    urgent: true,
    postedDate: "Nov 1, 2025",
    deadline: "Nov 20, 2025",
    applicants: 45,
    spotsAvailable: 20,
    description: `We're looking for 20 enthusiastic volunteers to help make our Summer Music Festival a success! This is a great opportunity to be part of the biggest music event while gaining valuable experience in event production.

As a festival volunteer, you'll work alongside our professional team and get an insider's view of how large-scale events are produced. Perfect for students, aspiring event professionals, or anyone who loves live music and wants to give back to the community.`,
    
    roles: [
      {
        title: "Stage Crew",
        count: 8,
        description: "Assist with stage setup, artist load-in, and equipment management",
      },
      {
        title: "Hospitality",
        count: 6,
        description: "Support artist green rooms, coordinate catering, and ensure artist comfort",
      },
      {
        title: "Photography",
        count: 4,
        description: "Capture event moments, artist performances, and crowd energy",
      },
      {
        title: "Guest Services",
        count: 2,
        description: "Help attendees with questions, directions, and general assistance",
      },
    ],
    
    requirements: [
      "18 years or older",
      "Available for full event duration (both days)",
      "Reliable and punctual",
      "Positive attitude and team player",
      "Previous event experience preferred but not required",
    ],
    
    perks: [
      "Free festival pass (2-day value: $125)",
      "All meals provided during shifts",
      "Official festival crew t-shirt",
      "500 GVTEWAY reward points",
      "Certificate of completion",
      "Networking with industry professionals",
      "Behind-the-scenes access",
      "Reference letter upon request",
    ],
    
    schedule: [
      { day: "Day 1 - Nov 25", time: "8:00 AM - 6:00 PM", tasks: "Setup, soundcheck, early performances" },
      { day: "Day 2 - Nov 26", time: "10:00 AM - 8:00 PM", tasks: "Main performances, breakdown" },
    ],
    
    compvssIntegration: {
      listingId: "compvss-rfp-12345",
      category: "Staffing",
      budget: null, // For paid opportunities
      contractType: "Volunteer",
    },
  };

  const relatedOpportunities = [
    { title: "Sound Engineer Needed", type: "freelance", organization: "The Ritz Ybor" },
    { title: "Marketing Coordinator", type: "career", organization: "Events Co" },
  ];

  return (
    <GvtewayLayout>

      {/* Cover Image */}
      <section className="relative h-[400px]">
        <Image
          src={opportunity.coverImage}
          alt={opportunity.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ghxst-black/80 to-transparent" />
      </section>

      {/* Opportunity Header */}
      <section className="section-padding">
        <div className="container mx-auto p-8">
          <div className="grid lg:grid-cols-[2fr_1fr] gap-12">
            {/* Main Content */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <Badge variant="default">{opportunity.type.toUpperCase()}</Badge>
                      {opportunity.urgent && <Badge variant="error">URGENT</Badge>}
                      <Metadata className="text-ghxst-text-secondary">
                        Posted {opportunity.postedDate}
                      </Metadata>
                    </div>
                    
                    <HeroTitle className="mb-3 text-ghxst-primary">{opportunity.title}</HeroTitle>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-ghxst-surface">
                        <Image
                          src={opportunity.logo}
                          alt={opportunity.organization}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-ghxst-primary">{opportunity.organization}</CardTitle>
                        <Metadata className="text-ghxst-text-secondary">{opportunity.organizationType}</Metadata>
                      </div>
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

                {/* Quick Info */}
                <div className="grid md:grid-cols-2 gap-4 p-6 bg-ghxst-surface rounded-lg">
                  <Metadata className="flex items-center gap-3 text-ghxst-text-secondary">
                    <MapPin className="w-5 h-5" />
                    {opportunity.location}
                  </Metadata>
                  <Metadata className="flex items-center gap-3 text-ghxst-text-secondary">
                    <Calendar className="w-5 h-5" />
                    {opportunity.date}
                  </Metadata>
                  <Metadata className="flex items-center gap-3 text-ghxst-text-secondary">
                    <Clock className="w-5 h-5" />
                    {opportunity.timeCommitment}
                  </Metadata>
                  <Metadata className="flex items-center gap-3 text-ghxst-text-secondary">
                    <DollarSign className="w-5 h-5" />
                    {opportunity.compensation}
                  </Metadata>
                </div>
              </div>

              {/* Description */}
              <div>
                <SectionHeader className="mb-4 uppercase text-ghxst-primary">About This Opportunity</SectionHeader>
                <BodyText className="text-ghxst-text-secondary whitespace-pre-line">
                  {opportunity.description}
                </BodyText>
              </div>

              {/* Roles Available */}
              <div>
                <SectionHeader className="mb-4 uppercase text-ghxst-primary">Roles Available</SectionHeader>
                <div className="space-y-4">
                  {opportunity.roles.map((role, idx) => (
                    <div key={idx} className="card p-6">
                      <div className="flex items-start justify-between mb-3">
                        <CardTitle className="text-ghxst-primary">{role.title}</CardTitle>
                        <Badge variant="default">{role.count} spots</Badge>
                      </div>
                      <BodyText className="text-ghxst-text-secondary">{role.description}</BodyText>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <SectionHeader className="mb-4 uppercase text-ghxst-primary">Requirements</SectionHeader>
                <div className="space-y-2">
                  {opportunity.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-ghxst-accent mt-2 flex-shrink-0" />
                      <BodyText className="text-ghxst-text-secondary">{req}</BodyText>
                    </div>
                  ))}
                </div>
              </div>

              {/* Perks & Benefits */}
              <div>
                <SectionHeader className="mb-4 uppercase text-ghxst-primary">Perks & Benefits</SectionHeader>
                <div className="grid md:grid-cols-2 gap-3">
                  {opportunity.perks.map((perk, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-ghxst-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-ghxst-white text-caption">✓</span>
                      </div>
                      <BodyText className="text-ghxst-text-secondary">{perk}</BodyText>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div>
                <SectionHeader className="mb-4 uppercase text-ghxst-primary">Schedule</SectionHeader>
                <div className="space-y-3">
                  {opportunity.schedule.map((item, idx) => (
                    <div key={idx} className="card p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-ghxst-primary mb-1">{item.day}</CardTitle>
                          <Metadata className="text-ghxst-text-secondary">{item.time}</Metadata>
                        </div>
                        <BodyText className="text-ghxst-text-secondary text-body-sm">{item.tasks}</BodyText>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* COMPVSS Integration Note */}
              <div className="card p-6 bg-ghxst-surface">
                <div className="flex items-start gap-4">
                  <Briefcase className="w-6 h-6 text-ghxst-accent flex-shrink-0" />
                  <div>
                    <CardTitle className="text-ghxst-primary mb-2">Professional Opportunity</CardTitle>
                    <BodyText className="text-ghxst-text-secondary text-body-sm">
                      This listing is integrated with COMPVSS. Applications are reviewed by verified event professionals.
                      Category: {opportunity.compvssIntegration.category} • Type: {opportunity.compvssIntegration.contractType}
                    </BodyText>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Application Card */}
              <div className="card p-6 space-y-4 sticky top-24">
                <SectionHeader className="uppercase text-ghxst-primary">Apply Now</SectionHeader>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Metadata className="text-ghxst-text-secondary">Deadline</Metadata>
                    <Metadata className="text-ghxst-text-primary">{opportunity.deadline}</Metadata>
                  </div>

                  <div className="flex items-center justify-between">
                    <Metadata className="text-ghxst-text-secondary">Applicants</Metadata>
                    <Metadata className="text-ghxst-text-primary">
                      {opportunity.applicants} applied
                    </Metadata>
                  </div>

                  <div className="flex items-center justify-between">
                    <Metadata className="text-ghxst-text-secondary">Spots Available</Metadata>
                    <Metadata className="text-ghxst-text-primary">
                      {opportunity.spotsAvailable} remaining
                    </Metadata>
                  </div>

                  <div className="pt-4 border-t border-ghxst-border space-y-3">
                    <Button variant="primary" size="lg" className="w-full">
                      Apply Now
                    </Button>
                    <Button variant="secondary" size="md" className="w-full">
                      Save for Later
                    </Button>
                  </div>

                  <Metadata className="text-ghxst-text-secondary text-caption text-center">
                    Applications reviewed within 48 hours
                  </Metadata>
                </div>
              </div>

              {/* Organization Info */}
              <div className="card p-6 space-y-4">
                <CardTitle className="text-ghxst-primary">About {opportunity.organization}</CardTitle>
                <BodyText className="text-ghxst-text-secondary text-body-sm">
                  Sunset Music Festival is the premier electronic music event, bringing world-class artists to the waterfront since 2015.
                </BodyText>
                <Button variant="secondary" size="sm" className="w-full">
                  View All Opportunities
                </Button>
              </div>

              {/* Related Opportunities */}
              <div className="card p-6 space-y-4">
                <CardTitle className="text-ghxst-primary">Similar Opportunities</CardTitle>
                <div className="space-y-3">
                  {relatedOpportunities.map((opp, idx) => (
                    <div key={idx} className="pb-3 border-b border-ghxst-border last:border-0 last:pb-0">
                      <Metadata className="text-ghxst-text-primary mb-1">{opp.title}</Metadata>
                      <Metadata className="text-ghxst-text-secondary text-caption">
                        {opp.type.toUpperCase()} • {opp.organization}
                      </Metadata>
                    </div>
                  ))}
                </div>
                <Button variant="secondary" size="sm" className="w-full">
                  View All
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </GvtewayLayout>
  );
}
