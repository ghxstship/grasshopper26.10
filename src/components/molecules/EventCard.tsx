import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/atoms/Card";
import { CardTitle, Metadata } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { PriceTag } from "@/components/atoms/PriceTag";
import { SocialProof } from "@/components/atoms/SocialProof";
import { Calendar, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface EventCardProps {
  id: string;
  title: string;
  venue: string;
  date: string;
  time: string;
  image: string;
  priceMin?: number;
  priceMax?: number;
  attendeeCount?: number;
  slug: string;
  className?: string;
}

export const EventCard: React.FC<EventCardProps> = ({
  id: _id,
  title,
  venue,
  date,
  time,
  image,
  priceMin,
  priceMax,
  attendeeCount,
  slug,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden group", className)}>
      <Link href={`/events/${slug}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-grey-100">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
        
        <div className="p-4 space-y-3">
          <CardTitle className="line-clamp-2 group-hover:text-grey-700 transition-colors">
            {title}
          </CardTitle>
          
          <div className="space-y-2">
            <Metadata className="flex items-center gap-2 text-grey-700">
              <MapPin className="w-4 h-4" />
              {venue}
            </Metadata>
            
            <Metadata className="flex items-center gap-2 text-grey-700">
              <Calendar className="w-4 h-4" />
              {date}
            </Metadata>
            
            <Metadata className="flex items-center gap-2 text-grey-700">
              <Clock className="w-4 h-4" />
              {time}
            </Metadata>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            {priceMin && (
              <PriceTag 
                amount={priceMin} 
                maxAmount={priceMax}
                range={!!priceMax}
              />
            )}
            
            {attendeeCount && attendeeCount > 0 && (
              <SocialProof count={attendeeCount} />
            )}
          </div>
          
          <Button variant="primary" size="md" className="w-full">
            Get Tickets
          </Button>
        </div>
      </Link>
    </Card>
  );
};

EventCard.displayName = "EventCard";
