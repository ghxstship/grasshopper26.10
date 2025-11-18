'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { Hotel, Save, AlertCircle } from 'lucide-react';
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

export default function AccommodationAdvancingPage() {
  const router = useRouter();
  const { formData: rawFormData, errors, isSubmitting, handleChange, handleSubmit, handleSaveDraft } = useAdvancingForm({
    category: 'accommodation',
    onSuccess: () => router.push('/compvss/advancing/dashboard'),
  });
  const formData = rawFormData as Record<string, string>;

  return (
    <CompvssLayout>
      <ContentLayout
        title="Accommodation Request"
        description="Hotel and lodging arrangements"
        breadcrumbs={[
          { label: 'Advancing', href: '/compvss/advancing' },
          { label: 'New Request', href: '/compvss/advancing/new' },
          { label: 'Accommodation' }
        ]}
        variant="compvss"
        showToolbar={false}
      >
        <div className="max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card variant="compvss" className="bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Hotel className="w-5 h-5 text-compvss-cyan-500" />
                Accommodation Details
              </CardTitle>
              <CardDescription className="text-gray-400">
                Provide hotel and lodging requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errors.submit && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{errors.submit}</span>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Check-in Date" required error={errors.checkInDate}>
                    <Input 
                      type="date" 
                      name="checkInDate"
                      value={String(formData.checkInDate || "")}
                      onChange={handleChange as any}
                      className="bg-black/50 border-compvss-cyan-500/30" 
                      variant="compvss" 
                      required 
                    />
                  </FormField>
                  <FormField label="Check-out Date" required error={errors.checkOutDate}>
                    <Input 
                      type="date" 
                      name="checkOutDate"
                      value={String(formData.checkOutDate || "")}
                      onChange={handleChange as any}
                      className="bg-black/50 border-compvss-cyan-500/30" 
                      variant="compvss" 
                      required 
                    />
                  </FormField>
                </div>

                <FormField label="Number of Rooms" required error={errors.numberOfRooms}>
                  <Input 
                    type="number" 
                    name="numberOfRooms"
                    value={String(formData.numberOfRooms || "")}
                    onChange={handleChange as any}
                    placeholder="e.g., 5" 
                    className="bg-black/50 border-compvss-cyan-500/30" 
                    variant="compvss" 
                    required 
                  />
                </FormField>

                <FormField label="Room Type" required error={errors.roomType}>
                  <Select 
                    name="roomType"
                    value={String(formData.roomType || "")}
                    onChange={handleChange as any}
                    className="bg-black/50 border-compvss-cyan-500/30" 
                    variant="compvss"
                  >
                    <option value="">Select room type</option>
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="suite">Suite</option>
                    <option value="mixed">Mixed</option>
                  </Select>
                </FormField>

                <FormField label="Preferred Location" error={errors.preferredLocation}>
                  <Input 
                    type="text" 
                    name="preferredLocation"
                    value={String(formData.preferredLocation || "")}
                    onChange={handleChange as any}
                    placeholder="Near venue, downtown, etc." 
                    className="bg-black/50 border-compvss-cyan-500/30" 
                    variant="compvss" 
                  />
                </FormField>

                <FormField label="Special Requirements" error={errors.specialRequirements}>
                  <Textarea 
                    name="specialRequirements"
                    value={String(formData.specialRequirements || "")}
                    onChange={handleChange as any}
                    placeholder="Accessibility, parking, amenities, etc..." 
                    className="bg-black/50 border-compvss-cyan-500/30" 
                    variant="compvss" 
                  />
                </FormField>

                <FormField label="Budget per Room/Night" error={errors.budgetPerRoom}>
                  <Input 
                    type="text" 
                    name="budgetPerRoom"
                    value={String(formData.budgetPerRoom || "")}
                    onChange={handleChange as any}
                    placeholder="e.g., $150" 
                    className="bg-black/50 border-compvss-cyan-500/30" 
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
