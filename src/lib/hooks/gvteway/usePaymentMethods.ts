import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
}

export interface BillingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/**
 * Hook to fetch payment methods
 */
export function usePaymentMethods() {
  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: async () => {
      const response = await fetch('/api/gvteway/payment-methods');
      
      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }
      
      return response.json();
    },
  });
}

/**
 * Hook to add a payment method
 */
export function useAddPaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { token: string }) => {
      const response = await fetch('/api/gvteway/payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add payment method');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
}

/**
 * Hook to delete a payment method
 */
export function useDeletePaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentMethodId: string) => {
      const response = await fetch(`/api/gvteway/payment-methods/${paymentMethodId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete payment method');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
}

/**
 * Hook to set default payment method
 */
export function useSetDefaultPaymentMethod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentMethodId: string) => {
      const response = await fetch(`/api/gvteway/payment-methods/${paymentMethodId}/default`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to set default payment method');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods'] });
    },
  });
}

/**
 * Hook to fetch billing address
 */
export function useBillingAddress() {
  return useQuery({
    queryKey: ['billing-address'],
    queryFn: async () => {
      const response = await fetch('/api/gvteway/billing-address');
      
      if (!response.ok) {
        throw new Error('Failed to fetch billing address');
      }
      
      return response.json();
    },
  });
}

/**
 * Hook to update billing address
 */
export function useUpdateBillingAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BillingAddress) => {
      const response = await fetch('/api/gvteway/billing-address', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update billing address');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-address'] });
    },
  });
}
