/**
 * A/B Testing utilities with PostHog
 * Agent 6: Integration Specialist
 */

import { getFeatureFlagVariant, trackEvent } from './posthog';

export interface ABTestConfig {
  testName: string;
  variants: string[];
  defaultVariant?: string;
}

export interface ABTestResult {
  variant: string;
  isControl: boolean;
}

/**
 * Get the variant for an A/B test
 */
export function getABTestVariant(
  testName: string,
  defaultVariant: string = 'control'
): ABTestResult {
  if (typeof window === 'undefined') {
    return {
      variant: defaultVariant,
      isControl: true,
    };
  }

  const variant = getFeatureFlagVariant(testName);
  const selectedVariant = typeof variant === 'string' ? variant : defaultVariant;

  return {
    variant: selectedVariant,
    isControl: selectedVariant === 'control',
  };
}

/**
 * Track A/B test exposure
 */
export function trackABTestExposure(
  testName: string,
  variant: string,
  properties?: Record<string, unknown>
) {
  trackEvent('ab_test_exposure', {
    test_name: testName,
    variant,
    ...properties,
  });
}

/**
 * Track A/B test conversion
 */
export function trackABTestConversion(
  testName: string,
  variant: string,
  conversionType: string,
  value?: number,
  properties?: Record<string, unknown>
) {
  trackEvent('ab_test_conversion', {
    test_name: testName,
    variant,
    conversion_type: conversionType,
    value,
    ...properties,
  });
}

/**
 * Hook-like function to use A/B test (for use in React components)
 * Returns the variant and tracking functions
 */
export function useABTest(config: ABTestConfig) {
  const { testName, defaultVariant = 'control' } = config;
  const result = getABTestVariant(testName, defaultVariant);

  // Track exposure automatically
  if (typeof window !== 'undefined') {
    trackABTestExposure(testName, result.variant);
  }

  return {
    variant: result.variant,
    isControl: result.isControl,
    trackConversion: (
      conversionType: string,
      value?: number,
      properties?: Record<string, unknown>
    ) => {
      trackABTestConversion(testName, result.variant, conversionType, value, properties);
    },
  };
}

/**
 * Common A/B test configurations
 */
export const ABTests = {
  // Example: Pricing page layout test
  pricingLayout: {
    testName: 'pricing_layout_test',
    variants: ['control', 'variant_a', 'variant_b'],
    defaultVariant: 'control',
  },

  // Example: Checkout flow test
  checkoutFlow: {
    testName: 'checkout_flow_test',
    variants: ['control', 'single_page', 'multi_step'],
    defaultVariant: 'control',
  },

  // Example: CTA button test
  ctaButton: {
    testName: 'cta_button_test',
    variants: ['control', 'variant_a', 'variant_b'],
    defaultVariant: 'control',
  },

  // Example: Event card layout test
  eventCardLayout: {
    testName: 'event_card_layout_test',
    variants: ['control', 'compact', 'detailed'],
    defaultVariant: 'control',
  },
};

/**
 * Multivariate testing support
 */
export interface MultivariateTestConfig {
  testName: string;
  factors: {
    [factorName: string]: string[];
  };
}

export interface MultivariateTestResult {
  combination: Record<string, string>;
  combinationId: string;
}

/**
 * Get the combination for a multivariate test
 */
export function getMultivariateTestCombination(
  config: MultivariateTestConfig
): MultivariateTestResult {
  const { testName, factors } = config;
  const combination: Record<string, string> = {};

  // Get variant for each factor
  Object.keys(factors).forEach((factorName) => {
    const flagKey = `${testName}_${factorName}`;
    const variant = getFeatureFlagVariant(flagKey);
    const defaultVariant = factors[factorName][0];
    combination[factorName] = typeof variant === 'string' ? variant : defaultVariant;
  });

  // Create combination ID
  const combinationId = Object.entries(combination)
    .map(([key, value]) => `${key}:${value}`)
    .join('|');

  // Track exposure
  if (typeof window !== 'undefined') {
    trackEvent('multivariate_test_exposure', {
      test_name: testName,
      combination_id: combinationId,
      ...combination,
    });
  }

  return {
    combination,
    combinationId,
  };
}

/**
 * Track multivariate test conversion
 */
export function trackMultivariateTestConversion(
  testName: string,
  combinationId: string,
  conversionType: string,
  value?: number,
  properties?: Record<string, unknown>
) {
  trackEvent('multivariate_test_conversion', {
    test_name: testName,
    combination_id: combinationId,
    conversion_type: conversionType,
    value,
    ...properties,
  });
}
