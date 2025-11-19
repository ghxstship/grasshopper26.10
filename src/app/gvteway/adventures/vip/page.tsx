'use client';

import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { Crown } from 'lucide-react';
import { CardTitle, BodyText } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';



// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/adventures/vip

export default function VIPPage() {
  const experiences = [{ id: '1', title: 'VIP Backstage Pass', description: 'Exclusive access', price: 299 }];
  return (
    <ListPageTemplate title="VIP Experiences" description="Exclusive VIP access and packages">
      <div className="grid md:grid-cols-2 gap-6">
        {experiences.map((exp) => (
          <div key={exp.id} className="card p-6">
            <Crown className="w-8 h-8 text-ghxst-primary mb-4" />
            <CardTitle className="mb-2 text-ghxst-primary">{exp.title}</CardTitle>
            <BodyText className="text-ghxst-text-secondary mb-4">{exp.description}</BodyText>
            <div className="flex items-center justify-between">
              <span className="text-ghxst-primary">${exp.price}</span>
              <Button variant="primary" size="sm">Book Now</Button>
            </div>
          </div>
        ))}
      </div>
    </ListPageTemplate>
  );
}
