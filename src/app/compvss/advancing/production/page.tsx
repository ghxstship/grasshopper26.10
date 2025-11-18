'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { Clapperboard, Save, AlertCircle } from 'lucide-react';
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

export default function ProductionAdvancingPage() {
  const router = useRouter();
  const { errors, isSubmitting, handleSubmit, handleSaveDraft } = useAdvancingForm({
    category: 'production',
    onSuccess: () => router.push('/compvss/advancing/dashboard'),
  });

  return (
    <CompvssLayout>
      <ContentLayout
        title="Production Request"
        description="Production services and crew"
        
        variant="compvss"
        showToolbar={false}
      >
        <div className="max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card variant="compvss" className="bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clapperboard className="w-5 h-5 text-compvss-cyan-500" />
                Production Details
              </CardTitle>
              <CardDescription className="text-gray-400">
                Standard advancing request form - Production category
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
                {/* Standard Fields */}
                <FormField label="Request Title" required>
                  <Input type="text" placeholder="Brief description of request" variant="compvss" required />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Event Date" required>
                    <Input type="date" variant="compvss" required />
                  </FormField>
                  <FormField label="Priority" required>
                    <Select variant="compvss">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </Select>
                  </FormField>
                </div>

                <FormField label="Venue/Location" required>
                  <Input type="text" placeholder="Event venue or location" variant="compvss" required />
                </FormField>

                {/* Category-Specific Fields */}
                <FormField label="Production Service" required>
                  <Select variant="compvss">
                    <option value="">Select from catalog</option>
                    <option value="stage_management">Stage Management</option>
                    <option value="technical_director">Technical Director</option>
                    <option value="crew">Production Crew</option>
                    <option value="coordination">Production Coordination</option>
                    <option value="other">Other</option>
                  </Select>
                </FormField>

                <FormField label="Number of Personnel" required>
                  <Input type="number" placeholder="Required crew members" variant="compvss" required />
                </FormField>

                <FormField label="Detailed Requirements" required>
                  <Textarea
                    placeholder="Specific production needs, crew roles, experience requirements..."
                    rows={5}
                    variant="compvss"
                    required
                  />
                </FormField>

                {/* Standard Fields */}
                <FormField label="Budget Estimate">
                  <Input type="text" placeholder="e.g., $5,000" variant="compvss" />
                </FormField>

                <FormField label="Additional Notes">
                  <Textarea
                    placeholder="Any additional information or special requirements..."
                    rows={4}
                    variant="compvss"
                  />
                </FormField>

                <div className="flex gap-4">
                  <Button type="submit" variant="compvss" size="lg" className="flex-1" disabled={isSubmitting}>
                    <Save className="w-5 h-5 mr-2" />
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                  <Button type="button" variant="compvss-outline" size="lg" className="flex-1" onClick={handleSaveDraft} disabled={isSubmitting}>
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
