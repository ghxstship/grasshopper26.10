'use client';

import { useState} from 'react';
import { GvtewayLayout} from '@/components/templates/GvtewayLayout';
import { ContentLayout} from '@/components/templates/ContentLayout';
import { Card, CardContent} from '@/components/atoms/Card';
import { Button} from '@/components/atoms/Button';
import { SearchBar} from '@/components/molecules/SearchBar';
import { BodyTextSmall, SubsectionHeader, Metadata} from '@/components/atoms/Typography';
import { Grid,
 List,
 Users,
 Eye,
 Verified,
 ExternalLink
} from 'lucide-react';
import Image from 'next/image';

interface Collection {
 id: string;
 name: string;
 description: string;
 image: string;
 banner: string;
 creator: string;
 verified: boolean;
 items: number;
 owners: number;
 floorPrice: string;
 volume: string;
 change24h: number;
}

const MOCK_COLLECTIONS: Collection[] = [
 {
 id: '1',
 name: 'Cosmic Voyagers',
 description: 'A collection of 10,000 unique space explorers traveling through the metaverse',
 image: 'https://picsum.photos/seed/collection1/200/200',
 banner: 'https://picsum.photos/seed/banner1/1200/300',
 creator: '0x1234...5678',
 verified: true,
 items: 10000,
 owners: 4523,
 floorPrice: '2.5',
 volume: '1234.5',
 change24h: 12.5
},
 {
 id: '2',
 name: 'Digital Dreams',
 description: 'Surreal digital art exploring the boundaries of imagination',
 image: 'https://picsum.photos/seed/collection2/200/200',
 banner: 'https://picsum.photos/seed/banner2/1200/300',
 creator: '0x8765...4321',
 verified: true,
 items: 5000,
 owners: 2341,
 floorPrice: '1.8',
 volume: '876.3',
 change24h: -5.2
},
 {
 id: '3',
 name: 'Abstract Reality',
 description: 'Where abstract meets reality in stunning visual compositions',
 image: 'https://picsum.photos/seed/collection3/200/200',
 banner: 'https://picsum.photos/seed/banner3/1200/300',
 creator: '0xabcd...efgh',
 verified: false,
 items: 7500,
 owners: 3124,
 floorPrice: '3.2',
 volume: '2104.7',
 change24h: 8.9
},
 {
 id: '4',
 name: 'Neon Genesis',
 description: 'Cyberpunk-inspired characters living in a neon-lit future',
 image: 'https://picsum.photos/seed/collection4/200/200',
 banner: 'https://picsum.photos/seed/banner4/1200/300',
 creator: '0x9876...1234',
 verified: true,
 items: 8888,
 owners: 4012,
 floorPrice: '0.9',
 volume: '543.2',
 change24h: 15.3
}
];

export default function CollectionPage() {
 const [searchQuery, setSearchQuery] = useState('');
 const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

 const filteredCollections = MOCK_COLLECTIONS.filter(collection =>
 collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
 collection.description.toLowerCase().includes(searchQuery.toLowerCase())
 );

 return (
 <GvtewayLayout>
 <ContentLayout
 title="NFT Collections"
 description="Explore curated collections from top creators"
 breadcrumbs={[
 { label:"Home", href:"/"},
 { label:"NFT", href:"/nft"},
 { label:"Collections"}
 ]}
 variant="gvteway"
 >
 <div className="space-y-6">
 {/* Search and View Toggle */}
 <Card variant="gvteway">
 <CardContent className="pt-6">
 <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
 <div className="flex-1 w-full md:w-auto">
 <SearchBar
 placeholder="Search collections..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 onClear={() => setSearchQuery('')}
 variant="gvteway"
 />
 </div>
 <div className="flex gap-2">
 <Button
 variant={viewMode === 'grid' ? 'gvteway' : 'gvteway-outline'}
 size="md"
 onClick={() => setViewMode('grid')}
 >
 <Grid className="w-4 h-4" />
 </Button>
 <Button
 variant={viewMode === 'list' ? 'gvteway' : 'gvteway-outline'}
 size="md"
 onClick={() => setViewMode('list')}
 >
 <List className="w-4 h-4" />
 </Button>
 </div>
 </div>
 </CardContent>
 </Card>

 {/* Collections Grid/List */}
 {viewMode === 'grid' ? (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 {filteredCollections.map((collection) => (
 <Card key={collection.id} variant="gvteway" className="group hover:shadow-2xl transition-all duration-300">
 <CardContent className="p-0">
 {/* Banner */}
 <div className="relative h-32 overflow-hidden rounded-t-xl">
 <Image
 src={collection.banner}
 alt={`${collection.name} banner`}
 fill
 className="object-cover group-hover:scale-110 transition-transform duration-300"
 />
 </div>

 {/* Collection Avatar */}
 <div className="relative px-6 -mt-12 mb-4">
 <div className="relative w-24 h-24 rounded-xl border-4 border-ghxst-black overflow-hidden">
 <Image
 src={collection.image}
 alt={collection.name}
 fill
 className="object-cover"
 />
 </div>
 </div>

 {/* Info */}
 <div className="px-6 pb-6 space-y-4">
 <div>
 <div className="flex items-center gap-2 mb-2">
 <SubsectionHeader className="text-white">
 {collection.name}
 </SubsectionHeader>
 {collection.verified && (
 <Verified className="w-5 h-5 text-gvteway-blue-500 fill-gvteway-blue-500" />
 )}
 </div>
 <BodyTextSmall className="mb-2">
 {collection.description}
 </BodyTextSmall>
 <BodyTextSmall className="mb-0">
 by {collection.creator}
 </BodyTextSmall>
 </div>

 {/* Stats */}
 <div className="grid grid-cols-3 gap-3">
 <div className="bg-ghxst-black/20 rounded-lg p-3">
 <Metadata className="mb-1">Floor</Metadata>
 <SubsectionHeader className="text-white mb-0">
 {collection.floorPrice} ETH
 </SubsectionHeader>
 </div>
 <div className="bg-ghxst-black/20 rounded-lg p-3">
 <Metadata className="mb-1">Volume</Metadata>
 <SubsectionHeader className="text-white mb-0">
 {collection.volume}
 </SubsectionHeader>
 </div>
 <div className="bg-ghxst-black/20 rounded-lg p-3">
 <Metadata className="mb-1">24h</Metadata>
 <SubsectionHeader className={`mb-0 ${collection.change24h > 0 ? 'text-success' : 'text-error'}`}>
 {collection.change24h > 0 ? '+' : ''}{collection.change24h}%
 </SubsectionHeader>
 </div>
 </div>

 {/* Additional Stats */}
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-1">
 <Eye className="w-4 h-4" />
 <Metadata>{collection.items.toLocaleString()} items</Metadata>
 </div>
 <div className="flex items-center gap-1">
 <Users className="w-4 h-4" />
 <Metadata>{collection.owners.toLocaleString()} owners</Metadata>
 </div>
 </div>

 <Button variant="gvteway" size="md" className="w-full">
 <ExternalLink className="w-4 h-4 me-2" />
 View Collection
 </Button>
 </div>
 </CardContent>
 </Card>
 ))}
 </div>
 ) : (
 <div className="space-y-4">
 {filteredCollections.map((collection) => (
 <Card key={collection.id} variant="gvteway" className="hover:shadow-xl transition-all">
 <CardContent className="p-6">
 <div className="flex flex-col md:flex-row gap-6">
 {/* Image */}
 <div className="relative w-full md:w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
 <Image
 src={collection.image}
 alt={collection.name}
 fill
 className="object-cover"
 />
 </div>

 {/* Info */}
 <div className="flex-1 space-y-3">
 <div>
 <div className="flex items-center gap-2 mb-1">
 <SubsectionHeader className="text-white">
 {collection.name}
 </SubsectionHeader>
 {collection.verified && (
 <Verified className="w-5 h-5 text-gvteway-blue-500 fill-gvteway-blue-500" />
 )}
 </div>
 <BodyTextSmall className="mb-1">
 {collection.description}
 </BodyTextSmall>
 <BodyTextSmall className="mb-0">
 by {collection.creator}
 </BodyTextSmall>
 </div>

 <div className="flex flex-wrap gap-4">
 <div>
 <Metadata>Floor Price</Metadata>
 <SubsectionHeader className="text-white mb-0">
 {collection.floorPrice} ETH
 </SubsectionHeader>
 </div>
 <div>
 <Metadata>Volume</Metadata>
 <SubsectionHeader className="text-white mb-0">
 {collection.volume} ETH
 </SubsectionHeader>
 </div>
 <div>
 <Metadata>24h Change</Metadata>
 <SubsectionHeader className={`mb-0 ${collection.change24h > 0 ? 'text-success' : 'text-error'}`}>
 {collection.change24h > 0 ? '+' : ''}{collection.change24h}%
 </SubsectionHeader>
 </div>
 <div>
 <Metadata>Items</Metadata>
 <SubsectionHeader className="text-white mb-0">
 {collection.items.toLocaleString()}
 </SubsectionHeader>
 </div>
 <div>
 <Metadata>Owners</Metadata>
 <SubsectionHeader className="text-white mb-0">
 {collection.owners.toLocaleString()}
 </SubsectionHeader>
 </div></div>

 {/* Action */}
 <div className="flex items-center">
 <Button variant="gvteway" size="md">
 <ExternalLink className="w-4 h-4 me-2" />
 View
 </Button>
 </div>
 </div>
 </div>
 </CardContent>
 </Card>
 ))}
 </div>
 )}

 {/* Empty State */}
 {filteredCollections.length === 0 && (
 <Card variant="gvteway">
 <CardContent className="py-12">
 <div className="text-center">
 <Grid className="w-16 h-16 mx-auto mb-4" />
 <SubsectionHeader className="text-white mb-2">
 No Collections Found
 </SubsectionHeader>
 <BodyTextSmall className="mb-4">
 Try adjusting your search
 </BodyTextSmall>
 <Button variant="gvteway" onClick={() => setSearchQuery('')}>
 Clear Search
 </Button>
 </div>
 </CardContent>
 </Card>
 )}
 </div>
 </ContentLayout>
 </GvtewayLayout>
 );
}
