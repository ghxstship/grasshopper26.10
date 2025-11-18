'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState } from 'react';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Badge } from '@/components/atoms/Badge';
import { useOpportunities } from '@/lib/hooks/atlvs/useOpportunities';
import { Loader2, Search, Plus, Eye, Users } from 'lucide-react';
import Link from 'next/link';

export default function OpportunitiesManagementPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading, error } = useOpportunities({
    search,
    category: (category as any) || undefined,
    status: (status as any) || undefined,
  });

  const breadcrumbs = [
    { label: 'ATLVS', href: '/atlvs/dashboard' },
    { label: 'Opportunities', href: '/atlvs/opportunities' },
  ];

  const statusColors: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
    PUBLISHED: 'success',
    DRAFT: 'warning',
    PAUSED: 'info',
    CLOSED: 'default',
    FILLED: 'success',
    CANCELLED: 'error',
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="Manage Opportunities"
        description="Create and manage job postings and opportunities"
        breadcrumbs={breadcrumbs}
        variant="atlvs"
      >
        {/* Filters */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search opportunities..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by opportunity category">
                <option value="">All Categories</option>
                <option value="RFP_JOB">RFP/Jobs</option>
                <option value="CAREER_FULL_TIME">Full Time</option>
                <option value="CAREER_PART_TIME">Part Time</option>
                <option value="CAREER_SEASONAL">Seasonal</option>
                <option value="CAREER_INTERN">Internship</option>
                <option value="AUDITION_CASTING">Auditions</option>
                <option value="CONTRACTOR">Contractor</option>
                <option value="BRAND_AMBASSADOR">Brand Ambassador</option>
                <option value="STREET_TEAM">Street Team</option>
                <option value="INFLUENCER">Influencer</option>
                <option value="AFFILIATE">Affiliate</option>
              </Select>

              <Select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by opportunity status">
                <option value="">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="PAUSED">Paused</option>
                <option value="CLOSED">Closed</option>
                <option value="FILLED">Filled</option>
              </Select>
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-atlvs-green-500" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-error">
            <div className="p-6 text-center">
              <p className="text-error mb-4">Failed to load opportunities</p>
              <Button onClick={() => window.location.reload()} variant="atlvs">
                Retry
              </Button>
            </div>
          </Card>
        )}

        {/* Opportunities Table */}
        {data && (
          <>
            <div className="mb-4 text-sm text-gray-600">
              {data.pagination?.total || 0} opportunities found
            </div>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full" role="table" aria-label="Opportunities list">
                  <thead className="bg-gray-50 border-b border-gray-200" role="rowgroup">
                    <tr role="row">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applications
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Views
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200" role="rowgroup">
                    {data.opportunities?.map((opportunity: any) => (
                      <tr key={opportunity.id} className="hover:bg-gray-50" role="row">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {opportunity.title}
                          </div>
                          {opportunity.location && (
                            <div className="text-sm text-gray-500">
                              {opportunity.location}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 capitalize">
                          {opportunity.category?.replace(/_/g, ' ').toLowerCase()}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={statusColors[opportunity.status] || 'default'}>
                            {opportunity.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" aria-hidden="true" />
                            <span className="text-sm text-gray-900" aria-label={`${opportunity.applicationCount || 0} applications`}>
                              {opportunity.applicationCount || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {opportunity.viewCount || 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/atlvs/opportunities/${opportunity.id}`}>
                            <Button variant="atlvs" size="sm">
                              Manage
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Empty State */}
            {(!data.opportunities || data.opportunities.length === 0) && (
              <Card>
                <div className="p-12 text-center">
                  <h3 className="font-bebas text-xl text-gray-900 mb-2">
                    No Opportunities Found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Create your first opportunity to get started
                  </p>
                  <Link href="/atlvs/opportunities/new">
                    <Button variant="atlvs">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Opportunity
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </>
        )}
      </ContentLayout>
    </AtlvsLayout>
  );
}
