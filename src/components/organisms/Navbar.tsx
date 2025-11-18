'use client';

import * as React from "react";
import Link from "next/link";
import { Menu, Bell, Search,  } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { IconButton } from "@/components/atoms/IconButton";
import { Badge } from "@/components/atoms/Badge";
import { Breadcrumb, type BreadcrumbItem } from "@/components/molecules/Breadcrumb";

export interface NavbarProps {
  logo?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  user?: {
    name: string;
    email?: string;
    avatar?: string;
  };
  notifications?: number;
  onMenuClick?: () => void;
  onSearchClick?: () => void;
  variant?: "default" | "gvteway" | "compvss" | "atlvs";
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({
  logo,
  breadcrumbs,
  actions,
  user,
  notifications = 0,
  onMenuClick,
  onSearchClick,
  variant = "default",
  className,
}) => {
  const variantStyles = {
    default: "bg-white border-gray-200",
    gvteway: "bg-white border-gvteway-red-200",
    compvss: "bg-white border-compvss-cyan-200",
    atlvs: "bg-white border-atlvs-green-200",
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-16 items-center gap-4 border-b px-4 lg:px-6",
        variantStyles[variant],
        className
      )}
    >
      {/* Mobile Menu Button */}
      {onMenuClick && (
        <IconButton
          icon={<Menu className="h-5 w-5" />}
          variant="ghost"
          onClick={onMenuClick}
          className="lg:hidden"
        />
      )}

      {/* Logo */}
      {logo && (
        <Link href="/" className="flex items-center gap-2 font-bebas text-xl tracking-wide">
          {logo}
        </Link>
      )}

      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="hidden lg:flex flex-1">
          <Breadcrumb items={breadcrumbs} showHome={false} />
        </div>
      )}

      {/* Spacer */}
      {!breadcrumbs && <div className="flex-1" />}

      {/* Actions */}
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}

      {/* Search */}
      {onSearchClick && (
        <IconButton
          icon={<Search className="h-5 w-5" />}
          variant="ghost"
          onClick={onSearchClick}
        />
      )}

      {/* Notifications */}
      {notifications > 0 && (
        <div className="relative">
          <IconButton
            icon={<Bell className="h-5 w-5" />}
            variant="ghost"
          />
          <Badge
            variant="error"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {notifications > 9 ? "9+" : notifications}
          </Badge>
        </div>
      )}

      {/* User Menu */}
      {user && (
        <Button variant="ghost" className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100 transition-colors">
          <Avatar
            src={user.avatar}
            alt={user.name}
            fallback={user.name}
            size="sm"
          />
          <div className="hidden lg:block text-left">
            <div className="text-sm font-medium text-gray-900 font-share-tech">
              {user.name}
            </div>
            {user.email && (
              <div className="text-xs text-gray-500 font-share-tech">
                {user.email}
              </div>
            )}
          </div>
        </Button>
      )}
    </header>
  );
};

Navbar.displayName = "Navbar";

export { Navbar };
