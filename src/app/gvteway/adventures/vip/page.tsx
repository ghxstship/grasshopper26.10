'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Crown, Star, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { useAdventures } from '@/lib/hooks/gvteway/useAdventures';

export default function VIPExperiencesPage() {
  const { data: adventuresData, isLoading, error, refetch } = useAdventures();

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading VIP experiences...</p>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  if (error) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load Experiences</h2>
            <p className="text-gray-400 mb-4">{error.message}</p>
            <Button variant="gvteway" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  const experiences = adventuresData || [];

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="text-center mb-12">
                <Crown className="w-16 h-16 text-warning mx-auto mb-4" />
                <h1 className="text-5xl font-bebas gvteway-text-gradient mb-4">VIP EXPERIENCES</h1>
                <p className="text-xl text-gray-400">Exclusive access and premium treatment</p>
              </div>

              {experiences.length === 0 ? (
                <div className="text-center py-12 col-span-full">
                  <Crown className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <h3 className="text-xl font-bebas text-white mb-2">No VIP Experiences Available</h3>
                  <p className="text-gray-400">Check back soon for exclusive VIP experiences</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {experiences.map((exp: any) => (
                    <Link key={exp.id} href={`/gvteway/adventures/${exp.id}`}>
                      <Card variant="gvteway" className="bg-gray-900/50 hover:scale-105 transition-transform cursor-pointer">
                        <div className="h-48 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                          <Crown className="w-16 h-16 text-warning/50" />
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bebas text-white mb-2">{exp.title || exp.name}</h3>
                          <div className="flex items-center mb-4">
                            <Star className="w-4 h-4 fill-yellow-500 text-warning mr-1" />
                            <span className="text-white text-sm">{exp.rating || '4.8'}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bebas text-gvteway-red-500">${exp.price}</span>
                            <Button variant="gvteway" size="sm">Book</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
