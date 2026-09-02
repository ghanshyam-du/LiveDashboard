'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mechanic, MechanicStatus, Booking } from '@/types';
import { MechanicStatusBadge, BookingStatusBadge } from '@/components/ui/StatusBadge';
import { Star, CheckCircle, Phone, Mail, Wrench } from 'lucide-react';
import { api } from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/formatters';

interface MechanicDetailModalProps {
  mechanic: Mechanic | null;
  recentBookings?: Booking[];
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated?: () => void;
}

export default function MechanicDetailModal({
  mechanic,
  recentBookings = [],
  isOpen,
  onClose,
  onStatusUpdated,
}: MechanicDetailModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<MechanicStatus | ''>('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!mechanic) return null;

  const handleUpdateStatus = async () => {
    if (!selectedStatus) return;
    setIsUpdating(true);

    try {
      await api.updateMechanicStatus(mechanic._id, {
        status: selectedStatus as MechanicStatus,
      });
      setSelectedStatus('');
      if (onStatusUpdated) onStatusUpdated();
      onClose();
    } catch {
      // handled
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#0B0F17] border-slate-800 text-slate-200 max-w-xl">
        <DialogHeader className="border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-lg text-blue-400">
              {mechanic.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-100 flex items-center gap-3">
                <span>{mechanic.name}</span>
                <MechanicStatusBadge status={mechanic.currentStatus} />
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400 mt-1">
                {mechanic.yearsOfExperience} years experience • {mechanic.totalJobsCompleted} jobs completed
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="text-slate-300 truncate">{mechanic.email}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="text-slate-300 truncate">{mechanic.phone}</span>
            </div>
          </div>

          {/* Quick Status Update Form */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Wrench className="w-3.5 h-3.5 text-blue-400" />
              Override Mechanic Status
            </h4>
            <div className="flex items-center gap-3">
              <Select
                value={(selectedStatus as string) || ''}
                onValueChange={(val) => setSelectedStatus(val as MechanicStatus)}
              >
                <SelectTrigger className="flex-1 bg-slate-950 border-slate-800 text-slate-200 text-xs h-9">
                  <SelectValue placeholder="Select new status..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                  {Object.values(MechanicStatus).map((st) => (
                    <SelectItem key={st} value={st}>
                      {st.replace(/_/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleUpdateStatus}
                disabled={!selectedStatus || isUpdating}
                size="sm"
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-9"
              >
                {isUpdating ? 'Saving...' : 'Update'}
              </Button>
            </div>
          </div>

          {/* Recent Assigned Jobs */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Recent Assigned Jobs ({recentBookings.length})
            </h4>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {recentBookings.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No recent assigned jobs.</p>
              ) : (
                recentBookings.map((bk) => (
                  <div
                    key={bk._id}
                    className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono font-bold text-blue-400 block">{bk.bookingNumber}</span>
                      <span className="text-slate-400 text-[11px]">
                        {(bk.service as any)?.name ?? 'Service'} • {formatCurrency(bk.amount)}
                      </span>
                    </div>
                    <BookingStatusBadge status={bk.status} />
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
