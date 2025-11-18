'use client';

import * as React from "react";
import { Home, Users, ClipboardList, Radio, QrCode, AlertCircle, DollarSign, Share2, Award, FileText, Settings, Briefcase } from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import type { SidebarSection } from "@/components/organisms/Sidebar";

export interface CompvssLayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email?: string;
    avatar?: string;
  };
  notifications?: number;
  breadcrumbs?: Array<{ label: string; href: string }>;
}

const CompvssLayout: React.FC<CompvssLayoutProps> = ({
  children,
  user,
  notifications = 0,
  breadcrumbs,
}) => {
  const sidebarSections: SidebarSection[] = [
    {
      items: [
        {
          label: "Dashboard",
          href: "/compvss/dashboard",
          icon: <Home className="h-5 w-5" />,
        },
        {
          label: "Team",
          href: "/compvss/team",
          icon: <Users className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Operations",
      items: [
        {
          label: "Advancing",
          href: "/compvss/advancing",
          icon: <ClipboardList className="h-5 w-5" />,
        },
        {
          label: "Day-of-Show",
          href: "/compvss/operations",
          icon: <Radio className="h-5 w-5" />,
        },
        {
          label: "QR Scanner",
          href: "/compvss/qr",
          icon: <QrCode className="h-5 w-5" />,
        },
        {
          label: "Issues",
          href: "/compvss/issues",
          icon: <AlertCircle className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Finance",
      items: [
        {
          label: "Expenses",
          href: "/compvss/expenses",
          icon: <DollarSign className="h-5 w-5" />,
        },
        {
          label: "Affiliates",
          href: "/compvss/affiliates",
          icon: <Share2 className="h-5 w-5" />,
        },
        {
          label: "Referrals",
          href: "/compvss/referrals",
          icon: <Award className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Opportunities",
      items: [
        {
          label: "Browse Jobs",
          href: "/compvss/opportunities",
          icon: <Briefcase className="h-5 w-5" />,
        },
        {
          label: "My Applications",
          href: "/compvss/applications",
          icon: <FileText className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Resources",
      items: [
        {
          label: "Credentials",
          href: "/compvss/credentials",
          icon: <FileText className="h-5 w-5" />,
        },
        {
          label: "Settings",
          href: "/compvss/settings",
          icon: <Settings className="h-5 w-5" />,
        },
      ],
    },
  ];

  const logo = (
    <span className="text-2xl font-bebas bg-gradient-to-r from-compvss-cyan-500 via-compvss-teal-500 to-compvss-indigo-500 bg-clip-text text-transparent">
      COMPVSS
    </span>
  );

  return (
    <DashboardLayout
      sidebarSections={sidebarSections}
      sidebarHeader={logo}
      navbarLogo={logo}
      user={user}
      notifications={notifications}
      variant="compvss"
      breadcrumbs={breadcrumbs}
    >
      {children}
    </DashboardLayout>
  );
};

CompvssLayout.displayName = "CompvssLayout";

export { CompvssLayout };
