/**
 * GVTEWAY AI Recommendations Page
 * Agent 2.5: Reverse Order Implementation - Module 8
 */

'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Sparkles, Calendar, MapPin, Heart, Loader2, AlertCircle, TrendingUp } from 'lucide-react';
import { useRecommendations } from '@/lib/hooks/gvteway/useAnalytics';

export default function AIRecommendationsPage() {
  const { data: recommendations = [], isLoading, error, refetch } = useRecommendations();

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading recommendations...</p>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  if (error) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load Recommendations</h2>
            <p className="text-gray-400 mb-4">{error.message}</p>
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Sparkles className="w-10 h-10 text-yellow-400" />
            AI Recommendations
          </h1>
          <p className="text-gray-400">Personalized event suggestions just for you</p>
        </div>

        {/* Match Score Info */}
        <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-atlvs-purple-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg">Your Taste Profile</h3>
                <p className="text-gray-300 text-sm">
                  We analyze your preferences, past events, and behavior to find perfect matches
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <div className="space-y-4">
          {recommendations.length === 0 ? (
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-12 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">No recommendations available yet</p>
                <p className="text-sm text-gray-500 mt-2">Attend more events to get personalized recommendations</p>
              </CardContent>
            </Card>
          ) : (
            recommendations.map((event) => (
            <Card key={event.id} className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all">
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="w-48 h-32 bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-atlvs-purple-500" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{(event as any).title || 'Recommended Event'}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
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
                      <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 text-lg px-4 py-1">
                        {(event as any).match || 85}% Match
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-300">{(event as any).reason || 'Based on your interests'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-400 text-sm">From </span>
                        <span className="text-2xl font-bold text-white">${(event as any).price || 0}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-gray-700">
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
        <Card className="bg-gray-900/50 border-gray-800">
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
                  className="border-gray-700 hover:bg-purple-600/20 hover:border-purple-500"
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
