'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { FormField } from '@/components/molecules/FormField';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { Button } from '@/components/atoms/Button';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, Mail, Users, Plus, Play, Pause, Edit, Trash2,  } from 'lucide-react';
import { useReports } from '@/lib/hooks/atlvs/useReports';

interface ScheduledReport {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
  status: 'active' | 'paused';
  lastRun: string;
  nextRun: string;
}

export default function ScheduledReportsPage() {  
  const queryClient = useQueryClient();
  const { data: reportsData,  } = useReports({ type: 'scheduled' });
  const [showAddModal, setShowAddModal] = useState(false);

  const scheduleReportMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/atlvs/analytics/scheduled-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to schedule report');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-reports'] });
      setShowAddModal(false);
    },
  });

  const scheduledReports: ScheduledReport[] = reportsData as any || [
    {
      id: '1',
      name: 'Daily Budget Summary',
      frequency: 'daily',
      time: '09:00',
      recipients: ['manager@atlvs.com', 'finance@atlvs.com'],
      format: 'pdf',
      status: 'active',
      lastRun: '2025-11-14 09:00',
      nextRun: '2025-11-15 09:00'
    },
    {
      id: '2',
      name: 'Weekly Team Performance',
      frequency: 'weekly',
      time: '10:00',
      recipients: ['hr@atlvs.com'],
      format: 'excel',
      status: 'active',
      lastRun: '2025-11-11 10:00',
      nextRun: '2025-11-18 10:00'
    },
    {
      id: '3',
      name: 'Monthly Financial Report',
      frequency: 'monthly',
      time: '08:00',
      recipients: ['cfo@atlvs.com', 'board@atlvs.com'],
      format: 'pdf',
      status: 'paused',
      lastRun: '2025-10-01 08:00',
      nextRun: 'Paused'
    }
  ];

  const getFrequencyBadge = (frequency: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      daily: { bg: 'bg-info-light', text: 'text-blue-800' },
      weekly: { bg: 'bg-purple-100', text: 'text-purple-800' },
      monthly: { bg: 'bg-success-light', text: 'text-success-foreground' }
    };
    return badges[frequency] || badges.daily;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      active: { bg: 'bg-success-light', text: 'text-success-foreground' },
      paused: { bg: 'bg-gray-100', text: 'text-gray-800' }
    };
    return badges[status] || badges.active;
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="Scheduled Reports"
        description="Automate report generation and delivery"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Analytics', href: '/atlvs/analytics' },
          { label: 'Scheduled Reports', href: '/atlvs/analytics/scheduled-reports' }
        ]}
        primaryAction={{
          label: 'Schedule Report',
          onClick: () => setShowAddModal(true),
          icon: <Plus className="w-4 h-4" />
        }}
        showToolbar={true}
      >

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-success" />
            <div>
              <div className="text-sm text-gray-600">Total Scheduled</div>
              <div className="text-2xl font-bold text-gray-900">{scheduledReports.length}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Play className="w-8 h-8 text-success" />
            <div>
              <div className="text-sm text-gray-600">Active</div>
              <div className="text-2xl font-bold text-gray-900">
                {scheduledReports.filter(r => r.status === 'active').length}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Pause className="w-8 h-8 text-gray-600" />
            <div>
              <div className="text-sm text-gray-600">Paused</div>
              <div className="text-2xl font-bold text-gray-900">
                {scheduledReports.filter(r => r.status === 'paused').length}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Mail className="w-8 h-8 text-info" />
            <div>
              <div className="text-sm text-gray-600">Recipients</div>
              <div className="text-2xl font-bold text-gray-900">
                {new Set(scheduledReports.flatMap(r => r.recipients)).size}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frequency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Next Run
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {scheduledReports.map(report => {
                const frequencyStyle = getFrequencyBadge(report.frequency);
                const statusStyle = getStatusBadge(report.status);
                
                return (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{report.name}</div>
                      <div className="text-sm text-gray-500">{report.format.toUpperCase()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 ${frequencyStyle.bg} ${frequencyStyle.text} text-xs rounded capitalize`}>
                        {report.frequency}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {report.time}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        {report.recipients.length} recipients
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{report.nextRun}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 ${statusStyle.bg} ${statusStyle.text} text-xs rounded capitalize`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {report.status === 'active' ? (
                          <Button variant="ghost" size="sm">
                            <Pause className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-success hover:bg-green-50">
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-error hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule New Report</h3>
            <div className="space-y-4">
              <FormField label="Report Name">
                <Input
                  type="text"
                  placeholder="e.g., Weekly Budget Summary"
                  variant="atlvs"
                />
              </FormField>
              <FormField label="Frequency">
                <Select variant="atlvs">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </Select>
              </FormField>
              <FormField label="Time">
                <Input
                  type="time"
                  variant="atlvs"
                />
              </FormField>
              <FormField label="Recipients (comma-separated emails)">
                <Textarea
                  rows={3}
                  placeholder="email1@example.com, email2@example.com"
                  variant="atlvs"
                />
              </FormField>
              <FormField label="Format">
                <Select variant="atlvs">
                  <option>PDF</option>
                  <option>Excel (XLSX)</option>
                  <option>CSV</option>
                </Select>
              </FormField>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => setShowAddModal(false)}
                  variant="atlvs-outline"
                  size="lg"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    scheduleReportMutation.mutate({});
                  }}
                  variant="atlvs"
                  size="lg"
                  className="flex-1"
                >
                  Schedule Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      </ContentLayout>
    </AtlvsLayout>
  );
}
