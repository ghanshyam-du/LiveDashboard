'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/layout/PageHeader';
import BookingTable from '@/components/bookings/BookingTable';
import BookingFilters from '@/components/bookings/BookingFilters';
import BookingDetailDrawer from '@/components/bookings/BookingDetailDrawer';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/StateViews';
import { api } from '@/lib/api';
import { Booking } from '@/types';

export default function BookingsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('scheduledAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['bookings', page, search, status, sortBy, sortOrder],
    queryFn: () =>
      api.getBookings({
        page,
        limit: 20,
        search: search || undefined,
        status: status !== 'ALL' ? status : undefined,
        sortBy,
        sortOrder,
      }),
  });

  const handleReset = () => {
    setPage(1);
    setSearch('');
    setStatus('ALL');
    setSortBy('scheduledAt');
    setSortOrder('desc');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Bookings Management"
        description="Comprehensive view and operational control of all vehicle service bookings with real-time status updates."
      />

      {/* Filter Toolbar */}
      <BookingFilters
        search={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        sortBy={sortBy}
        onSortByChange={(val) => setSortBy(val)}
        sortOrder={sortOrder}
        onSortOrderToggle={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
        onReset={handleReset}
      />

      {/* Main Bookings Table */}
      {isLoading ? (
        <TableSkeleton rows={10} />
      ) : isError || !data ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <BookingTable
          bookings={data.data}
          pagination={data.pagination}
          onPageChange={(p) => setPage(p)}
          onSelectBooking={(b) => setSelectedBooking(b)}
        />
      )}

      {/* Detail Drawer */}
      <BookingDetailDrawer
        booking={selectedBooking}
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        onStatusUpdated={refetch}
      />
    </div>
  );
}
