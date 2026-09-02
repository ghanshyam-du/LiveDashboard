'use client';

import React, { useState, useEffect } from 'react';
import { Radio, Activity, ArrowRight, ShieldCheck, Wrench, AlertCircle } from 'lucide-react';
import { getSocket } from '@/lib/socket';
import { LiveActivityItem, BookingStatus, MechanicStatus } from '@/types';
import { format } from 'date-fns';

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState<LiveActivityItem[]>([
    {
      id: 'init-1',
      timestamp: new Date(),
      type: 'notification',
      title: 'Ops Dashboard Active',
      description: 'Connected to real-time WebSocket event pipeline.',
      badgeText: 'SYSTEM',
      badgeVariant: 'outline',
    },
  ]);

  useEffect(() => {
    const socket = getSocket();

    const handleBookingStatusUpdated = (payload: {
      bookingNumber: string;
      newStatus: BookingStatus;
      mechanicName?: string;
    }) => {
      const newActivity: LiveActivityItem = {
        id: `act-${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
        type: 'status_change',
        title: `Booking ${payload.bookingNumber} → ${payload.newStatus}`,
        description: payload.mechanicName
          ? `Assigned mechanic: ${payload.mechanicName}`
          : `Status transition to ${payload.newStatus}`,
        badgeText: payload.newStatus,
        badgeVariant: payload.newStatus === BookingStatus.COMPLETED ? 'default' : 'secondary',
      };
      setActivities((prev) => [newActivity, ...prev.slice(0, 19)]);
    };

    const handleMechanicStatusUpdated = (payload: {
      mechanicName: string;
      newStatus: MechanicStatus;
    }) => {
      const newActivity: LiveActivityItem = {
        id: `act-${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
        type: 'mechanic_status',
        title: `Mechanic Status Updated`,
        description: `${payload.mechanicName} is now ${payload.newStatus}`,
        badgeText: payload.newStatus,
        badgeVariant: 'outline',
      };
      setActivities((prev) => [newActivity, ...prev.slice(0, 19)]);
    };

    socket.on('booking:status_updated', handleBookingStatusUpdated);
    socket.on('mechanic:status_updated', handleMechanicStatusUpdated);

    return () => {
      socket.off('booking:status_updated', handleBookingStatusUpdated);
      socket.off('mechanic:status_updated', handleMechanicStatusUpdated);
    };
  }, []);

  return (
    <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-slate-100">Live Operational Feed</h3>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase">
            LIVE
          </span>
        </div>
      </div>

      {/* Log Feed List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[380px]">
        {activities.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs flex items-start gap-3 hover:border-slate-700/80 transition-colors animate-in fade-in duration-300"
          >
            <div className="mt-0.5 p-1.5 rounded-md bg-slate-800 text-blue-400">
              {item.type === 'status_change' && <ArrowRight className="w-3.5 h-3.5" />}
              {item.type === 'mechanic_status' && <Wrench className="w-3.5 h-3.5" />}
              {item.type === 'notification' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="font-semibold text-slate-200 truncate">{item.title}</span>
                <span className="text-[10px] text-slate-500 shrink-0">
                  {format(item.timestamp, 'hh:mm:ss a')}
                </span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed truncate">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
