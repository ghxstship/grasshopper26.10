'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { ReportPresetGrid } from '@/components/reports/ReportPresetGrid';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { useReportPresets, useCategoryPresets, useFavoriteReports, useToggleFavorite } from '@/lib/hooks/atlvs/useReportPresets';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ReportPreset {
  id: string;
  name: string;
  category?: string;
  [key: string]: unknown;
}

import { Star, DollarSign, Ticket, Settings, TrendingUp, Users, Shield, Leaf, Cpu, Loader2, AlertCircle } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Reports', icon: Star },
  { id: 'financial', label: 'Financial', icon: DollarSign, count: 30 },
  { id: 'tickets', label: 'Tickets', icon: Ticket, count: 30 },
  { id: 'operational', label: 'Operational', icon: Settings, count: 35 },
  { id: 'marketing', label: 'Marketing', icon: TrendingUp, count: 35 },
  { id: 'customer', label: 'Customer', icon: Users, count: 25 },
  { id: 'safety', label: 'Safety', icon: Shield, count: 20 },
  { id: 'sustainability', label: 'Sustainability', icon: Leaf, count: 15 },
  { id: 'technology', label: 'Technology', icon: Cpu, count: 10 },
];

export default function ReportPresetsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const { data: allPresetsData, isLoading: loadingAll } = useReportPresets();
  const { data: categoryPresets, isLoading: loadingCategory } = useCategoryPresets(
    selectedCategory !== 'all' ? selectedCategory : ''
  );
  const { data: favoriteReports } = useFavoriteReports();
  const toggleFavorite = useToggleFavorite();

  const isLoading = selectedCategory === 'all' ? loadingAll : loadingCategory;
  
  const presets = selectedCategory === 'all' 
    ? allPresetsData?.presets || []
    : categoryPresets || [];

  const favoriteIds = favoriteReports?.map((f: { preset_id: string }) => f.preset_id) || [];

  const displayedPresets = showFavoritesOnly
    ? presets.filter((p: { id: string }) => favoriteIds.includes(p.id))
    : presets;

  const handleToggleFavorite = (presetId: string, isFavorite: boolean) => {
    toggleFavorite.mutate({ presetId, isFavorite });
  };

  const queryClient = useQueryClient();
  const generateReportMutation = useMutation({
    mutationFn: async (preset: ReportPreset) => {
      const response = await fetch('/api/atlvs/analytics/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presetId: preset.id, kpiFunction: preset.kpi_function }),
      });
      if (!response.ok) throw new Error('Failed to generate report');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });

  const handleGenerateReport = (presetId: string) => {
    const preset = displayedPresets.find((p: ReportPreset) => p.id === presetId);
    if (preset) {
      generateReportMutation.mutate(preset);
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="REPORT PRESETS"
        description="200+ pre-configured KPI reports ready to generate"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Analytics', href: '/atlvs/analytics' },
          { label: 'Report Presets' }
        ]}
      >
        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => {
                const Icon = category.icon;
                const isActive = selectedCategory === category.id;
                return (
                  <Button
                    key={category.id}
                    variant={isActive ? 'atlvs' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {category.label}
                    {category.count && (
                      <Badge variant="atlvs-outline" className="ml-1">
                        {category.count}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </div>

            <Button
              variant={showFavoritesOnly ? 'atlvs' : 'outline'}
              size="sm"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className="gap-2"
            >
              <Star className={showFavoritesOnly ? 'fill-current' : ''} />
              Favorites Only
              {favoriteIds.length > 0 && (
                <Badge variant="atlvs-outline">{favoriteIds.length}</Badge>
              )}
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <p className="text-body-sm text-gray-400 mb-1">Total Presets</p>
              <p className="text-h4 text-white">
                {allPresetsData?.total || 200}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <p className="text-body-sm text-gray-400 mb-1">Categories</p>
              <p className="text-h4 text-white">8</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <p className="text-body-sm text-gray-400 mb-1">Your Favorites</p>
              <p className="text-h4 text-atlvs-green-500">
                {favoriteIds.length}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
              <p className="text-body-sm text-gray-400 mb-1">Showing</p>
              <p className="text-h4 text-white">
                {displayedPresets.length}
              </p>
            </div>
          </div>
        </div>

        {/* Report Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
              <p className="text-gray-400">Loading report presets...</p>
            </div>
          </div>
        ) : displayedPresets.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400">
              {showFavoritesOnly 
                ? 'No favorite reports yet. Star some reports to add them to favorites!' 
                : 'No reports found in this category'}
            </p>
          </div>
        ) : (
          <ReportPresetGrid
            presets={displayedPresets}
            favorites={favoriteIds}
            onToggleFavorite={handleToggleFavorite}
            onGenerate={handleGenerateReport}
          />
        )}

        {/* Help Text */}
        <div className="mt-8 p-4 bg-atlvs-green-500/10 border border-atlvs-green-500/30 rounded-lg">
          <p className="text-body-sm text-gray-300">
            <strong className="text-atlvs-green-500">💡 Tip:</strong> Each report preset is linked to a KPI calculation function. 
            Click &quot;Generate&quot; to create a report for a specific event or project. Star your most-used reports for quick access!
          </p>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
