'use client';

import { KPICard } from './KPICard';

interface KPIMetric {
  title: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  description?: string;
  format?: 'number' | 'currency' | 'percentage';
}

interface KPIGridProps {
  metrics: KPIMetric[];
  columns?: 2 | 3 | 4;
  loading?: boolean;
}

export function KPIGrid({ metrics, columns = 4, loading }: KPIGridProps) {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-4`}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-grey-200 p-6 animate-pulse">
            <div className="h-4 bg-grey-200 rounded w-3/4 mb-4" />
            <div className="h-8 bg-grey-200 rounded w-1/2 mb-2" />
            <div className="h-3 bg-grey-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns];

  return (
    <div className={`grid ${gridClass} gap-4`}>
      {metrics.map((metric, index) => (
        <KPICard key={index} {...metric} />
      ))}
    </div>
  );
}
