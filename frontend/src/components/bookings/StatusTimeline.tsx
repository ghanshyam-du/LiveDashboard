import React from 'react';
import { BookingStatus, StatusHistoryEntry } from '@/types';
import { Check, Clock, Truck, CheckCircle2, XCircle } from 'lucide-react';
import { formatDate } from '@/lib/formatters';

interface StatusTimelineProps {
  currentStatus: BookingStatus;
  statusHistory?: StatusHistoryEntry[];
}

const STEPS = [
  { status: BookingStatus.PENDING, label: 'Pending', icon: Clock },
  { status: BookingStatus.ASSIGNED, label: 'Assigned', icon: Check },
  { status: BookingStatus.MECHANIC_ON_THE_WAY, label: 'On The Way', icon: Truck },
  { status: BookingStatus.COMPLETED, label: 'Completed', icon: CheckCircle2 },
];

export default function StatusTimeline({ currentStatus, statusHistory = [] }: StatusTimelineProps) {
  if (currentStatus === BookingStatus.CANCELLED) {
    return (
      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-3">
        <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
        <div>
          <span className="font-bold text-sm block">Booking Cancelled</span>
          <span className="text-xs text-rose-300/80">
            This booking was cancelled and has reached a terminal status.
          </span>
        </div>
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex((s) => s.status === currentStatus);

  const getHistoryTime = (status: BookingStatus) => {
    const entry = statusHistory.find((h) => h.status === status);
    return entry ? formatDate(entry.changedAt) : null;
  };

  return (
    <div className="py-3">
      <div className="relative flex items-center justify-between">
        {/* Connecting Line */}
        <div className="absolute left-4 right-4 top-4 -translate-y-1/2 h-0.5 bg-slate-800 -z-0" />
        <div
          className="absolute left-4 top-4 -translate-y-1/2 h-0.5 bg-blue-600 transition-all duration-500 -z-0"
          style={{
            width: `${Math.max(0, (currentStepIndex / (STEPS.length - 1)) * 100)}%`,
          }}
        />

        {STEPS.map((step, index) => {
          const isPassed = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const Icon = step.icon;
          const time = getHistoryTime(step.status);

          return (
            <div key={step.status} className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCurrent
                    ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/30 scale-110'
                    : isPassed
                    ? 'bg-slate-900 border-blue-500 text-blue-400'
                    : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-[11px] font-semibold mt-2 ${
                  isCurrent ? 'text-blue-400' : isPassed ? 'text-slate-200' : 'text-slate-500'
                }`}
              >
                {step.label}
              </span>
              {time && <span className="text-[9px] text-slate-500 mt-0.5">{time}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
