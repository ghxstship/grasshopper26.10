'use client';

import { useState} from 'react';
import { GvtewayLayout} from '@/components/templates/GvtewayLayout';
import { ContentLayout} from '@/components/templates/ContentLayout';
import { Card, CardContent} from '@/components/atoms/Card';
import { Button} from '@/components/atoms/Button';
import { SearchBar} from '@/components/molecules/SearchBar';
import { Tabs} from '@/components/molecules/Tabs';
import { BodyText, BodyTextSmall, SubsectionHeader,
 Metadata} from '@/components/atoms/Typography';
import { Plus,
 TrendingUp,
 Clock,
 Eye,
 Heart,
 Share2,
 Filter
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface NFT {
 id: string;
 name: string;
 image: string;
 price: string;
 creator: string;
 likes: number;
 views: number;
 isLiked: boolean;
}

const MOCK_NFTS: NFT[] = [
 {
 id: '1',
 name: 'Cosmic Voyager 001',
 image: 'https://picsum.photos/seed/nft1/400/400',
 price: '2.5',
 creator: '0x1234...5678',
 likes: 142,
 views: 1203,
 isLiked: false
},
 {
 id: '2',
 name: 'Digital Dreams',
 image: 'https://picsum.photos/seed/nft2/400/400',
 price: '1.8',
 creator: '0x8765...4321',
 likes: 89,
 views: 756,
 isLiked: true
},
 {
 id: '3',
 name: 'Abstract Reality',
 image: 'https://picsum.photos/seed/nft3/400/400',
 price: '3.2',
 creator: '0xabcd...efgh',
 likes: 234,
 views: 2104,
 isLiked: false
},
 {
 id: '4',
 name: 'Neon Genesis',
 image: 'https://picsum.photos/seed/nft4/400/400',
 price: '0.9',
 creator: '0x9876...1234',
 likes: 67,
 views: 543,
 isLiked: false
},
 {
 id: '5',
 name: 'Ethereal Essence',
 image: 'https://picsum.photos/seed/nft5/400/400',
 price: '4.1',
 creator: '0xfedc...ba98',
 likes: 312,
 views: 3421,
 isLiked: true
},
 {
 id: '6',
 name: 'Quantum Leap',
 image: 'https://picsum.photos/seed/nft6/400/400',
 price: '1.5',
 creator: '0x5555...6666',
 likes: 156,
 views: 1876,
 isLiked: false
}
];

export default function NFTPage() {
 const [searchQuery, setSearchQuery] = useState('');
 const [activeTab, setActiveTab] = useState('all');
 const [nfts, setNfts] = useState<NFT[]>(MOCK_NFTS);

 const handleLike = (id: string) => {
 setNfts(prev => prev.map(nft => nft.id === id ? { ...nft, isLiked: !nft.isLiked, likes: nft.isLiked ? nft.likes - 1 : nft.likes + 1}
 : nft
 ));
};

 const filteredNFTs = nfts.filter(nft => nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
 nft.creator.toLowerCase().includes(searchQuery.toLowerCase())
 );

 return (
 <GvtewayLayout>
 <ContentLayout
 title="NFT Marketplace"
 description="Discover, collect, and trade unique digital assets"
 breadcrumbs={[
 { label:"Home", href:"/"},
 { label:"NFT"}
 ]}
 variant="gvteway"
 primaryAction={{
 label:"Mint NFT",
 onClick: () => window.location.href = '/nft/mint',
 variant:"gvteway"
}}
 >
 <div className="space-y-6">
 {/* Stats Overview */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
 <Card variant="gvteway">
 <CardContent className="pt-6">
 <div className="flex items-center justify-between">
 <div>
 <Metadata className="mb-1">Total Volume</Metadata>
 <SubsectionHeader className="text-white">
 1,234.5 ETH
 </SubsectionHeader>
 </div>
 <TrendingUp className="w-8 h-8 text-gvteway-yellow-500" />
 </div>
 </CardContent>
 </Card>

 <Card variant="gvteway">
 <CardContent className="pt-6">
 <div className="flex items-center justify-between">
 <div>
 <Metadata className="mb-1">Total NFTs</Metadata>
 <SubsectionHeader className="text-white">
 8,432
 </SubsectionHeader>
 </div>
 <Eye className="w-8 h-8 text-gvteway-red-500" />
 </div>
 </CardContent>
 </Card>

 <Card variant="gvteway">
 <CardContent className="pt-6">
 <div className="flex items-center justify-between">
 <div>
 <Metadata className="mb-1">Creators</Metadata>
 <SubsectionHeader className="text-white">
 2,156
 </SubsectionHeader>
 </div>
 <Plus className="w-8 h-8 text-gvteway-blue-500" />
 </div>
 </CardContent>
 </Card>

 <Card variant="gvteway">
 <CardContent className="pt-6">
 <div className="flex items-center justify-between">
 <div>
 <Metadata className="mb-1">Floor Price</Metadata>
 <SubsectionHeader className="text-white">
 0.5 ETH
 </SubsectionHeader>
 </div>
 <Clock className="w-8 h-8 text-gvteway-yellow-500" />
 </div>
 </CardContent>
 </Card>
 </div>

 {/* Filters and Search */}
 <Card variant="gvteway">
 <CardContent className="pt-6">
 <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
 <div className="flex-1 w-full md:w-auto">
 <SearchBar
 placeholder="Search NFTs or creators..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 onClear={() => setSearchQuery('')}
 variant="gvteway"
 />
 </div>
 <div className="flex gap-2">
 <Button variant="gvteway-outline" size="md"
 onClick={() => alert('Filter functionality coming soon')}
 >
 <Filter className="w-4 h-4 me-2" />
 Filters
 </Button>
 </div>
 </div>

 <div className="mt-4">
 <Tabs
 tabs={[
 { id: 'all', label: 'All NFTs'},
 { id: 'trending', label: 'Trending'},
 { id: 'recent', label: 'Recent'},
 { id: 'liked', label: 'Liked'}
 ]}
 activeTab={activeTab}
 onChange={setActiveTab}
 variant="gvteway"
 />
 </div>
 </CardContent>
 </Card>

 {/* NFT Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {filteredNFTs.map((nft) => (
 <Card key={nft.id} variant="gvteway" className="group hover:shadow-2xl transition-all duration-300">
 <CardContent className="p-0">
 {/* Image */}
 <div className="relative aspect-square overflow-hidden rounded-t-xl">
 <Image
 src={nft.image}
 alt={nft.name}
 fill
 className="object-cover group-hover:scale-110 transition-transform duration-300"
 />
 <div className="absolute top-3 end-3 flex gap-2">
 <Button
 onClick={() => handleLike(nft.id)}
 variant="ghost"
 size="icon"
 className="bg-ghxst-black/60 backdrop-blur-sm rounded-full hover:bg-ghxst-black/80"
 >
 <Heart className={`w-4 h-4 ${nft.isLiked ? 'fill-gvteway-red-500 text-gvteway-red-500' : 'text-white'}`}
 />
 </Button>
 <Button variant="ghost" size="icon" className="bg-ghxst-black/60 backdrop-blur-sm rounded-full hover:bg-ghxst-black/80">
 <Share2 className="w-4 h-4 text-white" />
 </Button>
 </div>
 </div>

 {/* Info */}
 <div className="p-4 space-y-3">
 <div>
 <SubsectionHeader className="text-white mb-1">
 {nft.name}
 </SubsectionHeader>
 <BodyTextSmall className="mb-0">
 by {nft.creator}
 </BodyTextSmall>
 </div>

 <div className="flex items-center justify-between">
 <div>
 <Metadata className="mb-1">Price</Metadata>
 <BodyText className="text-white mb-0">
 {nft.price} ETH
 </BodyText>
 </div>
 <div className="flex items-center gap-3">
 <div className="flex items-center gap-1">
 <Heart className="w-4 h-4" />
 <Metadata>{nft.likes}</Metadata>
 </div>
 <div className="flex items-center gap-1">
 <Eye className="w-4 h-4" />
 <Metadata>{nft.views}</Metadata>
 </div></div>

 <div className="flex gap-2 pt-2">
 <Button variant="gvteway" size="sm" className="flex-1"
 onClick={() => alert('Buy NFT functionality coming soon')}
 >
 Buy Now
 </Button>
 <Button variant="gvteway-outline" size="sm" className="flex-1"
 onClick={() => alert('View NFT details coming soon')}
 >
 View Details
 </Button>
 </div>
 </div>
 </CardContent>
 </Card>
 ))}
 </div>

 {/* Empty State */}
 {filteredNFTs.length === 0 && (
 <Card variant="gvteway">
 <CardContent className="py-12">
 <div className="text-center">
 <Eye className="w-16 h-16 mx-auto mb-4" />
 <SubsectionHeader className="text-white mb-2">
 No NFTs Found
 </SubsectionHeader>
 <BodyTextSmall className="mb-4">
 Try adjusting your search or filters
 </BodyTextSmall>
 <Button variant="gvteway" onClick={() => setSearchQuery('')}>
 Clear Search
 </Button>
 </div>
 </CardContent>
 </Card>
 )}

 {/* CTA Section */}
 <Card variant="gvteway">
 <CardContent className="py-8">
 <div className="text-center max-w-2xl mx-auto">
 <SubsectionHeader className="text-white mb-3">
 Ready to Create Your NFT?
 </SubsectionHeader>
 <BodyText className="mb-6">
 Join thousands of creators and collectors in the GVTEWAY NFT marketplace. Mint your unique digital assets and start earning today.
 </BodyText>
 <Link href="/nft/mint">
 <Button variant="gvteway" size="lg">
 <Plus className="w-5 h-5 me-2" />
 Start Minting
 </Button>
 </Link>
 </div>
 </CardContent>
 </Card>
 </div>
 </ContentLayout>
 </GvtewayLayout>
 );
}
