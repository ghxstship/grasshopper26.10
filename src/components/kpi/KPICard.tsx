'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  description?: string;
  format?: 'number' | 'currency' | 'percentage';
  className?: string;
}

export function KPICard({
  title,
  value,
  unit,
  trend,
  trendValue,
  description,
  format = 'number',
  className = '',
}: KPICardProps) {
  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;

    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        });
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'neutral':
        return <Minus className="h-4 w-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow ${className}`}>
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {trend && (
          <div className={`flex items-center gap-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            {trendValue !== undefined && (
              <span className="text-xs font-medium">
                {trendValue > 0 ? '+' : ''}{trendValue.toFixed(1)}%
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-bold text-gray-900">
          {formatValue(value)}
        </span>
        {unit && !format && (
          <span className="text-sm text-gray-500">{unit}</span>
        )}
      </div>

      {description && (
        <p className="text-xs text-gray-500 mt-2">{description}</p>
      )}
    </div>
  );
}
