import * as React from "react";
import { cn } from "@/lib/utils";

interface IntegrationBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  provider: 'spotify' | 'shopify' | 'google';
  size?: 'sm' | 'md' | 'lg';
}

export const IntegrationBadge: React.FC<IntegrationBadgeProps> = ({ 
  provider, 
  size = 'md',
  className,
  ...props 
}) => {
  const sizeClasses = {
    sm: 'text-caption px-2 py-1',
    md: 'text-body-sm px-3 py-1.5',
    lg: 'text-body px-4 py-2',
  };

  const providerConfig = {
    spotify: {
      label: 'Powered by Spotify',
      color: 'bg-integration-spotify text-white',
    },
    shopify: {
      label: 'Powered by Shopify',
      color: 'bg-integration-shopify text-white',
    },
    google: {
      label: 'Powered by Google Places',
      color: 'bg-integration-google-bg text-integration-google-text border border-integration-google-border',
    },
  };

  const config = providerConfig[provider];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 font-share-tech-mono rounded-full",
        sizeClasses[size],
        config.color,
        className
      )}
      {...props}
    >
      <span>{config.label}</span>
    </div>
  );
};

IntegrationBadge.displayName = "IntegrationBadge";
