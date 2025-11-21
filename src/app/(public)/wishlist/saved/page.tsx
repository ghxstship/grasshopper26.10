'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function SavedWishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/wishlist')
      .then(res => res.json())
      .then(data => {
        setWishlist(data.data?.wishlist || []);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Saved Events</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {isLoading ? (
          <p>Loading wishlist...</p>
        ) : wishlist.length === 0 ? (
          <Card variant="gvteway">
            <CardContent>
              <p>No saved events yet</p>
            </CardContent>
          </Card>
        ) : (
          wishlist.map((item) => (
            <Card key={item.id} variant="gvteway">
              <CardHeader>
                <CardTitle>{item.event?.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{item.event?.venue?.name}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
