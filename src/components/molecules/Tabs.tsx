import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: "default" | "gvteway" | "compvss" | "atlvs";
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = "default",
  className,
}) => {
  const variantStyles = {
    default: {
      active: "border-grey-900 text-grey-900",
      inactive: "border-transparent text-grey-500 hover:text-grey-700 hover:border-grey-300",
    },
    gvteway: {
      active: "border-gvteway-red-500 text-gvteway-red-500",
      inactive: "border-transparent text-grey-500 hover:text-gvteway-red-500 hover:border-gvteway-red-300",
    },
    compvss: {
      active: "border-compvss-cyan-500 text-compvss-cyan-500",
      inactive: "border-transparent text-grey-500 hover:text-compvss-cyan-500 hover:border-compvss-cyan-300",
    },
    atlvs: {
      active: "border-atlvs-green-500 text-atlvs-green-500",
      inactive: "border-transparent text-grey-500 hover:text-atlvs-green-500 hover:border-atlvs-green-300",
    },
  };

  return (
    <div className={cn("border-b border-grey-200", className)}>
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const styles = isActive
            ? variantStyles[variant].active
            : variantStyles[variant].inactive;

          return (
            <Button
              key={tab.id}
              onClick={() => !tab.disabled && onChange(tab.id)}
              disabled={tab.disabled}
              variant="ghost"
              className={cn(
                "flex items-center gap-2 whitespace-nowrap border-b-2 py-4 px-1 text-body-sm font-share-tech transition-colors",
                styles,
                tab.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {tab.icon}
              {tab.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );
};

Tabs.displayName = "Tabs";

export { Tabs };
