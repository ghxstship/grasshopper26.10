/**
 * Press Kit Page - UI Rebuild
 */

import * as React from 'react';
import { Hero, H2, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';

export default function PressPage() {
  const resources = [
    { title: 'Brand Assets', description: 'Logos, colors, and brand guidelines', action: 'Download' },
    { title: 'Media Kit', description: 'Press releases and company information', action: 'Download' },
    { title: 'Screenshots', description: 'Product screenshots and images', action: 'Download' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Hero className="mb-12 text-center">PRESS KIT</Hero>
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <Body className="text-gray-700 text-lg">
            Download our press kit, brand assets, and media resources.
          </Body>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {resources.map((resource) => (
            <Card key={resource.title}>
              <CardHeader>
                <CardTitle>{resource.title}</CardTitle>
                <CardDescription>{resource.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button fullWidth>{resource.action}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
