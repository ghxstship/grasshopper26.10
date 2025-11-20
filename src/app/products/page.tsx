'use client';

import { useState} from 'react';
import { useRouter} from 'next/navigation';
import { GvtewayLayout} from '@/components/templates/GvtewayLayout';
import { ContentLayout} from '@/components/templates/ContentLayout';
import { Card, CardHeader, CardTitle, CardDescription,
 CardContent, CardFooter} from '@/components/atoms/Card';
import { Button} from '@/components/atoms/Button';
import { Badge} from '@/components/atoms/Badge';
import { SubsectionHeader,
 BodyTextSmall,
 Caption
} from '@/components/atoms/Typography';
import { SearchBar} from '@/components/molecules/SearchBar';
import { Tabs} from '@/components/molecules/Tabs';
import { Pagination} from '@/components/molecules/Pagination';
import { EmptyState} from '@/components/molecules/EmptyState';
import { Package, Star,
 Filter,
 Grid3x3,
 List,
 ShoppingCart,
 TrendingUp,
 Sparkles,
 Clock
} from 'lucide-react';

export default function ProductsPage() {
 const router = useRouter();
 const [searchQuery, setSearchQuery] = useState('');
 const [activeCategory, setActiveCategory] = useState('all');
 const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
 const [currentPage, setCurrentPage] = useState(1);

 // Mock products data - in production, fetch from API
 const products = [
 {
 id: '1',
 name: 'Premium Event Ticket Package',
 description: 'VIP access with exclusive merchandise and backstage passes',
 price: 299.99,
 originalPrice: 399.99,
 category: 'Events',
 rating: 4.8,
 reviewCount: 127,
 inStock: true,
 featured: true,
 new: false,
 trending: true
},
 {
 id: '2',
 name: 'Standard Event Pass',
 description: 'General admission with standard seating',
 price: 149.99,
 originalPrice: null,
 category: 'Events',
 rating: 4.5,
 reviewCount: 89,
 inStock: true,
 featured: false,
 new: false,
 trending: false
},
 {
 id: '3',
 name: 'VIP Concert Experience',
 description: 'Front row seats with meet and greet',
 price: 499.99,
 originalPrice: 599.99,
 category: 'Concerts',
 rating: 4.9,
 reviewCount: 203,
 inStock: true,
 featured: true,
 new: true,
 trending: true
},
 {
 id: '4',
 name: 'Festival Weekend Pass',
 description: 'All-access 3-day festival pass',
 price: 349.99,
 originalPrice: null,
 category: 'Festivals',
 rating: 4.7,
 reviewCount: 156,
 inStock: true,
 featured: false,
 new: true,
 trending: false
},
 {
 id: '5',
 name: 'Sports Game Premium Seats',
 description: 'Courtside seats with VIP lounge access',
 price: 799.99,
 originalPrice: 999.99,
 category: 'Sports',
 rating: 4.9,
 reviewCount: 78,
 inStock: true,
 featured: true,
 new: false,
 trending: true
},
 {
 id: '6',
 name: 'Theater Show Package',
 description: 'Orchestra seats with dinner included',
 price: 249.99,
 originalPrice: null,
 category: 'Theater',
 rating: 4.6,
 reviewCount: 92,
 inStock: true,
 featured: false,
 new: false,
 trending: false
},
 {
 id: '7',
 name: 'Comedy Night VIP',
 description: 'Front row with backstage meet and greet',
 price: 179.99,
 originalPrice: 229.99,
 category: 'Comedy',
 rating: 4.8,
 reviewCount: 134,
 inStock: false,
 featured: false,
 new: false,
 trending: false
},
 {
 id: '8',
 name: 'Music Festival Early Bird',
 description: 'Limited early bird pricing for summer festival',
 price: 199.99,
 originalPrice: 299.99,
 category: 'Festivals',
 rating: 4.7,
 reviewCount: 167,
 inStock: true,
 featured: true,
 new: true,
 trending: true
}
 ];

 const categories = [
 { id: 'all', label: 'All Products'},
 { id: 'events', label: 'Events'},
 { id: 'concerts', label: 'Concerts'},
 { id: 'festivals', label: 'Festivals'},
 { id: 'sports', label: 'Sports'},
 { id: 'theater', label: 'Theater'},
 { id: 'comedy', label: 'Comedy'}
 ];

 const filteredProducts = products.filter(product => {
 const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
 product.description.toLowerCase().includes(searchQuery.toLowerCase());
 const matchesCategory = activeCategory === 'all' || product.category.toLowerCase() === activeCategory.toLowerCase();
 return matchesSearch && matchesCategory;
});

 const handleProductClick = (productId: string) => {
 router.push(`/products/${productId}`);
};

 const renderProductCard = (product: typeof products[0]) => (
 <Card key={product.id} variant="gvteway" className="group cursor-pointer hover:scale-[1.02] transition-transform">
 <CardContent className="p-0 relative">
 <div className="aspect-square bg-black rounded-t-2xl flex items-center justify-center relative overflow-hidden">
 <Package className="h-24 w-24 text-gvteway-red-500/50 group-hover:scale-110 transition-transform" />
 {/* Badges */}
 <div className="absolute top-3 start-3 flex flex-col gap-2">
 {product.new && (
 <Badge variant="gvteway" className="flex items-center gap-1">
 <Sparkles className="h-3 w-3" />
 New
 </Badge>
 )}
 {product.trending && (
 <Badge variant="warning" className="flex items-center gap-1">
 <TrendingUp className="h-3 w-3" />
 Trending
 </Badge>
 )}
 {!product.inStock && (
 <Badge variant="error">Sold Out</Badge>
 )}
 </div>

 {/* Discount Badge */}
 {product.originalPrice && (
 <div className="absolute top-3 end-3">
 <Badge variant="error">
 Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
 </Badge>
 </div>
 )}
 </div>
 </CardContent>
 <CardHeader>
 <div className="flex items-start justify-between gap-2 mb-2">
 <CardTitle className="line-clamp-1">{product.name}</CardTitle>
 <Badge variant="gvteway-outline">
 {product.category}
 </Badge>
 </div>
 <CardDescription className="line-clamp-2">
 {product.description}
 </CardDescription>
 {/* Rating */}
 <div className="flex items-center gap-2 mt-2">
 <div className="flex items-center">
 {[...Array(5)].map((_, i) => (
 <Star
 key={i}
 className={`h-3 w-3 ${
 i < Math.floor(product.rating)
 ? 'fill-gvteway-yellow-500 text-gvteway-yellow-500'
 : ''
}`}
 />
 ))}
 </div>
 <Caption>
 {product.rating} ({product.reviewCount})
 </Caption>
 </div>
 </CardHeader>
 <CardFooter className="flex flex-col gap-3">
 <div className="flex items-baseline justify-between w-full">
 <div className="flex items-baseline gap-2">
 <SubsectionHeader className="text-gvteway-red-500">
 ${product.price}
 </SubsectionHeader>
 {product.originalPrice && (
 <Caption className="line-through">
 ${product.originalPrice}
 </Caption>
 )}
 </div>
 </div>
 <div className="flex gap-2 w-full">
 <Button
 variant="gvteway"
 size="sm"
 className="flex-1"
 onClick={() => handleProductClick(product.id)}
 disabled={!product.inStock}
 >
 {product.inStock ? 'View Details' : 'Out of Stock'}
 </Button>
 {product.inStock && (
 <Button
 variant="gvteway-outline"
 size="sm"
 iconOnly
 onClick={(e) => {
 e.stopPropagation();
 // Add to cart logic
}}
 >
 <ShoppingCart className="h-4 w-4" />
 </Button>
 )}
 </div>
 </CardFooter>
 </Card>
 );

 const renderProductListItem = (product: typeof products[0]) => (
 <Card key={product.id} variant="gvteway" className="group cursor-pointer hover:border-gvteway-red-500/50 transition-all"
 >
 <div className="flex flex-col md:flex-row gap-6">
 <div className="w-full md:w-48 h-48 bg-black rounded-2xl flex items-center justify-center flex-shrink-0 relative">
 <Package className="h-20 w-20 text-gvteway-red-500/50 group-hover:scale-110 transition-transform" />
 {/* Badges */}
 <div className="absolute top-3 start-3 flex flex-col gap-2">
 {product.new && (
 <Badge variant="gvteway" className="flex items-center gap-1">
 <Sparkles className="h-3 w-3" />
 New
 </Badge>
 )}
 {product.trending && (
 <Badge variant="warning" className="flex items-center gap-1">
 <TrendingUp className="h-3 w-3" />
 Trending
 </Badge>
 )}
 </div>
 </div>
 <div className="flex-1 flex flex-col justify-between">
 <div>
 <div className="flex items-start justify-between gap-4 mb-2">
 <div className="flex-1">
 <div className="flex items-center gap-2 mb-2">
 <SubsectionHeader>{product.name}</SubsectionHeader>
 <Badge variant="gvteway-outline">
 {product.category}
 </Badge>
 </div>
 <BodyTextSmall className="mb-3">
 {product.description}
 </BodyTextSmall>
 {/* Rating */}
 <div className="flex items-center gap-2">
 <div className="flex items-center">
 {[...Array(5)].map((_, i) => (
 <Star
 key={i}
 className={`h-4 w-4 ${
 i < Math.floor(product.rating)
 ? 'fill-gvteway-yellow-500 text-gvteway-yellow-500'
 : ''
}`}
 />
 ))}
 </div>
 <Caption>
 {product.rating} ({product.reviewCount} reviews)
 </Caption>
 </div>
 <div className="text-right">
 <div className="flex items-baseline gap-2 justify-end mb-2">
 <SubsectionHeader className="text-gvteway-red-500">
 ${product.price}
 </SubsectionHeader>
 {product.originalPrice && (
 <Caption className="line-through">
 ${product.originalPrice}
 </Caption>
 )}
 </Caption>
 {product.originalPrice && (
 <Badge variant="error">
 Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
 </Badge>
 )}
 </Caption>
 </div>
 </div>
 <div className="flex items-center justify-between pt-4 border-t">
 <div className="flex items-center gap-2">
 {!product.inStock && (
 <Badge variant="error">Sold Out</Badge>
 )}
 </div>
 <div className="flex gap-2">
 <Button
 variant="gvteway-outline"
 size="sm"
 onClick={() => handleProductClick(product.id)}
 >
 View Details
 </Button>
 {product.inStock && (
 <Button
 variant="gvteway"
 size="sm"
 leftIcon={<ShoppingCart className="h-4 w-4" />}
 onClick={(e) => {
 e.stopPropagation();
 // Add to cart logic
}}
 >
 Add to Cart
 </Button>
 )}
 </div></div>
 </div>
 </Card>
 );

 return (
 <GvtewayLayout>
 <ContentLayout
 title="Products"
 description="Browse our collection of premium event tickets and packages"
 breadcrumbs={[
 { label: 'Home', href: '/'},
 { label: 'Products'}
 ]}
 variant="gvteway"
 >
 {/* Stats Cards */}
 <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
 <Card variant="gvteway">
 <CardContent className="flex items-center gap-4">
 <div className="p-3 bg-gvteway-red-500/20 rounded-lg">
 <Package className="h-6 w-6 text-gvteway-red-500" />
 </div>
 <div>
 <SubsectionHeader>{products.length}</SubsectionHeader>
 <Caption>Total Products</Caption>
 </CardContent>
 </Card>
 <Card variant="gvteway">
 <CardContent className="flex items-center gap-4">
 <div className="p-3 bg-gvteway-yellow-500/20 rounded-lg">
 <Sparkles className="h-6 w-6 text-gvteway-yellow-500" />
 </div>
 <div>
 <SubsectionHeader>{products.filter(p => p.new).length}</SubsectionHeader>
 <Caption>New Arrivals</Caption>
 </CardContent>
 </Card>
 <Card variant="gvteway">
 <CardContent className="flex items-center gap-4">
 <div className="p-3 bg-gvteway-blue-500/20 rounded-lg">
 <TrendingUp className="h-6 w-6 text-gvteway-blue-500" />
 </div>
 <div>
 <SubsectionHeader>{products.filter(p => p.trending).length}</SubsectionHeader>
 <Caption>Trending</Caption>
 </CardContent>
 </Card>
 <Card variant="gvteway">
 <CardContent className="flex items-center gap-4">
 <div className="p-3 bg-success/20 rounded-lg">
 <Clock className="h-6 w-6 text-success" />
 </div>
 <div>
 <SubsectionHeader>{products.filter(p => p.inStock).length}</SubsectionHeader>
 <Caption>In Stock</Caption>
 </CardContent>
 </Card>
 </div>

 {/* Filters and Search */}
 <Card variant="gvteway" className="mb-8">
 <CardContent>
 <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
 <div className="flex-1 w-full lg:max-w-md">
 <SearchBar
 placeholder="Search products..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 onClear={() => setSearchQuery('')}
 variant="gvteway"
 />
 </div>
 <div className="flex items-center gap-3">
 <Button
 variant={viewMode === 'grid' ? 'gvteway' : 'gvteway-outline'}
 size="sm"
 iconOnly
 onClick={() => setViewMode('grid')}
 >
 <Grid3x3 className="h-4 w-4" />
 </Button>
 <Button
 variant={viewMode === 'list' ? 'gvteway' : 'gvteway-outline'}
 size="sm"
 iconOnly
 onClick={() => setViewMode('list')}
 >
 <List className="h-4 w-4" />
 </Button>
 <Button
 variant="gvteway-outline"
 size="sm"
 leftIcon={<Filter className="h-4 w-4" />}
 >
 Filters
 </Button>
 </div>
 </div>
 </CardContent>
 </Card>

 {/* Category Tabs */}
 <div className="mb-8">
 <Tabs
 tabs={categories}
 activeTab={activeCategory}
 onChange={setActiveCategory}
 variant="gvteway"
 />
 </div>

 {/* Products Grid/List */}
 {filteredProducts.length > 0 ? (
 <>
 {viewMode === 'grid' ? (
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
 {filteredProducts.map(renderProductCard)}
 </div>
 ) : (
 <div className="space-y-4 mb-8">
 {filteredProducts.map(renderProductListItem)}
 </div>
 )}

 {/* Pagination */}
 <div className="flex justify-center">
 <Pagination
 currentPage={currentPage}
 totalPages={Math.ceil(filteredProducts.length / 12)}
 onPageChange={setCurrentPage}
 variant="gvteway"
 />
 </div>
 </>
 ) : (
 <EmptyState
 icon={<Package className="h-16 w-16" />}
 title="No Products Found"
 message={searchQuery ?`No products match"${searchQuery}"` :"No products available in this category"}
 actionLabel="Clear Search"
 onAction={() => {
 setSearchQuery('');
 setActiveCategory('all');
}}
 variant="gvteway"
 />
 )}
 </ContentLayout>
 </GvtewayLayout>
 );
}
