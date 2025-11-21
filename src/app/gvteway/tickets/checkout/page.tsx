'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, Lock, Calendar, MapPin, Ticket, ChevronLeft, Plus, Minus, Shield, Loader2 } from 'lucide-react';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { FormField } from '@/components/molecules/FormField';
import { useToast } from '@/lib/hooks/useToast';
import { useEvent } from '@/lib/hooks/gvteway/useEvents';
import { AlertCircle } from 'lucide-react';
import { BodyText, HeroTitle, SectionHeader } from "@/components/atoms/Typography";

function CheckoutContent() {
  const _router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const eventId = searchParams.get('eventId') || '';
  
  // Fetch event data
  const { data: event, isLoading, error, refetch } = useEvent(eventId);
  
  const [quantity, setQuantity] = useState(1);
  const [ticketType, setTicketType] = useState('vip');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, _setPaymentMethod] = useState<'card' | 'crypto'>('card');
  
  // Form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [billingAddress, setBillingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
  });

  // Loading state
  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <BodyText className="text-grey-400">Loading event details...</BodyText>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <SectionHeader className="mb-2">Failed to Load Event</SectionHeader>
            <p className="text-grey-400 mb-4">{error?.message || 'Event not found'}</p>
            <Button variant="gvteway" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  const ticketTypes = event.ticketTypes || [
    { id: 'general', name: 'General Admission', price: 49.99, available: 500 },
    { id: 'vip', name: 'VIP Pass', price: 89.99, available: 100 },
    { id: 'premium', name: 'Premium Package', price: 149.99, available: 50 },
  ];

  const selectedTicket = ticketTypes.find(t => t.id === ticketType)!;
  const _eventDate = new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const _eventTime = new Date(event.startDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const _eventVenue = event.venue?.name || event.location || 'TBA';
  const subtotal = Number(selectedTicket.price) * quantity;
  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee;

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    try {
      if (paymentMethod === 'card') {
        // Validate card details
        if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
          addToast({ title: 'Error', description: 'Please fill in all payment details', variant: 'error' });
          return;
        }

        // Create Stripe checkout session
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: [{
              priceId: selectedTicket.id, // In production, use actual Stripe price ID
              quantity,
            }],
            metadata: {
              eventId: searchParams.get('eventId') || 'mock-event-id',
              ticketType: selectedTicket.id,
              cardholderName,
              billingAddress: JSON.stringify(billingAddress),
            },
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create checkout session');
        }

        const { url } = await response.json();
        
        // Redirect to Stripe checkout
        if (url) {
          window.location.href = url;
        }
      } else {
        // Crypto payment flow
        const response = await fetch('/api/crypto/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total,
            currency: 'USD',
            metadata: {
              eventId: searchParams.get('eventId') || 'mock-event-id',
              ticketType: selectedTicket.id,
              quantity,
            },
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to initiate crypto payment');
        }

        const { paymentAddress, amount } = await response.json();
        
        // Show crypto payment modal (implement later)
        addToast({ title: 'Crypto Payment', description: `Send ${amount} to ${paymentAddress}`, variant: 'info' });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      addToast({ 
        title: 'Payment Failed', 
        description: error instanceof Error ? error.message : 'An error occurred during checkout',
        variant: 'error' 
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Back Button */}
              <Link href="/gvteway/events">
                <Button variant="ghost" size="sm" className="mb-6 text-grey-400 hover:text-white">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back to Event
                </Button>
              </Link>

              <HeroTitle className="mb-4 gvteway-text-gradient">
                CHECKOUT
              </HeroTitle>
              <BodyText className="text-grey-400 mb-12">
                Complete your ticket purchase
              </BodyText>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Ticket Selection */}
                  <Card variant="gvteway" className="bg-grey-900/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Select Tickets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {ticketTypes.map((type) => (
                          <Button
                            key={type.id}
                            onClick={() => setTicketType(type.id)}
                            variant="ghost"
                            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${ ticketType === type.id ? 'border-gvteway-red-500 bg-gvteway-red-500/10' : 'border-grey-700 hover:border-grey-600' }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-white mb-1">{type.name}</h3>
                                <p className="text-grey-400 text-body-sm">
                                  {type.available} available
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-gvteway-red-500">
                                  ${type.price}
                                </p>
                                <BodyText className="text-grey-400 text-body-sm">per ticket</BodyText>
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>

                      {/* Quantity Selector */}
                      <div className="mt-6 pt-6 border-t border-grey-800">
                        <FormField label="Quantity">
                          <div className="flex items-center gap-4">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                              disabled={quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="text-white w-12 text-center">
                              {quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setQuantity(Math.min(10, quantity + 1))}
                              disabled={quantity >= 10}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                            <span className="text-grey-400 text-body-sm ml-4">
                              Max 10 tickets per order
                            </span>
                          </div>
                        </FormField>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payment Information */}
                  <Card variant="gvteway" className="bg-grey-900/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Lock className="w-5 h-5 mr-2 text-gvteway-red-500" />
                        Payment Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <FormField label="Card Number">
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-500" />
                            <Input
                              type="text"
                              placeholder="1234 5678 9012 3456"
                              className="pl-10"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                            />
                          </div>
                        </FormField>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <FormField label="Expiry Date">
                            <Input type="text" placeholder="MM/YY" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
                          </FormField>
                          <FormField label="CVV">
                            <Input type="text" placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value)} />
                          </FormField>
                        </div>

                        <FormField label="Cardholder Name">
                          <Input type="text" placeholder="John Doe" value={cardholderName} onChange={(e) => setCardholderName(e.target.value)} />
                        </FormField>
                      </form>

                      <div className="mt-6 p-4 bg-grey-800/50 rounded-lg flex items-start">
                        <Shield className="w-5 h-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                        <div className="text-body-sm text-grey-300">
                          <BodyText className="font-medium text-white mb-1">Secure Payment</BodyText>
                          <BodyText >Your payment information is encrypted and secure</BodyText>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Billing Address */}
                  <Card variant="gvteway" className="bg-grey-900/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Billing Address</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <FormField label="Street Address">
                          <Input type="text" placeholder="123 Main St" value={billingAddress.street} onChange={(e) => setBillingAddress({...billingAddress, street: e.target.value})} />
                        </FormField>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <FormField label="City">
                            <Input type="text" placeholder="New York" value={billingAddress.city} onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})} />
                          </FormField>
                          <FormField label="State">
                            <Input type="text" placeholder="NY" value={billingAddress.state} onChange={(e) => setBillingAddress({...billingAddress, state: e.target.value})} />
                          </FormField>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <FormField label="ZIP Code">
                            <Input type="text" placeholder="10001" value={billingAddress.zip} onChange={(e) => setBillingAddress({...billingAddress, zip: e.target.value})} />
                          </FormField>
                          <FormField label="Country">
                            <Input type="text" placeholder="United States" value={billingAddress.country} onChange={(e) => setBillingAddress({...billingAddress, country: e.target.value})} />
                          </FormField>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-1">
                  <Card variant="gvteway" className="bg-grey-900/50 backdrop-blur-sm sticky top-24">
                    <CardHeader>
                      <CardTitle className="text-white">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Event Info */}
                      <div className="mb-6 pb-6 border-b border-grey-800">
                        <h3 className="text-white mb-3">
                          {event.name}
                        </h3>
                        <div className="space-y-2 text-body-sm text-grey-400">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(event.startDate).toLocaleDateString()} • {new Date(event.startDate).toLocaleTimeString()}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {event.location}
                          </div>
                          <div className="flex items-center">
                            <Ticket className="w-4 h-4 mr-2" />
                            {selectedTicket.name}
                          </div>
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-grey-300">
                          <span>Tickets ({quantity}x ${Number(selectedTicket.price).toFixed(2)})</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-grey-300">
                          <span>Service Fee</span>
                          <span>${serviceFee.toFixed(2)}</span>
                        </div>
                        <div className="pt-3 border-t border-grey-800 flex justify-between">
                          <span className="text-white">Total</span>
                          <span className="text-gvteway-red-500">
                            ${total.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Complete Purchase Button */}
                      <Button 
                        variant="gvteway" 
                        size="lg" 
                        className="w-full mb-4" 
                        rounded="full"
                        onClick={handleCheckout}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Lock className="w-5 h-5 mr-2" />
                            Complete Purchase
                          </>
                        )}
                      </Button>

                      <p className="text-caption text-grey-500 text-center">
                        By completing this purchase, you agree to our{' '}
                        <Link href="/terms" className="text-gvteway-red-500 hover:underline">
                          Terms of Service
                        </Link>
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-destructive" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
