'use client';

import { GvtewayLayout } from "@/components/templates/GvtewayLayout";
import { HeroTitle, SectionHeader, CardTitle, BodyText, Metadata } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { IntegrationBadge } from "@/components/atoms/IntegrationBadge";
import { Badge } from "@/components/atoms/Badge";
import { Store, ExternalLink, ShoppingCart } from "lucide-react";
import Image from "next/image";

interface ShopPageProps {
  params: {
    slug: string;
  };
}

async function generateMetadata({ params }: ShopPageProps) {
  return {
    title: `Shop Name | GVTEWAY Shops`,
    description: `Shop exclusive merchandise, vinyl, and apparel from Shop Name.`,
  };
}

export default function ShopPage({ params: { slug } }: ShopPageProps) {
  // Demo data - replace with actual API call using slug
  const shop = {
    name: "The Midnight Collective Store",
    type: "Artist Store",
    description: "Official merchandise, vinyl releases, and exclusive drops from The Midnight Collective. All items are authentic and support the artists directly.",
    logo: "/api/placeholder/200/200",
    shopifyStoreId: "store123",
    shopifyUrl: "https://midnight-collective.myshopify.com",
  };

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
  ];

  const categories = ["All", "Apparel", "Vinyl", "Accessories", "Posters"];

  return (
    <GvtewayLayout>

      {/* Shop Hero */}
      <section className="section-padding bg-ghxst-surface">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-[200px_1fr] gap-12 items-start">
            {/* Shop Logo */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-ghxst-white mx-auto lg:mx-0 border-2 border-ghxst-border p-4">
              <Image
                src={shop.logo}
                alt={shop.name}
                fill
                className="object-contain"
              />
            </div>

            {/* Shop Info */}
            <div className="space-y-6">
              <div>
                <HeroTitle className="mb-2 text-ghxst-primary">{shop.name}</HeroTitle>
                
                <div className="flex items-center gap-3 mb-4">
                  <Metadata className="flex items-center gap-2 text-ghxst-text-secondary">
                    <Store className="w-4 h-4" />
                    {shop.type}
                  </Metadata>
                </div>

                <BodyText className="text-ghxst-text-secondary mb-6">
                  {shop.description}
                </BodyText>

                <div className="flex flex-wrap gap-4">
                  <Button
                    variant="primary"
                    size="lg"
                    leftIcon={<ExternalLink className="w-4 h-4" />}
                    onClick={() => window.open(shop.shopifyUrl, '_blank')}
                  >
                    Visit Full Store
                  </Button>
                  <Button variant="secondary" size="lg">
                    Follow Shop
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
                className={`px-6 py-2 uppercase whitespace-nowrap transition-colors ${ category === "All" ? "bg-ghxst-black text-ghxst-white" : "bg-ghxst-surface text-ghxst-text-primary hover:bg-ghxst-border" }`}
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
                      <span className="text-ghxst-white">SOLD OUT</span>
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <CardTitle className="text-ghxst-primary line-clamp-2">
                    {product.name}
                  </CardTitle>
                  
                  <div className="flex items-center justify-between">
                    <span className="-tech-mono text-ghxst-primary">
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

      {/* Shop Info */}
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

    </GvtewayLayout>
  );
}
