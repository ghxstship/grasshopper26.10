'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { useState } from 'react';
import { FileText, Download, Calendar, Filter, TrendingUp, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Select } from '@/components/atoms/Select';
import { FormField } from '@/components/molecules/FormField';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { useReports, type Report } from '@/lib/hooks/atlvs/useReports';

export default function BudgetReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [selectedType, setSelectedType] = useState('all');
  const { data = [], isLoading, error, refetch } = useReports({ type: 'budget' });
  const reports: Report[] = Array.isArray(data) ? data : [];
  const alerts: any[] = [];

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="BUDGET REPORTS"
          description="Loading reports..."
          variant="atlvs"
          breadcrumbs={[
            { label: 'Budgets', href: '/atlvs/budgets' },
            { label: 'Reports' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
              <p className="text-gray-400">Loading budget reports...</p>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  if (error) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="BUDGET REPORTS"
          description="Error loading reports"
          variant="atlvs"
          breadcrumbs={[
            { label: 'Budgets', href: '/atlvs/budgets' },
            { label: 'Reports' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <h2 className="text-xl font-bebas mb-2">Failed to Load Reports</h2>
              <p className="text-gray-400 mb-4">{error.message}</p>
              <Button variant="atlvs" onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  // Filter reports by type
  const _filteredReports = reports.filter((report: any) => {
    const matchesType = selectedType === 'all' || report.type === selectedType;
    return matchesType;
  });

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string }> = {
      ready: { bg: 'bg-success-light', text: 'text-success-foreground' },
      generating: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      scheduled: { bg: 'bg-info-light', text: 'text-blue-800' }
    };
    return badges[status] || badges.ready;
  };

  const getAlertColor = (severity: string) => {
    const colors: Record<string, string> = {
      critical: 'border-red-500 bg-red-50',
      high: 'border-orange-500 bg-orange-50',
      low: 'border-blue-500 bg-blue-50'
    };
    return colors[severity] || colors.low;
  };

  const getAlertIcon = (severity: string) => {
    if (severity === 'critical' || severity === 'high') {
      return <AlertCircle className="w-5 h-5 text-error" />;
    }
    return <CheckCircle className="w-5 h-5 text-info" />;
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="BUDGET REPORTS & ALERTS"
        description="Generate reports and manage budget alerts"
        breadcrumbs={[
          { label: 'Budgets', href: '/atlvs/budgets' },
          { label: 'Reports' }
        ]}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-success" />
            <div>
              <div className="text-sm text-gray-600">Total Reports</div>
              <div className="text-2xl font-bold text-gray-900">{reports.length}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-info" />
            <div>
              <div className="text-sm text-gray-600">Ready</div>
              <div className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'ready').length}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-atlvs-orange-500" />
            <div>
              <div className="text-sm text-gray-600">Active Alerts</div>
              <div className="text-2xl font-bold text-gray-900">{alerts.length}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-atlvs-purple-500" />
            <div>
              <div className="text-sm text-gray-600">Scheduled</div>
              <div className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'scheduled').length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Alerts */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Budget Alerts</h2>
          <Button variant="ghost" size="sm" className="text-success hover:text-green-700">
            Configure Alerts
          </Button>
        </div>
        <div className="space-y-3">
          {alerts.map(alert => (
            <div key={alert.id} className={`p-4 border-l-4 rounded-lg ${getAlertColor(alert.severity)}`}>
              <div className="flex items-start gap-3">
                {getAlertIcon(alert.severity)}
                <div className="flex-1">
                  <div className="font-medium text-gray-900 mb-1">{alert.message}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="px-2 py-0.5 bg-white rounded text-xs font-medium">
                      {alert.category}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{alert.severity} priority</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Dismiss
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Generation */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Generate New Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <FormField label="Report Type">
            <Select variant="atlvs">
              <option>Budget Summary</option>
              <option>Expense Breakdown</option>
              <option>Variance Analysis</option>
              <option>Financial Overview</option>
              <option>Department Budget</option>
              <option>Custom Report</option>
            </Select>
          </FormField>
          <FormField label="Period">
            <Select variant="atlvs">
              <option>Current Month</option>
              <option>Last Month</option>
              <option>Current Quarter</option>
              <option>Last Quarter</option>
              <option>Year to Date</option>
              <option>Custom Range</option>
            </Select>
          </FormField>
          <FormField label="Format">
            <Select variant="atlvs">
              <option>PDF</option>
              <option>Excel (XLSX)</option>
              <option>CSV</option>
              <option>JSON</option>
            </Select>
          </FormField>
        </div>
        <Button variant="atlvs" className="w-full">
          <FileText className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          <Select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            variant="atlvs"
          >
            <option value="all">All Periods</option>
            <option value="current-month">Current Month</option>
            <option value="last-month">Last Month</option>
            <option value="current-quarter">Current Quarter</option>
          </Select>
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            variant="atlvs"
          >
            <option value="all">All Types</option>
            <option value="summary">Summary</option>
            <option value="expense">Expense</option>
            <option value="variance">Variance</option>
            <option value="financial">Financial</option>
          </Select>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated
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
              {reports.map(report => {
                const statusStyle = getStatusBadge(report.status);
                return (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="font-medium text-gray-900">{report.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded capitalize">
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {report.period}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{report.generated || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 ${statusStyle.bg} ${statusStyle.text} text-xs rounded capitalize`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {report.status === 'ready' && (
                        <Button variant="ghost" size="sm" className="text-success">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      )}
                      {report.status === 'scheduled' && (
                        <Button variant="ghost" size="sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          Edit Schedule
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alert Configuration */}
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Alert Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Budget Thresholds</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-sm text-gray-700">Warning at</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    defaultValue="80"
                    className="w-16 text-sm text-center"
                    variant="atlvs"
                  />
                  <span className="text-sm text-gray-600">%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-sm text-gray-700">Critical at</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    defaultValue="95"
                    className="w-16 text-sm text-center"
                    variant="atlvs"
                  />
                  <span className="text-sm text-gray-600">%</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Notification Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox defaultChecked variant="atlvs" />
                <span className="text-sm text-gray-700">Email notifications</span>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox defaultChecked variant="atlvs" />
                <span className="text-sm text-gray-700">In-app notifications</span>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox variant="atlvs" />
                <span className="text-sm text-gray-700">SMS notifications</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button variant="atlvs">
            Save Alert Settings
          </Button>
        </div>
      </div>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
