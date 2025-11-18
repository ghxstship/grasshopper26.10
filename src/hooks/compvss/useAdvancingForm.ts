import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useSubmitAdvancing } from './useSubmitAdvancing';
import { useAuth } from '@/hooks/auth/useAuth';
import type { AdvancingCategory, AdvancingPriority } from '@/lib/validations/advancing';

export interface AdvancingFormData {
  title?: string;
  eventDate?: string;
  priority?: string;
  venue?: string;
  requirements?: string;
  budgetEstimate?: string;
  notes?: string;
  [key: string]: string | undefined;
}

interface UseAdvancingFormOptions {
  category: string;
  onSuccess?: () => void;
}

interface FormErrors {
  [key: string]: string | undefined;
  submit?: string;
}

export function useAdvancingForm(options: UseAdvancingFormOptions) {
  const { category, onSuccess } = options;
  const router = useRouter();
  const { user } = useAuth();
  const { submitAdvancing, isLoading, error } = useSubmitAdvancing();
  
  const [formData, setFormData] = useState<AdvancingFormData>({
    title: '',
    eventDate: '',
    priority: 'MEDIUM',
    venue: '',
    requirements: '',
    budgetEstimate: '',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setErrors({ submit: 'You must be logged in to submit a request' });
      return;
    }

    try {
      setErrors({});
      
      // Extract standard fields
      const { title, eventDate, priority, venue, requirements, budgetEstimate, notes, ...customFields } = formData;

      const payload = {
        eventId: formData.eventId || sessionStorage.getItem('selectedEventId') || undefined,
        category: category.toUpperCase().replace(/-/g, '_') as AdvancingCategory,
        title: title || 'Untitled Request',
        description: requirements || '',
        priority: (priority || 'MEDIUM') as AdvancingPriority,
        requestedBy: user.id,
        dueDate: eventDate ? new Date(eventDate).toISOString() : undefined,
        requirements: {
          venue,
          budgetEstimate,
          notes,
          ...customFields,
        },
      };

      await submitAdvancing(payload);
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/compvss/advancing/dashboard');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setErrors({ submit: error?.message || 'Failed to submit request' });
    }
  };

  const handleSaveDraft = async () => {
    try {
      const draftKey = `advancing_draft_${category}`;
      const draftData = {
        ...formData,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(draftKey, JSON.stringify(draftData));
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Failed to save draft:', error);
      alert('Failed to save draft');
    }
  };

  return {
    formData,
    errors,
    isSubmitting: isLoading,
    handleChange,
    handleSubmit,
    handleSaveDraft,
    user,
  };
}
