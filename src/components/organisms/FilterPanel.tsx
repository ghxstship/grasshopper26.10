'use client';

import * as React from "react";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { Checkbox } from "@/components/atoms/Checkbox";
import { Separator } from "@/components/atoms/Separator";

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  type?: "checkbox" | "radio";
}

export interface FilterPanelProps {
  groups: FilterGroup[];
  selectedFilters: Record<string, string[]>;
  onFilterChange: (groupId: string, values: string[]) => void;
  onClear: () => void;
  variant?: "default" | "gvteway" | "compvss" | "atlvs";
  className?: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  groups,
  selectedFilters,
  onFilterChange,
  onClear,
  variant = "default",
  className,
}) => {
  const [expandedGroups, setExpandedGroups] = React.useState<string[]>(
    groups.map((g) => g.id)
  );

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleOptionChange = (groupId: string, value: string, checked: boolean) => {
    const currentValues = selectedFilters[groupId] || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);
    onFilterChange(groupId, newValues);
  };

  const totalFilters = Object.values(selectedFilters).reduce(
    (sum, values) => sum + values.length,
    0
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bebas tracking-wide text-gray-900">
          Filters
          {totalFilters > 0 && (
            <span className="ml-2 text-sm text-gray-500">({totalFilters})</span>
          )}
        </h3>
        {totalFilters > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <Separator />

      {/* Filter Groups */}
      <div className="space-y-4">
        {groups.map((group) => {
          const isExpanded = expandedGroups.includes(group.id);
          const groupValues = selectedFilters[group.id] || [];

          return (
            <div key={group.id} className="space-y-3">
              {/* Group Header */}
              <Button
                onClick={() => toggleGroup(group.id)}
                variant="ghost"
                className="flex w-full items-center justify-between text-left"
              >
                <span className="text-sm font-medium text-gray-900 font-share-tech">
                  {group.label}
                  {groupValues.length > 0 && (
                    <span className="ml-2 text-gray-500">({groupValues.length})</span>
                  )}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-gray-500 transition-transform",
                    isExpanded && "rotate-180"
                  )}
                />
              </Button>

              {/* Group Options */}
              {isExpanded && (
                <div className="space-y-2 pl-1">
                  {group.options.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center gap-2 group"
                    >
                      <Checkbox
                        checked={groupValues.includes(option.value)}
                        onChange={(e) =>
                          handleOptionChange(
                            group.id,
                            option.value,
                            e.target.checked
                          )
                        }
                        variant={variant}
                      />
                      <span className="flex-1 text-sm text-gray-700 group-hover:text-gray-900 font-share-tech cursor-pointer">
                        {option.label}
                      </span>
                      {option.count !== undefined && (
                        <span className="text-xs text-gray-500">
                          {option.count}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

FilterPanel.displayName = "FilterPanel";

export { FilterPanel };
