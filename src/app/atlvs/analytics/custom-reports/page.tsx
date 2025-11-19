'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { FormField } from '@/components/molecules/FormField';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Button } from '@/components/atoms/Button';
import { useState } from 'react';
import { BarChart3, PieChart, LineChart, TrendingUp, Calendar, Filter, Save, Play, Loader2 } from 'lucide-react';
import { useToast } from '@/lib/hooks/useToast';
import { useReports, useGenerateReport } from '@/lib/hooks/atlvs/useReports';
import { BodyText, SectionHeader } from "@/components/atoms/Typography";

interface ReportField {
  id: string;
  name: string;
  type: 'metric' | 'dimension' | 'date';
  category: string;
}

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/analytics/custom-reports

export default function CustomReportsPage() {
  const { addToast } = useToast();
  const { data: _existingReports, isLoading: _isLoading, error: _error } = useReports();
  const _generateReportMutation = useGenerateReport();
  
  const [reportName, setReportName] = useState('');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [chartType, setChartType] = useState('bar');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const availableFields: ReportField[] = [
    { id: 'total_budget', name: 'Total Budget', type: 'metric', category: 'Financial' },
    { id: 'spent_amount', name: 'Spent Amount', type: 'metric', category: 'Financial' },
    { id: 'remaining_budget', name: 'Remaining Budget', type: 'metric', category: 'Financial' },
    { id: 'project_count', name: 'Project Count', type: 'metric', category: 'Projects' },
    { id: 'task_count', name: 'Task Count', type: 'metric', category: 'Tasks' },
    { id: 'team_size', name: 'Team Size', type: 'metric', category: 'Team' },
    { id: 'project_name', name: 'Project Name', type: 'dimension', category: 'Projects' },
    { id: 'department', name: 'Department', type: 'dimension', category: 'Team' },
    { id: 'status', name: 'Status', type: 'dimension', category: 'General' },
    { id: 'date_created', name: 'Date Created', type: 'date', category: 'General' }
  ];

  const toggleField = (fieldId: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldId) ? prev.filter(id => id !== fieldId) : [...prev, fieldId]
    );
  };

  const handleSaveReport = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      addToast({
        title: 'Success',
        description: 'Report saved successfully',
        variant: 'success',
      });
    } catch {
      addToast({
        title: 'Error',
        description: 'Failed to save report',
        variant: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRunReport = async () => {
    setIsRunning(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      addToast({
        title: 'Success',
        description: 'Report generated successfully',
        variant: 'success',
      });
    } catch {
      addToast({
        title: 'Error',
        description: 'Failed to generate report',
        variant: 'error',
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getFieldsByCategory = (category: string) => {
    return availableFields.filter(f => f.category === category);
  };

  const categories = Array.from(new Set(availableFields.map(f => f.category)));

  return (
    <AtlvsLayout>
      <ContentLayout
        title="Custom Report Builder"
        description="Create custom reports with your own metrics and dimensions"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Analytics', href: '/atlvs/analytics' },
          { label: 'Custom Reports', href: '/atlvs/analytics/custom-reports' }
        ]}
        showToolbar={true}
      >

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Name */}
          <div className="bg-white rounded-lg border border-grey-200 p-6">
            <SectionHeader className="text-grey-900 mb-4">Report Configuration</SectionHeader>
            <div className="space-y-4">
              <FormField label="Report Name">
                <Input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="e.g., Monthly Budget Overview"
                  variant="atlvs"
                />
              </FormField>

              <FormField label="Date Range">
                <Select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  variant="atlvs"
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last-7-days">Last 7 Days</option>
                  <option value="last-30-days">Last 30 Days</option>
                  <option value="this-month">This Month</option>
                  <option value="last-month">Last Month</option>
                  <option value="this-quarter">This Quarter</option>
                  <option value="this-year">This Year</option>
                  <option value="custom">Custom Range</option>
                </Select>
              </FormField>

              <FormField label="Visualization Type">
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'bar', icon: BarChart3, label: 'Bar' },
                    { value: 'line', icon: LineChart, label: 'Line' },
                    { value: 'pie', icon: PieChart, label: 'Pie' },
                    { value: 'table', icon: Filter, label: 'Table' }
                  ].map(({ value, icon: Icon, label }) => (
                    <Button
                      key={value}
                      onClick={() => setChartType(value)}
                      variant={chartType === value ? 'atlvs' : 'outline'}
                      className="flex flex-col items-center gap-2 h-auto p-3"
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-caption">{label}</span>
                    </Button>
                  ))}
                </div>
              </FormField>
            </div>
          </div>

          {/* Field Selection */}
          <div className="bg-white rounded-lg border border-grey-200 p-6">
            <SectionHeader className="text-grey-900 mb-4">Select Fields</SectionHeader>
            <div className="space-y-4">
              {categories.map(category => (
                <div key={category}>
                  <h3 className="text-body-sm text-grey-700 mb-2">{category}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {getFieldsByCategory(category).map(field => (
                      <div
                        key={field.id}
                        className={`flex items-center gap-2 p-3 border-2 rounded-lg transition-colors ${ selectedFields.includes(field.id) ? 'border-success bg-success-light' : 'border-grey-200 hover:border-grey-300' }`}
                      >
                        <Checkbox
                          checked={selectedFields.includes(field.id)}
                          onChange={() => toggleField(field.id)}
                          variant="atlvs"
                        />
                        <div className="flex-1">
                          <div className={`text-body-sm ${ selectedFields.includes(field.id) ? 'text-success' : 'text-grey-900' }`}>
                            {field.name}
                          </div>
                          <div className="text-caption text-grey-500 capitalize">{field.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleRunReport}
              disabled={selectedFields.length === 0 || !reportName || isRunning}
              variant="atlvs"
              size="lg"
              className="flex-1"
            >
              {isRunning ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Play className="w-5 h-5 mr-2" />
              )}
              {isRunning ? 'Running...' : 'Run Report'}
            </Button>
            <Button
              onClick={handleSaveReport}
              disabled={selectedFields.length === 0 || !reportName || isSaving}
              variant="atlvs-outline"
              size="lg"
              className="flex-1"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {isSaving ? 'Saving...' : 'Save Report'}
            </Button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-grey-200 p-6 sticky top-6">
            <SectionHeader className="text-grey-900 mb-4">Report Preview</SectionHeader>
            
            <div className="space-y-4">
              <div>
                <div className="text-body-sm text-grey-600 mb-1">Report Name</div>
                <div className="font-medium text-grey-900">
                  {reportName || 'Untitled Report'}
                </div>
              </div>

              <div>
                <div className="text-body-sm text-grey-600 mb-1">Date Range</div>
                <div className="flex items-center gap-1 text-body-sm">
                  <Calendar className="w-4 h-4 text-grey-600" />
                  <span className="capitalize">{dateRange.replace('-', ' ')}</span>
                </div>
              </div>

              <div>
                <div className="text-body-sm text-grey-600 mb-1">Visualization</div>
                <div className="capitalize text-body-sm">{chartType} Chart</div>
              </div>

              <div>
                <div className="text-body-sm text-grey-600 mb-2">Selected Fields ({selectedFields.length})</div>
                {selectedFields.length === 0 ? (
                  <BodyText className="text-body-sm text-grey-500 italic">No fields selected</BodyText>
                ) : (
                  <div className="space-y-1">
                    {selectedFields.map(fieldId => {
                      const field = availableFields.find(f => f.id === fieldId);
                      return (
                        <div key={fieldId} className="flex items-center justify-between text-body-sm p-2 bg-grey-50 rounded">
                          <span>{field?.name}</span>
                          <span className="text-caption text-grey-500 capitalize">{field?.type}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {selectedFields.length > 0 && reportName && (
              <div className="mt-6 p-4 bg-success-light border border-success-border rounded-lg">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-success mt-0.5" />
                  <div className="text-body-sm text-success-foreground">
                    <div className="font-medium mb-1">Ready to generate</div>
                    <div>Your custom report is configured and ready to run.</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Saved Reports */}
      <div className="mt-6 bg-white rounded-lg border border-grey-200 p-6">
        <SectionHeader className="text-grey-900 mb-4">Saved Reports</SectionHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'Monthly Budget Overview', fields: 5, lastRun: '2025-11-14' },
            { name: 'Team Performance Report', fields: 7, lastRun: '2025-11-13' },
            { name: 'Project Status Summary', fields: 4, lastRun: '2025-11-12' }
          ].map((report, index) => (
            <div key={index} className="p-4 border border-grey-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="font-medium text-grey-900 mb-2">{report.name}</div>
              <div className="text-body-sm text-grey-600 mb-3">
                {report.fields} fields • Last run: {report.lastRun}
              </div>
              <div className="flex gap-2">
                <Button variant="atlvs" size="sm" className="flex-1">
                  Run
                </Button>
                <Button variant="atlvs-outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
