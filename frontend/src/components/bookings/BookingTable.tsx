'use client';

import React from 'react';
import { Booking } from '@/types';
import { BookingStatusBadge } from '@/components/ui/StatusBadge';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BookingTableProps {
  bookings: Booking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (newPage: number) => void;
  onSelectBooking: (booking: Booking) => void;
}

export default function BookingTable({
  bookings,
  pagination,
  onPageChange,
  onSelectBooking,
}: BookingTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="p-12 border border-dashed border-slate-800 rounded-xl bg-slate-900/30 text-center">
        <p className="text-sm font-semibold text-slate-300">No bookings match the search criteria.</p>
        <p className="text-xs text-slate-500 mt-1">Try resetting filters or adjusting search terms.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/40">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-900/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4">Booking ID</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Vehicle</th>
              <th className="py-3.5 px-4">Service</th>
              <th className="py-3.5 px-4">Mechanic</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Scheduled</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
            {bookings.map((booking) => {
              const customerName = (booking.customer as any)?.name ?? 'N/A';
              const vehicleMake = (booking.vehicle as any)?.make ?? '';
              const vehicleModel = (booking.vehicle as any)?.model ?? '';
              const vehicleReg = (booking.vehicle as any)?.registrationNumber ?? '';
              const serviceName = (booking.service as any)?.name ?? 'Vehicle Service';
              const mechanicName = (booking.mechanic as any)?.name ?? 'Unassigned';

              return (
                <tr
                  key={booking._id}
                  onClick={() => onSelectBooking(booking)}
                  className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-400 group-hover:underline">
                    {booking.bookingNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-200 block">{customerName}</span>
                    <span className="text-[10px] text-slate-500 truncate block max-w-[140px]">
                      {(booking.customer as any)?.email ?? ''}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-200 block">
                      {vehicleMake} {vehicleModel}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      {vehicleReg}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-300">{serviceName}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-xs ${
                        booking.mechanic ? 'text-slate-200 font-medium' : 'text-slate-500 italic'
                      }`}
                    >
                      {mechanicName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <BookingStatusBadge status={booking.status} />
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-100">
                    {formatCurrency(booking.amount)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    {formatDate(booking.scheduledAt)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectBooking(booking);
                      }}
                      className="text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 h-8 px-2"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Server-driven Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400">
        <div>
          Showing{' '}
          <span className="font-bold text-slate-200">
            {(pagination.page - 1) * pagination.limit + 1}
          </span>{' '}
          to{' '}
          <span className="font-bold text-slate-200">
            {Math.min(pagination.page * pagination.limit, pagination.total)}
          </span>{' '}
          of <span className="font-bold text-slate-200">{pagination.total}</span> bookings
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
            className="border-slate-800 bg-slate-950 text-slate-300 h-8 text-xs"
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-1" />
            Previous
          </Button>
          <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded font-semibold text-slate-200">
            {pagination.page} / {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}
            className="border-slate-800 bg-slate-950 text-slate-300 h-8 text-xs"
          >
            Next
            <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
