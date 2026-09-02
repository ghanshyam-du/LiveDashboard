'use client';

import React from 'react';
import { Search, X, Filter, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookingStatus } from '@/types';

interface BookingFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderToggle: () => void;
  onReset: () => void;
}

export default function BookingFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderToggle,
  onReset,
}: BookingFiltersProps) {
  const hasActiveFilters = search || status !== 'ALL' || sortBy !== 'scheduledAt' || sortOrder !== 'desc';

  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by Booking ID, Customer, Vehicle Reg, or Mechanic..."
          className="pl-9 bg-slate-950 border-slate-800 text-slate-200 text-xs placeholder:text-slate-500 h-9"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Select Filters & Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          <Select value={status} onValueChange={(val) => onStatusChange(val || 'ALL')}>
            <SelectTrigger className="w-36 bg-slate-950 border-slate-800 text-slate-200 text-xs h-9">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value={BookingStatus.PENDING}>Pending</SelectItem>
              <SelectItem value={BookingStatus.ASSIGNED}>Assigned</SelectItem>
              <SelectItem value={BookingStatus.MECHANIC_ON_THE_WAY}>On The Way</SelectItem>
              <SelectItem value={BookingStatus.COMPLETED}>Completed</SelectItem>
              <SelectItem value={BookingStatus.CANCELLED}>Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort By Select */}
        <Select value={sortBy} onValueChange={(val) => onSortByChange(val || 'scheduledAt')}>
          <SelectTrigger className="w-36 bg-slate-950 border-slate-800 text-slate-200 text-xs h-9">
            <SelectValue placeholder="Sort field" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
            <SelectItem value="scheduledAt">Scheduled Date</SelectItem>
            <SelectItem value="createdAt">Created Date</SelectItem>
            <SelectItem value="amount">Amount</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Direction Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={onSortOrderToggle}
          title={`Order: ${sortOrder.toUpperCase()}`}
          className="border-slate-800 bg-slate-950 text-slate-300 h-9 px-3 text-xs"
        >
          <ArrowUpDown className="w-3.5 h-3.5 mr-1" />
          {sortOrder.toUpperCase()}
        </Button>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-slate-400 hover:text-slate-200 h-9 text-xs"
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
