import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/atoms/Input";
import { IconButton } from "@/components/atoms/IconButton";
import { cn } from "@/lib/utils";

export interface SearchBarProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onClear?: () => void;
  variant?: "default" | "gvteway" | "compvss" | "atlvs";
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, onClear, variant = "default", value, ...props }, ref) => {
    return (
      <div className={cn("relative flex items-center", className)}>
        <Search className="absolute start-3 h-5 w-5 text-grey-400 pointer-events-none" />
        <Input
          ref={ref}
          type="search"
          variant={variant}
          value={value}
          className="ps-10 pe-10"
          {...props}
        />
        {value && onClear && (
          <IconButton
            icon={<X className="h-4 w-4" />}
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="absolute end-2"
            type="button"
          />
        )}
      </div>
    );
  }
);
SearchBar.displayName = "SearchBar";

export { SearchBar };
