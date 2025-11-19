"use client";
import { KPICard } from "@/components/molecules/KPICard";
interface KPIMetric {
  title: string;
  value: number | string;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: number;
  description?: string;
  format?: "number" | "currency" | "percentage";
}
interface KPIGridProps {
  metrics: KPIMetric[];
  columns?: 2 | 3 | 4;
  loading?: boolean;
}
export function KPIGrid({ metrics, columns = 4, loading }: KPIGridProps) {
  if (loading) {
    return (
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} gap-4`}
      >
        {" "}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-none border p-6 animate-pulse"
          >
            {" "}
            <div className="h-4 rounded-none-none w-3/4 mb-4" />{" "}
            <div className="h-8 rounded-none-none w-1/2 mb-2" />{" "}
            <div className="h-3 rounded-none-none w-2/3" />{" "}
          </div>
        ))}{" "}
      </div>
    );
  }
  const gridClass = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }[columns];
  return (
    <div className={`grid ${gridClass} gap-4`}>
      {" "}
      {metrics.map((metric, index) => (
        <KPICard key={index} {...metric} />
      ))}{" "}
    </div>
  );
}
