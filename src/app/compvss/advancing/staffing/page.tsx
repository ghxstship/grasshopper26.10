'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { Users, Save } from 'lucide-react';
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

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/advancing/staffing

export default function StaffingAdvancingPage() {
  const router = useRouter();
  const { formData, errors, isSubmitting, handleChange, handleSubmit, handleSaveDraft } = useAdvancingForm({
    category: 'staffing',
    onSuccess: () => router.push('/compvss/advancing/dashboard'),
  });
  
  const isLoading = isSubmitting;
  const error = errors.submit ? { message: errors.submit } : null;
  return (
    <CompvssLayout>
      <ContentLayout
        title="Staffing Request"
        description="Event staff and personnel"
        
        variant="compvss"
        showToolbar={false}
      >
        <div className="max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card variant="compvss" className="bg-grey-900/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-compvss-cyan-500" />
                Staffing Details
              </CardTitle>
              <CardDescription className="text-grey-400">
                Standard advancing request form - Staffing category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <FormField label="Request Title" required>
                  <Input type="text" placeholder="Brief description of request" className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" name="title" value={String(formData.title || "")} onChange={handleChange as any} required />
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
                  <Input type="text" placeholder="Event venue or location" className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" name="venue" value={String(formData.venue || "")} onChange={handleChange as any} required />
                </FormField>

                <FormField label="Staff Role" required>
                  <Select className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" value={String(formData.staffRole || "")} name="staffRole" onChange={handleChange as any}>
                    <option value="">Select from catalog</option>
                    <option value="ushers">Ushers</option>
                    <option value="ticket_takers">Ticket Takers</option>
                    <option value="merchandise">Merchandise Staff</option>
                    <option value="hospitality">Hospitality Staff</option>
                    <option value="runners">Runners</option>
                    <option value="other">Other</option>
                  </Select>
                </FormField>

                <FormField label="Number of Personnel" required>
                  <Input type="number" placeholder="Required staff members" className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" value={String(formData.numberOfPersonnel || "")} name="numberOfPersonnel" onChange={handleChange as any} required />
                </FormField>

                <FormField label="Detailed Requirements" required>
                  <Textarea placeholder="Specific staffing needs, shifts, qualifications..." className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" name="requirements" value={String(formData.requirements || "")} onChange={handleChange as any} required />
                </FormField>

                <FormField label="Budget Estimate">
                  <Input type="text" placeholder="e.g., $2,500" className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" name="budgetEstimate" value={String(formData.budgetEstimate || "")} onChange={handleChange as any} />
                </FormField>

                <FormField label="Additional Notes">
                  <Textarea placeholder="Any additional information or special requirements..." className="bg-black/50 border-compvss-cyan-500/30 min-h-[100px]" variant="compvss" name="notes" value={String(formData.notes || "")} onChange={handleChange as any} />
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
