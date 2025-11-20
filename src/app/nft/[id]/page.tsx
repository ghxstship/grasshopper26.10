'use client';

import { useState} from 'react';
import { useParams} from 'next/navigation';
import { GvtewayLayout} from '@/components/templates/GvtewayLayout';
import { ContentLayout} from '@/components/templates/ContentLayout';
import { Card, CardHeader, CardTitle, CardContent} from '@/components/atoms/Card';
import { Button} from '@/components/atoms/Button';
import { Badge} from '@/components/atoms/Badge';
import { Avatar} from '@/components/atoms/Avatar';
import { Tabs} from '@/components/molecules/Tabs';
import { Alert} from '@/components/molecules/Alert';
import { BodyText, BodyTextSmall, SubsectionHeader,
 Metadata} from '@/components/atoms/Typography';
import { Heart,
 Share2,
 ExternalLink,
 TrendingUp,
 Eye,
 ShoppingCart,
 Tag,
 Verified
} from 'lucide-react';
import Image from 'next/image';

interface NFTData {
 id: string;
 name: string;
 description: string;
 image: string;
 price: string;
 owner: {
 address: string;
 name: string;
 avatar: string;
 verified: boolean;
};
 creator: {
 address: string;
 name: string;
 avatar: string;
 verified: boolean;
};
 collection: string;
 tokenId: string;
 contractAddress: string;
 blockchain: string;
 royalty: string;
 views: number;
 likes: number;
 isLiked: boolean;
 attributes: Array<{ trait: string; value: string; rarity: string}>;
 history: Array<{
 event: string;
 from: string;
 to: string;
 price: string;
 date: string;
}>;
 offers: Array<{
 from: string;
 price: string;
 expiry: string;
}>;
}

const MOCK_NFT: NFTData = {
 id: '1',
 name: 'Cosmic Voyager 001',
 description: 'A unique space explorer traveling through the metaverse. This NFT represents the first in a collection of 10,000 unique voyagers, each with their own story and attributes.',
 image: 'https://picsum.photos/seed/nftdetail1/800/800',
 price: '2.5',
 owner: {
 address: '0x1234...5678',
 name: 'CryptoCollector',
 avatar: 'https://picsum.photos/seed/owner1/100/100',
 verified: true
},
 creator: {
 address: '0x8765...4321',
 name: 'DigitalArtist',
 avatar: 'https://picsum.photos/seed/creator1/100/100',
 verified: true
},
 collection: 'Cosmic Voyagers',
 tokenId: '1',
 contractAddress: '0xabcd...efgh',
 blockchain: 'Ethereum',
 royalty: '10',
 views: 1203,
 likes: 142,
 isLiked: false,
 attributes: [
 { trait: 'Background', value: 'Nebula', rarity: '12%'},
 { trait: 'Suit', value: 'Quantum', rarity: '5%'},
 { trait: 'Helmet', value: 'Crystal', rarity: '8%'},
 { trait: 'Accessory', value: 'Laser Sword', rarity: '3%'}
 ],
 history: [
 { event: 'Sale', from: '0xaaa...bbb', to: '0x1234...5678', price: '2.5', date: '2024-01-20'},
 { event: 'Transfer', from: '0xccc...ddd', to: '0xaaa...bbb', price: '0', date: '2024-01-15'},
 { event: 'Minted', from: '0x000...000', to: '0xccc...ddd', price: '0', date: '2024-01-10'}
 ],
 offers: [
 { from: '0xeee...fff', price: '2.3', expiry: '2024-02-01'},
 { from: '0xggg...hhh', price: '2.1', expiry: '2024-01-28'}
 ]
};

export default function NFTDetailPage() {
 const params = useParams();
 const [nft, setNft] = useState<NFTData>(MOCK_NFT);
 const [activeTab, setActiveTab] = useState('details');
 const [_copied, setCopied] = useState(false);

 const handleLike = () => {
 setNft(prev => ({
 ...prev,
 isLiked: !prev.isLiked,
 likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
}));
};

 const _handleCopy = (text: string) => {
 navigator.clipboard.writeText(text);
 setCopied(true);
 setTimeout(() => setCopied(false), 2000);
};

 return (
 <GvtewayLayout>
 <ContentLayout
 title={nft.name}
 description={`NFT #${params.id}`}
 breadcrumbs={[
 { label:"Home", href:"/"},
 { label:"NFT", href:"/nft"},
 { label: nft.collection, href:"/nft/collection"},
 { label: nft.name}
 ]}
 variant="gvteway"
 >
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
 {/* Left Column - Image */}
 <div className="space-y-4">
 <Card variant="gvteway">
 <CardContent className="p-0">
 <div className="relative aspect-square overflow-hidden rounded-xl">
 <Image
 src={nft.image}
 alt={nft.name}
 fill
 className="object-cover"
 />
 </div>
 </CardContent>
 </Card>

 {/* Stats */}
 <div className="grid grid-cols-2 gap-4">
 <Card variant="gvteway">
 <CardContent className="pt-6">
 <div className="flex items-center gap-3">
 <Eye className="w-6 h-6 text-gvteway-yellow-500" />
 <div>
 <Metadata>Views</Metadata>
 <SubsectionHeader className="text-white mb-0">
 {nft.views.toLocaleString()}
 </SubsectionHeader>
 </div>
 </div>
 </CardContent>
 </Card>

 <Card variant="gvteway">
 <CardContent className="pt-6">
 <div className="flex items-center gap-3">
 <Heart className="w-6 h-6 text-gvteway-red-500" />
 <div>
 <Metadata>Likes</Metadata>
 <SubsectionHeader className="text-white mb-0">
 {nft.likes.toLocaleString()}
 </SubsectionHeader>
 </div>
 </div>
 </CardContent>
 </Card>
 </div>
 </div>

 {/* Right Column - Details */}
 <div className="space-y-6">
 {/* Collection Badge */}
 <div className="flex items-center gap-2">
 <Badge variant="gvteway">
 {nft.collection}
 </Badge>
 <Badge variant="default">
 {nft.blockchain}
 </Badge>
 </div>

 {/* Title and Actions */}
 <div>
 <SubsectionHeader className="text-white mb-2">
 {nft.name}
 </SubsectionHeader>
 <div className="flex items-center gap-4">
 <Button
 variant={nft.isLiked ? 'gvteway' : 'gvteway-outline'}
 size="sm"
 onClick={handleLike}
 >
 <Heart className={`w-4 h-4 me-1 ${nft.isLiked ? 'fill-current' : ''}`} />
 {nft.likes}
 </Button>
 <Button 
 variant="ghost" 
 size="icon"
 onClick={() => alert('Share NFT functionality coming soon')}
 >
 <Share2 className="w-4 h-4" />
 </Button>
 <Button 
 variant="ghost" 
 size="icon"
 onClick={() => window.open('https://etherscan.io', '_blank')}
 >
 <ExternalLink className="w-4 h-4" />
 </Button>
 </div>
 </div>

 {/* Owner & Creator */}
 <Card variant="gvteway">
 <CardContent className="pt-6 space-y-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <Avatar
 src={nft.owner.avatar}
 alt={nft.owner.name}
 fallback={nft.owner.name}
 size="md"
 />
 <div>
 <Metadata>Owned by</Metadata>
 <div className="flex items-center gap-1">
 <BodyTextSmall className="text-white mb-0">
 {nft.owner.name}
 </BodyTextSmall>
 {nft.owner.verified && (
 <Verified className="w-4 h-4 text-gvteway-blue-500 fill-gvteway-blue-500" />
 )}
 </div>
 </div>
 </div>
 </div>

 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <Avatar
 src={nft.creator.avatar}
 alt={nft.creator.name}
 fallback={nft.creator.name}
 size="md"
 />
 <div>
 <Metadata>Created by</Metadata>
 <div className="flex items-center gap-1">
 <BodyTextSmall className="text-white mb-0">
 {nft.creator.name}
 </BodyTextSmall>
 {nft.creator.verified && (
 <Verified className="w-4 h-4 text-gvteway-blue-500 fill-gvteway-blue-500" />
 )}
 </div>
 </div>
 </div>
 </div>
 </CardContent>
 </Card>

 {/* Price and Buy */}
 <Card variant="gvteway">
 <CardContent className="pt-6 space-y-4">
 <div>
 <Metadata className="mb-2">Current Price</Metadata>
 <SubsectionHeader className="text-white">
 {nft.price} ETH
 </SubsectionHeader>
 <BodyTextSmall className="mb-0">
 ≈ ${(parseFloat(nft.price) * 2000).toFixed(2)} USD
 </BodyTextSmall>
 </div>

 <div className="grid grid-cols-2 gap-3">
 <Button 
 variant="gvteway" 
 size="lg" 
 className="flex-1"
 onClick={() => alert('Buy now functionality coming soon')}
 >
 <ShoppingCart className="w-5 h-5 me-2" />
 Buy Now
 </Button>
 <Button 
 variant="gvteway-outline" 
 size="lg" 
 className="flex-1"
 onClick={() => alert('Make offer functionality coming soon')}
 >
 <Tag className="w-5 h-5 me-2" />
 Make Offer
 </Button>
 </div>
 </CardContent>
 </Card>

 {/* Contract Info */}
 <Card variant="gvteway">
 <CardHeader>
 <CardTitle>Contract Details</CardTitle>
 </CardHeader>
 <CardContent className="space-y-3">
 <div className="flex items-center justify-between">
 <Metadata>Token ID</Metadata>
 <BodyTextSmall className="text-white mb-0">
 {nft.tokenId}
 </BodyTextSmall>
 </div>
 <div className="flex items-center justify-between">
 <Metadata>Royalty</Metadata>
 <BodyTextSmall className="text-white mb-0">
 {nft.royalty}%
 </BodyTextSmall>
 </div>
 </CardContent>
 </Card>
 </div>
 </div>

 {/* Tabs Section */}
 <div className="mt-8">
 <Card variant="gvteway">
 <CardContent className="pt-6">
 <Tabs
 tabs={[
 { id: 'details', label: 'Details'},
 { id: 'attributes', label: 'Attributes'},
 { id: 'history', label: 'History'},
 { id: 'offers', label:`Offers (${nft.offers.length})`}
 ]}
 activeTab={activeTab}
 onChange={setActiveTab}
 variant="gvteway"
 />

 <div className="mt-6">
 {activeTab === 'details' && (
 <div className="space-y-4">
 <div>
 <SubsectionHeader className="text-white mb-3">
 Description
 </SubsectionHeader>
 <BodyText>
 {nft.description}
 </BodyText>
 </div>
 </div>
 )}

 {activeTab === 'attributes' && (
 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 {nft.attributes.map((attr, index) => (
 <Card key={index} variant="default">
 <CardContent className="pt-6 text-center">
 <Metadata className="mb-1 uppercase">
 {attr.trait}
 </Metadata>
 <SubsectionHeader className="text-white mb-1">
 {attr.value}
 </SubsectionHeader>
 <BodyTextSmall className="mb-0">
 {attr.rarity} have this trait
 </BodyTextSmall>
 </CardContent>
 </Card>
 ))}
 </div>
 )}

 {activeTab === 'history' && (
 <div className="space-y-3">
 {nft.history.map((item, index) => (
 <Card key={index} variant="default">
 <CardContent className="pt-6">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="p-2 bg-gvteway-red-500/10 rounded-lg">
 {item.event === 'Sale' && <ShoppingCart className="w-5 h-5 text-gvteway-red-500" />}
 {item.event === 'Transfer' && <TrendingUp className="w-5 h-5 text-gvteway-yellow-500" />}
 {item.event === 'Minted' && <Tag className="w-5 h-5 text-gvteway-blue-500" />}
 </div>
 <div>
 <BodyText className="text-white mb-1">
 {item.event}
 </BodyText>
 <BodyTextSmall className="mb-0">
 From {item.from} to {item.to}
 </BodyTextSmall>
 </div>
 </div>
 <div className="text-right">
 {item.price !== '0' && (
 <SubsectionHeader className="text-white mb-1">
 {item.price} ETH
 </SubsectionHeader>
 )}
 <Metadata>
 {new Date(item.date).toLocaleDateString()}
 </Metadata>
 </div>
 </div>
 </CardContent>
 </Card>
 ))}
 </div>
 )}

 {activeTab === 'offers' && (
 <div className="space-y-3">
 {nft.offers.length > 0 ? (
 nft.offers.map((offer, index) => (
 <Card key={index} variant="default">
 <CardContent className="pt-6">
 <div className="flex items-center justify-between">
 <div>
 <BodyText className="text-white mb-1">
 {offer.price} ETH
 </BodyText>
 <BodyTextSmall className="mb-0">
 From {offer.from}
 </BodyTextSmall>
 </div>
 <div className="text-right">
 <BodyTextSmall className="mb-2">
 Expires {new Date(offer.expiry).toLocaleDateString()}
 </BodyTextSmall>
 <div className="flex gap-2">
 <Button variant="gvteway" size="sm"
 onClick={() => alert(`Accepting offer from ${offer.from}`)}
 >
 Accept
 </Button>
 <Button variant="gvteway-outline" size="sm"
 onClick={() => alert(`Counter offer from ${offer.from}`)}
 >
 Counter
 </Button>
 </div>
 </div>
 </div>
 </CardContent>
 </Card>
 ))
 ) : (
 <Alert variant="info" title="No Offers Yet">
 <BodyTextSmall className="mb-0">
 This NFT hasn&apos;t received any offers yet.
 </BodyTextSmall>
 </Alert>
 )}
 </div>
 )}
 </div>
 </CardContent>
 </Card>
 </div>
 </ContentLayout>
 </GvtewayLayout>
 );
}
