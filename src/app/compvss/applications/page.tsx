'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState } from 'react';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { Select } from '@/components/atoms/Select';
import { ApplicationStatusBadge } from '@/components/atoms/ApplicationStatusBadge';
import { OpportunityBadge } from '@/components/atoms/OpportunityBadge';
import { useMyApplications } from '@/lib/hooks/shared/useApplications';
import { Loader2, FileText, Calendar, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function MyApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading, error } = useMyApplications({
    status: statusFilter,
    page: 1,
    limit: 20,
  });

  const breadcrumbs = [
    { label: 'COMPVSS', href: '/compvss/dashboard' },
    { label: 'My Applications', href: '/compvss/applications' },
  ];

  return (
    <CompvssLayout>
      <ContentLayout
        title="My Applications"
        description="Track your opportunity applications and their status"
        breadcrumbs={breadcrumbs}
      >
        {/* Filter */}
        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <label className="text-body-sm text-gray-700">Filter by Status:</label>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-64"
              >
                <option value="">All Statuses</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="INTERVIEW">Interview</option>
                <option value="OFFER_SENT">Offer Sent</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
                <option value="ONBOARDING">Onboarding</option>
              </Select>
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-compvss-cyan-500" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-error">
            <div className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-error mx-auto mb-4" />
              <p className="text-error mb-4">Failed to load applications</p>
              <Button onClick={() => window.location.reload()} variant="compvss">
                Retry
              </Button>
            </div>
          </Card>
        )}

        {/* Applications List */}
        {data && (
          <>
            <div className="mb-4 text-body-sm text-gray-600">
              {data.pagination?.total || data.applications?.length || 0} applications found
            </div>

            <div className="space-y-4">
              {data.applications?.map((application: any) => (
                <Link
                  key={application.id}
                  href={`/compvss/applications/${application.id}`}
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bebas text-h5 text-gray-900">
                              {application.opportunity?.title || 'Opportunity'}
                            </h3>
                            <ApplicationStatusBadge status={application.status} />
                          </div>
                          
                          {application.opportunity?.category && (
                            <OpportunityBadge category={application.opportunity.category} />
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-body-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Applied: {new Date(application.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        {application.reviewedAt && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <FileText className="h-4 w-4" />
                            <span>
                              Reviewed: {new Date(application.reviewedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        {application.opportunity?.organization && (
                          <div className="text-gray-600">
                            Organization: {application.opportunity.organization.name}
                          </div>
                        )}
                      </div>

                      {application.reviewNotes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-body-sm text-gray-700">
                            <strong>Review Notes:</strong> {application.reviewNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Empty State */}
            {(!data.applications || data.applications.length === 0) && (
              <Card>
                <div className="p-12 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-bebas text-h5 text-gray-900 mb-2">
                    No Applications Yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    You haven&apos;t applied to any opportunities yet
                  </p>
                  <Link href="/compvss/opportunities">
                    <Button variant="compvss">
                      Browse Opportunities
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </>
        )}
      </ContentLayout>
    </CompvssLayout>
  );
}
