'use client';

import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Star, TrendingUp, DollarSign, Users, Activity } from 'lucide-react';
import { useState } from 'react';

interface ReportPresetCardProps {
  preset: {
    id: string;
    name: string;
    description: string;
    category: string;
    subcategory: string;
    icon: string;
    color: string;
    display_format: string;
    unit: string;
  };
  isFavorite?: boolean;
  onToggleFavorite?: (presetId: string, isFavorite: boolean) => void;
  onGenerate?: (presetId: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'dollar-sign': DollarSign,
  'trending-up': TrendingUp,
  'users': Users,
  'activity': Activity,
};

export function ReportPresetCard({
  preset,
  isFavorite = false,
  onToggleFavorite,
  onGenerate,
}: ReportPresetCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const Icon = iconMap[preset.icon] || Activity;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerate?.(preset.id);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="hover:border-atlvs-green-500/50 transition-all duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-${preset.color}-500/10`}>
              <Icon className={`w-5 h-5 text-${preset.color}-500`} />
            </div>
            <div>
              <h3 className="font-semibold text-white">{preset.name}</h3>
              <p className="text-sm text-gray-400">{preset.subcategory}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleFavorite?.(preset.id, !isFavorite)}
            className="p-1"
          >
            <Star
              className={`w-5 h-5 ${
                isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'
              }`}
            />
          </Button>
        </div>

        <p className="text-sm text-gray-300 mb-4 line-clamp-2">
          {preset.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="atlvs" className="text-xs">
              {preset.category}
            </Badge>
            <Badge variant="atlvs-outline" className="text-xs">
              {preset.display_format}
            </Badge>
          </div>
          <Button
            variant="atlvs"
            size="sm"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
