/**
 * Marketplace Checkout Page - UI Rebuild
 * Checkout flow for marketplace orders
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { H1, H2, Body, Caption, Label } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { Checkbox } from '@/components/ui-rebuild/atoms/Checkbox';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Separator } from '@/components/ui-rebuild/atoms/Separator';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    currency: string;
  };
}

export default function MarketplaceCheckoutPage() {
  const router = useRouter();
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [processing, setProcessing] = React.useState(false);
  const [error, setError] = React.useState('');

  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [city, setCity] = React.useState('');
  const [zipCode, setZipCode] = React.useState('');
  const [cardNumber, setCardNumber] = React.useState('');
  const [expiry, setExpiry] = React.useState('');
  const [cvc, setCvc] = React.useState('');
  const [saveCard, setSaveCard] = React.useState(false);

  React.useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      if (token) {
        apiClient.setAuthToken(token);
      }

      const response = await apiClient.get<{ items: CartItem[] }>('/api/cart');
      if (response.data?.items) {
        setItems(response.data.items);
        if (response.data.items.length === 0) {
          router.push('/marketplace/cart');
        }
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubtotal = () => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  };

  const getTax = () => {
    return getSubtotal() * 0.08;
  };

  const getShipping = () => {
    return 10; // Flat rate shipping
  };

  const getTotal = () => {
    return getSubtotal() + getTax() + getShipping();
  };

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setProcessing(true);

    try {
      const response = await apiClient.post('/api/marketplace/checkout', {
        email,
        name,
        address,
        city,
        zipCode,
        cardNumber,
        expiry,
        cvc,
        saveCard,
      });

      if (response.data && typeof response.data === 'object' && 'orderId' in response.data) {
        router.push(`/marketplace/orders?success=true&order=${response.data.orderId as string}`);
      }
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err 
        ? (err.message as string)
        : 'Checkout failed. Please try again.';
      setError(message);
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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">Checkout</H1>
          <Body className="text-gray-600">Complete your marketplace order</Body>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {error && (
                <div className="bg-gray-100 border-2 border-black p-4">
                  <Body className="text-sm text-gray-900">{error}</Body>
                </div>
              )}

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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={processing}
                      placeholder="you@example.com"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={processing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      disabled={processing}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        disabled={processing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        required
                        disabled={processing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      disabled={processing}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry</Label>
                      <Input
                        id="expiry"
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        required
                        disabled={processing}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        required
                        disabled={processing}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                  <Checkbox
                    id="saveCard"
                    label="Save card for future purchases"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    disabled={processing}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <Body className="text-sm">{item.product.name}</Body>
                          <Caption className="text-gray-500">Qty: {item.quantity}</Caption>
                        </div>
                        <Body className="text-sm">
                          {formatPrice(item.product.price * item.quantity, item.product.currency)}
                        </Body>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <Caption>Subtotal</Caption>
                    <Body>{formatPrice(getSubtotal())}</Body>
                  </div>
                  <div className="flex items-center justify-between">
                    <Caption>Shipping</Caption>
                    <Body>{formatPrice(getShipping())}</Body>
                  </div>
                  <div className="flex items-center justify-between">
                    <Caption>Tax</Caption>
                    <Body>{formatPrice(getTax())}</Body>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <H2>Total</H2>
                    <H2>{formatPrice(getTotal())}</H2>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    loading={processing}
                    disabled={processing}
                  >
                    {processing ? 'Processing...' : 'Complete Order'}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
