import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "gvteway" | "compvss" | "atlvs" | "glass";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variantStyles = {
    default: "bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800",
    gvteway: "bg-white border-gvteway-red-500/20 hover:border-gvteway-red-500/50",
    compvss: "bg-white border-compvss-cyan-500/20 hover:border-compvss-cyan-500/50",
    atlvs: "bg-white border-atlvs-green-500/20 hover:border-atlvs-green-500/50",
    glass: "glass border-white/20",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border-2 p-6 shadow-lg transition-all",
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
    className={cn("font-bebas text-2xl tracking-wide", className)}
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
    className={cn("font-share-tech text-sm text-gray-600 dark:text-gray-400", className)}
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
