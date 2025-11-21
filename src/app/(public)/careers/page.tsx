/**
 * Careers Page - UI Rebuild
 */

import * as React from 'react';
import { Hero, H2, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';

export default function CareersPage() {
  const positions = [
    { title: 'Senior Full Stack Engineer', department: 'Engineering', location: 'Remote' },
    { title: 'Product Designer', department: 'Design', location: 'Remote' },
    { title: 'DevOps Engineer', department: 'Engineering', location: 'Remote' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Hero className="mb-12 text-center">CAREERS</Hero>
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <Body className="text-gray-700 text-lg">
            Join our team and help revolutionize the event and production management industry.
          </Body>
        </div>
        <div className="space-y-6">
          {positions.map((position, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{position.title}</CardTitle>
                    <CardDescription>{position.department} • {position.location}</CardDescription>
                  </div>
                  <Button>Apply</Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
