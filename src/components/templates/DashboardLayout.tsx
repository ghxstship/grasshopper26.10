'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import { Sidebar, type SidebarSection } from "@/components/organisms/Sidebar";
import { Navbar } from "@/components/organisms/Navbar";
import { type BreadcrumbItem } from "@/components/molecules/Breadcrumb";

export interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarSections: SidebarSection[];
  sidebarHeader?: React.ReactNode;
  sidebarFooter?: React.ReactNode;
  navbarLogo?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  navbarActions?: React.ReactNode;
  user?: {
    name: string;
    email?: string;
    avatar?: string;
  };
  notifications?: number;
  variant?: "default" | "gvteway" | "compvss" | "atlvs";
  sidebarCollapsible?: boolean;
  sidebarDefaultCollapsed?: boolean;
  className?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  sidebarSections,
  sidebarHeader,
  sidebarFooter,
  navbarLogo,
  breadcrumbs,
  navbarActions,
  user,
  notifications,
  variant = "default",
  sidebarCollapsible = true,
  sidebarDefaultCollapsed = false,
  className,
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);

  const backgroundStyles = {
    default: "bg-grey-50",
    gvteway: "bg-black",
    compvss: "bg-black",
    atlvs: "bg-black",
  };

  return (
    <div className={cn("flex h-screen overflow-hidden", backgroundStyles[variant], className)}>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          sections={sidebarSections}
          header={sidebarHeader}
          footer={sidebarFooter}
          variant={variant}
          collapsible={sidebarCollapsible}
          defaultCollapsed={sidebarDefaultCollapsed}
        />
      </div>

      {/* Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 start-0 w-64">
            <Sidebar
              sections={sidebarSections}
              header={sidebarHeader}
              footer={sidebarFooter}
              variant={variant}
              collapsible={false}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar
          logo={navbarLogo}
          breadcrumbs={breadcrumbs}
          actions={navbarActions}
          user={user}
          notifications={notifications}
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          variant={variant}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6 lg:px-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

DashboardLayout.displayName = "DashboardLayout";

export { DashboardLayout };
