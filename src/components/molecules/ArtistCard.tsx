import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/atoms/Card";
import { CardTitle, Metadata } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { IntegrationBadge } from "@/components/atoms/IntegrationBadge";
import { Music } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ArtistCardProps {
  id: string;
  name: string;
  genre: string;
  image: string;
  followers?: number;
  upcomingShows?: number;
  slug: string;
  spotifyId?: string;
  className?: string;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({
  name,
  genre,
  image,
  followers,
  upcomingShows,
  slug,
  spotifyId,
  className,
}) => {
  return (
    <Card className={cn("overflow-hidden group", className)}>
      <Link href={`/music/artists/${slug}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105 rounded-full p-4"
          />
        </div>
        
        <div className="p-4 space-y-3">
          <CardTitle className="line-clamp-1 group-hover:text-gray-700 transition-colors text-center">
            {name}
          </CardTitle>
          
          <Metadata className="text-center text-gray-700 flex items-center justify-center gap-2">
            <Music className="w-4 h-4" />
            {genre}
          </Metadata>
          
          {spotifyId && (
            <div className="flex justify-center">
              <IntegrationBadge provider="spotify" size="sm" />
            </div>
          )}
          
          {followers && (
            <Metadata className="text-center text-gray-600">
              {followers.toLocaleString()} followers
            </Metadata>
          )}
          
          {upcomingShows && upcomingShows > 0 && (
            <Metadata className="text-center text-accent">
              {upcomingShows} upcoming {upcomingShows === 1 ? 'show' : 'shows'}
            </Metadata>
          )}
          
          <div className="flex gap-2">
            <Button variant="primary" size="sm" className="flex-1">
              Follow
            </Button>
            <Button variant="secondary" size="sm" className="flex-1">
              View Profile
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  );
};

ArtistCard.displayName = "ArtistCard";
