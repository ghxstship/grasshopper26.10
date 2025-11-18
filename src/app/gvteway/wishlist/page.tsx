'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Calendar, MapPin, Trash2, Share2, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useWishlists } from '@/lib/hooks/gvteway/useWishlist';

export default function WishlistPage() {
  const { data: wishlist, isLoading, error, refetch } = useWishlists();
  
  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading wishlist...</p>
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
            <h2 className="text-xl font-bebas mb-2">Failed to Load Wishlist</h2>
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
              <div className="mb-12">
                <h1 className="text-5xl sm:text-6xl font-bebas mb-4 gvteway-text-gradient">
                  MY WISHLIST
                </h1>
                <p className="text-xl text-gray-400 font-oswald">
                  Events you&apos;re interested in
                </p>
              </div>

              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <Heart className="w-8 h-8 text-gvteway-red-500 mx-auto mb-2" />
                    <p className="text-3xl font-bebas text-white mb-1">{wishlist?.length || 0}</p>
                    <p className="text-gray-400 text-sm">Saved Events</p>
                  </CardContent>
                </Card>
                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <Calendar className="w-8 h-8 text-gvteway-blue-500 mx-auto mb-2" />
                    <p className="text-3xl font-bebas text-white mb-1">2</p>
                    <p className="text-gray-400 text-sm">Upcoming</p>
                  </CardContent>
                </Card>
                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <Share2 className="w-8 h-8 text-success mx-auto mb-2" />
                    <p className="text-3xl font-bebas text-white mb-1">0</p>
                    <p className="text-gray-400 text-sm">Shared Lists</p>
                  </CardContent>
                </Card>
              </div>

              {/* Wishlist Items */}
              <div className="space-y-6">
                {(wishlist || []).map((item: any, index: number) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="w-full lg:w-48 h-48 bg-gradient-to-br from-gvteway-red-500/20 to-gvteway-blue-500/20 rounded-xl flex-shrink-0" />
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <Badge variant="gvteway-outline" className="mb-2">{item.category}</Badge>
                                <h3 className="text-2xl font-bebas text-white mb-2">{item.title}</h3>
                              </div>
                              {item.available && (
                                <Badge variant="gvteway">Available</Badge>
                              )}
                            </div>

                            <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-400 mb-4">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {item.date}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2" />
                                {item.venue}, {item.location}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                              <span className="text-3xl font-bebas text-gvteway-red-500">
                                ${item.price}
                              </span>
                              <div className="flex gap-2">
                                <Link href={`/gvteway/events/${item.id}`}>
                                  <Button variant="gvteway" size="sm" rounded="full">
                                    View Event
                                  </Button>
                                </Link>
                                <Button variant="outline" size="icon">
                                  <Share2 className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="text-error hover:text-red-400">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Empty State */}
              {(!wishlist || wishlist.length === 0) && (
                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bebas text-white mb-2">No Saved Events</h3>
                    <p className="text-gray-400 mb-6">
                      Start adding events to your wishlist to keep track of what you love
                    </p>
                    <Link href="/gvteway/events">
                      <Button variant="gvteway" size="lg" rounded="full">
                        Discover Events
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
