/**
 * Ticket Checkout Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, H2, H3, Body, Label } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Alert } from '@/components/ui-rebuild/molecules/Alert';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import { CreditCard, Lock } from 'lucide-react';

interface CartItem {
  id: string;
  eventName: string;
  ticketType: string;
  quantity: number;
  price: number;
}

export default function TicketCheckoutPage() {
  const [loading, setLoading] = React.useState(true);
  const [processing, setProcessing] = React.useState(false);
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [email, setEmail] = React.useState('');
  const [cardNumber, setCardNumber] = React.useState('');
  const [expiry, setExpiry] = React.useState('');
  const [cvc, setCvc] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ items: CartItem[] }>('/api/cart');
        if (response.data?.items) {
          setCart(response.data.items);
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const fees = subtotal * 0.1;
  const total = subtotal + fees;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      const response = await apiClient.post('/api/tickets/purchase', {
        email,
        payment: {
          cardNumber,
          expiry,
          cvc
        }
      });

      if (response.data && typeof response.data === 'object' && 'orderId' in response.data && response.data.orderId) {
        router.push(`/tickets/success?orderId=${response.data.orderId as string}`);
      }
    } catch (err) {
      setError('Payment failed. Please check your card details and try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <H1 className="mb-4">Your Cart is Empty</H1>
          <Body className="text-gray-600 mb-8">Add some tickets to get started</Body>
          <Button onClick={() => router.push('/events')}>Browse Events</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">Checkout</H1>
          <Body className="text-gray-600">
            Complete your purchase
          </Body>
        </div>

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="email">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={processing}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    <CardTitle>Payment Information</CardTitle>
                  </div>
                  <CardDescription>
                    All transactions are secure and encrypted
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">
                      Card Number
                    </Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      required
                      disabled={processing}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">
                        Expiry Date
                      </Label>
                      <Input
                        id="expiry"
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM/YY"
                        required
                        disabled={processing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvc">
                        CVC
                      </Label>
                      <Input
                        id="cvc"
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        placeholder="123"
                        required
                        disabled={processing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                loading={processing}
                disabled={processing}
                className="w-full"
                size="lg"
              >
                <Lock className="w-5 h-5 mr-2" />
                Complete Purchase - ${total.toFixed(2)}
              </Button>
            </form>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="pb-4 border-b border-gray-200 last:border-0">
                    <H3 className="mb-1">{item.eventName}</H3>
                    <Body className="text-gray-600 text-sm mb-2">
                      {item.ticketType} × {item.quantity}
                    </Body>
                    <H3>
                      ${(item.price * item.quantity).toFixed(2)}
                    </H3>
                  </div>
                ))}

                <div className="pt-4 space-y-2">
                  <div className="flex justify-between">
                    <Body className="text-gray-600">Subtotal</Body>
                    <Body>${subtotal.toFixed(2)}</Body>
                  </div>
                  <div className="flex justify-between">
                    <Body className="text-gray-600">Service Fee</Body>
                    <Body>${fees.toFixed(2)}</Body>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <H2>Total</H2>
                    <H2>${total.toFixed(2)}</H2>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
