/**
 * GVTEWAY Payment Methods Settings Page
 * Agent 2.5: Reverse Order Implementation
 */

'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { CreditCard, Plus, Trash2, Star, Loader2, AlertCircle } from 'lucide-react';
import { usePaymentMethods, useBillingAddress, useDeletePaymentMethod, useSetDefaultPaymentMethod, type PaymentMethod } from '@/lib/hooks/gvteway/usePaymentMethods';

export default function PaymentMethodsPage() {
  const { data: paymentMethods = [], isLoading, error, refetch } = usePaymentMethods();
  const { data: billingAddress } = useBillingAddress();
  const deleteMutation = useDeletePaymentMethod();
  const setDefaultMutation = useSetDefaultPaymentMethod();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this payment method?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        console.error('Failed to delete payment method:', err);
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultMutation.mutateAsync(id);
    } catch (err) {
      console.error('Failed to set default payment method:', err);
    }
  };

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading payment methods...</p>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  if (error) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load Payment Methods</h2>
            <p className="text-gray-400 mb-4">{error.message}</p>
            <Button variant="gvteway" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Payment Methods</h1>
              <p className="text-gray-400">Manage your saved payment methods</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </Button>
          </div>

          {/* Saved Cards */}
          <div className="space-y-4">
            {paymentMethods.length === 0 ? (
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-12 text-center">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">No payment methods saved</p>
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Card
                  </Button>
                </CardContent>
              </Card>
            ) : (
              paymentMethods.map((method: PaymentMethod) => (
            <Card key={method.id} className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium">
                          {method.type} •••• {method.last4}
                        </p>
                        {method.isDefault && (
                          <Badge className="bg-info/20 text-info border-blue-500/50">
                            <Star className="w-3 h-3 mr-1" />
                            Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">Expires {method.expiry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-gray-700"
                        onClick={() => handleSetDefault(method.id)}
                        disabled={setDefaultMutation.isPending}
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-400 hover:text-red-300 hover:bg-red-950/20"
                      onClick={() => handleDelete(method.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
            )}
        </div>

        {/* Billing Address */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Billing Address</CardTitle>
            
          </CardHeader>
          <CardContent>
            {billingAddress ? (
              <>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <p className="text-white font-medium">{billingAddress.name}</p>
                  <p className="text-gray-400 text-sm">{billingAddress.line1}</p>
                  {billingAddress.line2 && <p className="text-gray-400 text-sm">{billingAddress.line2}</p>}
                  <p className="text-gray-400 text-sm">{billingAddress.city}, {billingAddress.state} {billingAddress.postalCode}</p>
                  <p className="text-gray-400 text-sm">{billingAddress.country}</p>
                </div>
                <Button variant="outline" className="mt-4 border-gray-700">
                  Edit Address
                </Button>
              </>
            ) : (
              <div className="p-4 bg-gray-800/50 rounded-lg text-center">
                <p className="text-gray-400">No billing address saved</p>
                <Button variant="outline" className="mt-4 border-gray-700">
                  Add Address
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Security */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Payment Security</CardTitle>
            
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">Secure Payments</p>
                <p className="text-sm text-gray-400">All transactions are encrypted and PCI compliant</p>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </GvtewayLayout>
  );
}
