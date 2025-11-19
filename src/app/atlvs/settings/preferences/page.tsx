'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Select } from '@/components/atoms/Select';
import { FormField } from '@/components/molecules/FormField';

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/settings/preferences

export default function PreferencesPage() {
  return (
    <AtlvsLayout>
      <ContentLayout
        title="PREFERENCES"
        description="Customize your experience"
        breadcrumbs={[
          { label: 'Settings', href: '/atlvs/settings' },
          { label: 'Preferences' }
        ]}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card variant="atlvs" className="bg-grey-900/50">
          <CardHeader>
            <CardTitle className="mb-6">Display Settings</CardTitle>
            <div className="space-y-4">
              <FormField label="Theme">
                <Select variant="atlvs">
                  <option>Dark</option>
                  <option>Light</option>
                </Select>
              </FormField>
              <Button variant="atlvs" className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </CardHeader>
          </Card>
        </motion.div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
