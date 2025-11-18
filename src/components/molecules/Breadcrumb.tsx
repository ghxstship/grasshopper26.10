import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  showHome = true,
  className,
}) => {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-2", className)}>
      {showHome && (
        <>
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            <Home className="h-4 w-4" />
          </Link>
          {items.length > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
        </>
      )}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="flex items-center gap-1 text-sm font-share-tech text-gray-500 hover:text-gray-900 transition-colors"
              >
                {item.icon}
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  "flex items-center gap-1 text-sm font-share-tech",
                  isLast ? "text-gray-900 font-medium" : "text-gray-500"
                )}
              >
                {item.icon}
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight className="h-4 w-4 text-gray-400" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

Breadcrumb.displayName = "Breadcrumb";

export { Breadcrumb };
