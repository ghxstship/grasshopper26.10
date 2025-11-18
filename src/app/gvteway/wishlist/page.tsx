'use client';

import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { Heart, Calendar, MapPin, DollarSign, Plus } from 'lucide-react';
import Link from 'next/link';
import { CardTitle, BodyText, Metadata } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import Image from 'next/image';

export default function WishlistPage() {
  const wishlistItems = [
    {
      id: '1',
      type: 'event',
      title: 'Summer Music Festival 2025',
      venue: 'Curtis Hixon Park',
      date: 'June 15, 2025',
      priceMin: 45,
      priceMax: 125,
      image: '/api/placeholder/400/300',
      slug: 'summer-music-festival',
    },
  ];

  return (
    <ListPageTemplate
      title="My Wishlist"
      description="Save events and experiences you're interested in"
      categories={[
        { id: 'all', label: 'All Items' },
        { id: 'events', label: 'Events', icon: <Calendar className="w-4 h-4" /> },
        { id: 'adventures', label: 'Adventures', icon: <MapPin className="w-4 h-4" /> },
        { id: 'marketplace', label: 'Marketplace', icon: <DollarSign className="w-4 h-4" /> },
      ]}
      activeCategory="all"
      headerAction={{
        label: 'Browse Events',
        href: '/gvteway/events',
        icon: <Plus className="w-4 h-4 mr-2" />,
      }}
      isEmpty={wishlistItems.length === 0}
      emptyState={{
        icon: <Heart className="w-16 h-16 mx-auto" />,
        title: 'No Items Yet',
        description: 'Start adding events and experiences to your wishlist',
        action: {
          label: 'Browse Events',
          href: '/gvteway/events',
        },
      }}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="card overflow-hidden group">
            <div className="relative h-48">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button className="absolute top-3 right-3 p-2 bg-ghxst-white rounded-full hover:bg-destructive/10 transition-colors">
                <Heart className="w-5 h-5 text-destructive fill-red-500" />
              </button>
              <Badge variant="default" className="absolute top-3 left-3">
                Event
              </Badge>
            </div>
            <div className="p-6">
              <CardTitle className="mb-2 text-ghxst-primary line-clamp-2">
                {item.title}
              </CardTitle>
              <div className="space-y-2 mb-4">
                <Metadata className="flex items-center gap-2 text-ghxst-text-secondary">
                  <Calendar className="w-4 h-4" />
                  {item.date}
                </Metadata>
                <Metadata className="flex items-center gap-2 text-ghxst-text-secondary">
                  <MapPin className="w-4 h-4" />
                  {item.venue}
                </Metadata>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-ghxst-border">
                <BodyText className="text-ghxst-primary">
                  ${item.priceMin} - ${item.priceMax}
                </BodyText>
                <Link href={`/gvteway/events/${item.slug}`}>
                  <Button variant="primary" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ListPageTemplate>
  );
}
