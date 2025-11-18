'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { Utensils, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { FormField } from '@/components/molecules/FormField';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { useAdvancingForm } from '@/lib/hooks/compvss/useAdvancingForm';

export default function HospitalityAdvancingPage() {
  const router = useRouter();
  const { formData, errors, isSubmitting, handleChange, handleSubmit, handleSaveDraft } = useAdvancingForm({
    category: 'hospitality',
    onSuccess: () => router.push('/compvss/advancing/dashboard'),
  });
  
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    handleChange(e.target.name, e.target.value);
  };
  
  const isLoading = isSubmitting;
  const error = errors.submit ? { message: errors.submit } : null;
  return (
    <CompvssLayout>
      <ContentLayout
        title="Hospitality Request"
        description="Catering, meals, and refreshments"
        breadcrumbs={[
          { label: 'Advancing', href: '/compvss/advancing' },
          { label: 'New Request', href: '/compvss/advancing/new' },
          { label: 'Hospitality' }
        ]}
        variant="compvss"
        showToolbar={false}
      >
        <div className="max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card variant="compvss" className="bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Utensils className="w-5 h-5 text-compvss-cyan-500" />
                Hospitality Details
              </CardTitle>
              <CardDescription className="text-gray-400">
                Provide information about catering and meal requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <FormField label="Request Title" required>
                  <Input type="text" placeholder="Brief description" className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" name="title" value={String(formData.title || '')} onChange={onChange} required />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Event Date" required>
                    <Input type="date" className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" name="eventDate" value={String(formData.eventDate || '')} onChange={onChange} required />
                  </FormField>
                  <FormField label="Priority" required>
                    <Select className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" name="priority" value={String(formData.priority || '')} onChange={onChange}>
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </Select>
                  </FormField>
                </div>

                <FormField label="Venue/Location" required>
                  <Input type="text" placeholder="Event venue" className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" name="venue" value={String(formData.venue || '')} onChange={onChange} required />
                </FormField>

                <FormField label="Number of People" required>
                  <Input type="number" placeholder="e.g., 50" className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" value={String(formData.numberOfPeople || '')} name="numberOfPeople" onChange={onChange} required />
                </FormField>

                <FormField label="Meal Type" required>
                  <Select className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" value={String(formData.mealType || '')} name="mealType" onChange={onChange}>
                    <option value="">Select meal type</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snacks">Snacks & Refreshments</option>
                    <option value="full_catering">Full Day Catering</option>
                  </Select>
                </FormField>

                <FormField label="Dietary Restrictions">
                  <Textarea placeholder="List any dietary restrictions or allergies..." className="bg-black/50 border-compvss-cyan-500/30 min-h-[100px]" variant="compvss" name="dietaryRestrictions" value={String(formData.dietaryRestrictions || '')} onChange={onChange} />
                </FormField>

                <FormField label="Detailed Requirements" required>
                  <Textarea placeholder="Specific hospitality needs..." className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" name="requirements" value={String(formData.requirements || '')} onChange={onChange} required />
                </FormField>

                <FormField label="Budget Estimate">
                  <Input type="text" placeholder="e.g., $500-$1000" className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" name="budgetEstimate" value={String(formData.budgetEstimate || '')} onChange={onChange} />
                </FormField>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">{error.message}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button type="submit" variant="compvss" size="lg" className="flex-1" disabled={isLoading}>
                    <Save className="w-5 h-5 mr-2" />
                    {isLoading ? 'Submitting...' : 'Submit Request'}
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
