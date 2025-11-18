import * as React from "react";
import Image from "next/image";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const avatarVariants = cva(
  "relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800",
  {
    variants: {
      size: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
        "2xl": "h-20 w-20",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt, fallback, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    const getInitials = (name?: string) => {
      if (!name) return "";
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        {src && !imageError ? (
          <Image
            src={src}
            alt={alt || "Avatar"}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800">
            {fallback ? (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-bebas">
                {getInitials(fallback)}
              </span>
            ) : (
              <User className="h-1/2 w-1/2 text-gray-500 dark:text-gray-400" />
            )}
          </div>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar, avatarVariants };
