'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { FormField } from '@/components/molecules/FormField';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { useSubmitAdvancing } from '@/lib/hooks/compvss/useSubmitAdvancing';
import { useAuth } from '@/lib/hooks/auth/useAuth';

export default function AccessAdvancingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { submitAdvancing, isLoading, error } = useSubmitAdvancing();
  
  const [formData, setFormData] = useState({
    title: '',
    eventDate: '',
    priority: 'MEDIUM',
    venue: '',
    accessType: '',
    numberOfPersonnel: '',
    requirements: '',
    budgetEstimate: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    e.preventDefault();
    
    if (!user) {
      alert('You must be logged in to submit a request');
      return;
    }

    try {
      const payload = {
        eventId: '00000000-0000-0000-0000-000000000000', // TODO: Get from event selection
        eventDate: formData.eventDate ? new Date(formData.eventDate).toISOString() : new Date().toISOString(),
        category: 'ACCESS_CREDENTIALS' as const,
        title: formData.title,
        description: formData.requirements,
        priority: formData.priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
        requestedBy: user.id,
        dueDate: formData.eventDate ? new Date(formData.eventDate).toISOString() : undefined,
        requirements: {
          venue: formData.venue,
          accessType: formData.accessType,
          numberOfPersonnel: parseInt(formData.numberOfPersonnel) || 0,
          budgetEstimate: formData.budgetEstimate,
          notes: formData.notes,
        },
      };

      await submitAdvancing(payload);
      
      if (isDraft) {
        alert('Draft saved successfully!');
      } else {
        alert('Request submitted successfully!');
        router.push('/compvss/advancing/dashboard');
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert(error?.message || 'Failed to submit request');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <CompvssLayout>
      <ContentLayout
        title="Access Request"
        description="Site access and credentials"
        
        variant="compvss"
        showToolbar={false}
      >
        <div className="max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card variant="compvss" className="bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-compvss-cyan-500" />
                Access Details
              </CardTitle>
              <CardDescription className="text-gray-400">
                Standard advancing request form - Access category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
                <FormField label="Request Title" required>
                  <Input 
                    type="text" 
                    placeholder="Brief description of request" 
                    className="bg-black/50 border-compvss-cyan-500/30" 
                    variant="compvss" 
                    name="title" value={String(formData.title || "")} onChange={handleChange as any}
                    required 
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Event Date" required>
                    <Input 
                      type="date" 
                      className="bg-black/50 border-compvss-cyan-500/30" 
                      variant="compvss" 
                      name="eventDate" value={String(formData.eventDate || "")} onChange={handleChange as any}
                      required 
                    />
                  </FormField>
                  <FormField label="Priority" required>
                    <Select 
                      className="bg-black/50 border-compvss-cyan-500/30" 
                      variant="compvss"
                      name="priority" value={String(formData.priority || "")} onChange={handleChange as any}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </Select>
                  </FormField>
                </div>

                <FormField label="Venue/Location" required>
                  <Input 
                    type="text" 
                    placeholder="Event venue or location" 
                    className="bg-black/50 border-compvss-cyan-500/30" 
                    variant="compvss" 
                    name="venue" value={String(formData.venue || "")} onChange={handleChange as any}
                    required 
                  />
                </FormField>

                <FormField label="Access Type" required>
                  <Select 
                    className="bg-black/50 border-compvss-cyan-500/30" 
                    variant="compvss"
                    name="accessType" value={String(formData.accessType || "")} onChange={handleChange as any}
                  >
                    <option value="">Select from catalog</option>
                    <option value="backstage">Backstage Access</option>
                    <option value="vip">VIP Access</option>
                    <option value="production">Production Area Access</option>
                    <option value="loading">Loading Dock Access</option>
                    <option value="parking">Parking Access</option>
                    <option value="other">Other</option>
                  </Select>
                </FormField>

                <FormField label="Number of Personnel" required>
                  <Input 
                    type="number" 
                    placeholder="Number requiring access" 
                    className="bg-black/50 border-compvss-cyan-500/30" 
                    variant="compvss" 
                    name="numberOfPersonnel" value={String(formData.numberOfPersonnel || "")} onChange={handleChange as any}
                    required 
                  />
                </FormField>

                <FormField label="Detailed Requirements" required>
                  <Textarea 
                    placeholder="Specific access needs, credentials required, time periods..." 
                    className="bg-black/50 border-compvss-cyan-500/30" 
                    variant="compvss" 
                    name="requirements" value={String(formData.requirements || "")} onChange={handleChange as any}
                    required 
                  />
                </FormField>

                <FormField label="Budget Estimate">
                  <Input 
                    type="text" 
                    placeholder="e.g., $500" 
                    className="bg-black/50 border-compvss-cyan-500/30" 
                    variant="compvss" 
                    name="budgetEstimate" value={String(formData.budgetEstimate || "")} onChange={handleChange as any}
                  />
                </FormField>

                <FormField label="Additional Notes">
                  <Textarea 
                    placeholder="Any additional information or special requirements..." 
                    className="bg-black/50 border-compvss-cyan-500/30 min-h-[100px]" 
                    variant="compvss" 
                    name="notes" value={String(formData.notes || "")} onChange={handleChange as any}
                  />
                </FormField>

                {error && (
                  <div className="p-4 bg-destructive/100/10 border border-destructive/30 rounded-lg">
                    <p className="text-destructive text-body-sm">{error.message}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    variant="compvss" 
                    size="lg" 
                    className="flex-1"
                    disabled={isLoading}
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {isLoading ? 'Submitting...' : 'Submit Request'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="compvss-outline" 
                    size="lg" 
                    className="flex-1"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmit(e as unknown as React.FormEvent, true)}
                    disabled={isLoading}
                  >
                    Save Draft
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
        </div>
      </ContentLayout>
    </CompvssLayout>
  );
}
