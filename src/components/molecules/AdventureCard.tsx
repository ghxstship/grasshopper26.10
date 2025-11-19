import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/atoms/Card";
import { CardTitle, Metadata, BodyText } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { PriceTag } from "@/components/atoms/PriceTag";
import { Clock, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AdventureCardProps {
  id: string;
  name: string;
  category: 'poi' | 'tour' | 'outdoor' | 'cultural' | 'food' | 'nightlife';
  image: string;
  description: string;
  duration?: string;
  price?: number;
  slug: string;
  className?: string;
}

export const AdventureCard: React.FC<AdventureCardProps> = ({
  name,
  category,
  image,
  description,
  duration,
  price,
  slug,
  className,
}) => {
  const categoryLabels = {
    poi: 'Point of Interest',
    tour: 'Guided Tour',
    outdoor: 'Outdoor Activity',
    cultural: 'Cultural Experience',
    food: 'Food & Drink',
    nightlife: 'Nightlife',
  };

  return (
    <Card className={cn("overflow-hidden group", className)}>
      <Link href={`/adventures/${slug}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-grey-100">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        
        <div className="p-4 space-y-3">
          <CardTitle className="line-clamp-2 group-hover:text-grey-700 transition-colors">
            {name}
          </CardTitle>
          
          <Metadata className="text-grey-700">
            {categoryLabels[category]}
          </Metadata>
          
          <BodyText className="text-body-sm text-grey-600 line-clamp-3">
            {description}
          </BodyText>
          
          <div className="flex items-center justify-between">
            {duration && (
              <Metadata className="flex items-center gap-2 text-grey-700">
                <Clock className="w-4 h-4" />
                {duration}
              </Metadata>
            )}
            
            {price && <PriceTag amount={price} />}
          </div>
          
          <div className="flex gap-2">
            <Button variant="primary" size="sm" className="flex-1">
              Book Now
            </Button>
            <Button variant="secondary" size="sm" className="aspect-square p-0">
              <Bookmark className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  );
};

AdventureCard.displayName = "AdventureCard";
