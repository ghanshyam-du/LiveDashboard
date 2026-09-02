'use client';

import React from 'react';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Wrench,
  UserPlus,
  TrendingUp,
} from 'lucide-react';
import { DashboardSummary } from '@/types';
import { formatCurrency } from '@/lib/formatters';

interface DashboardKpiCardsProps {
  summary: DashboardSummary;
}

export default function DashboardKpiCards({ summary }: DashboardKpiCardsProps) {
  const kpis = [
    {
      title: "Today's Bookings",
      value: summary.todaysBookings,
      subtitle: `${summary.totalBookings} total all-time`,
      icon: CalendarCheck,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(summary.totalRevenue),
      subtitle: 'From completed services',
      icon: IndianRupee,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Active Mechanics',
      value: summary.activeMechanics,
      subtitle: 'On duty right now',
      icon: Wrench,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'Pending Bookings',
      value: summary.pendingBookings,
      subtitle: 'Awaiting assignment',
      icon: Clock,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Completed Jobs',
      value: summary.completedBookings,
      subtitle: 'Successfully delivered',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Cancelled Jobs',
      value: summary.cancelledBookings,
      subtitle: 'Terminal status',
      icon: XCircle,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/20',
    },
    {
      title: 'New Customers Today',
      value: summary.newCustomersToday,
      subtitle: 'Registered today',
      icon: UserPlus,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Completion Rate',
      value: summary.totalBookings
        ? `${Math.round((summary.completedBookings / summary.totalBookings) * 100)}%`
        : '0%',
      subtitle: 'Efficiency metric',
      icon: TrendingUp,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <div
            key={index}
            className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all shadow-sm group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                {kpi.title}
              </span>
              <div
                className={`w-9 h-9 rounded-lg border flex items-center justify-center ${kpi.bgColor}`}
              >
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-slate-100 mb-1">
              {kpi.value}
            </div>
            <p className="text-[11px] text-slate-500 font-medium">{kpi.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}
