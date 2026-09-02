'use client';

import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { BookingStatus } from '@/types';

interface StatusDistributionChartProps {
  data: { status: BookingStatus; count: number }[];
}

const STATUS_COLORS: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: '#f59e0b',
  [BookingStatus.ASSIGNED]: '#3b82f6',
  [BookingStatus.MECHANIC_ON_THE_WAY]: '#a855f7',
  [BookingStatus.COMPLETED]: '#10b981',
  [BookingStatus.CANCELLED]: '#f43f5e',
};

const STATUS_LABELS: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: 'Pending',
  [BookingStatus.ASSIGNED]: 'Assigned',
  [BookingStatus.MECHANIC_ON_THE_WAY]: 'On The Way',
  [BookingStatus.COMPLETED]: 'Completed',
  [BookingStatus.CANCELLED]: 'Cancelled',
};

export default function StatusDistributionChart({ data }: StatusDistributionChartProps) {
  const chartData = data.map((item) => ({
    name: STATUS_LABELS[item.status] || item.status,
    value: item.count,
    color: STATUS_COLORS[item.status] || '#64748b',
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 h-64 w-full">
      <div className="w-full sm:w-1/2 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              formatter={(val: any) => [
                `${val || 0} bookings (${Math.round((Number(val || 0) / (total || 1)) * 100)}%)`,
                'Count',
              ]}
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#f8fafc',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="w-full sm:w-1/2 space-y-2.5">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-medium text-slate-300">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100">{item.value}</span>
              <span className="text-slate-500 text-[10px] w-8 text-right">
                {total ? `${Math.round((item.value / total) * 100)}%` : '0%'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
