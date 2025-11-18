'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { Building2, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { FormField } from '@/components/molecules/FormField';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { useAdvancingForm } from '@/lib/hooks/compvss/useAdvancingForm';

export default function SiteInfrastructureAdvancingPage() {
  const { formData, errors, isSubmitting, handleChange, handleSubmit, handleSaveDraft } = useAdvancingForm({
    category: 'site-infrastructure',
  });

  return (
    <CompvssLayout>
      <ContentLayout
        title="Site Infrastructure Request"
        description="Site infrastructure and facilities"
        breadcrumbs={[
          { label: 'Advancing', href: '/compvss/advancing' },
          { label: 'New Request', href: '/compvss/advancing/new' },
          { label: 'Site Infrastructure' }
        ]}
        variant="compvss"
        showToolbar={false}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card variant="compvss" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-compvss-cyan-500" />
                  Site Infrastructure Details
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Standard advancing request form - Site Infrastructure category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errors.submit && (
                    <div className="p-4 bg-error/10 border border-error/30 rounded-lg flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-error">{errors.submit}</p>
                    </div>
                  )}

                  <FormField label="Request Title" required error={errors.title}>
                    <Input
                      name="title"
                      value={String(formData.title || "")}
                      onChange={handleChange as any}
                      type="text"
                      placeholder="Brief description of request"
                      variant="compvss"
                      required
                    />
                  </FormField>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Event Date" required error={errors.eventDate}>
                      <Input
                        name="eventDate"
                        value={String(formData.eventDate || "")}
                        onChange={handleChange as any}
                        type="date"
                        variant="compvss"
                        required
                      />
                    </FormField>
                    <FormField label="Priority" required error={errors.priority}>
                      <Select
                        name="priority"
                        value={String(formData.priority || "")}
                        onChange={handleChange as any}
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
                      name="venue"
                      value={String(formData.venue || "")}
                      onChange={handleChange as any}
                      type="text"
                      placeholder="Event venue or location"
                      variant="compvss"
                      required
                    />
                  </FormField>

                  <FormField label="Infrastructure Type" required error={errors.infrastructureType}>
                    <Select
                      name="infrastructureType"
                      value={String(formData.infrastructureType || "")}
                      onChange={handleChange as any}
                      variant="compvss"
                    >
                      <option value="">Select from catalog</option>
                      <option value="staging">Staging & Platforms</option>
                      <option value="barriers">Barriers & Fencing</option>
                      <option value="tents">Tents & Structures</option>
                      <option value="flooring">Flooring & Matting</option>
                      <option value="restrooms">Restroom Facilities</option>
                      <option value="other">Other</option>
                    </Select>
                  </FormField>

                  <FormField label="Quantity" required error={errors.quantity}>
                    <Input
                      name="quantity"
                      value={String(formData.quantity || "")}
                      onChange={handleChange as any}
                      type="number"
                      placeholder="Number of units"
                      variant="compvss"
                      required
                    />
                  </FormField>

                  <FormField label="Detailed Requirements" required error={errors.requirements}>
                    <Textarea
                      name="requirements"
                      value={String(formData.requirements || "")}
                      onChange={handleChange as any}
                      placeholder="Specific infrastructure needs, dimensions, setup requirements..."
                      variant="compvss"
                      required
                    />
                  </FormField>

                  <FormField label="Budget Estimate" error={errors.budgetEstimate}>
                    <Input
                      name="budgetEstimate"
                      value={String(formData.budgetEstimate || "")}
                      onChange={handleChange as any}
                      type="text"
                      placeholder="e.g., $5,000"
                      variant="compvss"
                    />
                  </FormField>

                  <FormField label="Additional Notes" error={errors.notes}>
                    <Textarea
                      name="notes"
                      value={String(formData.notes || "")}
                      onChange={handleChange as any}
                      placeholder="Any additional information or special requirements..."
                      className="min-h-[100px]"
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
