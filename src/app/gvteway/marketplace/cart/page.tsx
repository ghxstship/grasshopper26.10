'use client';

import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { CardTitle, BodyText, Metadata } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import Image from 'next/image';
import { useState } from 'react';

export default function CartPage() {
  const [cartItems] = useState([
    {
      id: '1',
      title: 'Festival T-Shirt',
      seller: 'Official Merch',
      price: 35,
      quantity: 2,
      image: '/api/placeholder/100/100',
    },
  ]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.07;
  const total = subtotal + tax;

  return (
    <ListPageTemplate
      title="Shopping Cart"
      description={`${cartItems.length} items in your cart`}
      isEmpty={cartItems.length === 0}
      emptyState={{
        icon: <ShoppingCart className="w-16 h-16 mx-auto" />,
        title: 'Your Cart is Empty',
        description: 'Browse the marketplace to add items',
        action: { label: 'Browse Marketplace', href: '/gvteway/marketplace' },
      }}
    >
      <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="card p-6">
              <div className="flex gap-6">
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image src={item.image} alt={item.title} fill className="object-cover rounded-lg" />
                </div>
                <div className="flex-1">
                  <CardTitle className="mb-2 text-ghxst-primary">{item.title}</CardTitle>
                  <Metadata className="text-ghxst-text-secondary mb-4">{item.seller}</Metadata>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 border-2 border-ghxst-border rounded hover:border-ghxst-primary">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button className="p-1 border-2 border-ghxst-border rounded hover:border-ghxst-primary">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button className="text-destructive hover:text-destructive-foreground">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <BodyText className="text-ghxst-primary">
                    ${item.price * item.quantity}
                  </BodyText>
                  <Metadata className="text-ghxst-text-secondary">${item.price} each</Metadata>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="card p-6 h-fit sticky top-24">
          <CardTitle className="mb-6 text-ghxst-primary">Order Summary</CardTitle>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <Metadata className="text-ghxst-text-secondary">Subtotal</Metadata>
              <BodyText>${subtotal.toFixed(2)}</BodyText>
            </div>
            <div className="flex justify-between">
              <Metadata className="text-ghxst-text-secondary">Tax</Metadata>
              <BodyText>${tax.toFixed(2)}</BodyText>
            </div>
            <div className="flex justify-between pt-3 border-t border-ghxst-border">
              <CardTitle className="text-ghxst-primary">Total</CardTitle>
              <CardTitle className="text-ghxst-primary">${total.toFixed(2)}</CardTitle>
            </div>
          </div>
          <Link href="/gvteway/marketplace/checkout">
            <Button variant="primary" size="lg" className="w-full">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </ListPageTemplate>
  );
}
