'use client';

import * as React from "react";
import { Filter, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";
import { IconButton } from "@/components/atoms/IconButton";
import { SearchBar } from "@/components/molecules/SearchBar";

export interface ToolbarAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "primary" | "outline" | "gvteway" | "compvss" | "atlvs";
  disabled?: boolean;
}

export interface ToolbarProps {
  title?: string;
  description?: string;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  onFilter?: () => void;
  actions?: ToolbarAction[];
  primaryAction?: ToolbarAction;
  variant?: "default" | "gvteway" | "compvss" | "atlvs";
  className?: string;
}

const Toolbar: React.FC<ToolbarProps> = ({
  title,
  description,
  searchPlaceholder = "Search...",
  onSearch,
  onFilter,
  actions = [],
  primaryAction,
  variant = "default",
  className,
}) => {
  const [searchValue, setSearchValue] = React.useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch?.(value);
  };

  const handleSearchClear = () => {
    setSearchValue("");
    onSearch?.("");
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Title Section */}
      {(title || description) && (
        <div>
          {title && (
            <h2 className="text-grey-900">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-1 text-body-sm text-grey-600 -tech">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        {onSearch && (
          <div className="flex-1 max-w-md">
            <SearchBar
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={handleSearchChange}
              onClear={handleSearchClear}
              variant={variant}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Filter Button */}
          {onFilter && (
            <IconButton
              icon={<Filter className="h-4 w-4" />}
              variant="outline"
              onClick={onFilter}
            />
          )}

          {/* Secondary Actions */}
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "outline"}
              size="sm"
              onClick={action.onClick}
              disabled={action.disabled}
              className="hidden sm:inline-flex"
            >
              {action.icon}
              {action.label}
            </Button>
          ))}

          {/* Mobile Actions Menu */}
          {actions.length > 0 && (
            <IconButton
              icon={<MoreVertical className="h-4 w-4" />}
              variant="outline"
              className="sm:hidden"
            />
          )}

          {/* Primary Action */}
          {primaryAction && (
            <Button
              variant={primaryAction.variant || variant}
              size="sm"
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled}
            >
              {primaryAction.icon}
              {primaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

Toolbar.displayName = "Toolbar";

export { Toolbar };
