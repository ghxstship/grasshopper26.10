import * as React from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number;
  maxRating?: number;
  reviewCount?: number;
  showCount?: boolean;
}

export const Rating: React.FC<RatingProps> = ({ 
  rating, 
  maxRating: _maxRating = 5,
  reviewCount,
  showCount = true,
  className,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 font-share-tech-mono text-body-sm",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-warning text-warning" />
        <span className="font-semibold">{rating.toFixed(1)}</span>
      </div>
      {showCount && reviewCount && (
        <span className="text-grey-600">({reviewCount})</span>
      )}
    </div>
  );
};

Rating.displayName = "Rating";
