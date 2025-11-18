'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState } from 'react';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Card } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { OpportunityBadge } from '@/components/atoms/OpportunityBadge';
import { usePublicOpportunities } from '@/lib/hooks/shared/useOpportunities';
import { Loader2, Search, Briefcase, MapPin, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function OpportunitiesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [locationType, setLocationType] = useState('');

  const { data, isLoading, error } = usePublicOpportunities({
    search,
    category,
    locationType,
    page: 1,
    limit: 20,
  });

  const breadcrumbs = [
    { label: 'COMPVSS', href: '/compvss/dashboard' },
    { label: 'Opportunities', href: '/compvss/opportunities' },
  ];

  return (
    <CompvssLayout>
      <ContentLayout
        title="Browse Opportunities"
        description="Explore job openings, gigs, and collaboration opportunities"
        breadcrumbs={breadcrumbs}
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
              
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
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

              <Select
                value={locationType}
                onChange={(e) => setLocationType(e.target.value)}
              >
                <option value="">All Locations</option>
                <option value="onsite">On-site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
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
              <p className="text-error mb-4">Failed to load opportunities</p>
              <Button onClick={() => window.location.reload()} variant="compvss">
                Retry
              </Button>
            </div>
          </Card>
        )}

        {/* Opportunities Grid */}
        {data && (
          <>
            <div className="mb-4 text-body-sm text-gray-600">
              {data.pagination.total} opportunities found
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.opportunities.map((opportunity: Record<string, unknown>) => (
                <Link
                  key={opportunity.id as string}
                  href={`/compvss/opportunities/${opportunity.id}`}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <OpportunityBadge category={opportunity.category as string} />
                        {opportunity.compensationType && (
                          <span className="text-caption text-gray-500 capitalize">
                            {opportunity.compensationType as string}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bebas text-h5 mb-2 text-gray-900">
                        {opportunity.title as string}
                      </h3>

                      <p className="text-body-sm text-gray-600 mb-4 line-clamp-2">
                        {opportunity.description as string}
                      </p>

                      <div className="space-y-2 text-body-sm text-gray-500">
                        {opportunity.organization && (
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            <span>{(opportunity.organization as any).name}</span>
                          </div>
                        )}

                        {opportunity.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{opportunity.location as string}</span>
                          </div>
                        )}

                        {(opportunity.compensationMin || opportunity.compensationMax) && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span>
                              {opportunity.compensationMin && `$${opportunity.compensationMin as number}`}
                              {opportunity.compensationMin && opportunity.compensationMax && ' - '}
                              {opportunity.compensationMax && `$${opportunity.compensationMax as number}`}
                              {opportunity.compensationCurrency && ` ${opportunity.compensationCurrency as string}`}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <Button variant="compvss" size="sm" className="w-full">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Empty State */}
            {data.opportunities.length === 0 && (
              <Card>
                <div className="p-12 text-center">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-bebas text-h5 text-gray-900 mb-2">
                    No Opportunities Found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your filters to see more results
                  </p>
                </div>
              </Card>
            )}
          </>
        )}
      </ContentLayout>
    </CompvssLayout>
  );
}
