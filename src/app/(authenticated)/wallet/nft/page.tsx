/**
 * NFT Collection Page - UI Rebuild
 * View and manage NFT collection
 */

'use client';

import * as React from 'react';
import { H1, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui-rebuild/molecules/Tabs';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { Image as ImageIcon, ExternalLink } from 'lucide-react';

interface NFT {
  id: string;
  tokenId: string;
  name: string;
  description: string;
  imageUrl: string;
  collection: string;
  blockchain: 'ETHEREUM' | 'POLYGON' | 'SOLANA';
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  acquiredDate: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export default function NFTCollectionPage() {
  const [loading, setLoading] = React.useState(true);
  const [nfts, setNfts] = React.useState<NFT[]>([]);
  const [filter, setFilter] = React.useState<'all' | NFT['blockchain']>('all');

  React.useEffect(() => {
    const fetchNFTs = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ nfts: NFT[] }>('/api/wallet/nft');
        if (response.data?.nfts) {
          setNfts(response.data.nfts);
        }
      } catch (error) {
        console.error('Failed to fetch NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  const getRarityColor = (rarity: NFT['rarity']) => {
    switch (rarity) {
      case 'LEGENDARY':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'EPIC':
        return 'bg-gradient-to-r from-purple-400 to-pink-500';
      case 'RARE':
        return 'bg-gradient-to-r from-blue-400 to-cyan-500';
      case 'UNCOMMON':
        return 'bg-gradient-to-r from-green-400 to-emerald-500';
      case 'COMMON':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const filteredNFTs = filter === 'all' ? nfts : nfts.filter(nft => nft.blockchain === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">NFT Collection</H1>
          <Body className="text-gray-600">
            Your digital collectibles and NFTs
          </Body>
        </div>

        {nfts.length === 0 ? (
          <Card>
            <CardContent className="py-24 text-center">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <H3 className="mb-4">No NFTs yet</H3>
              <Body className="text-gray-600 mb-6">
                Start collecting NFTs from events and exclusive drops
              </Body>
              <Button>Explore NFTs</Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Filter Tabs */}
            <Tabs defaultValue="all" value={filter} onValueChange={(value) => setFilter(value as typeof filter)} className="mb-8">
              <TabsList>
                <TabsTrigger value="all">All ({nfts.length})</TabsTrigger>
                <TabsTrigger value="ETHEREUM">
                  Ethereum ({nfts.filter(n => n.blockchain === 'ETHEREUM').length})
                </TabsTrigger>
                <TabsTrigger value="POLYGON">
                  Polygon ({nfts.filter(n => n.blockchain === 'POLYGON').length})
                </TabsTrigger>
                <TabsTrigger value="SOLANA">
                  Solana ({nfts.filter(n => n.blockchain === 'SOLANA').length})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* NFT Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredNFTs.map((nft) => (
                <Card key={nft.id} className="overflow-hidden">
                  <div className="aspect-square bg-gray-200 border-b-2 border-black relative">
                    {nft.imageUrl ? (
                      <img
                        src={nft.imageUrl}
                        alt={nft.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge className={getRarityColor(nft.rarity)}>
                        {nft.rarity}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline">{nft.blockchain}</Badge>
                    </div>
                    <CardTitle className="text-base">{nft.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {nft.collection}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Caption className="text-gray-500 text-xs">
                      Token ID: {nft.tokenId}
                    </Caption>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="secondary" size="sm" className="flex-1">
                      View
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Collection Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Body className="text-gray-500 mb-2">Total NFTs</Body>
              <H3>{nfts.length}</H3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Body className="text-gray-500 mb-2">Collections</Body>
              <H3>{new Set(nfts.map(n => n.collection)).size}</H3>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Body className="text-gray-500 mb-2">Blockchains</Body>
              <H3>{new Set(nfts.map(n => n.blockchain)).size}</H3>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
