'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { Wrench, Save } from 'lucide-react';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { FormField } from '@/components/molecules/FormField';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { useRouter } from 'next/navigation';
import { useAdvancingForm } from '@/lib/hooks/compvss/useAdvancingForm';

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/advancing/technical

export default function TechnicalAdvancingPage() {
  const router = useRouter();
  const { formData, errors, isSubmitting, handleChange, handleSubmit, handleSaveDraft } = useAdvancingForm({
    category: 'technical',
    onSuccess: () => router.push('/compvss/advancing/dashboard'),
  });
  
  const isLoading = isSubmitting;
  const error = errors.submit ? { message: errors.submit } : null;
  return (
    <CompvssLayout>
      <ContentLayout
        title="Technical Request"
        description="Technical services"
        
        variant="compvss"
        showToolbar={false}
      >
        <div className="max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card variant="compvss" className="bg-grey-900/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wrench className="w-5 h-5 text-compvss-cyan-500" />
                Technical Details
              </CardTitle>
              <CardDescription className="text-grey-400">
                Standard advancing request form - Technical category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <FormField label="Request Title" required>
                  <Input type="text" placeholder="Brief description" className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" name="title" value={String(formData.title || "")} onChange={handleChange as any} required />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Event Date" required>
                    <Input type="date" className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" name="eventDate" value={String(formData.eventDate || "")} onChange={handleChange as any} required />
                  </FormField>
                  <FormField label="Priority" required>
                    <Select className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" name="priority" value={String(formData.priority || "")} onChange={handleChange as any}>
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </Select>
                  </FormField>
                </div>

                <FormField label="Venue/Location" required>
                  <Input type="text" placeholder="Event venue" className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" name="venue" value={String(formData.venue || "")} onChange={handleChange as any} required />
                </FormField>

                <FormField label="Service Type" required>
                  <Select className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" value={String(formData.serviceType || "")} name="serviceType" onChange={handleChange as any}>
                    <option value="">Select from catalog</option>
                    <option value="av">AV Technicians</option>
                    <option value="it">IT Support</option>
                    <option value="rigging">Rigging Services</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="other">Other</option>
                  </Select>
                </FormField>

                <FormField label="Detailed Requirements" required>
                  <Textarea placeholder="Specific technical needs..." className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" name="requirements" value={String(formData.requirements || "")} onChange={handleChange as any} required />
                </FormField>

                <FormField label="Budget Estimate">
                  <Input type="text" placeholder="e.g., $2,500" className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" name="budgetEstimate" value={String(formData.budgetEstimate || "")} onChange={handleChange as any} />
                </FormField>

                {error && (
                  <div className="p-4 bg-destructive/100/10 border border-destructive/30 rounded-lg">
                    <p className="text-destructive text-body-sm">{error.message}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button type="submit" variant="compvss" size="lg" className="flex-1" disabled={isLoading}>
                    <Save className="w-5 h-5 mr-2" />
                    {isLoading ? 'Submitting...' : 'Submit'}
                  </Button>
                  <Button type="button" variant="compvss-outline" size="lg" className="flex-1" onClick={handleSaveDraft} disabled={isLoading}>
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
