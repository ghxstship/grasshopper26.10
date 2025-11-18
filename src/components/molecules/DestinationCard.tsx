import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/atoms/Card";
import { CardTitle, Metadata } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { Rating } from "@/components/atoms/Rating";
import { IntegrationBadge } from "@/components/atoms/IntegrationBadge";
import { MapPin, DollarSign, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface DestinationCardProps {
  id: string;
  name: string;
  category: 'stay' | 'dining' | 'shopping' | 'wellness';
  image: string;
  address: string;
  distance?: string;
  priceLevel?: number;
  rating?: number;
  reviewCount?: number;
  slug: string;
  googlePlaceId?: string;
  className?: string;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  name,
  category,
  image,
  address,
  distance,
  priceLevel,
  rating,
  reviewCount,
  slug,
  googlePlaceId,
  className,
}) => {
  const categoryLabels = {
    stay: 'Accommodation',
    dining: 'Restaurant',
    shopping: 'Shopping',
    wellness: 'Wellness',
  };

  const renderPriceLevel = (level?: number) => {
    if (!level) return null;
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: level }).map((_, i) => (
          <DollarSign key={i} className="w-3 h-3" />
        ))}
      </div>
    );
  };

  return (
    <Card className={cn("overflow-hidden group", className)}>
      <Link href={`/destinations/${slug}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        
        <div className="p-4 space-y-3">
          <CardTitle className="line-clamp-2 group-hover:text-gray-700 transition-colors">
            {name}
          </CardTitle>
          
          <div className="space-y-2">
            <Metadata className="text-gray-700">
              {categoryLabels[category]}
            </Metadata>
            
            {distance && (
              <Metadata className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4" />
                {distance} from venue
              </Metadata>
            )}
            
            <div className="flex items-center gap-3">
              {priceLevel && renderPriceLevel(priceLevel)}
              {rating && (
                <Rating rating={rating} reviewCount={reviewCount} />
              )}
            </div>
          </div>
          
          {googlePlaceId && (
            <IntegrationBadge provider="google" size="sm" />
          )}
          
          <div className="flex gap-2">
            <Button variant="primary" size="sm" className="flex-1">
              View Details
            </Button>
            <Button variant="secondary" size="sm" className="aspect-square p-0">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  );
};

DestinationCard.displayName = "DestinationCard";
