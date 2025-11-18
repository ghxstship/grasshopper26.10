'use client';

import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { Compass } from 'lucide-react';
import { CardTitle, BodyText } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';



export default function ToursPage() {
  const tours = [{ id: '1', title: 'City Tour', description: 'Explore the city', price: 79 }];
  return (
    <ListPageTemplate title="Tours" description="Guided tours and experiences">
      <div className="grid md:grid-cols-2 gap-6">
        {tours.map((tour) => (
          <div key={tour.id} className="card p-6">
            <Compass className="w-8 h-8 text-ghxst-primary mb-4" />
            <CardTitle className="mb-2 text-ghxst-primary">{tour.title}</CardTitle>
            <BodyText className="text-ghxst-text-secondary mb-4">{tour.description}</BodyText>
            <div className="flex items-center justify-between">
              <span className="text-h4 font-anton text-ghxst-primary">${tour.price}</span>
              <Button variant="primary" size="sm">Book Now</Button>
            </div>
          </div>
        ))}
      </div>
    </ListPageTemplate>
  );
}
