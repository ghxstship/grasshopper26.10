import * as React from "react";
import { cn } from "@/lib/utils";

interface PriceTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  amount: number | string;
  currency?: string;
  range?: boolean;
  maxAmount?: number | string;
}

export const PriceTag: React.FC<PriceTagProps> = ({ 
  amount, 
  currency = '$',
  range = false,
  maxAmount,
  className,
  ...props 
}) => {
  const formatPrice = (price: number | string) => {
    if (typeof price === 'number') {
      return price.toFixed(2);
    }
    return price;
  };

  return (
    <span
      className={cn(
        "font-share-tech-mono text-body",
        className
      )}
      {...props}
    >
      {currency}{formatPrice(amount)}
      {range && maxAmount && ` - ${currency}${formatPrice(maxAmount)}`}
    </span>
  );
};

PriceTag.displayName = "PriceTag";
