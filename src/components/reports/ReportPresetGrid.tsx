'use client';

import { ReportPresetCard } from './ReportPresetCard';
import { Loader2 } from 'lucide-react';
import { BodyText } from "@/components/atoms/Typography";

interface ReportPreset {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  icon: string;
  color: string;
  display_format: string;
  unit: string;
}

interface ReportPresetGridProps {
  presets: ReportPreset[];
  favorites?: string[];
  loading?: boolean;
  onToggleFavorite?: (presetId: string, isFavorite: boolean) => void;
  onGenerate?: (presetId: string) => void;
}

export function ReportPresetGrid({
  presets,
  favorites = [],
  loading = false,
  onToggleFavorite,
  onGenerate,
}: ReportPresetGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
          <BodyText className="text-grey-400">Loading report presets...</BodyText>
        </div>
      </div>
    );
  }

  if (!presets || presets.length === 0) {
    return (
      <div className="text-center py-12">
        <BodyText className="text-grey-400">No report presets found</BodyText>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {presets.map((preset) => (
        <ReportPresetCard
          key={preset.id}
          preset={preset}
          isFavorite={favorites.includes(preset.id)}
          onToggleFavorite={onToggleFavorite}
          onGenerate={onGenerate}
        />
      ))}
    </div>
  );
}
