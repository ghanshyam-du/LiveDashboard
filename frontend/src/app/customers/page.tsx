'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/layout/PageHeader';
import CustomerTable from '@/components/customers/CustomerTable';
import CustomerDetailModal from '@/components/customers/CustomerDetailModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TableSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/StateViews';
import { api } from '@/lib/api';
import { Customer, Booking } from '@/types';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['customers', page, search],
    queryFn: () =>
      api.getCustomers({
        page,
        limit: 20,
        search: search || undefined,
      }),
  });

  const handleSelectCustomer = async (customer: Customer) => {
    setSelectedCustomer(customer);
    try {
      const res = await api.getCustomerById(customer._id);
      setRecentBookings(res.recentBookings);
    } catch {
      setRecentBookings([]);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Customers Directory"
        description="View customer profiles, total bookings placed, total spend across services, and recent service requests."
      />

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search customer by name, email, or phone number..."
            className="pl-9 bg-slate-950 border-slate-800 text-slate-200 text-xs placeholder:text-slate-500 h-9"
          />
        </div>
      </div>

      {/* Main Customers Table */}
      {isLoading ? (
        <TableSkeleton rows={10} />
      ) : isError || !data ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <div className="space-y-4">
          <CustomerTable
            customers={data.data}
            onSelectCustomer={handleSelectCustomer}
          />

          {/* Server-side Pagination */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400">
            <div>
              Showing page <span className="font-bold text-slate-200">{data.pagination.page}</span> of{' '}
              <span className="font-bold text-slate-200">{data.pagination.totalPages}</span> ({data.pagination.total} total customers)
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={data.pagination.page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="border-slate-800 bg-slate-950 text-slate-300 h-8 text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={data.pagination.page >= data.pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="border-slate-800 bg-slate-950 text-slate-300 h-8 text-xs"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      <CustomerDetailModal
        customer={selectedCustomer}
        recentBookings={recentBookings}
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
  );
}
