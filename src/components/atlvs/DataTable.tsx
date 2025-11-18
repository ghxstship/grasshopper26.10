'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, ChevronsUpDown, Search, Filter, Download, MoreVertical } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Input } from '@/components/atoms/Input';

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  onRowClick?: (row: T) => void;
  searchable?: boolean;
  exportable?: boolean;
  pageSize?: number;
}

export function DataTable<T extends Record<string, unknown>>({ 
  data, 
  columns, 
  onRowClick,
  searchable = true,
  exportable = true,
  pageSize = 10
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = [...data];

    // Search
    if (searchQuery) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Sort
    if (sortKey) {
      filtered.sort((a, b) => {
        const aVal = a[sortKey] as string | number;
        const bVal = b[sortKey] as string | number;
        
        if (aVal === bVal) return 0;
        
        const comparison = aVal > bVal ? 1 : -1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [data, searchQuery, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleExport = () => {
    const csv = [
      columns.map(col => col.header).join(','),
      ...processedData.map(row =>
        columns.map(col => {
          const value = row[col.key as keyof T];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="bg-black rounded-xl border border-gray-800 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          {searchable && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="atlvs"
                className="pl-10"
              />
            </div>
          )}
          <Button variant="ghost" size="sm" className="text-gray-400">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="atlvs-outline">
            {processedData.length} results
          </Badge>
          {exportable && (
            <Button 
              variant="atlvs-outline" 
              size="sm"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900/50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-6 py-4 text-left"
                  style={{ width: column.width }}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bebas text-body-sm text-gray-400 uppercase">
                      {column.header}
                    </span>
                    {column.sortable && (
                      <Button
                        onClick={() => handleSort(String(column.key))}
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0"
                      >
                        {sortKey === column.key ? (
                          sortDirection === 'asc' ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )
                        ) : (
                          <ChevronsUpDown className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                onClick={() => onRowClick?.(row)}
                className="border-t border-gray-800 hover:bg-gray-900/50 transition-colors cursor-pointer"
              >
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-6 py-4">
                    <div className="text-body-sm text-white font-oswald">
                      {column.render 
                        ? column.render(row[column.key as keyof T], row)
                        : String(row[column.key as keyof T] || '-')
                      }
                    </div>
                  </td>
                ))}
                <td className="px-6 py-4">
                  <Button variant="ghost" size="sm" className="h-auto p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-800 flex items-center justify-between">
          <div className="text-body-sm text-gray-400 font-oswald">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="text-gray-400 disabled:opacity-50"
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? 'atlvs' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? '' : 'text-gray-400'}
                >
                  {page}
                </Button>
              );
            })}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="text-gray-400 disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
