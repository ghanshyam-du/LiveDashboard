'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageHeader from '@/components/layout/PageHeader';
import MechanicCard from '@/components/mechanics/MechanicCard';
import MechanicDetailModal from '@/components/mechanics/MechanicDetailModal';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { KpiSkeletonGrid } from '@/components/ui/LoadingSkeleton';
import { ErrorState, EmptyState } from '@/components/ui/StateViews';
import { api } from '@/lib/api';
import { Mechanic, MechanicStatus, Booking } from '@/types';
import { Search, Filter, Wrench } from 'lucide-react';

export default function MechanicsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['mechanics', search, status],
    queryFn: () =>
      api.getMechanics({
        page: 1,
        limit: 50,
        search: search || undefined,
        status: status !== 'ALL' ? status : undefined,
      }),
  });

  const handleSelectMechanic = async (mechanic: Mechanic) => {
    setSelectedMechanic(mechanic);
    try {
      const res = await api.getMechanicById(mechanic._id);
      setRecentBookings(res.recentBookings);
    } catch {
      setRecentBookings([]);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Mechanics Operations"
        description="Monitor field technician availability, skill sets, total jobs completed, ratings, and active assignments."
      />

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search mechanic by name, email, or skill..."
            className="pl-9 bg-slate-950 border-slate-800 text-slate-200 text-xs placeholder:text-slate-500 h-9"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          <Select value={status} onValueChange={(val) => setStatus(val || 'ALL')}>
            <SelectTrigger className="w-40 bg-slate-950 border-slate-800 text-slate-200 text-xs h-9">
              <SelectValue placeholder="All Mechanics" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
              <SelectItem value="ALL">All Mechanics</SelectItem>
              {Object.values(MechanicStatus).map((st) => (
                <SelectItem key={st} value={st}>
                  {st.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(search || status !== 'ALL') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch('');
                setStatus('ALL');
              }}
              className="text-slate-400 hover:text-slate-200 h-9 text-xs"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Mechanics Card Grid */}
      {isLoading ? (
        <KpiSkeletonGrid />
      ) : isError || !data ? (
        <ErrorState onRetry={refetch} />
      ) : data.data.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No mechanics found"
          description="There are no mechanics matching the selected status or search term."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.data.map((mechanic) => (
            <MechanicCard
              key={mechanic._id}
              mechanic={mechanic}
              onSelect={handleSelectMechanic}
            />
          ))}
        </div>
      )}

      {/* Mechanic Detail Modal */}
      <MechanicDetailModal
        mechanic={selectedMechanic}
        recentBookings={recentBookings}
        isOpen={!!selectedMechanic}
        onClose={() => setSelectedMechanic(null)}
        onStatusUpdated={refetch}
      />
    </div>
  );
}
