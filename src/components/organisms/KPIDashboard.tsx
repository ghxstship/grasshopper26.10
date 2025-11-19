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
  metrics: KPIMetric[];
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
}; // Memoized metric card component const MetricCard = memo(({ metric }: { metric: KPIMetric }) => ( <Card className="p-6 hover:shadow-hard-hard-hard-lg transition-shadow-hard-hard"> <div className="flex items-start justify-between mb-2"> <BodyText>{metric.name}</BodyText> {metric.trend && ( <div className={`flex items-center gap-1 ${ metric.trend === 'up' ? 'text-success' : metric.trend === 'down' ? 'text-destructive' : ' ' }`}> {metric.trend === 'up' ? ( <TrendingUp className="h-3 w-3" /> ) : metric.trend === 'down' ? ( <TrendingDown className="h-3 w-3" /> ) : null} {metric.trendValue && `${metric.trendValue}%`} </div> )} </div> <div className="flex items-baseline gap-2"> <span > {metric.value.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: metric.unit === 'USD' ? 2 : 0 })} </span> <span >{metric.unit}</span> </div> </Card> )); MetricCard.displayName = 'MetricCard'; function KPIDashboardComponent({ metrics, loading }: KPIDashboardProps) { // Memoize grouped metrics calculation const groupedMetrics = useMemo(() => { return metrics.reduce((acc, metric) => { if (!acc[metric.category]) { acc[metric.category] = []; } acc[metric.category].push(metric); return acc; }, {} as Record<string, KPIMetric[]>); }, [metrics]); if (loading) { return ( <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> {[...Array(8)].map((_, i) => ( <Card key={i} className="p-6 animate-pulse"> <div className="h-4 rounded-none-none w-3/4 mb-4" /> <div className="h-8 rounded-none-none w-1/2" /> </Card> ))} </div> ); } return ( <div className="space-y-8"> {Object.entries(groupedMetrics).map(([category, categoryMetrics]) => { const Icon = categoryIcons[category as keyof typeof categoryIcons] || Activity; const colorClass = categoryColors[category as keyof typeof categoryColors] || ' '; return ( <div key={category}> <div className="flex items-center gap-2 mb-4"> <Icon className={`h-5 w-5 ${colorClass}`} /> <SubsectionHeader className="capitalize">{category} Metrics</SubsectionHeader> </div> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> {categoryMetrics.map((metric) => ( <MetricCard key={metric.name} metric={metric} /> ))} </div> </div> ); })} </div> ); } // Export memoized version export const KPIDashboard = memo(KPIDashboardComponent);
