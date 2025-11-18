'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import { Toolbar, type ToolbarAction } from "@/components/organisms/Toolbar";
import { Breadcrumb, type BreadcrumbItem } from "@/components/molecules/Breadcrumb";

export interface ContentLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  onFilter?: () => void;
  actions?: ToolbarAction[];
  primaryAction?: ToolbarAction;
  variant?: "default" | "gvteway" | "compvss" | "atlvs";
  showToolbar?: boolean;
  className?: string;
}

const ContentLayout: React.FC<ContentLayoutProps> = ({
  children,
  title,
  description,
  breadcrumbs,
  searchPlaceholder,
  onSearch,
  onFilter,
  actions,
  primaryAction,
  variant = "default",
  showToolbar = true,
  className,
}) => {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb items={breadcrumbs} />
      )}

      {/* Toolbar */}
      {showToolbar && (
        <Toolbar
          title={title}
          description={description}
          searchPlaceholder={searchPlaceholder}
          onSearch={onSearch}
          onFilter={onFilter}
          actions={actions}
          primaryAction={primaryAction}
          variant={variant}
        />
      )}

      {/* Content */}
      <div>{children}</div>
    </div>
  );
};

ContentLayout.displayName = "ContentLayout";

export { ContentLayout };
