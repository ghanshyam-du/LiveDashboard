'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Customer, Booking } from '@/types';
import { BookingStatusBadge } from '@/components/ui/StatusBadge';
import { Mail, Phone, MapPin, Calendar, IndianRupee } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/formatters';

interface CustomerDetailModalProps {
  customer: Customer | null;
  recentBookings?: Booking[];
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomerDetailModal({
  customer,
  recentBookings = [],
  isOpen,
  onClose,
}: CustomerDetailModalProps) {
  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#0B0F17] border-slate-800 text-slate-200 max-w-xl">
        <DialogHeader className="border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center font-bold text-lg text-emerald-400">
              {customer.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-100">
                {customer.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400 mt-1">
                Customer Profile & Order History
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Total Bookings</span>
                <span className="text-lg font-bold text-slate-100">{customer.totalBookings ?? 0}</span>
              </div>
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Total Spent</span>
                <span className="text-lg font-bold text-emerald-400">
                  {formatCurrency(customer.totalAmountSpent ?? 0)}
                </span>
              </div>
              <IndianRupee className="w-5 h-5 text-emerald-400" />
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="text-slate-300">{customer.email}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <Phone className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="text-slate-300 font-mono">{customer.phone}</span>
            </div>
            {customer.address && (
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="text-slate-300">{customer.address}</span>
              </div>
            )}
          </div>

          {/* Booking History */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Booking History ({recentBookings.length})
            </h4>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {recentBookings.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No recent bookings found.</p>
              ) : (
                recentBookings.map((bk) => (
                  <div
                    key={bk._id}
                    className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono font-bold text-blue-400 block">{bk.bookingNumber}</span>
                      <span className="text-slate-400 text-[11px]">
                        {(bk.service as any)?.name ?? 'Service'} • {formatDate(bk.scheduledAt)}
                      </span>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <span className="font-bold text-slate-200">{formatCurrency(bk.amount)}</span>
                      <BookingStatusBadge status={bk.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
