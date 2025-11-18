import { ReactNode } from 'react';
import { Navigation } from '@/components/organisms/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { PageTitle, SectionHeader, BodyText, Metadata } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Check, X } from 'lucide-react';

export interface ComparisonOption {
  id: string;
  name: string;
  description?: string;
  price?: {
    amount: number;
    period?: string;
    currency?: string;
  };
  badge?: {
    label: string;
    variant?: 'default' | 'warning' | 'success' | 'error';
  };
  features: Array<{
    label: string;
    included: boolean;
    value?: string;
  }>;
  cta: {
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'secondary';
  };
  highlighted?: boolean;
}

export interface ComparisonPageTemplateProps {
  title: string;
  description?: string;
  options: ComparisonOption[];
  featureCategories?: Array<{
    name: string;
    features: string[];
  }>;
}

/**
 * ComparisonPageTemplate - GHXSTSHIP Standardized
 * 
 * Reusable template for comparing options side-by-side.
 * Optimized for membership tiers, pricing plans, and feature comparisons.
 * 
 * Features:
 * - Side-by-side comparison table
 * - Highlight differences between options
 * - Feature checkmarks and values
 * - CTA buttons per option
 * - Highlighted/recommended option
 * - Mobile-friendly stacked view
 * - Pricing display with currency formatting
 * 
 * @example
 * <ComparisonPageTemplate
 *   title="Choose Your Membership"
 *   description="Select the plan that's right for you"
 *   options={[
 *     {
 *       id: 'basic',
 *       name: 'Basic',
 *       price: { amount: 0, period: 'forever' },
 *       features: [
 *         { label: 'Access to events', included: true },
 *         { label: 'Discount', included: false }
 *       ],
 *       cta: { label: 'Get Started', href: '/signup' }
 *     },
 *     {
 *       id: 'premium',
 *       name: 'Premium',
 *       price: { amount: 9.99, period: 'month' },
 *       highlighted: true,
 *       features: [
 *         { label: 'Access to events', included: true },
 *         { label: 'Discount', included: true, value: '10%' }
 *       ],
 *       cta: { label: 'Upgrade', href: '/upgrade', variant: 'primary' }
 *     }
 *   ]}
 * />
 */
export function ComparisonPageTemplate({
  title,
  description,
  options,
  featureCategories,
}: ComparisonPageTemplateProps) {
  const formatPrice = (price: ComparisonOption['price']) => {
    if (!price) return null;
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currency || 'USD',
    }).format(price.amount);
    return price.period ? `${formatted}/${price.period}` : formatted;
  };

  // Extract all unique features if no categories provided
  const allFeatures = featureCategories
    ? featureCategories.flatMap(cat => cat.features)
    : Array.from(
        new Set(
          options.flatMap(opt => opt.features.map(f => f.label))
        )
      );

  return (
    <div className="min-h-screen bg-ghxst-white">
      <Navigation />

      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <PageTitle className="mb-4 uppercase text-ghxst-primary">{title}</PageTitle>
            {description && (
              <BodyText className="text-ghxst-text-secondary max-w-2xl mx-auto">
                {description}
              </BodyText>
            )}
          </div>

          {/* Desktop: Side-by-Side Comparison */}
          <div className="hidden lg:block overflow-x-auto">
            <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(280px, 1fr))` }}>
              {options.map((option) => (
                <Card
                  key={option.id}
                  className={`relative ${
                    option.highlighted
                      ? 'border-2 border-ghxst-primary shadow-lg scale-105'
                      : ''
                  }`}
                >
                  {option.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant={option.badge.variant}>
                        {option.badge.label}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-6">
                    <CardTitle className="font-bebas text-h3 mb-2">
                      {option.name}
                    </CardTitle>
                    {option.description && (
                      <Metadata className="text-ghxst-text-secondary">
                        {option.description}
                      </Metadata>
                    )}
                    {option.price && (
                      <div className="mt-4">
                        <SectionHeader className="font-bebas text-h2 text-ghxst-primary">
                          {formatPrice(option.price)}
                        </SectionHeader>
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Features */}
                    <div className="space-y-3 min-h-[300px]">
                      {allFeatures.map((featureLabel) => {
                        const feature = option.features.find(f => f.label === featureLabel);
                        return (
                          <div key={featureLabel} className="flex items-start gap-2">
                            {feature?.included ? (
                              <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <BodyText className={feature?.included ? '' : 'text-gray-400'}>
                                {featureLabel}
                              </BodyText>
                              {feature?.value && (
                                <Metadata className="text-ghxst-primary">
                                  {feature.value}
                                </Metadata>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* CTA */}
                    {option.cta.href ? (
                      <a href={option.cta.href}>
                        <Button
                          variant={option.cta.variant || (option.highlighted ? 'primary' : 'secondary')}
                          className="w-full"
                        >
                          {option.cta.label}
                        </Button>
                      </a>
                    ) : (
                      <Button
                        variant={option.cta.variant || (option.highlighted ? 'primary' : 'secondary')}
                        className="w-full"
                        onClick={option.cta.onClick}
                      >
                        {option.cta.label}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Mobile: Stacked Cards */}
          <div className="lg:hidden space-y-6">
            {options.map((option) => (
              <Card
                key={option.id}
                className={`relative ${
                  option.highlighted
                    ? 'border-2 border-ghxst-primary shadow-lg'
                    : ''
                }`}
              >
                {option.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant={option.badge.variant}>
                      {option.badge.label}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-6">
                  <CardTitle className="font-bebas text-h3 mb-2">
                    {option.name}
                  </CardTitle>
                  {option.description && (
                    <Metadata className="text-ghxst-text-secondary">
                      {option.description}
                    </Metadata>
                  )}
                  {option.price && (
                    <div className="mt-4">
                      <SectionHeader className="font-bebas text-h2 text-ghxst-primary">
                        {formatPrice(option.price)}
                      </SectionHeader>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Features */}
                  <div className="space-y-3">
                    {option.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <BodyText className={feature.included ? '' : 'text-gray-400'}>
                            {feature.label}
                          </BodyText>
                          {feature.value && (
                            <Metadata className="text-ghxst-primary">
                              {feature.value}
                            </Metadata>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  {option.cta.href ? (
                    <a href={option.cta.href}>
                      <Button
                        variant={option.cta.variant || (option.highlighted ? 'primary' : 'secondary')}
                        className="w-full"
                      >
                        {option.cta.label}
                      </Button>
                    </a>
                  ) : (
                    <Button
                      variant={option.cta.variant || (option.highlighted ? 'primary' : 'secondary')}
                      className="w-full"
                      onClick={option.cta.onClick}
                    >
                      {option.cta.label}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
