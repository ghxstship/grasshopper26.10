'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, ChevronLeft, ChevronRight, Plus, Users, Clock, Download, Upload, Filter, X, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { FormField } from '@/components/molecules/FormField';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader } from '@/components/atoms/Card';
import { useTeams } from '@/lib/hooks/atlvs/useTeams';
import { BodyText, HeroTitle, SectionHeader, SubsectionHeader } from "@/components/atoms/Typography";

export default function TeamSchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [_selectedCell, setSelectedCell] = useState<{day: string, shift: string} | null>(null);
  
  const { data, isLoading, error, refetch } = useTeams({ include: 'schedule' });
  const scheduleEntries = data?.schedule || [];
  const queryClient = useQueryClient();

  const exportScheduleMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/atlvs/teams/schedule/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to export schedule');
      return response.blob();
    },
  });

  const addShiftMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/atlvs/teams/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to add shift');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      setShowAddModal(false);
    },
  });

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="TEAM SCHEDULE"
          description="Loading schedule..."
          variant="atlvs"
          breadcrumbs={[
            { label: 'Teams', href: '/atlvs/teams' },
            { label: 'Schedule' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
              <BodyText className="text-grey-400">Loading team schedule...</BodyText>
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
          title="TEAM SCHEDULE"
          description="Error loading schedule"
          variant="atlvs"
          breadcrumbs={[
            { label: 'Teams', href: '/atlvs/teams' },
            { label: 'Schedule' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <SectionHeader className="mb-2">Failed to Load Schedule</SectionHeader>
              <p className="text-grey-400 mb-4">{error.message}</p>
              <Button variant="atlvs" onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  const mockScheduleEntries = [
    { id: '1', memberId: 'm1', memberName: 'Sarah Johnson', date: '2025-11-14', shift: 'morning', role: 'Production Manager', status: 'confirmed' },
    { id: '2', memberId: 'm2', memberName: 'Mike Chen', date: '2025-11-14', shift: 'afternoon', role: 'Technical Director', status: 'confirmed' },
    { id: '3', memberId: 'm1', memberName: 'Sarah Johnson', date: '2025-11-15', shift: 'morning', role: 'Production Manager', status: 'confirmed' },
    { id: '4', memberId: 'm3', memberName: 'Emily Davis', date: '2025-11-14', shift: 'evening', role: 'Coordinator', status: 'pending' },
    { id: '5', memberId: 'm4', memberName: 'James Wilson', date: '2025-11-16', shift: 'morning', role: 'Specialist', status: 'requested' }
  ];

  const _displayScheduleEntries = scheduleEntries.length > 0 ? scheduleEntries : mockScheduleEntries;

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const shifts = ['morning', 'afternoon', 'evening', 'night'];
  const departments = ['all', 'Production', 'Technical', 'Logistics', 'Creative'];

  const getShiftColor = (shift: string) => {
    const colors: Record<string, string> = {
      morning: 'bg-warning/20 text-warning border-warning/30',
      afternoon: 'bg-info/20 text-info border-info/30',
      evening: 'bg-atlvs-purple-500/20 text-atlvs-purple-500 border-atlvs-purple-500/30',
      night: 'bg-grey-700 text-grey-300 border-grey-600'
    };
    return colors[shift] || colors.morning;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      confirmed: 'bg-atlvs-green-500/20 text-atlvs-green-500',
      pending: 'bg-warning/20 text-warning',
      requested: 'bg-info/20 text-info'
    };
    return badges[status] || badges.confirmed;
  };

  const handleAddShift = (day: string, shift: string) => {
    setSelectedCell({ day, shift });
    setShowAddModal(true);
  };

  const handleExportSchedule = () => {
    exportScheduleMutation.mutate();
  };

  const handleImportSchedule = () => {
    // File upload would trigger import
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx';
    input.click();
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const getEntriesForCell = (day: string, shift: string) => {
    return scheduleEntries.filter(e => e.shift === shift);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <HeroTitle className="text-white mb-2">Team Schedule</HeroTitle>
          <BodyText className="text-grey-400">Manage team shifts and availability</BodyText>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleImportSchedule}
            variant="ghost"
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button
            onClick={handleExportSchedule}
            variant="ghost"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            variant="atlvs"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Shift
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card variant="atlvs" className="bg-grey-900/50">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Week Navigator */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigateWeek('prev')}
                variant="ghost"
                size="sm"
                className="p-2 text-grey-400"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2 px-4">
                <Calendar className="w-5 h-5 text-grey-400" />
                <span className="font-semibold text-white">Week of Nov 11-17, 2025</span>
              </div>
            <Button
              onClick={() => navigateWeek('next')}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <Button
              onClick={() => setViewMode('week')}
              variant={viewMode === 'week' ? 'atlvs' : 'ghost'}
              className="px-4 py-2"
            >
              Week
            </Button>
            <Button
              onClick={() => setViewMode('month')}
              variant={viewMode === 'month' ? 'atlvs' : 'ghost'}
              className="px-4 py-2"
            >
              Month
            </Button>
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-grey-400" />
            <Select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              variant="atlvs"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept === 'all' ? 'All Departments' : dept}
                </option>
              ))}
            </Select>
          </div>
        </div>
        </CardHeader>
      </Card>

      {/* Schedule Grid */}
      <div className="bg-white rounded-lg border border-grey-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-grey-50 border-b border-grey-200">
              <tr>
                <th className="px-4 py-3 text-left text-body-sm text-grey-900 w-32">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Shift
                  </div>
                </th>
                {weekDays.map(day => (
                  <th key={day} className="px-4 py-3 text-center text-body-sm text-grey-900">
                    {day}
                    <div className="text-caption text-grey-500">Nov {11 + weekDays.indexOf(day)}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-grey-200">
              {shifts.map(shift => (
                <tr key={shift}>
                  <td className="px-4 py-3 text-body-sm text-grey-900 capitalize bg-grey-50">
                    <div>
                      {shift}
                      <div className="text-caption text-grey-500">
                        {shift === 'morning' && '6am-12pm'}
                        {shift === 'afternoon' && '12pm-6pm'}
                        {shift === 'evening' && '6pm-12am'}
                        {shift === 'night' && '12am-6am'}
                      </div>
                    </div>
                  </td>
                  {weekDays.map(day => (
                    <td key={`${shift}-${day}`} className="px-2 py-2 align-top">
                      <div
                        onClick={() => handleAddShift(day, shift)}
                        className="min-h-[100px] p-2 hover:bg-grey-50 rounded cursor-pointer border border-transparent hover:border-success transition-colors"
                      >
                        {getEntriesForCell(day, shift).map(entry => (
                          <div
                            key={entry.id}
                            className={`text-caption p-2 rounded mb-1 border ${getShiftColor(shift)}`}
                          >
                            <div className="font-medium mb-1">{entry.memberName}</div>
                            <div className="text-caption opacity-75 mb-1">{entry.role}</div>
                            <span className={`px-1.5 py-0.5 rounded text-caption ${getStatusBadge(entry.status)}`}>
                              {entry.status}
                            </span>
                          </div>
                        ))}
                        {getEntriesForCell(day, shift).length === 0 && (
                          <div className="flex items-center justify-center h-full text-grey-400">
                            <Plus className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-grey-200 p-4">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-success" />
            <div>
              <div className="text-body-sm text-grey-600">Total Shifts</div>
              <div className="text-grey-900">{scheduleEntries.length}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-grey-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-success-light flex items-center justify-center">
              <span className="text-success">✓</span>
            </div>
            <div>
              <div className="text-body-sm text-grey-600">Confirmed</div>
              <div className="text-grey-900">
                {scheduleEntries.filter(e => e.status === 'confirmed').length}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-grey-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-warning-light flex items-center justify-center">
              <span className="text-warning">⏱</span>
            </div>
            <div>
              <div className="text-body-sm text-grey-600">Pending</div>
              <div className="text-grey-900">
                {scheduleEntries.filter(e => e.status === 'pending').length}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-grey-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-info-light flex items-center justify-center">
              <span className="text-info">?</span>
            </div>
            <div>
              <div className="text-body-sm text-grey-600">Requested</div>
              <div className="text-grey-900">
                {scheduleEntries.filter(e => e.status === 'requested').length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Shift Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <SubsectionHeader className="text-grey-900">Add Shift</SubsectionHeader>
              <Button
                onClick={() => setShowAddModal(false)}
                variant="ghost"
                size="sm"
                className="p-1"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <FormField label="Team Member">
                <Select variant="atlvs">
                  <option>Select member...</option>
                  <option>Sarah Johnson</option>
                  <option>Mike Chen</option>
                  <option>Emily Davis</option>
                </Select>
              </FormField>
              <FormField label="Date">
                <Input
                  type="date"
                  variant="atlvs"
                />
              </FormField>
              <FormField label="Shift">
                <Select variant="atlvs">
                  <option>Morning (6am-12pm)</option>
                  <option>Afternoon (12pm-6pm)</option>
                  <option>Evening (6pm-12am)</option>
                  <option>Night (12am-6am)</option>
                </Select>
              </FormField>
              <FormField label="Role">
                <Input
                  type="text"
                  placeholder="e.g., Production Manager"
                  variant="atlvs"
                />
              </FormField>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => setShowAddModal(false)}
                  variant="ghost"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    addShiftMutation.mutate({});
                  }}
                  variant="atlvs"
                  className="flex-1"
                >
                  Add Shift
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
