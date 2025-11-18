'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { BarChart3, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { useProjects } from '@/lib/hooks/atlvs/useProjects';

interface ProjectMetrics {
  projectName: string;
  status: string;
  completion: number;
  budget: number;
  spent: number;
  daysRemaining: number;
}

export default function ProjectAnalyticsPage() {
  const { data: projectsData } = useProjects();
  
  const projects: ProjectMetrics[] = projectsData || [
    { projectName: 'Summer Festival 2025', status: 'active', completion: 75, budget: 500000, spent: 350000, daysRemaining: 45 },
    { projectName: 'Corporate Event Series', status: 'active', completion: 45, budget: 150000, spent: 60000, daysRemaining: 60 },
    { projectName: 'Concert Tour Q1', status: 'planning', completion: 20, budget: 800000, spent: 120000, daysRemaining: 90 }
  ];

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
  const avgCompletion = projects.reduce((sum, p) => sum + p.completion, 0) / projects.length;

  return (
    <AtlvsLayout>
      <ContentLayout
        title="PROJECT ANALYTICS"
        description="Detailed metrics and performance analysis"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Analytics', href: '/atlvs/analytics' },
          { label: 'Projects' }
        ]}
      >
        {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Active Projects</div>
              <div className="text-2xl font-bold text-gray-900">{projects.length}</div>
            </div>
            <BarChart3 className="w-8 h-8 text-info" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Avg Completion</div>
              <div className="text-2xl font-bold text-success">{avgCompletion.toFixed(0)}%</div>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Budget</div>
              <div className="text-2xl font-bold text-atlvs-purple-500">${(totalBudget / 1000).toFixed(0)}K</div>
            </div>
            <DollarSign className="w-8 h-8 text-atlvs-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Budget Used</div>
              <div className="text-2xl font-bold text-atlvs-orange-500">
                {((totalSpent / totalBudget) * 100).toFixed(0)}%
              </div>
            </div>
            <Clock className="w-8 h-8 text-atlvs-orange-500" />
          </div>
        </div>
      </div>

      {/* Project Details Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Project Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Project</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Status</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Completion</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Budget</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Spent</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Days Left</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.map((project, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{project.projectName}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-1 bg-success-light text-success-foreground text-xs rounded-full">
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-success h-2 rounded-full"
                          style={{ width: `${project.completion}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{project.completion}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    ${project.budget.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    ${project.spent.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">
                    {project.daysRemaining} days
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ContentLayout>
  </AtlvsLayout>
  );
}
