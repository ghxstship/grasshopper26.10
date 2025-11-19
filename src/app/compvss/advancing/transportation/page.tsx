'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { Car, Save } from 'lucide-react';
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

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/advancing/transportation

export default function TransportationAdvancingPage() {
  const router = useRouter();
  const { formData, errors, isSubmitting, handleChange, handleSubmit, handleSaveDraft } = useAdvancingForm({
    category: 'transportation',
    onSuccess: () => router.push('/compvss/advancing/dashboard'),
  });
  
  const isLoading = isSubmitting;
  const error = errors.submit ? { message: errors.submit } : null;
  return (
    <CompvssLayout>
      <ContentLayout
        title="Transportation Request"
        description="Ground transportation and logistics"
        
        variant="compvss"
        showToolbar={false}
      >
        <div className="max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card variant="compvss" className="bg-grey-900/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-compvss-cyan-500" />
                Transportation Details
              </CardTitle>
              <CardDescription className="text-grey-400">
                Provide transportation requirements and logistics
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

                <FormField label="Pickup Location" required>
                  <Input type="text" placeholder="Address or venue name" className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" name="pickupLocation" value={String(formData.pickupLocation || "")} onChange={handleChange as any} required />
                </FormField>

                <FormField label="Drop-off Location" required>
                  <Input type="text" placeholder="Address or venue name" className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" name="dropoffLocation" value={String(formData.dropoffLocation || "")} onChange={handleChange as any} required />
                </FormField>

                <FormField label="Number of Passengers" required>
                  <Input type="number" placeholder="e.g., 8" className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" value={String(formData.numberOfPassengers || "")} name="numberOfPassengers" onChange={handleChange as any} required />
                </FormField>

                <FormField label="Vehicle Type" required>
                  <Select className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" value={String(formData.vehicleType || "")} name="vehicleType" onChange={handleChange as any}>
                    <option value="">Select vehicle type</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="van">Van/Sprinter</option>
                    <option value="bus">Bus</option>
                    <option value="truck">Truck/Cargo</option>
                  </Select>
                </FormField>

                <FormField label="Detailed Requirements" required>
                  <Textarea placeholder="Luggage, equipment, accessibility needs, etc..." className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" name="requirements" value={String(formData.requirements || "")} onChange={handleChange as any} required />
                </FormField>

                <FormField label="Budget Estimate">
                  <Input type="text" placeholder="e.g., $300" className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" name="budgetEstimate" value={String(formData.budgetEstimate || "")} onChange={handleChange as any} />
                </FormField>

                {error && (
                  <div className="p-4 bg-destructive/100/10 border border-destructive/30 rounded-lg">
                    <p className="text-destructive text-body-sm">{error.message}</p>
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
