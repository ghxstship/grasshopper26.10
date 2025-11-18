'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { Megaphone, Save, AlertCircle } from 'lucide-react';
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

export default function MarketingAdvancingPage() {
  const router = useRouter();
  const { formData, errors, isSubmitting, handleChange, handleSubmit, handleSaveDraft } = useAdvancingForm({
    category: 'marketing',
    onSuccess: () => router.push('/compvss/advancing/dashboard'),
  });
  
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    handleChange(e.target.name, e.target.value);
  };

  return (
    <CompvssLayout>
      <ContentLayout
        title="Marketing Request"
        description="Promotional materials and marketing"
        
        variant="compvss"
        showToolbar={false}
      >
        <div className="max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card variant="compvss" className="bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-compvss-cyan-500" />
                Marketing Details
              </CardTitle>
              <CardDescription className="text-gray-400">
                Standard advancing request form - Marketing category
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errors.submit && (
                <div className="mb-4 p-3 bg-destructive/100/10 border border-destructive/30 rounded-lg flex items-center gap-2 text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-body-sm">{errors.submit}</span>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <FormField label="Request Title" required error={errors.title}>
                  <Input 
                    type="text" 
                    name="title"
                    value={String(formData.title || '')}
                    onChange={onChange}
                    placeholder="Brief description of request" 
                    className="bg-black/50 border-compvss-cyan-500/30" 
                    variant="compvss" 
                    required 
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Event Date" required error={errors.eventDate}>
                    <Input 
                      type="date" 
                      name="eventDate"
                      value={String(formData.eventDate || '')}
                      onChange={onChange}
                      className="bg-black/50 border-compvss-cyan-500/30" 
                      variant="compvss" 
                      required 
                    />
                  </FormField>
                  <FormField label="Priority" required error={errors.priority}>
                    <Select 
                      name="priority"
                      value={String(formData.priority || 'MEDIUM')}
                      onChange={onChange}
                      className="bg-black/50 border-compvss-cyan-500/30" 
                      variant="compvss"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </Select>
                  </FormField>
                </div>

                <FormField label="Venue/Location" required error={errors.venue}>
                  <Input 
                    type="text" 
                    name="venue"
                    value={String(formData.venue || '')}
                    onChange={onChange}
                    placeholder="Event venue or location" 
                    className="bg-black/50 border-compvss-cyan-500/30" 
                    variant="compvss" 
                    required 
                  />
                </FormField>

                <FormField label="Marketing Service" required error={errors.marketingService}>
                  <Select 
                    name="marketingService"
                    value={String(formData.marketingService || '')}
                    onChange={onChange}
                    className="bg-black/50 border-compvss-cyan-500/30" 
                    variant="compvss"
                  >
                    <option value="">Select from catalog</option>
                    <option value="print_materials">Print Materials</option>
                    <option value="digital_marketing">Digital Marketing</option>
                    <option value="social_media">Social Media</option>
                    <option value="signage">Signage & Banners</option>
                    <option value="merchandise">Promotional Merchandise</option>
                    <option value="other">Other</option>
                  </Select>
                </FormField>

                <FormField label="Quantity" required error={errors.quantity}>
                  <Input 
                    type="number" 
                    name="quantity"
                    value={String(formData.quantity || '')}
                    onChange={onChange}
                    placeholder="Number of items/impressions" 
                    className="bg-black/50 border-compvss-cyan-500/30" 
                    variant="compvss" 
                    required 
                  />
                </FormField>

                <FormField label="Detailed Requirements" required error={errors.requirements}>
                  <Textarea 
                    name="requirements"
                    value={String(formData.requirements || '')}
                    onChange={onChange}
                    placeholder="Specific marketing needs, design specs, distribution plan..." 
                    className="bg-black/50 border-compvss-cyan-500/30" 
                    variant="compvss" 
                    required 
                  />
                </FormField>

                <FormField label="Budget Estimate" error={errors.budgetEstimate}>
                  <Input 
                    type="text" 
                    name="budgetEstimate"
                    value={String(formData.budgetEstimate || '')}
                    onChange={onChange}
                    placeholder="e.g., $1,500" 
                    className="bg-black/50 border-compvss-cyan-500/30" 
                    variant="compvss" 
                  />
                </FormField>

                <FormField label="Additional Notes" error={errors.notes}>
                  <Textarea 
                    name="notes"
                    value={String(formData.notes || '')}
                    onChange={onChange}
                    placeholder="Any additional information or special requirements..." 
                    className="bg-black/50 border-compvss-cyan-500/30 min-h-[100px]" 
                    variant="compvss" 
                  />
                </FormField>

                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    variant="compvss" 
                    size="lg" 
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="compvss-outline" 
                    size="lg" 
                    className="flex-1"
                    onClick={handleSaveDraft}
                    disabled={isSubmitting}
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
