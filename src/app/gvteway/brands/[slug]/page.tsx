'use client';

import { GvtewayLayout } from "@/components/templates/GvtewayLayout";
import { HeroTitle, SectionHeader, CardTitle, BodyText, Metadata } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { IntegrationBadge } from "@/components/atoms/IntegrationBadge";
import { Badge } from "@/components/atoms/Badge";
import { Store, Music, Building2, Users, ExternalLink, ShoppingCart } from "lucide-react";
import Image from "next/image";

interface BrandPageProps {
  params: {
    slug: string;
  };
}

async function generateMetadata({ params }: BrandPageProps) {
  return {
    title: `Brand Name | GVTEWAY Brands`,
    description: `Shop exclusive merchandise, vinyl, and apparel from Brand Name.`,
  };
}

export default function BrandPage({ params: { slug } }: BrandPageProps) {
  // Demo data - replace with actual API call using slug
  const brand = {
    name: "The Midnight Collective",
    type: "artist" as const,
    typeLabel: "Artist Brand",
    description: "Official merchandise, vinyl releases, and exclusive drops from The Midnight Collective. All items are authentic and support the artists directly. Join our community of fans and get access to limited edition releases, early drops, and exclusive collaborations.",
    logo: "/api/placeholder/200/200",
    shopifyStoreId: "store123",
    shopifyUrl: "https://midnight-collective.myshopify.com",
    followers: "12.5K",
    products: 45,
  };

  const typeIcons = {
    artist: Music,
    venue: Building2,
    label: Store,
    brand: Store,
    community: Users,
  };

  const TypeIcon = typeIcons[brand.type];

  const products = [
    {
      id: "1",
      name: "Limited Edition Tour Tee",
      price: 35.00,
      image: "/api/placeholder/400/400",
      badge: "Limited",
      inStock: true,
    },
    {
      id: "2",
      name: "Midnight Drive Vinyl",
      price: 28.00,
      image: "/api/placeholder/400/400",
      badge: "New",
      inStock: true,
    },
    {
      id: "3",
      name: "Neon Dreams Hoodie",
      price: 65.00,
      image: "/api/placeholder/400/400",
      badge: null,
      inStock: true,
    },
    {
      id: "4",
      name: "Artist Signature Poster",
      price: 20.00,
      image: "/api/placeholder/400/400",
      badge: "Exclusive",
      inStock: false,
    },
    {
      id: "5",
      name: "Synthwave Collection Box Set",
      price: 120.00,
      image: "/api/placeholder/400/400",
      badge: "Limited",
      inStock: true,
    },
    {
      id: "6",
      name: "Classic Logo Snapback",
      price: 30.00,
      image: "/api/placeholder/400/400",
      badge: null,
      inStock: true,
    },
  ];

  const categories = ["All", "Apparel", "Vinyl", "Accessories", "Posters", "Collectibles"];

  return (
    <GvtewayLayout>

      {/* Brand Hero */}
      <section className="section-padding bg-ghxst-surface">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-[200px_1fr] gap-12 items-start">
            {/* Brand Logo */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-ghxst-white mx-auto lg:mx-0 border-2 border-ghxst-border p-4">
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-contain"
              />
            </div>

            {/* Brand Info */}
            <div className="space-y-6">
              <div>
                <HeroTitle className="mb-2 text-ghxst-primary">{brand.name}</HeroTitle>
                
                <div className="flex items-center gap-4 mb-4">
                  <Metadata className="flex items-center gap-2 text-ghxst-text-secondary">
                    <TypeIcon className="w-4 h-4" />
                    {brand.typeLabel}
                  </Metadata>
                  <Metadata className="text-ghxst-text-secondary">
                    {brand.followers} Followers
                  </Metadata>
                  <Metadata className="text-ghxst-text-secondary">
                    {brand.products} Products
                  </Metadata>
                </div>

                <BodyText className="text-ghxst-text-secondary mb-6">
                  {brand.description}
                </BodyText>

                <div className="flex flex-wrap gap-4">
                  <Button
                    variant="primary"
                    size="lg"
                    leftIcon={<ExternalLink className="w-4 h-4" />}
                    onClick={() => window.open(brand.shopifyUrl, '_blank')}
                  >
                    Visit Full Store
                  </Button>
                  <Button variant="secondary" size="lg">
                    Follow Brand
                  </Button>
                </div>
              </div>

              <IntegrationBadge provider="shopify" size="md" />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b-2 border-ghxst-border bg-ghxst-white sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-4 py-4 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-2 font-bebas text-h6 uppercase whitespace-nowrap transition-colors ${
                  category === "All"
                    ? "bg-ghxst-black text-ghxst-white"
                    : "bg-ghxst-surface text-ghxst-text-primary hover:bg-ghxst-border"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between mb-8">
            <SectionHeader className="uppercase text-ghxst-primary">Featured Products</SectionHeader>
            <Metadata className="text-ghxst-text-secondary">{products.length} items</Metadata>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="card overflow-hidden group">
                <div className="relative aspect-square bg-ghxst-surface">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  {product.badge && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="error">{product.badge}</Badge>
                    </div>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-ghxst-black/50 flex items-center justify-center">
                      <span className="font-bebas text-h4 text-ghxst-white">SOLD OUT</span>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <CardTitle className="text-ghxst-primary line-clamp-2">
                    {product.name}
                  </CardTitle>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-share-tech-mono text-h6 text-ghxst-primary">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    disabled={!product.inStock}
                    leftIcon={<ShoppingCart className="w-4 h-4" />}
                  >
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Benefits */}
      <section className="section-padding bg-ghxst-surface">
        <div className="max-w-7xl mx-auto px-8 max-w-4xl">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <CardTitle className="text-ghxst-primary">Free Shipping</CardTitle>
              <BodyText className="text-ghxst-text-secondary text-body-sm">
                On orders over $50
              </BodyText>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-ghxst-primary">Authentic Merch</CardTitle>
              <BodyText className="text-ghxst-text-secondary text-body-sm">
                100% official products
              </BodyText>
            </div>
            <div className="space-y-2">
              <CardTitle className="text-ghxst-primary">Support Artists</CardTitle>
              <BodyText className="text-ghxst-text-secondary text-body-sm">
                Direct artist support
              </BodyText>
            </div>
          </div>
        </div>
      </section>

      {/* Related Brands */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          <SectionHeader className="mb-8 uppercase text-ghxst-primary">
            Similar Brands
          </SectionHeader>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card p-4 text-center group cursor-pointer">
                <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-ghxst-surface">
                  <Image
                    src="/api/placeholder/100/100"
                    alt="Brand"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform"
                  />
                </div>
                <CardTitle className="text-ghxst-primary mb-2 text-h6">Brand Name</CardTitle>
                <Metadata className="text-ghxst-text-secondary text-body-sm">Artist Brand</Metadata>
              </div>
            ))}
          </div>
        </div>
      </section>

    </GvtewayLayout>
  );
}
