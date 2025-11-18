'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, Award, Loader2, Plus, Shield, Smartphone, Ticket, TrendingUp, Wallet } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useWallet } from '@/lib/hooks/gvteway/useWallet';

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'tickets' | 'passes' | 'nft'>('all');
  
  const { data: walletData, isLoading, error, refetch } = useWallet();
  
  const stats = useMemo(() => {
    if (!walletData) return {
      totalItems: 0,
      activeTickets: 0,
      nftCollectibles: 0,
      loyaltyPoints: 0,
    };
    
    return {
      totalItems: walletData.items?.length || 0,
      activeTickets: walletData.items?.filter((item: any) => item.type === 'ticket' && item.status === 'active').length || 0,
      nftCollectibles: walletData.items?.filter((item: any) => item.type === 'nft').length || 0,
      loyaltyPoints: walletData.loyaltyPoints || 0,
    };
  }, [walletData]);
  
  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading wallet...</p>
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
            <h2 className="text-xl font-bebas mb-2">Failed to Load Wallet</h2>
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
                  UNIVERSAL WALLET
                </h1>
                <p className="text-xl text-gray-400 font-oswald">
                  Your digital hub for tickets, passes, and collectibles
                </p>
              </header>

              {/* Stats Grid */}
              <div className="grid md:grid-cols-4 gap-6 mb-8" role="region" aria-label="Wallet statistics">
                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Total Items</p>
                        <p className="text-3xl font-bebas text-white" aria-label={`${stats.totalItems} total items`}>{stats.totalItems}</p>
                      </div>
                      <div className="w-12 h-12 bg-gvteway-red-500/20 rounded-full flex items-center justify-center" aria-hidden="true">
                        <Wallet className="w-6 h-6 text-gvteway-red-500" aria-hidden="true" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Active Tickets</p>
                        <p className="text-3xl font-bebas text-white" aria-label={`${stats.activeTickets} active tickets`}>{stats.activeTickets}</p>
                      </div>
                      <div className="w-12 h-12 bg-gvteway-blue-500/20 rounded-full flex items-center justify-center" aria-hidden="true">
                        <Ticket className="w-6 h-6 text-gvteway-blue-500" aria-hidden="true" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">NFT Collectibles</p>
                        <p className="text-3xl font-bebas text-white" aria-label={`${stats.nftCollectibles} NFT collectibles`}>{stats.nftCollectibles}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center" aria-hidden="true">
                        <Award className="w-6 h-6 text-atlvs-purple-500" aria-hidden="true" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Loyalty Points</p>
                        <p className="text-3xl font-bebas text-white" aria-label={`${stats.loyaltyPoints} loyalty points`}>{stats.loyaltyPoints}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center" aria-hidden="true">
                        <TrendingUp className="w-6 h-6 text-success" aria-hidden="true" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <Link href="/gvteway/wallet/passes">
                  <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Smartphone className="w-12 h-12 text-gvteway-red-500 mx-auto mb-3" />
                      <h3 className="text-xl font-bebas text-white mb-2">Digital Passes</h3>
                      <p className="text-gray-400 text-sm">View all your wallet passes</p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/gvteway/wallet/nft">
                  <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Award className="w-12 h-12 text-atlvs-purple-500 mx-auto mb-3" />
                      <h3 className="text-xl font-bebas text-white mb-2">NFT Collection</h3>
                      <p className="text-gray-400 text-sm">Browse your collectibles</p>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/gvteway/wallet/credentials">
                  <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Shield className="w-12 h-12 text-gvteway-blue-500 mx-auto mb-3" />
                      <h3 className="text-xl font-bebas text-white mb-2">Credentials</h3>
                      <p className="text-gray-400 text-sm">Manage your credentials</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>

              {/* Tabs */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                  {(['all', 'tickets', 'passes', 'nft'] as const).map((tab) => (
                    <Button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      variant="ghost"
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                        activeTab === tab
                          ? 'bg-gvteway-red-500 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {tab}
                    </Button>
                  ))}
                </div>
                <Button variant="gvteway" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {/* Wallet Items Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: item * 0.1 }}
                  >
                    <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                      <div className="relative h-48 bg-gradient-to-br from-gvteway-red-500/20 to-gvteway-blue-500/20">
                        <div className="absolute top-4 right-4">
                          <Badge variant="gvteway">Active</Badge>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Ticket className="w-16 h-16 text-white/20" />
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bebas text-white mb-2">
                          Event Ticket #{item}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                          Summer Music Festival 2025
                        </p>
                        <Button variant="gvteway-outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Wallet Integration CTA */}
              <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm mt-12">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gvteway-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Smartphone className="w-8 h-8 text-gvteway-red-500" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bebas text-white mb-1">
                          Add to Mobile Wallet
                        </h3>
                        <p className="text-gray-400">
                          Access your tickets instantly on Apple Wallet or Google Pay
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Link href="/gvteway/wallet/apple-wallet">
                        <Button variant="gvteway" size="lg">
                          Apple Wallet
                        </Button>
                      </Link>
                      <Link href="/gvteway/wallet/google-wallet">
                        <Button variant="gvteway-outline" size="lg">
                          Google Pay
                        </Button>
                      </Link>
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
