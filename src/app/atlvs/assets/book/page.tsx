'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, Calendar, User } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { FormField } from '@/components/molecules/FormField';
import { useAuth } from '@/lib/hooks/auth/useAuth';

export default function BookAssetPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    asset: '',
    project: '',
    purpose: '',
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '17:00',
    assignedTo: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to book equipment');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/atlvs/equipment/' + formData.asset + '/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipmentId: formData.asset,
          projectId: formData.project,
          purpose: formData.purpose,
          startDate: new Date(formData.startDate + 'T' + formData.startTime).toISOString(),
          endDate: new Date(formData.endDate + 'T' + formData.endTime).toISOString(),
          assignedTo: formData.assignedTo || user.id,
          notes: formData.notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to book equipment');
      }

      alert('Equipment booked successfully!');
      router.push('/atlvs/assets');
    } catch (err) {
      console.error('Booking error:', err);
      setError(err instanceof Error ? err.message : 'Failed to book equipment');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="BOOK ASSET"
        description="Reserve an asset for your project"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Assets', href: '/atlvs/assets' },
          { label: 'Book' }
        ]}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
            {/* Asset Selection */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="mb-6">Asset & Project</CardTitle>
                <div className="space-y-4">
                  <FormField label="Select Asset" required>
                    <Select
                      required
                      value={formData.asset}
                      onChange={(e) => setFormData({...formData, asset: e.target.value})}
                      variant="atlvs"
                    >
                      <option value="">Choose an asset...</option>
                      <option value="1">LED Wall Panel System</option>
                      <option value="2">Sound System - Main Stage</option>
                      <option value="3">Lighting Rig - Complete</option>
                      <option value="4">Generator - 100kW</option>
                    </Select>
                  </FormField>

                  <FormField label="Project" required>
                    <Select
                      required
                      value={formData.project}
                      onChange={(e) => setFormData({...formData, project: e.target.value})}
                      variant="atlvs"
                    >
                      <option value="">Select a project...</option>
                      <option value="1">Summer Music Festival</option>
                      <option value="2">Arena Concert Series</option>
                      <option value="3">Corporate Conference</option>
                    </Select>
                  </FormField>

                  <FormField label="Purpose" required>
                    <Input
                      type="text"
                      required
                      value={formData.purpose}
                      onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                      variant="atlvs"
                      placeholder="Main stage setup"
                    />
                  </FormField>
                </div>
              </CardHeader>
            </Card>

            {/* Booking Period */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mb-6">
                  <Calendar className="w-5 h-5" />
                  Booking Period
                </CardTitle>
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Start Date" required>
                    <Input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      variant="atlvs"
                    />
                  </FormField>

                  <FormField label="End Date" required>
                    <Input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      variant="atlvs"
                    />
                  </FormField>

                  <FormField label="Start Time">
                    <Input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                      variant="atlvs"
                    />
                  </FormField>

                  <FormField label="End Time">
                    <Input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                      variant="atlvs"
                    />
                  </FormField>
                </div>
              </CardHeader>
            </Card>

            {/* Assignment */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 mb-6">
                  <User className="w-5 h-5" />
                  Assignment
                </CardTitle>
                <div className="space-y-4">
                  <FormField label="Assigned To">
                    <Select
                      value={formData.assignedTo}
                      onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                      variant="atlvs"
                    >
                      <option value="">Select team member...</option>
                      <option value="1">Mike Chen</option>
                      <option value="2">Sarah Johnson</option>
                      <option value="3">Alex Kim</option>
                      <option value="4">Jordan Lee</option>
                    </Select>
                  </FormField>

                  <FormField label="Additional Notes">
                    <Textarea
                      rows={4}
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      variant="atlvs"
                      placeholder="Any special requirements or notes..."
                    />
                  </FormField>
                </div>
              </CardHeader>
            </Card>

            {error && (
              <div className="p-4 bg-destructive/100/10 border border-destructive/30 rounded-lg">
                <p className="text-destructive text-body-sm">{error}</p>
              </div>
            )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-4">
                <Button variant="ghost" type="button">
                  Cancel
                </Button>
                <Button type="submit" variant="atlvs" disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? 'Booking...' : 'Book Asset'}
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
