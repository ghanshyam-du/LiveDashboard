import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function KpiSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24 bg-slate-800" />
            <Skeleton className="h-8 w-8 rounded-lg bg-slate-800" />
          </div>
          <Skeleton className="h-8 w-32 bg-slate-800" />
          <Skeleton className="h-3 w-40 bg-slate-800/60" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2 border border-slate-800 rounded-xl p-4 bg-slate-900/40">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <Skeleton className="h-4 w-32 bg-slate-800" />
        <Skeleton className="h-8 w-24 bg-slate-800" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-3">
          <Skeleton className="h-4 w-20 bg-slate-800" />
          <Skeleton className="h-4 w-36 bg-slate-800" />
          <Skeleton className="h-4 w-28 bg-slate-800" />
          <Skeleton className="h-6 w-20 rounded-full bg-slate-800" />
          <Skeleton className="h-4 w-16 bg-slate-800" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40 bg-slate-800" />
        <Skeleton className="h-8 w-28 bg-slate-800" />
      </div>
      <Skeleton className="h-64 w-full bg-slate-800/50 rounded-lg" />
    </div>
  );
}
