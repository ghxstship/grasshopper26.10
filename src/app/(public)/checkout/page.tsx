/**
 * Checkout Page - UI Rebuild
 * Complete purchase flow
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Hero, H2, H3, Body, Label, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Alert } from '@/components/ui-rebuild/molecules/Alert';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { CreditCard, Lock, ShoppingCart } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  type: 'ticket' | 'merchandise' | 'adventure';
  quantity: number;
  price: number;
  imageUrl?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState('');
  const [formData, setFormData] = React.useState({
    email: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    city: '',
    state: '',
    zipCode: '',
  });

  React.useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<{ items: CartItem[] }>('/api/cart');
        if (response.data?.items) {
          setCartItems(response.data.items);
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const serviceFee = subtotal * 0.025; // 2.5% service fee
  const total = subtotal + tax + serviceFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      await apiClient.post('/api/checkout', {
        items: cartItems,
        payment: formData,
        total,
      });
      router.push('/checkout/confirmation');
    } catch (err) {
      setError('Payment failed. Please check your information and try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent" />
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <Card>
            <CardContent className="py-24 text-center">
              <ShoppingCart className="w-16 h-16 mx-auto mb-6 text-gray-400" />
              <H2 className="mb-4">Your Cart is Empty</H2>
              <Body className="mb-8 text-gray-600">Add some items to your cart to checkout</Body>
              <Button onClick={() => router.push('/events')}>Browse Events</Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Hero className="mb-12 text-center">CHECKOUT</Hero>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="you@example.com"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Details */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    <CardTitle>Payment Details</CardTitle>
                  </div>
                  <CardDescription>All transactions are secure and encrypted</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      required
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      type="text"
                      value={formData.cardName}
                      onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                      required
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        type="text"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        required
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="text"
                        value={formData.cvv}
                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                        required
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="billingAddress">Street Address</Label>
                    <Input
                      id="billingAddress"
                      type="text"
                      value={formData.billingAddress}
                      onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                      required
                      placeholder="123 Main St"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        required
                        placeholder="NY"
                        maxLength={2}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      required
                      placeholder="10001"
                      maxLength={5}
                    />
                  </div>
                </CardContent>
              </Card>

              {error && (
                <Alert variant="error">{error}</Alert>
              )}

              <Button
                type="submit"
                size="lg"
                fullWidth
                loading={processing}
                disabled={processing}
              >
                <Lock className="w-5 h-5 mr-2" />
                {processing ? 'Processing Payment...' : `Pay $${total.toFixed(2)}`}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b-2 border-gray-100">
                    <div className="flex-1">
                      <H3 className="text-base mb-1">{item.name}</H3>
                      <Caption className="text-gray-600">
                        {item.type} × {item.quantity}
                      </Caption>
                    </div>
                    <div className="text-right">
                      <Body className="font-bold">${(item.price * item.quantity).toFixed(2)}</Body>
                    </div>
                  </div>
                ))}

                <div className="space-y-2 pt-4">
                  <div className="flex justify-between">
                    <Caption className="text-gray-600">Subtotal</Caption>
                    <Caption>${subtotal.toFixed(2)}</Caption>
                  </div>
                  <div className="flex justify-between">
                    <Caption className="text-gray-600">Service Fee</Caption>
                    <Caption>${serviceFee.toFixed(2)}</Caption>
                  </div>
                  <div className="flex justify-between">
                    <Caption className="text-gray-600">Tax</Caption>
                    <Caption>${tax.toFixed(2)}</Caption>
                  </div>
                  <div className="flex justify-between pt-4 border-t-2 border-black">
                    <H2>Total</H2>
                    <H2>${total.toFixed(2)}</H2>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center gap-2 text-gray-600">
                  <Lock className="w-4 h-4" />
                  <Caption>Secure checkout powered by Stripe</Caption>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}