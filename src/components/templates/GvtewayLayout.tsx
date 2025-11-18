'use client';

import * as React from "react";
import { Home, Calendar, Ticket, Wallet, ShoppingBag, Users, MapPin, Settings } from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import type { SidebarSection } from "@/components/organisms/Sidebar";

export interface GvtewayLayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email?: string;
    avatar?: string;
  };
  notifications?: number;
}

const GvtewayLayout: React.FC<GvtewayLayoutProps> = ({
  children,
  user,
  notifications = 0,
}) => {
  const sidebarSections: SidebarSection[] = [
    {
      items: [
        {
          label: "Home",
          href: "/gvteway",
          icon: <Home className="h-5 w-5" />,
        },
        {
          label: "Events",
          href: "/gvteway/events",
          icon: <Calendar className="h-5 w-5" />,
        },
        {
          label: "My Tickets",
          href: "/gvteway/tickets",
          icon: <Ticket className="h-5 w-5" />,
        },
        {
          label: "Wallet",
          href: "/gvteway/wallet",
          icon: <Wallet className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Explore",
      items: [
        {
          label: "Marketplace",
          href: "/gvteway/marketplace",
          icon: <ShoppingBag className="h-5 w-5" />,
        },
        {
          label: "Adventures",
          href: "/gvteway/adventures",
          icon: <MapPin className="h-5 w-5" />,
        },
        {
          label: "Social Hub",
          href: "/gvteway/social",
          icon: <Users className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          label: "Settings",
          href: "/gvteway/settings",
          icon: <Settings className="h-5 w-5" />,
        },
      ],
    },
  ];

  const logo = (
    <span className="text-2xl font-bebas bg-gradient-to-r from-gvteway-red-500 via-gvteway-yellow-500 to-gvteway-blue-500 bg-clip-text text-transparent">
      GVTEWAY
    </span>
  );

  return (
    <DashboardLayout
      sidebarSections={sidebarSections}
      sidebarHeader={logo}
      navbarLogo={logo}
      user={user}
      notifications={notifications}
      variant="gvteway"
    >
      {children}
    </DashboardLayout>
  );
};

GvtewayLayout.displayName = "GvtewayLayout";

export { GvtewayLayout };
