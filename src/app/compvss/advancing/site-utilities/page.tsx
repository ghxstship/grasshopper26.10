'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { Zap, Save, AlertCircle } from 'lucide-react';
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

export default function SiteUtilitiesAdvancingPage() {
  const router = useRouter();
  const { errors, isSubmitting, handleSubmit, handleSaveDraft } = useAdvancingForm({
    category: 'site-utilities',
    onSuccess: () => router.push('/compvss/advancing/dashboard'),
  });

  return (
    <CompvssLayout>
      <ContentLayout
        title="Site Utilities Request"
        description="Site utilities and services"
        breadcrumbs={[
          { label: 'Advancing', href: '/compvss/advancing' },
          { label: 'New Request', href: '/compvss/advancing/new' },
          { label: 'Site Utilities' }
        ]}
        variant="compvss"
        showToolbar={false}
      >
        <div className="max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card variant="compvss" className="bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-compvss-cyan-500" />
                Site Utilities Details
              </CardTitle>
              <CardDescription className="text-gray-400">
                Standard advancing request form - Site Utilities category
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
                <FormField label="Request Title" required>
                  <Input type="text" placeholder="Brief description of request" className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" required />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Event Date" required>
                    <Input type="date" className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" required />
                  </FormField>
                  <FormField label="Priority" required>
                    <Select className="bg-black/50 border-compvss-cyan-500/30" variant="compvss">
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </Select>
                  </FormField>
                </div>

                <FormField label="Venue/Location" required>
                  <Input type="text" placeholder="Event venue or location" className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" required />
                </FormField>

                <FormField label="Utility Type" required>
                  <Select className="bg-black/50 border-compvss-cyan-500/30" variant="compvss">
                    <option value="">Select from catalog</option>
                    <option value="power">Power/Electrical</option>
                    <option value="water">Water Supply</option>
                    <option value="internet">Internet/WiFi</option>
                    <option value="hvac">HVAC/Climate Control</option>
                    <option value="waste">Waste Management</option>
                    <option value="other">Other</option>
                  </Select>
                </FormField>

                <FormField label="Capacity/Load" required>
                  <Input type="text" placeholder="e.g., 200 amps, 500 Mbps" className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" required />
                </FormField>

                <FormField label="Detailed Requirements" required>
                  <Textarea placeholder="Specific utility needs, connection points, distribution requirements..." className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" required />
                </FormField>

                <FormField label="Budget Estimate">
                  <Input type="text" placeholder="e.g., $3,000" className="bg-black/50 border-compvss-cyan-500/30" variant="compvss" />
                </FormField>

                <FormField label="Additional Notes">
                  <Textarea placeholder="Any additional information or special requirements..." className="bg-black/50 border-compvss-cyan-500/30 min-h-[100px]" variant="compvss" />
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
