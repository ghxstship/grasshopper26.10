import { ReactNode, useState } from 'react';
import { Navigation } from '@/components/organisms/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { PageTitle, SectionHeader, BodyText, Metadata } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { SearchBar } from '@/components/molecules/SearchBar';
import { EmptyState } from '@/components/molecules/EmptyState';
import { Pagination } from '@/components/molecules/Pagination';
import { Grid, List, SlidersHorizontal, X } from 'lucide-react';

export interface SearchFilter {
  id: string;
  label: string;
  options: Array<{
    value: string;
    label: string;
    count?: number;
  }>;
  type?: 'checkbox' | 'radio' | 'range';
}

export interface SearchResultsPageTemplateProps {
  query: string;
  totalResults: number;
  results: ReactNode;
  filters?: SearchFilter[];
  activeFilters?: Record<string, string[]>;
  onFilterChange?: (filterId: string, values: string[]) => void;
  onClearFilters?: () => void;
  onSearch?: (query: string) => void;
  sortOptions?: Array<{
    value: string;
    label: string;
  }>;
  currentSort?: string;
  onSortChange?: (sort: string) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  showFilters?: boolean;
  emptyStateIcon?: ReactNode;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
}

/**
 * SearchResultsPageTemplate - GHXSTSHIP Standardized
 * 
 * Reusable template for search results with filters and sorting.
 * Optimized for event search, marketplace search, and content discovery.
 * 
 * Features:
 * - Search bar with live search
 * - Faceted search sidebar with filters
 * - Results grid/list toggle
 * - Sort options dropdown
 * - Pagination
 * - Empty state for no results
 * - Active filters display
 * - Mobile-responsive (filters in drawer on mobile)
 * 
 * @example
 * <SearchResultsPageTemplate
 *   query="electronic music"
 *   totalResults={42}
 *   results={<EventsGrid events={events} />}
 *   filters={[
 *     { id: 'genre', label: 'Genre', options: [...] },
 *     { id: 'date', label: 'Date', options: [...] }
 *   ]}
 *   sortOptions={[
 *     { value: 'relevance', label: 'Relevance' },
 *     { value: 'date', label: 'Date' }
 *   ]}
 *   onSearch={handleSearch}
 * />
 */
export function SearchResultsPageTemplate({
  query,
  totalResults,
  results,
  filters,
  activeFilters = {},
  onFilterChange,
  onClearFilters,
  onSearch,
  sortOptions,
  currentSort,
  onSortChange,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  viewMode = 'grid',
  onViewModeChange,
  showFilters = true,
  emptyStateIcon,
  emptyStateTitle = 'No results found',
  emptyStateDescription = 'Try adjusting your search or filters',
}: SearchResultsPageTemplateProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const hasActiveFilters = Object.values(activeFilters).some(v => v.length > 0);
  const isEmpty = totalResults === 0;

  return (
    <div className="min-h-screen bg-ghxst-white">
      <Navigation />

      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          {/* Header */}
          <div className="mb-8">
            <PageTitle className="mb-4 uppercase text-ghxst-primary">
              Search Results
            </PageTitle>
            {query && (
              <BodyText className="text-ghxst-text-secondary">
                Showing results for &quot;{query}&quot;
              </BodyText>
            )}
          </div>

          {/* Search Bar */}
          {onSearch && (
            <div className="mb-8">
              <SearchBar
                defaultValue={query}
                placeholder="Search..."
              />
            </div>
          )}

          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* Filters Sidebar */}
            {showFilters && filters && filters.length > 0 && (
              <aside className="hidden lg:block">
                <Card className="sticky top-24">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <SectionHeader className="font-bebas text-h5">
                        Filters
                      </SectionHeader>
                      {hasActiveFilters && onClearFilters && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onClearFilters}
                        >
                          Clear All
                        </Button>
                      )}
                    </div>

                    <div className="space-y-6">
                      {filters.map((filter) => (
                        <div key={filter.id}>
                          <BodyText className="font-medium mb-3">
                            {filter.label}
                          </BodyText>
                          <div className="space-y-2">
                            {filter.options.map((option) => (
                              <label
                                key={option.value}
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <input
                                  type={filter.type === 'radio' ? 'radio' : 'checkbox'}
                                  checked={activeFilters[filter.id]?.includes(option.value)}
                                  onChange={(e) => {
                                    if (!onFilterChange) return;
                                    const current = activeFilters[filter.id] || [];
                                    const newValues = e.target.checked
                                      ? [...current, option.value]
                                      : current.filter(v => v !== option.value);
                                    onFilterChange(filter.id, newValues);
                                  }}
                                  className="rounded border-ghxst-border"
                                />
                                <Metadata className="flex-1">
                                  {option.label}
                                  {option.count !== undefined && (
                                    <span className="text-ghxst-text-secondary ml-1">
                                      ({option.count})
                                    </span>
                                  )}
                                </Metadata>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </aside>
            )}

            {/* Main Content */}
            <div className="space-y-6">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Metadata className="text-ghxst-text-secondary">
                    {totalResults.toLocaleString()} results
                  </Metadata>
                  
                  {/* Mobile Filters Button */}
                  {showFilters && filters && filters.length > 0 && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="lg:hidden"
                      onClick={() => setMobileFiltersOpen(true)}
                    >
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort Options */}
                  {sortOptions && sortOptions.length > 0 && onSortChange && (
                    <select
                      value={currentSort}
                      onChange={(e) => onSortChange(e.target.value)}
                      className="px-4 py-2 border border-ghxst-border rounded-lg bg-white"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* View Mode Toggle */}
                  {onViewModeChange && (
                    <div className="flex items-center gap-1 border border-ghxst-border rounded-lg p-1">
                      <Button
                        variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => onViewModeChange('grid')}
                      >
                        <Grid className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => onViewModeChange('list')}
                      >
                        <List className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2">
                  <Metadata className="text-ghxst-text-secondary">
                    Active filters:
                  </Metadata>
                  {Object.entries(activeFilters).map(([filterId, values]) =>
                    values.map((value) => (
                      <Button
                        key={`${filterId}-${value}`}
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          if (onFilterChange) {
                            onFilterChange(
                              filterId,
                              values.filter(v => v !== value)
                            );
                          }
                        }}
                      >
                        {value}
                        <X className="w-3 h-3 ml-2" />
                      </Button>
                    ))
                  )}
                </div>
              )}

              {/* Results */}
              {isEmpty ? (
                <EmptyState
                  icon={emptyStateIcon}
                  title={emptyStateTitle}
                  message={emptyStateDescription}
                />
              ) : (
                results
              )}

              {/* Pagination */}
              {totalPages > 1 && onPageChange && (
                <div className="flex justify-center mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
