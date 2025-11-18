import { ReactNode } from 'react';
import { Navigation } from '@/components/organisms/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { PageTitle, SectionHeader, BodyText, Metadata } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Separator } from '@/components/atoms/Separator';
import { Badge } from '@/components/atoms/Badge';
import { ShoppingCart, CreditCard, Lock } from 'lucide-react';

export interface CheckoutItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CheckoutPageTemplateProps {
  title?: string;
  items: CheckoutItem[];
  subtotal: number;
  tax?: number;
  fees?: number;
  discount?: number;
  total: number;
  currency?: string;
  checkoutForm: ReactNode;
  onSubmit: () => void | Promise<void>;
  isProcessing?: boolean;
  securityBadges?: ReactNode;
  termsAndConditions?: ReactNode;
}

/**
 * CheckoutPageTemplate - GHXSTSHIP Standardized
 * 
 * Reusable template for checkout pages with order summary sidebar.
 * Optimized for ticket purchases, merchandise, and membership upgrades.
 * 
 * Features:
 * - Order summary sidebar (sticky on desktop)
 * - Itemized pricing breakdown
 * - Payment form section
 * - Security badges and trust indicators
 * - Mobile-responsive (summary on top for mobile)
 * - Loading states during processing
 * 
 * @example
 * <CheckoutPageTemplate
 *   items={cartItems}
 *   subtotal={99.99}
 *   tax={8.99}
 *   total={108.98}
 *   checkoutForm={<PaymentForm />}
 *   onSubmit={handleCheckout}
 * />
 */
export function CheckoutPageTemplate({
  title = 'Checkout',
  items,
  subtotal,
  tax = 0,
  fees = 0,
  discount = 0,
  total,
  currency = 'USD',
  checkoutForm,
  onSubmit,
  isProcessing = false,
  securityBadges,
  termsAndConditions,
}: CheckoutPageTemplateProps) {
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-ghxst-white">
      <Navigation />

      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          {/* Header */}
          <div className="mb-8">
            <PageTitle className="mb-4 uppercase text-ghxst-primary flex items-center gap-3">
              <ShoppingCart className="w-8 h-8" />
              {title}
            </PageTitle>
          </div>

          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-bebas text-h4">
                    <CreditCard className="w-6 h-6" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent>{checkoutForm}</CardContent>
              </Card>

              {/* Security Badges */}
              {securityBadges && (
                <div className="flex items-center justify-center gap-4 py-4">
                  {securityBadges}
                </div>
              )}

              {/* Terms and Conditions */}
              {termsAndConditions && (
                <Card className="bg-ghxst-background">
                  <CardContent className="p-4">
                    <BodyText className="text-body-sm text-ghxst-text-secondary">
                      {termsAndConditions}
                    </BodyText>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <aside className="lg:sticky lg:top-24 h-fit">
              <Card>
                <CardHeader>
                  <CardTitle className="font-bebas text-h4">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-start gap-3">
                        {item.image && (
                          <div className="w-16 h-16 rounded-lg bg-ghxst-background flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <BodyText className="font-medium truncate">
                            {item.name}
                          </BodyText>
                          {item.description && (
                            <Metadata className="text-ghxst-text-secondary truncate">
                              {item.description}
                            </Metadata>
                          )}
                          <div className="flex items-center justify-between mt-1">
                            <Metadata className="text-ghxst-text-secondary">
                              Qty: {item.quantity}
                            </Metadata>
                            <BodyText className="font-medium">
                              {formatPrice(item.price * item.quantity)}
                            </BodyText>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Pricing Breakdown */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <BodyText className="text-ghxst-text-secondary">Subtotal</BodyText>
                      <BodyText>{formatPrice(subtotal)}</BodyText>
                    </div>

                    {tax > 0 && (
                      <div className="flex items-center justify-between">
                        <BodyText className="text-ghxst-text-secondary">Tax</BodyText>
                        <BodyText>{formatPrice(tax)}</BodyText>
                      </div>
                    )}

                    {fees > 0 && (
                      <div className="flex items-center justify-between">
                        <BodyText className="text-ghxst-text-secondary">Fees</BodyText>
                        <BodyText>{formatPrice(fees)}</BodyText>
                      </div>
                    )}

                    {discount > 0 && (
                      <div className="flex items-center justify-between">
                        <BodyText className="text-success">Discount</BodyText>
                        <BodyText className="text-success">
                          -{formatPrice(discount)}
                        </BodyText>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex items-center justify-between">
                    <SectionHeader className="font-bebas">Total</SectionHeader>
                    <SectionHeader className="font-bebas text-ghxst-primary">
                      {formatPrice(total)}
                    </SectionHeader>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={onSubmit}
                    disabled={isProcessing}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    {isProcessing ? 'Processing...' : `Pay ${formatPrice(total)}`}
                  </Button>

                  {/* Security Badge */}
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <Lock className="w-4 h-4 text-success" />
                    <Metadata className="text-success">
                      Secure checkout powered by Stripe
                    </Metadata>
                  </div>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
