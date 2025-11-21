/**
 * Landing Page - UI Rebuild
 * Contemporary Minimal Pop Art - Monochromatic
 */

import * as React from 'react';
import Link from 'next/link';
import { Hero, H2, H3, Body, Display } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';

export default function LandingPage() {
  const features = [
    {
      title: 'Events',
      description: 'Discover and attend unforgettable experiences',
      icon: '🎫',
    },
    {
      title: 'Adventures',
      description: 'Book exclusive VIP experiences and tours',
      icon: '🗺️',
    },
    {
      title: 'Marketplace',
      description: 'Shop official merchandise and collectibles',
      icon: '🛍️',
    },
    {
      title: 'Memberships',
      description: 'Unlock premium benefits and early access',
      icon: '⭐',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Events' },
    { value: '500K+', label: 'Members' },
    { value: '50+', label: 'Cities' },
    { value: '1M+', label: 'Tickets Sold' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center space-y-8">
            <Hero className="text-black">
              EXPERIENCE
              <br />
              THE FUTURE
            </Hero>
            <Body className="max-w-2xl mx-auto text-gray-700 text-xl">
              The ultimate platform for discovering events, booking adventures, and connecting with experiences that matter.
            </Body>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/events">
                <Button size="xl">
                  Explore Events
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="secondary" size="xl">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Brutalist decorative element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-black transform translate-x-32 -translate-y-32 rotate-45 opacity-5" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black transform -translate-x-48 translate-y-48 rotate-12 opacity-5" />
      </section>

      {/* Stats Section */}
      <section className="border-b-4 border-black bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <Display as="div" className="text-5xl md:text-6xl mb-2">
                  {stat.value}
                </Display>
                <H3 className="text-gray-400">
                  {stat.label}
                </H3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <H2 className="mb-4">What We Offer</H2>
            <Body className="max-w-2xl mx-auto text-gray-600">
              Everything you need to discover, book, and experience the best events and adventures.
            </Body>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardHeader>
                  <div className="text-6xl mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-b-4 border-black bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <H2 className="mb-6">Ready to Get Started?</H2>
          <Body className="mb-8 text-gray-600">
            Join thousands of members experiencing the best events and adventures.
          </Body>
          <Link href="/auth/register">
            <Button size="xl">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
