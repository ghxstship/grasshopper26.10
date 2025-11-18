'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState } from 'react';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Download, FileText, Table } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { FormField } from '@/components/molecules/FormField';
import { useReports } from '@/lib/hooks/atlvs/useReports';
import { useToast } from '@/lib/hooks/useToast';

export default function ExportDataPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const { data: _reports } = useReports();
  const { addToast } = useToast();

  const handleExport = async (format: 'csv' | 'pdf') => {
    if (!startDate || !endDate) {
      addToast({ title: 'Date Range Required', description: 'Please select both start and end dates', variant: 'error' });
      return;
    }

    setIsExporting(true);
    try {
      // TODO: Implement actual export API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      addToast({ title: 'Export Successful', description: `Your ${format.toUpperCase()} file is ready for download`, variant: 'success' });
    } catch {
      addToast({ title: 'Export Failed', description: 'Failed to export data. Please try again.', variant: 'error' });
    } finally {
      setIsExporting(false);
    }
  };
  return (
    <AtlvsLayout>
      <ContentLayout
        title="EXPORT DATA"
        description="Download your data in various formats"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Analytics', href: '/atlvs/analytics' },
          { label: 'Export' }
        ]}
      >
        <div className="space-y-6">
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <CardTitle className="mb-6">Export Options</CardTitle>
              <div className="space-y-4">
                <div className="p-4 bg-gray-800/50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-atlvs-green-500/20 flex items-center justify-center">
                      <Table className="w-6 h-6 text-atlvs-green-500" />
                    </div>
                    <div>
                      <div className="font-medium mb-1">CSV Export</div>
                      <div className="text-body-sm text-gray-400">Spreadsheet compatible format</div>
                    </div>
                  </div>
                  <Button 
                    variant="atlvs" 
                    size="sm"
                    onClick={() => handleExport('csv')}
                    disabled={isExporting}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-atlvs-purple-500/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-atlvs-purple-500" />
                    </div>
                    <div>
                      <div className="font-medium mb-1">PDF Report</div>
                      <div className="text-body-sm text-gray-400">Formatted document with charts</div>
                    </div>
                  </div>
                  <Button 
                    variant="atlvs" 
                    size="sm"
                    onClick={() => handleExport('pdf')}
                    disabled={isExporting}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <CardTitle className="mb-6">Date Range</CardTitle>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Start Date">
                  <Input
                    type="date"
                    variant="atlvs"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </FormField>
                <FormField label="End Date">
                  <Input
                    type="date"
                    variant="atlvs"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </FormField>
              </div>
            </CardHeader>
          </Card>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
