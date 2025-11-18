 
'use client';

import { useEffect, useState } from 'react';
import { ABTestConfig, getABTestVariant, trackABTestExposure, trackABTestConversion } from '@/lib/integrations/analytics/ab-testing';

export interface UseABTestReturn {
  variant: string;
  isControl: boolean;
  isLoading: boolean;
  trackConversion: (
    conversionType: string,
    value?: number,
    properties?: Record<string, unknown>
  ) => void;
}

/**
 * React hook for A/B testing with PostHog
 * Automatically tracks exposure when the component mounts
 */
export function useABTest(config: ABTestConfig): UseABTestReturn {
  const { testName, defaultVariant = 'control' } = config;
  const [state, setState] = useState({
    isLoading: true,
    variant: defaultVariant,
    isControl: true,
  });

   
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => setState(prev => ({ ...prev, isLoading: false })), 0);
      return;
    }

    // Get variant
    const result = getABTestVariant(testName, defaultVariant);

    // Track exposure
    trackABTestExposure(testName, result.variant);

    // Update state once - legitimate use for external system sync (A/B testing)
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      setState({
        isLoading: false,
        variant: result.variant,
        isControl: result.isControl,
      });
    }, 0);
    // Intentionally syncing with external A/B testing system
  }, [testName, defaultVariant]);

  const trackConversion = (
    conversionType: string,
    value?: number,
    properties?: Record<string, unknown>
  ) => {
    trackABTestConversion(testName, state.variant, conversionType, value, properties);
  };

  return {
    variant: state.variant,
    isControl: state.isControl,
    isLoading: state.isLoading,
    trackConversion,
  };
}
