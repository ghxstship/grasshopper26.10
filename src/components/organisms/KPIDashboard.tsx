"use client";

import { memo, useMemo } from "react";
import { Card } from "@/components/atoms/Card";
import { BodyText, SubsectionHeader } from "@/components/atoms/Typography";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Activity,
} from "lucide-react";

interface KPIMetric {
  name: string;
  value: number;
  unit: string;
  category: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: number;
}

interface KPIDashboardProps {
  eventId: string;
  metrics?: KPIMetric[];
  loading?: boolean;
}

const categoryIcons = {
  financial: DollarSign,
  tickets: Users,
  operational: Activity,
  marketing: Target,
};

const categoryColors = {
  financial: "text-success",
  tickets: "text-info",
  operational: "text-accent",
  marketing: "text-warning",
};

const MetricCard = memo(({ metric }: { metric: KPIMetric }) => {
  const TrendIcon = metric.trend === "up" ? TrendingUp : metric.trend === "down" ? TrendingDown : null;

  return (
    <Card variant="default" className="p-6 hover:shadow-hard-hard-hard-lg transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <BodyText className="text-ghxst-text-secondary">{metric.name}</BodyText>
        {TrendIcon && (
          <div
            className={`flex items-center gap-1 ${
              metric.trend === "up"
                ? "text-success"
                : metric.trend === "down"
                  ? "text-destructive"
                  : ""
            }`}
          >
            <TrendIcon className="h-3 w-3" />
            {metric.trendValue && `${metric.trendValue}%`}
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold">
          {metric.value.toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: metric.unit === "USD" ? 2 : 0,
          })}
        </span>
        <BodyText className="mb-0 text-ghxst-text-secondary">{metric.unit}</BodyText>
      </div>
    </Card>
  );
});

MetricCard.displayName = "MetricCard";

function KPIDashboardComponent({ metrics = [], loading }: KPIDashboardProps) {
  const groupedMetrics = useMemo(() => {
    return metrics.reduce((acc, metric) => {
      if (!acc[metric.category]) {
        acc[metric.category] = [];
      }
      acc[metric.category].push(metric);
      return acc;
    }, {} as Record<string, KPIMetric[]>);
  }, [metrics]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="p-6 animate-pulse">
            <div className="mb-4 h-4 w-3/4 rounded bg-ghxst-surface" />
            <div className="h-8 w-1/2 rounded bg-ghxst-surface/80" />
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics.length) {
    return (
      <div className="rounded-lg border border-dashed border-ghxst-border p-8 text-center">
        <BodyText className="text-ghxst-text-secondary">No KPI metrics available yet.</BodyText>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedMetrics).map(([category, categoryMetrics]) => {
        const Icon = categoryIcons[category as keyof typeof categoryIcons] || Activity;
        const colorClass = categoryColors[category as keyof typeof categoryColors] || "";

        return (
          <div key={category}>
            <div className="mb-4 flex items-center gap-2">
              <Icon className={`h-5 w-5 ${colorClass}`} />
              <SubsectionHeader className="mb-0 capitalize">{category} Metrics</SubsectionHeader>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {categoryMetrics.map((metric) => (
                <MetricCard key={metric.name} metric={metric} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const KPIDashboard = memo(KPIDashboardComponent);
