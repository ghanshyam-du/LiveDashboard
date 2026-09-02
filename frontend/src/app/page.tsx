'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/layout/PageHeader';
import DashboardKpiCards from '@/components/dashboard/DashboardKpiCards';
import LiveActivityFeed from '@/components/dashboard/LiveActivityFeed';
import BookingTrendChart from '@/components/charts/BookingTrendChart';
import StatusDistributionChart from '@/components/charts/StatusDistributionChart';
import BookingTable from '@/components/bookings/BookingTable';
import BookingDetailDrawer from '@/components/bookings/BookingDetailDrawer';
import { KpiSkeletonGrid, ChartSkeleton, TableSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/StateViews';
import { api } from '@/lib/api';
import { Booking } from '@/types';
import { Button } from '@/components/ui/button';
import { RefreshCw, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Fetch KPI Summary
  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    refetch: refetchSummary,
  } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => api.getDashboardSummary(),
    refetchInterval: 30000,
  });

  // Fetch 30-day Analytics
  const {
    data: analytics,
    isLoading: isAnalyticsLoading,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ['dashboard-analytics', '30d'],
    queryFn: () => api.getDashboardAnalytics('30d'),
    refetchInterval: 60000,
  });

  // Fetch Recent 5 Bookings for quick ops preview
  const {
    data: recentBookingsData,
    isLoading: isBookingsLoading,
    refetch: refetchBookings,
  } = useQuery({
    queryKey: ['recent-bookings'],
    queryFn: () => api.getBookings({ page: 1, limit: 5 }),
    refetchInterval: 15000,
  });

  const handleRefreshAll = () => {
    refetchSummary();
    refetchAnalytics();
    refetchBookings();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title="Live Operations Dashboard"
        description="Real-time monitoring of vehicle service bookings, mechanics, revenue, and active field operations."
      >
        <Button
          onClick={handleRefreshAll}
          variant="outline"
          size="sm"
          className="border-slate-800 bg-slate-900 text-slate-300 hover:text-white text-xs h-9"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-2" />
          Refresh Pipeline
        </Button>
      </PageHeader>

      {/* KPI Cards Section */}
      {isSummaryLoading ? (
        <KpiSkeletonGrid />
      ) : isSummaryError || !summary ? (
        <ErrorState onRetry={refetchSummary} />
      ) : (
        <DashboardKpiCards summary={summary} />
      )}

      {/* Grid: Booking Volume Chart + Live Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Volume Trend */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-800/60">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Booking Volume Trend</h3>
              <p className="text-[11px] text-slate-400">Total service requests over past 30 days</p>
            </div>
            <Link
              href="/analytics"
              className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-semibold"
            >
              Detailed Analytics <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {isAnalyticsLoading || !analytics ? (
            <ChartSkeleton />
          ) : (
            <BookingTrendChart data={analytics.bookingTrend} />
          )}
        </div>

        {/* Live Activity Feed */}
        <div className="lg:col-span-1">
          <LiveActivityFeed />
        </div>
      </div>

      {/* Grid: Booking Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <div className="lg:col-span-1 p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="pb-4 mb-2 border-b border-slate-800/60">
            <h3 className="text-sm font-bold text-slate-100">Status Distribution</h3>
            <p className="text-[11px] text-slate-400">Current allocation across booking stages</p>
          </div>
          {isAnalyticsLoading || !analytics ? (
            <ChartSkeleton />
          ) : (
            <StatusDistributionChart data={analytics.bookingStatusDistribution} />
          )}
        </div>

        {/* Quick Recent Bookings Preview */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100">Recent Service Bookings</h3>
            <Link
              href="/bookings"
              className="text-xs text-blue-400 hover:underline flex items-center gap-1 font-semibold"
            >
              View All 500+ Bookings <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {isBookingsLoading || !recentBookingsData ? (
            <TableSkeleton rows={5} />
          ) : (
            <BookingTable
              bookings={recentBookingsData.data}
              pagination={recentBookingsData.pagination}
              onPageChange={() => {}}
              onSelectBooking={(b) => setSelectedBooking(b)}
            />
          )}
        </div>
      </div>

      {/* Booking Detail Drawer */}
      <BookingDetailDrawer
        booking={selectedBooking}
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onStatusUpdated={handleRefreshAll}
      />
    </div>
  );
}
