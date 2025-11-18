'use client';

import * as React from "react";
import { Search,  } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onSelect: () => void;
  category?: string;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
  variant?: "default" | "gvteway" | "compvss" | "atlvs";
  className?: string;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  items,
  placeholder = "Search commands...",
  variant = "default",
  className,
}) => {
  const [search, setSearch] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const filteredItems = React.useMemo(() => {
    if (!search) return items;
    const query = search.toLowerCase();
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
    );
  }, [items, search]);

  const groupedItems = React.useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredItems.forEach((item) => {
      const category = item.category || "Commands";
      if (!groups[category]) groups[category] = [];
      groups[category].push(item);
    });
    return groups;
  }, [filteredItems]);

  React.useEffect(() => {
    if (!isOpen) {
      setSearch("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredItems.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredItems.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].onSelect();
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Command Palette */}
      <div className="fixed left-1/2 top-[20%] z-50 w-full max-w-2xl -translate-x-1/2 px-4">
        <div
          className={cn(
            "bg-white rounded-2xl shadow-2xl border-2 overflow-hidden",
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholder}
              variant={variant}
              className="border-0 focus:ring-0 px-0"
              autoFocus
            />
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto p-2">
            {Object.keys(groupedItems).length === 0 ? (
              <div className="py-12 text-center text-body-sm text-gray-500 font-share-tech">
                No results found
              </div>
            ) : (
              Object.entries(groupedItems).map(([category, categoryItems]) => (
                <div key={category} className="mb-4 last:mb-0">
                  <div className="px-3 py-2 text-caption text-gray-500 uppercaser">
                    {category}
                  </div>
                  {categoryItems.map((item, _index) => {
                    const globalIndex = filteredItems.indexOf(item);
                    const isSelected = globalIndex === selectedIndex;

                    return (
                      <Button
                        key={item.id}
                        onClick={() => {
                          item.onSelect();
                          onClose();
                        }}
                        variant="ghost"
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                          isSelected
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        {item.icon && (
                          <div className="flex-shrink-0 text-gray-500">
                            {item.icon}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-body-sm font-share-tech truncate">
                            {item.label}
                          </div>
                          {item.description && (
                            <div className="text-caption text-gray-500 font-share-tech truncate">
                              {item.description}
                            </div>
                          )}
                        </div>
                        {item.shortcut && (
                          <div className="flex-shrink-0 text-caption text-gray-400 font-mono">
                            {item.shortcut}
                          </div>
                        )}
                      </Button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-4 py-2 text-caption text-gray-500 font-share-tech">
            <span className="mr-4">↑↓ Navigate</span>
            <span className="mr-4">↵ Select</span>
            <span>ESC Close</span>
          </div>
        </div>
      </div>
    </>
  );
};

CommandPalette.displayName = "CommandPalette";

export { CommandPalette };
