import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface AdvancingFormData {
  title: string;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  eventDate: string;
  description?: string;
  [key: string]: unknown;
}

interface UseAdvancingFormOptions {
  category: string;
  onSuccess?: () => void;
}

export function useAdvancingForm(options: UseAdvancingFormOptions) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Partial<AdvancingFormData>>({
    category: options.category,
    priority: 'MEDIUM',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: async (data: AdvancingFormData) => {
      const response = await fetch('/api/compvss/advancing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit advancing form');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['compvss', 'advancing'] });
      options.onSuccess?.();
    },
  });

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrors({});
    
    try {
      await mutation.mutateAsync(formData as AdvancingFormData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleSaveDraft = async () => {
    // Save draft logic
    console.log('Saving draft:', formData);
  };

  return {
    formData,
    errors,
    isSubmitting: mutation.isPending,
    handleChange,
    handleSubmit,
    handleSaveDraft,
  };
}
