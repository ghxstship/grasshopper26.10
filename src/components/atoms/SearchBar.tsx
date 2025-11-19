import * as React from "react";
import { cn } from "@/lib/utils";
import { Search, MapPin } from "lucide-react";

interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onSearch?: (query: string) => void;
  location?: string;
  onLocationChange?: (location: string) => void;
  showLocationSelector?: boolean;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ 
    className, 
    placeholder = "Search events, artists, brands, destinations...",
    onSearch,
    location,
    onLocationChange: _onLocationChange,
    showLocationSelector = true,
    ...props 
  }, ref) => {
    const [query, setQuery] = React.useState("");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSearch?.(query);
    };

    return (
      <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
        <div className="flex items-center gap-2 border-2 border-black bg-white">
          <div className="flex-1 flex items-center gap-3 px-4 py-3">
            <Search className="w-5 h-5 text-grey-700 flex-shrink-0" />
            <input
              ref={ref}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent -tech text-body outline-none placeholder:text-grey-500"
              {...props}
            />
          </div>
          
          {showLocationSelector && (
            <>
              <div className="h-8 w-px bg-grey-300" />
              <div className="flex items-center gap-2 px-4 cursor-pointer hover:bg-grey-100 transition-colors">
                <MapPin className="w-4 h-4 text-grey-700" />
                <span className="-tech-mono text-body-sm whitespace-nowrap">
                  {location || "Location"}
                </span>
              </div>
            </>
          )}
        </div>
      </form>
    );
  }
);

SearchBar.displayName = "SearchBar";
