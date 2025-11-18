'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, Award, ExternalLink, Filter, Grid, List, Loader2, Share2 } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useNFTs } from '@/lib/hooks/gvteway/useNFTs';

export default function NFTCollectionPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Fetch NFT tickets
  const { data: nftsData, isLoading, error, refetch } = useNFTs();
  
  // Calculate stats
  const stats = useMemo(() => {
    const nfts = nftsData?.tickets || [];
    const collections = new Set(nfts.map((nft: any) => nft.event?.title)).size;
    const legendary = nfts.filter((nft: any) => nft.ticketType?.name?.includes('VIP')).length;
    const totalValue = nfts.reduce((sum: number, nft: any) => sum + (nft.ticketType?.price || 0), 0);
    
    return {
      total: nfts.length,
      collections,
      legendary,
      totalValue: totalValue.toFixed(2),
    };
  }, [nftsData]);

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
                <Link href="/gvteway/wallet">
                  <Button variant="ghost" size="sm" className="mb-4 text-gray-400 hover:text-white">
                    ← Back to Wallet
                  </Button>
                </Link>
                <h1 className="text-5xl sm:text-6xl font-bebas mb-4 gvteway-text-gradient">
                  NFT COLLECTION
                </h1>
                <p className="text-xl text-gray-400 font-oswald">
                  Your blockchain-verified event collectibles
                </p>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-12 h-12 animate-spin text-gvteway-red-500" />
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
                  <h2 className="text-xl font-bebas mb-2">Failed to Load NFTs</h2>
                  <p className="text-gray-400 mb-4">{error.message}</p>
                  <Button variant="gvteway" onClick={() => refetch()}>
                    Try Again
                  </Button>
                </div>
              )}

              {/* Stats */}
              {!isLoading && !error && (
                <>
                  <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                      <CardContent className="p-6 text-center">
                        <p className="text-3xl font-bebas text-white mb-1">{stats.total}</p>
                        <p className="text-gray-400 text-sm">Total NFTs</p>
                      </CardContent>
                    </Card>
                    <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                      <CardContent className="p-6 text-center">
                        <p className="text-3xl font-bebas text-white mb-1">{stats.collections}</p>
                        <p className="text-gray-400 text-sm">Collections</p>
                      </CardContent>
                    </Card>
                    <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                      <CardContent className="p-6 text-center">
                        <p className="text-3xl font-bebas text-white mb-1">{stats.legendary}</p>
                        <p className="text-gray-400 text-sm">Legendary</p>
                      </CardContent>
                    </Card>
                    <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                      <CardContent className="p-6 text-center">
                        <p className="text-3xl font-bebas text-white mb-1">${stats.totalValue}</p>
                        <p className="text-gray-400 text-sm">Est. Value</p>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}

              {/* Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setViewMode('grid')}
                    variant={viewMode === 'grid' ? 'gvteway' : 'outline'}
                    size="sm"
                  >
                    <Grid className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => setViewMode('list')}
                    variant={viewMode === 'list' ? 'gvteway' : 'outline'}
                    size="sm"
                  >
                    <List className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* NFT Grid */}
              {!isLoading && !error && (
                <>
                  {nftsData?.tickets.length === 0 ? (
                    <div className="text-center py-12">
                      <Award className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                      <h3 className="text-xl font-bebas text-white mb-2">No NFT Tickets Yet</h3>
                      <p className="text-gray-400 mb-6">
                        Purchase tickets to events and they&apos;ll appear here as NFT collectibles
                      </p>
                      <Link href="/gvteway/events">
                        <Button variant="gvteway">
                          Browse Events
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                      {nftsData?.tickets.map((nft: any, index: number) => (
                        <motion.div
                          key={nft.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                          <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                            {/* NFT Image */}
                            <div className="relative aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                              <div className="absolute top-4 right-4 z-10">
                                <Badge variant={nft.ticketType?.name?.includes('VIP') ? 'gvteway' : 'default'}>
                                  {nft.ticketType?.name?.includes('VIP') ? 'Legendary' : 'Standard'}
                                </Badge>
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Award className="w-24 h-24 text-white/20" />
                              </div>
                            </div>

                            <CardContent className="p-6">
                              <div className="mb-4">
                                <p className="text-gray-400 text-xs mb-1">{nft.event?.title || 'Event'}</p>
                                <h3 className="text-xl font-bebas text-white mb-1">{nft.ticketType?.name || 'Ticket'}</h3>
                                <p className="text-gray-400 text-sm">#{nft.id.slice(0, 8)}</p>
                              </div>

                              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
                                <div>
                                  <p className="text-gray-400 text-xs">Status</p>
                                  <p className="text-white text-sm font-medium">{nft.status}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-gray-400 text-xs">Value</p>
                                  <p className="text-white text-sm font-medium">${nft.ticketType?.price || '0.00'}</p>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Link href={`/gvteway/tickets/${nft.id}`} className="flex-1">
                                  <Button variant="gvteway" size="sm" className="w-full">
                                    View Details
                                  </Button>
                                </Link>
                                <Button variant="outline" size="icon">
                                  <Share2 className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon">
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Info Card */}
              <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm mt-12">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-atlvs-purple-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bebas text-white mb-2">
                        About NFT Tickets
                      </h3>
                      <p className="text-gray-400 mb-4">
                        NFT tickets are blockchain-verified digital collectibles that serve as proof of attendance and can appreciate in value over time. They&apos;re secure, transferable, and yours forever.
                      </p>
                      <Button variant="gvteway-outline">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
