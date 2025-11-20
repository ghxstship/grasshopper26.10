import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/atoms/Card";
import { CardTitle, Metadata, BodyTextSmall } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { IntegrationBadge } from "@/components/atoms/IntegrationBadge";
import { Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ShopCardProps {
  id: string;
  name: string;
  type: 'artist' | 'venue' | 'label' | 'brand';
  logo: string;
  description?: string;
  featuredProducts?: string[];
  slug: string;
  shopifyStoreId?: string;
  className?: string;
}

export const ShopCard: React.FC<ShopCardProps> = ({
  name,
  type,
  logo,
  description,
  featuredProducts = [],
  slug,
  shopifyStoreId,
  className,
}) => {
  const typeLabels = {
    artist: 'Artist Store',
    venue: 'Venue Merch',
    label: 'Record Label',
    brand: 'Local Brand',
  };

  return (
    <Card className={cn("overflow-hidden group", className)}>
      <Link href={`/shops/${slug}`}>
        <div className="relative aspect-square overflow-hidden bg-grey-100 flex items-center justify-center p-8">
          <Image
            src={logo}
            alt={name}
            width={200}
            height={200}
            className="object-contain transition-transform group-hover:scale-105"
          />
        </div>
        
        <div className="p-4 space-y-3">
          <CardTitle className="line-clamp-1 group-hover:text-grey-700 transition-colors">
            {name}
          </CardTitle>
          
          <Metadata className="text-grey-700 flex items-center gap-2">
            <Store className="w-4 h-4" />
            {typeLabels[type]}
          </Metadata>
          
          {description && (
            <BodyTextSmall className="-tech text-grey-600 line-clamp-2">
              {description}
            </BodyTextSmall>
          )}
          
          {featuredProducts.length > 0 && (
            <div className="flex gap-2 overflow-hidden">
              {featuredProducts.slice(0, 3).map((product, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded border border-grey-200">
                  <Image
                    src={product}
                    alt="Product"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          
          {shopifyStoreId && (
            <IntegrationBadge provider="shopify" size="sm" />
          )}
          
          <Button variant="primary" size="md" className="w-full">
            Shop Now
          </Button>
        </div>
      </Link>
    </Card>
  );
};

ShopCard.displayName = "ShopCard";
