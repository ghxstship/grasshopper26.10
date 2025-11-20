'use client';

import { useState} from 'react';
import { GvtewayLayout} from '@/components/templates/GvtewayLayout';
import { ContentLayout} from '@/components/templates/ContentLayout';
import { Card, CardContent} from '@/components/atoms/Card';
import { Button} from '@/components/atoms/Button';
import { Badge} from '@/components/atoms/Badge';
import { Tabs} from '@/components/molecules/Tabs';
import { EmptyState} from '@/components/molecules/EmptyState';
import { BodyText, BodyTextSmall, SubsectionHeader,
 Metadata} from '@/components/atoms/Typography';
import { Plus,
 Wallet,
 TrendingUp,
 Eye,
 Edit,
 Trash2,
 ExternalLink,
 Download
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface UserNFT {
 id: string;
 name: string;
 image: string;
 price: string;
 status: 'listed' | 'unlisted' | 'sold';
 views: number;
 likes: number;
 createdAt: string;
}

const MOCK_USER_NFTS: UserNFT[] = [
 {
 id: '1',
 name: 'My First NFT',
 image: 'https://picsum.photos/seed/mynft1/400/400',
 price: '2.5',
 status: 'listed',
 views: 234,
 likes: 45,
 createdAt: '2024-01-15'
},
 {
 id: '2',
 name: 'Digital Masterpiece',
 image: 'https://picsum.photos/seed/mynft2/400/400',
 price: '1.8',
 status: 'unlisted',
 views: 156,
 likes: 32,
 createdAt: '2024-01-20'
},
 {
 id: '3',
 name: 'Abstract Vision',
 image: 'https://picsum.photos/seed/mynft3/400/400',
 price: '3.2',
 status: 'sold',
 views: 412,
 likes: 89,
 createdAt: '2024-01-10'
}
];

export default function MyNFTsPage() {
 const [activeTab, setActiveTab] = useState('all');
 const [nfts] = useState<UserNFT[]>(MOCK_USER_NFTS);

 const filteredNFTs = nfts.filter(nft => {
 if (activeTab === 'all') return true;
 if (activeTab === 'listed') return nft.status === 'listed';
 if (activeTab === 'unlisted') return nft.status === 'unlisted';
 if (activeTab === 'sold') return nft.status === 'sold';
 return true;
});

 const stats = {
 total: nfts.length,
 listed: nfts.filter(n => n.status === 'listed').length,
 sold: nfts.filter(n => n.status === 'sold').length,
 totalValue: nfts.reduce((sum, nft) => sum + parseFloat(nft.price), 0).toFixed(2)
};

 const getStatusBadge = (status: UserNFT['status']) => {
 const variants = {
 listed: { variant: 'success' as const, label: 'Listed'},
 unlisted: { variant: 'warning' as const, label: 'Unlisted'},
 sold: { variant: 'default' as const, label: 'Sold'}
};
 return variants[status];
};

 return (
 <GvtewayLayout>
 <ContentLayout
 title="My NFTs"
 description="Manage your digital collectibles"
 breadcrumbs={[
 { label:"Home", href:"/"},
 { label:"NFT", href:"/nft"},
 { label:"My NFTs"}
 ]}
 variant="gvteway"
 primaryAction={{
 label:"Mint New NFT",
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
 <Metadata className="mb-1">Total NFTs</Metadata>
 <SubsectionHeader className="text-white">
 {stats.total}
 </SubsectionHeader>
 </div>
 <Wallet className="w-8 h-8 text-gvteway-red-500" />
 </div>
 </CardContent>
 </Card>

 <Card variant="gvteway">
 <CardContent className="pt-6">
 <div className="flex items-center justify-between">
 <div>
 <Metadata className="mb-1">Listed</Metadata>
 <SubsectionHeader className="text-white">
 {stats.listed}
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
 <Metadata className="mb-1">Sold</Metadata>
 <SubsectionHeader className="text-white">
 {stats.sold}
 </SubsectionHeader>
 </div>
 <Eye className="w-8 h-8 text-gvteway-blue-500" />
 </div>
 </CardContent>
 </Card>

 <Card variant="gvteway">
 <CardContent className="pt-6">
 <div className="flex items-center justify-between">
 <div>
 <Metadata className="mb-1">Total Value</Metadata>
 <SubsectionHeader className="text-white">
 {stats.totalValue} ETH
 </SubsectionHeader>
 </div>
 <Wallet className="w-8 h-8 text-gvteway-yellow-500" />
 </div>
 </CardContent>
 </Card>
 </div>

 {/* Tabs */}
 <Card variant="gvteway">
 <CardContent className="pt-6">
 <Tabs
 tabs={[
 { id: 'all', label:`All (${stats.total})`},
 { id: 'listed', label:`Listed (${stats.listed})`},
 { id: 'unlisted', label:`Unlisted (${nfts.filter(n => n.status === 'unlisted').length})`},
 { id: 'sold', label:`Sold (${stats.sold})`}
 ]}
 activeTab={activeTab}
 onChange={setActiveTab}
 variant="gvteway"
 />
 </CardContent>
 </Card>

 {/* NFT Grid */}
 {filteredNFTs.length > 0 ? (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
 {filteredNFTs.map((nft) => {
 const statusBadge = getStatusBadge(nft.status);
 return (
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
 <div className="absolute top-3 end-3">
 <Badge variant={statusBadge.variant}>
 {statusBadge.label}
 </Badge>
 </div>
 </div>

 {/* Info */}
 <div className="p-4 space-y-3">
 <div>
 <SubsectionHeader className="text-white mb-1">
 {nft.name}
 </SubsectionHeader>
 <BodyTextSmall className="mb-0">
 Created {new Date(nft.createdAt).toLocaleDateString()}
 </BodyTextSmall>
 </div>

 <div className="flex items-center justify-between">
 <div>
 <Metadata className="mb-1">Price</Metadata>
 <SubsectionHeader className="text-white mb-0">
 {nft.price} ETH
 </SubsectionHeader>
 </div>
 <div className="flex items-center gap-3">
 <div className="flex items-center gap-1">
 <Eye className="w-4 h-4" />
 <Metadata>{nft.views}</Metadata>
 </div></div>

 <div className="grid grid-cols-2 gap-2 pt-2">
 <Button variant="gvteway-outline" size="sm"
 onClick={() => alert(`Edit ${nft.name}`)}
 >
 <Edit className="w-4 h-4 me-1" />
 Edit
 </Button>
 <Button variant="gvteway-outline" size="sm"
 onClick={() => alert(`View ${nft.name}`)}
 >
 <ExternalLink className="w-4 h-4 me-1" />
 View
 </Button>
 </div>

 {nft.status === 'listed' && (
 <Button variant="gvteway-ghost" size="sm" className="w-full"
 onClick={() => alert(`Delist ${nft.name}`)}
 >
 <Trash2 className="w-4 h-4 me-1" />
 Delist
 </Button>
 )}
 {nft.status === 'unlisted' && (
 <Button 
 variant="gvteway" 
 size="sm" 
 className="w-full"
 onClick={() => alert(`List for sale: ${nft.name}`)}
 >
 <TrendingUp className="w-4 h-4 me-1" />
 List for Sale
 </Button>
 )}
 {nft.status === 'sold' && (
 <Button 
 variant="gvteway-outline" 
 size="sm" 
 className="w-full"
 onClick={() => alert(`Download receipt for ${nft.name}`)}
 >
 <Download className="w-4 h-4 me-1" />
 Download Receipt
 </Button>
 )}
 </div>
 </CardContent>
 </Card>
 );
})}
 </div>
 ) : (
 <EmptyState
 icon={<Wallet className="h-12 w-12" />}
 title="No NFTs Found"
 message={
 activeTab === 'all'
 ?"You haven't created any NFTs yet. Start minting your first digital collectible!"
 :`You don't have any ${activeTab} NFTs.`
}
 action={
 activeTab === 'all' ? (
 <Link href="/nft/mint">
 <Button variant="gvteway">
 <Plus className="w-4 h-4 me-2" />
 Mint Your First NFT
 </Button>
 </Link>
 ) : (
 <Button variant="gvteway" onClick={() => setActiveTab('all')}>
 View All NFTs
 </Button>
 )
}
 variant="gvteway"
 />
 )}

 {/* Quick Actions */}
 {nfts.length > 0 && (
 <Card variant="gvteway">
 <CardContent className="py-8">
 <div className="text-center max-w-2xl mx-auto">
 <SubsectionHeader className="text-white mb-3">
 Ready to Create More?
 </SubsectionHeader>
 <BodyText className="mb-6">
 Keep building your collection and showcase your creativity to the world.
 </BodyText>
 <Link href="/nft/mint">
 <Button variant="gvteway" size="lg">
 <Plus className="w-5 h-5 me-2" />
 Mint Another NFT
 </Button>
 </Link>
 </div>
 </CardContent>
 </Card>
 )}
 </div>
 </ContentLayout>
 </GvtewayLayout>
 );
}
