/**
 * Payment Settings Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, H3, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { CreditCard } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expires: string;
  isDefault: boolean;
  brand: string;
}

export default function PaymentSettingsPage() {
  const [loading, setLoading] = React.useState(true);
  const [paymentMethods, setPaymentMethods] = React.useState<PaymentMethod[]>([]);
  const [updating, setUpdating] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ paymentMethods: PaymentMethod[] }>('/api/settings/payment');
        if (response.data?.paymentMethods) {
          setPaymentMethods(response.data.paymentMethods);
        }
      } catch (error) {
        console.error('Failed to fetch payment methods:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  const handleSetDefault = async (methodId: string) => {
    try {
      setUpdating(methodId);
      await apiClient.put(`/api/settings/payment/${methodId}/default`);
      setPaymentMethods(prev => prev.map(method => ({
        ...method,
        isDefault: method.id === methodId
      })));
    } catch (error) {
      console.error('Failed to set default payment method:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (methodId: string) => {
    try {
      setUpdating(methodId);
      await apiClient.delete(`/api/settings/payment/${methodId}`);
      setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
    } catch (error) {
      console.error('Failed to remove payment method:', error);
    } finally {
      setUpdating(null);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <H1 className="mb-2">Payment Methods</H1>
            <Body className="text-gray-600">Manage your payment methods</Body>
          </div>
          <Button>Add Payment Method</Button>
        </div>

        {paymentMethods.length === 0 ? (
          <Card>
            <CardContent className="py-24 text-center">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <H3 className="mb-4">No payment methods</H3>
              <Body className="text-gray-600 mb-6">
                Add a payment method to make purchases easier
              </Body>
              <Button>Add Payment Method</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <Card key={method.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-gray-900" />
                      <div>
                        <CardTitle>{method.brand} •••• {method.last4}</CardTitle>
                        <CardDescription>Expires {method.expires}</CardDescription>
                      </div>
                    </div>
                    {method.isDefault && <Badge>Default</Badge>}
                  </div>
                </CardHeader>
                <CardFooter className="flex gap-3">
                  {!method.isDefault && (
                    <Button 
                      variant="secondary"
                      onClick={() => handleSetDefault(method.id)}
                      disabled={updating === method.id}
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button 
                    variant="ghost"
                    onClick={() => handleRemove(method.id)}
                    disabled={updating === method.id || method.isDefault}
                  >
                    Remove
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
