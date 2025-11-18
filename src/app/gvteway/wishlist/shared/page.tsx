'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { Users, Share2, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { useWishlists } from '@/lib/hooks/gvteway/useWishlist';

export default function SharedWishlistsPage() {
  const { data: wishlistsData, isLoading, error, refetch } = useWishlists();

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading shared wishlists...</p>
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
            <h2 className="text-xl font-bebas mb-2">Failed to Load Wishlists</h2>
            <p className="text-gray-400 mb-4">{error.message}</p>
            <Button variant="gvteway" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  const shared = wishlistsData || [];

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-5xl font-bebas mb-8 gvteway-text-gradient">SHARED WISHLISTS</h1>

              <div className="space-y-4">
                {shared.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-xl font-bebas text-white mb-2">No Shared Wishlists</h3>
                    <p className="text-gray-400">No one has shared their wishlist with you yet</p>
                  </div>
                ) : (
                  shared.map((list: any) => (
                    <Card key={list.id} variant="gvteway" className="bg-gray-900/50">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Users className="w-8 h-8 text-gvteway-blue-500" />
                            <div>
                              <h3 className="text-xl font-bebas text-white">{list.name}</h3>
                              <p className="text-gray-400 text-sm">
                                Shared by {list.user?.name || 'User'} • {list.items?.length || 0} items
                              </p>
                            </div>
                          </div>
                          <Button variant="gvteway-outline" size="sm">
                            <Share2 className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
