'use client';

import * as React from "react";
import { Home, FolderKanban, CheckSquare, Users, DollarSign, Package, ClipboardList, FileText, Workflow, BarChart3, Settings, Briefcase } from "lucide-react";
import { DashboardLayout } from "./DashboardLayout";
import type { SidebarSection } from "@/components/organisms/Sidebar";

export interface AtlvsLayoutProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email?: string;
    avatar?: string;
  };
  notifications?: number;
  showNav?: boolean;
}

const AtlvsLayout: React.FC<AtlvsLayoutProps> = ({
  children,
  user,
  notifications = 0,
}) => {
  const sidebarSections: SidebarSection[] = [
    {
      items: [
        {
          label: "Overview",
          href: "/atlvs",
          icon: <Home className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Project Management",
      items: [
        {
          label: "Projects",
          href: "/atlvs/projects",
          icon: <FolderKanban className="h-5 w-5" />,
        },
        {
          label: "Tasks",
          href: "/atlvs/tasks",
          icon: <CheckSquare className="h-5 w-5" />,
        },
        {
          label: "Team",
          href: "/atlvs/teams",
          icon: <Users className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Resources",
      items: [
        {
          label: "Budgets",
          href: "/atlvs/budgets",
          icon: <DollarSign className="h-5 w-5" />,
        },
        {
          label: "Assets",
          href: "/atlvs/assets",
          icon: <Package className="h-5 w-5" />,
        },
        {
          label: "Advancing",
          href: "/atlvs/advancing",
          icon: <ClipboardList className="h-5 w-5" />,
        },
        {
          label: "Documents",
          href: "/atlvs/documents",
          icon: <FileText className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Automation",
      items: [
        {
          label: "Workflows",
          href: "/atlvs/automation",
          icon: <Workflow className="h-5 w-5" />,
        },
        {
          label: "Analytics",
          href: "/atlvs/analytics",
          icon: <BarChart3 className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "Opportunities",
      items: [
        {
          label: "Manage Postings",
          href: "/atlvs/opportunities",
          icon: <Briefcase className="h-5 w-5" />,
        },
      ],
    },
    {
      title: "System",
      items: [
        {
          label: "Settings",
          href: "/atlvs/settings",
          icon: <Settings className="h-5 w-5" />,
        },
      ],
    },
  ];

  const logo = (
    <span className="text-2xl font-bebas bg-gradient-to-r from-atlvs-green-500 via-atlvs-orange-500 to-atlvs-purple-500 bg-clip-text text-transparent">
      ATLVS
    </span>
  );

  return (
    <DashboardLayout
      sidebarSections={sidebarSections}
      sidebarHeader={logo}
      navbarLogo={logo}
      user={user}
      notifications={notifications}
      variant="atlvs"
    >
      {children}
    </DashboardLayout>
  );
};

AtlvsLayout.displayName = "AtlvsLayout";

export { AtlvsLayout };
