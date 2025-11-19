'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { useAssets } from '@/lib/hooks/atlvs/useAssets';
import { Loader2 } from 'lucide-react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

interface Booking {
  id: string;
  assetName: string;
  bookedBy: string;
  startDate: string;
  endDate: string;
  status: 'confirmed' | 'pending';
}

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/assets/calendar

export default function AssetCalendarPage() {
  const { data: _assetsData, isLoading } = useAssets();
  const bookings: Booking[] = [];

  if (isLoading) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-atlvs-green-500" />
        </div>
      </AtlvsLayout>
    );
  }

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <AtlvsLayout>
      <ContentLayout
        title="ASSET AVAILABILITY CALENDAR"
        description="View asset bookings and availability"
        breadcrumbs={[
          { label: 'Assets', href: '/atlvs/assets' },
          { label: 'Calendar' }
        ]}
      >
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-grey-200 p-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" className="p-2">
                <ChevronLeft className="w-5 h-5 text-grey-600" />
              </Button>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-grey-600" />
                <span className="font-semibold text-grey-900">November 2025</span>
              </div>
              <Button variant="ghost" size="sm" className="p-2">
                <ChevronRight className="w-5 h-5 text-grey-600" />
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-grey-200 overflow-hidden">
            <div className="grid grid-cols-7 border-b border-grey-200">
              {weekDays.map(day => (
                <div key={day} className="px-4 py-3 text-center text-body-sm text-grey-900 bg-grey-50">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {Array.from({ length: 35 }, (_, i) => (
                <div key={i} className="border-r border-b border-grey-200 min-h-[120px] p-2">
                  <div className="text-body-sm text-grey-600 mb-2">{i + 1}</div>
                  {(bookings || [])
                    .filter(b => new Date(b.startDate).getDate() === i + 1)
                    .map(booking => (
                      <div
                        key={booking.id}
                        className={`text-caption p-2 rounded mb-1 ${ booking.status === 'confirmed' ? 'bg-success-light text-success-foreground' : 'bg-warning-light text-warning-foreground' }`}
                      >
                        <div className="font-medium truncate">{booking.assetName}</div>
                        <div className="truncate">{booking.bookedBy}</div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 text-body-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-success-light rounded"></div>
              <span className="text-grey-600">Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-warning-light rounded"></div>
              <span className="text-grey-600">Pending</span>
            </div>
          </div>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
