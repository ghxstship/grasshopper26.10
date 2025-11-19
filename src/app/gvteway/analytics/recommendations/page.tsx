/**
 * GVTEWAY AI Recommendations Page
 * Agent 2.5: Reverse Order Implementation - Module 8
 */

'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Sparkles, Calendar, MapPin, Heart, Loader2, AlertCircle, TrendingUp } from 'lucide-react';
import { useRecommendations } from '@/lib/hooks/gvteway/useAnalytics';
import { BodyText, SectionHeader, SubsectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/analytics/recommendations

export default function AIRecommendationsPage() {
  const { data: recommendations = [], isLoading, error, refetch } = useRecommendations();

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-gradient-to-br from-black via-grey-900 to-black flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <BodyText className="text-grey-400">Loading recommendations...</BodyText>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  if (error) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-gradient-to-br from-black via-grey-900 to-black flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <SectionHeader className="mb-2">Failed to Load Recommendations</SectionHeader>
            <p className="text-grey-400 mb-4">{error.message}</p>
            <Button variant="gvteway" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  return (
    <GvtewayLayout>
    <div className="min-h-screen bg-gradient-to-br from-black via-grey-900 to-black p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-white mb-2 flex items-center gap-3">
            <Sparkles className="w-10 h-10 text-warning" />
            AI Recommendations
          </h1>
          <BodyText className="text-grey-400">Personalized event suggestions just for you</BodyText>
        </div>

        {/* Match Score Info */}
        <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-accent/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/100/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-atlvs-purple-500" />
              </div>
              <div className="flex-1">
                <SubsectionHeader className="text-white">Your Taste Profile</SubsectionHeader>
                <BodyText className="text-grey-300 text-body-sm">
                  We analyze your preferences, past events, and behavior to find perfect matches
                </BodyText>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <div className="space-y-4">
          {recommendations.length === 0 ? (
            <Card className="bg-grey-900/50 border-grey-800">
              <CardContent className="p-12 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-grey-600" />
                <BodyText className="text-grey-400">No recommendations available yet</BodyText>
                <BodyText className="text-body-sm text-grey-500 mt-2">Attend more events to get personalized recommendations</BodyText>
              </CardContent>
            </Card>
          ) : (
            recommendations.map((event) => (
            <Card key={event.id} className="bg-grey-900/50 border-grey-800 hover:border-accent/50 transition-all">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="w-48 h-32 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-atlvs-purple-500" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-white mb-2">{(event as any).title || 'Recommended Event'}</h3>
                        <div className="flex items-center gap-4 text-body-sm text-grey-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date().toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {(event as any).venue || 'TBA'}
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 px-4 py-1">
                        {(event as any).match || 85}% Match
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-body-sm">
                        <Sparkles className="w-4 h-4 text-warning" />
                        <span className="text-grey-300">{(event as any).reason || 'Based on your interests'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-grey-400 text-body-sm">From </span>
                        <span className="text-white">${(event as any).price || 0}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-grey-700">
                          <Heart className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                          View Event
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
          )}
        </div>

        {/* Preference Tuning */}
        <Card className="bg-grey-900/50 border-grey-800">
          <CardHeader>
            <CardTitle className="text-white">Tune Your Recommendations</CardTitle>
            <CardDescription>Help us understand your preferences better</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Music', 'Sports', 'Tech', 'Comedy', 'Arts', 'Food', 'Theater', 'Festivals'].map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  className="border-grey-700 hover:bg-accent/20 hover:border-accent"
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </GvtewayLayout>
  );
}
