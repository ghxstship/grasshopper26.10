'use client';

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight,  } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/atoms/IconButton";
import { Separator } from "@/components/atoms/Separator";

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

export interface SidebarItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: SidebarItem[];
}

export interface SidebarProps {
  sections: SidebarSection[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "default" | "gvteway" | "compvss" | "atlvs";
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  sections,
  header,
  footer,
  variant = "default",
  collapsible = true,
  defaultCollapsed = false,
  className,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);
  const pathname = usePathname();

  const variantStyles = {
    default: "bg-white border-gray-200",
    gvteway: "bg-gradient-to-b from-gvteway-red-50 to-white border-gvteway-red-200",
    compvss: "bg-gradient-to-b from-compvss-cyan-50 to-white border-compvss-cyan-200",
    atlvs: "bg-gradient-to-b from-atlvs-green-50 to-white border-atlvs-green-200",
  };

  const activeStyles = {
    default: "bg-gray-100 text-gray-900 border-l-4 border-gray-900",
    gvteway: "bg-gvteway-red-100 text-gvteway-red-900 border-l-4 border-gvteway-red-500",
    compvss: "bg-compvss-cyan-100 text-compvss-cyan-900 border-l-4 border-compvss-cyan-500",
    atlvs: "bg-atlvs-green-100 text-atlvs-green-900 border-l-4 border-atlvs-green-500",
  };

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const renderItem = (item: SidebarItem, depth = 0) => {
    const isActive = pathname === item.href;
    const isExpanded = expandedItems.includes(item.label);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.label}>
        <Link
          href={item.href}
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault();
              toggleExpanded(item.label);
            }
          }}
          className={cn(
            "flex items-center gap-3 px-4 py-3 text-sm font-share-tech transition-colors relative",
            depth > 0 && "pl-8",
            isActive
              ? activeStyles[variant]
              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          )}
        >
          {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
          {!isCollapsed && (
            <>
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span className="flex-shrink-0 rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium">
                  {item.badge}
                </span>
              )}
              {hasChildren && (
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isExpanded && "rotate-90"
                  )}
                />
              )}
            </>
          )}
        </Link>
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="bg-gray-50/50">
            {item.children!.map((child) => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        variantStyles[variant],
        className
      )}
    >
      {/* Header */}
      {header && (
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          {!isCollapsed && header}
          {collapsible && (
            <IconButton
              icon={isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
            />
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {sections.map((section, index) => (
          <div key={index}>
            {section.title && !isCollapsed && (
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.title}
              </div>
            )}
            {section.items.map((item) => renderItem(item))}
            {index < sections.length - 1 && (
              <Separator className="my-4" />
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {footer && !isCollapsed && (
        <div className="border-t border-gray-200 p-4">
          {footer}
        </div>
      )}
    </aside>
  );
};

Sidebar.displayName = "Sidebar";

export { Sidebar };
