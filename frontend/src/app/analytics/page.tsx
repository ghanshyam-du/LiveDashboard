'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/layout/PageHeader';
import BookingTrendChart from '@/components/charts/BookingTrendChart';
import RevenueTrendChart from '@/components/charts/RevenueTrendChart';
import StatusDistributionChart from '@/components/charts/StatusDistributionChart';
import ServiceBreakdownChart from '@/components/charts/ServiceBreakdownChart';
import { ChartSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/StateViews';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['analytics-full', period],
    queryFn: () => api.getDashboardAnalytics(period),
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Analytics & Operations Intelligence"
        description="Comprehensive operational breakdown of booking volumes, revenue performance, service distribution, and completion efficiency."
      >
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-lg">
          <Calendar className="w-4 h-4 text-slate-500 ml-2 mr-1" />
          {(['7d', '30d', '90d'] as const).map((p) => (
            <Button
              key={p}
              variant={period === p ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPeriod(p)}
              className={`h-7 px-3 text-xs font-semibold ${
                period === p
                  ? 'bg-blue-600 text-white hover:bg-blue-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
            </Button>
          ))}
        </div>
      </PageHeader>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      ) : isError || !data ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Volume Trend */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="pb-4 mb-3 border-b border-slate-800/60">
              <h3 className="text-sm font-bold text-slate-100">Booking Volume Trend</h3>
              <p className="text-[11px] text-slate-400">Total bookings scheduled per day ({period})</p>
            </div>
            <BookingTrendChart data={data.bookingTrend} />
          </div>

          {/* Revenue Growth Trend */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="pb-4 mb-3 border-b border-slate-800/60">
              <h3 className="text-sm font-bold text-slate-100">Revenue Growth Trend</h3>
              <p className="text-[11px] text-slate-400">Gross revenue generated from completed jobs</p>
            </div>
            <RevenueTrendChart data={data.revenueTrend} />
          </div>

          {/* Booking Status Distribution */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="pb-4 mb-3 border-b border-slate-800/60">
              <h3 className="text-sm font-bold text-slate-100">Status Breakdown</h3>
              <p className="text-[11px] text-slate-400">Percentage distribution across operational stages</p>
            </div>
            <StatusDistributionChart data={data.bookingStatusDistribution} />
          </div>

          {/* Service Category Breakdown */}
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="pb-4 mb-3 border-b border-slate-800/60">
              <h3 className="text-sm font-bold text-slate-100">Top Requested Services</h3>
              <p className="text-[11px] text-slate-400">Service volume ranking by demand</p>
            </div>
            <ServiceBreakdownChart data={data.serviceBreakdown} />
          </div>
        </div>
      )}
    </div>
  );
}
