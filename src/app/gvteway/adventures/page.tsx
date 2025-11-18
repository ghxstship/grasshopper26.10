'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, Clock, Filter, Loader2, MapPin, Star, TrendingUp, Users } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useAdventures } from '@/lib/hooks/gvteway/useAdventures';
import { useDebounce } from 'use-debounce';

const CATEGORIES = ['All', 'VIP Experiences', 'Meet & Greets', 'Tours', 'Workshops', 'Exclusive Access'];

export default function AdventuresPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 300);
  
  const { data: adventures, isLoading, error, refetch } = useAdventures();
  
  const filteredAdventures = useMemo(() => {
    if (!adventures) return [];
    
    return adventures.filter((adventure: any) => {
      const categoryMatch = selectedCategory === 'All' || adventure.category === selectedCategory;
      const searchMatch = !debouncedSearch || 
        adventure.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        adventure.description?.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      return categoryMatch && searchMatch;
    });
  }, [adventures, selectedCategory, debouncedSearch]);
  
  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading adventures...</p>
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
            <h2 className="text-xl font-bebas mb-2">Failed to Load Adventures</h2>
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
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <header className="mb-12">
                <h1 className="text-5xl sm:text-6xl font-bebas mb-4 gvteway-text-gradient" id="page-title">
                  ADVENTURES
                </h1>
                <p className="text-xl text-gray-400 font-oswald">
                  Exclusive experiences and VIP access
                </p>
              </header>

              {/* Search */}
              <div className="flex gap-4 mb-8" role="search" aria-label="Adventure search">
                <Input 
                  placeholder="Search adventures..." 
                  className="flex-1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search adventures by name or description"
                />
                <Button variant="outline" size="lg" aria-label="Open advanced filters">
                  <Filter className="w-5 h-5 mr-2" aria-hidden="true" />
                  Filters
                </Button>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Filter by category">
                {CATEGORIES.map((category) => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? 'gvteway' : 'outline'}
                    size="sm"
                    aria-pressed={selectedCategory === category}
                    aria-label={`Filter by ${category}`}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-6 mb-12" role="region" aria-label="Adventure statistics">
                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-gvteway-red-500 mx-auto mb-2" aria-hidden="true" />
                    <p className="text-2xl font-bebas text-white mb-1" aria-label="Over 150 experiences available">150+</p>
                    <p className="text-gray-400 text-sm">Experiences Available</p>
                  </CardContent>
                </Card>
                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <Star className="w-8 h-8 text-warning mx-auto mb-2" aria-hidden="true" />
                    <p className="text-2xl font-bebas text-white mb-1" aria-label="Average rating 4.9 out of 5">4.9/5</p>
                    <p className="text-gray-400 text-sm">Average Rating</p>
                  </CardContent>
                </Card>
                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <Users className="w-8 h-8 text-gvteway-blue-500 mx-auto mb-2" aria-hidden="true" />
                    <p className="text-2xl font-bebas text-white mb-1" aria-label="Over 25 thousand happy customers">25K+</p>
                    <p className="text-gray-400 text-sm">Happy Customers</p>
                  </CardContent>
                </Card>
              </div>

              {/* Adventures Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {filteredAdventures.map((adventure: any, index: number) => (
                  <motion.div
                    key={adventure.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Link href={`/gvteway/adventures/${adventure.id}`}>
                      <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                        <div className="relative h-64 bg-gradient-to-br from-gvteway-red-500/20 to-gvteway-blue-500/20">
                          {adventure.featured && (
                            <Badge variant="gvteway" className="absolute top-4 right-4 z-10">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-6">
                          <Badge variant="gvteway-outline" className="mb-3">
                            {adventure.category}
                          </Badge>
                          <h3 className="text-2xl font-bebas text-white mb-2">
                            {adventure.title}
                          </h3>
                          <p className="text-gray-400 mb-4">{adventure.description}</p>

                          <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-400">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              {adventure.duration}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2" />
                              {adventure.capacity} spots
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {adventure.location}
                            </div>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 mr-2 fill-yellow-500 text-warning" />
                              {adventure.rating} ({adventure.reviews})
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                            <span className="text-3xl font-bebas text-gvteway-red-500">
                              ${adventure.price}
                            </span>
                            <Button variant="gvteway" size="sm" rounded="full">
                              Book Now
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
