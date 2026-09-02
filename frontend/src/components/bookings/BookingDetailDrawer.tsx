'use client';

import React, { useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Booking, BookingStatus } from '@/types';
import { BookingStatusBadge } from '@/components/ui/StatusBadge';
import StatusTimeline from './StatusTimeline';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { User, Car, Wrench, Calendar, FileText, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api';

interface BookingDetailDrawerProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated?: () => void;
}

const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  [BookingStatus.PENDING]: [BookingStatus.ASSIGNED, BookingStatus.CANCELLED],
  [BookingStatus.ASSIGNED]: [BookingStatus.MECHANIC_ON_THE_WAY, BookingStatus.CANCELLED],
  [BookingStatus.MECHANIC_ON_THE_WAY]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
  [BookingStatus.COMPLETED]: [],
  [BookingStatus.CANCELLED]: [],
};

export default function BookingDetailDrawer({
  booking,
  isOpen,
  onClose,
  onStatusUpdated,
}: BookingDetailDrawerProps) {
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | ''>('');
  const [notes, setNotes] = useState('');
  const [cancellationReason, setCancellationReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!booking) return null;

  const allowedNextStatuses = ALLOWED_TRANSITIONS[booking.status] || [];
  const isTerminal = allowedNextStatuses.length === 0;

  const customerName = (booking.customer as any)?.name ?? 'N/A';
  const customerEmail = (booking.customer as any)?.email ?? 'N/A';
  const customerPhone = (booking.customer as any)?.phone ?? 'N/A';

  const vehicleMake = (booking.vehicle as any)?.make ?? '';
  const vehicleModel = (booking.vehicle as any)?.model ?? '';
  const vehicleReg = (booking.vehicle as any)?.registrationNumber ?? 'N/A';

  const serviceName = (booking.service as any)?.name ?? 'Vehicle Service';
  const serviceCategory = (booking.service as any)?.category ?? 'Maintenance';

  const mechanicName = (booking.mechanic as any)?.name ?? 'Unassigned';

  const handleUpdateStatus = async () => {
    if (!selectedStatus) return;
    setIsUpdating(true);
    setErrorMsg('');

    try {
      await api.updateBookingStatus(booking._id, {
        status: selectedStatus as BookingStatus,
        notes: notes.trim() || undefined,
        cancellationReason:
          selectedStatus === BookingStatus.CANCELLED ? cancellationReason.trim() : undefined,
      });

      setSelectedStatus('');
      setNotes('');
      setCancellationReason('');
      if (onStatusUpdated) onStatusUpdated();
      onClose();
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message || 'Failed to update booking status. Please try again.',
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="bg-[#0B0F17] border-slate-800 text-slate-200 max-w-2xl mx-auto max-h-[90vh] flex flex-col">
        <DrawerHeader className="border-b border-slate-800/80 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-lg font-bold text-slate-100 flex items-center gap-3">
                <span>{booking.bookingNumber}</span>
                <BookingStatusBadge status={booking.status} />
              </DrawerTitle>
              <DrawerDescription className="text-xs text-slate-400 mt-1">
                Scheduled for {formatDate(booking.scheduledAt)}
              </DrawerDescription>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Total Amount</span>
              <span className="text-lg font-bold text-emerald-400">
                {formatCurrency(booking.amount)}
              </span>
            </div>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status Timeline */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Status Progression
            </h4>
            <StatusTimeline
              currentStatus={booking.status}
              statusHistory={booking.statusHistory}
            />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Details */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-1">
                <User className="w-4 h-4" />
                <span>Customer Information</span>
              </div>
              <p className="text-sm font-bold text-slate-200">{customerName}</p>
              <p className="text-xs text-slate-400">{customerEmail}</p>
              <p className="text-xs text-slate-400">{customerPhone}</p>
            </div>

            {/* Vehicle Details */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-1">
                <Car className="w-4 h-4" />
                <span>Vehicle Information</span>
              </div>
              <p className="text-sm font-bold text-slate-200">
                {vehicleMake} {vehicleModel}
              </p>
              <p className="text-xs text-slate-400 font-mono">Reg: {vehicleReg}</p>
            </div>

            {/* Service Info */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
                <Calendar className="w-4 h-4" />
                <span>Service Info</span>
              </div>
              <p className="text-sm font-bold text-slate-200">{serviceName}</p>
              <span className="inline-block text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {serviceCategory}
              </span>
            </div>

            {/* Assigned Mechanic */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
                <Wrench className="w-4 h-4" />
                <span>Assigned Mechanic</span>
              </div>
              <p className="text-sm font-bold text-slate-200">{mechanicName}</p>
              <span className="text-xs text-slate-400 block">
                {booking.mechanic ? 'Assigned' : 'Awaiting Assignment'}
              </span>
            </div>
          </div>

          {/* Booking Notes */}
          {booking.notes && (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                <FileText className="w-4 h-4" />
                <span>Notes & Instructions</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{booking.notes}</p>
            </div>
          )}

          {/* Update Status Action Form */}
          {!isTerminal ? (
            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-4">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Wrench className="w-4 h-4 text-blue-400" />
                Update Operational Status
              </h4>

              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                    Next Valid Status Transition
                  </label>
                  <Select
                    value={(selectedStatus as string) || ''}
                    onValueChange={(val) => setSelectedStatus(val as BookingStatus)}
                  >
                    <SelectTrigger className="bg-slate-950 border-slate-800 text-slate-200">
                      <SelectValue placeholder="Select new status..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                      {allowedNextStatuses.map((st) => (
                        <SelectItem key={st} value={st}>
                          {st.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedStatus === BookingStatus.CANCELLED && (
                  <div>
                    <label className="text-xs font-semibold text-rose-400 block mb-1.5">
                      Cancellation Reason *
                    </label>
                    <Textarea
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                      placeholder="Specify reason for cancellation..."
                      className="bg-slate-950 border-slate-800 text-slate-200 text-xs"
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                    Operation Notes (Optional)
                  </label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add operational notes or update details..."
                    className="bg-slate-950 border-slate-800 text-slate-200 text-xs"
                  />
                </div>

                <Button
                  onClick={handleUpdateStatus}
                  disabled={!selectedStatus || isUpdating}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  {isUpdating ? 'Updating Status...' : 'Apply Status Transition'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-500">
              This booking is in a terminal status ({booking.status}) and cannot be transitioned further.
            </div>
          )}
        </div>

        <DrawerFooter className="border-t border-slate-800/80">
          <Button variant="outline" onClick={onClose} className="border-slate-800 bg-slate-900 text-slate-300">
            Close Drawer
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
