import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/Button";

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  defaultOpen = [],
  className,
}) => {
  const [openItems, setOpenItems] = React.useState<string[]>(defaultOpen);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenItems((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenItems((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn("divide-y divide-gray-200 border border-gray-200 rounded-lg", className)}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id);
        return (
          <div key={item.id}>
            <Button
              onClick={() => toggleItem(item.id)}
              variant="ghost"
              className="flex w-full items-center justify-between px-4 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="font-medium text-gray-900 font-share-tech">
                  {item.title}
                </span>
              </div>
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-gray-500 transition-transform",
                  isOpen && "transform rotate-180"
                )}
              />
            </Button>
            {isOpen && (
              <div className="px-4 pb-4 pt-2 text-gray-700 font-share-tech">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

Accordion.displayName = "Accordion";

export { Accordion };
