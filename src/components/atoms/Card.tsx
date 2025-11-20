import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "gvteway" | "compvss" | "atlvs" | "glass";
    brutalist?: boolean; // Enable neobrutalist styling
  }
>(({ className, variant = "default", brutalist = true, ...props }, ref) => {
  // Platform variants
  const variantStyles = {
    default: "bg-white border-black dark:bg-grey-900 dark:border-white",
    gvteway: "bg-white border-black hover:border-gvteway-red-500",
    compvss: "bg-white border-black hover:border-compvss-cyan-500",
    atlvs: "bg-white border-black hover:border-atlvs-green-500",
    glass: "glass border-black/30",
  };

  return (
    <div
      ref={ref}
      className={cn(
        // Neobrutalist: sharp edges, bold borders, flat design
        brutalist ? "rounded-none border-3" : "rounded-2xl border-2",
        brutalist ? "shadow-none" : "shadow-lg",
        "p-6 transition-all",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
});
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-bebas text-h4", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("font-share-tech text-body-sm text-grey-600 dark:text-grey-400", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
