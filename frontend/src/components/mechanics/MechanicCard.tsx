'use client';

import React from 'react';
import { Mechanic } from '@/types';
import { MechanicStatusBadge } from '@/components/ui/StatusBadge';
import { Star, CheckCircle, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MechanicCardProps {
  mechanic: Mechanic;
  onSelect: (mechanic: Mechanic) => void;
}

export default function MechanicCard({ mechanic, onSelect }: MechanicCardProps) {
  return (
    <div
      onClick={() => onSelect(mechanic)}
      className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-blue-400">
              {mechanic.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                {mechanic.name}
              </h3>
              <p className="text-[11px] text-slate-500">{mechanic.yearsOfExperience} years exp.</p>
            </div>
          </div>
          <MechanicStatusBadge status={mechanic.currentStatus} />
        </div>

        {/* Specialization Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {mechanic.specializations.map((spec, i) => (
            <span
              key={i}
              className="text-[10px] bg-slate-800/80 border border-slate-700/50 text-slate-300 px-2 py-0.5 rounded"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Metrics Footer */}
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="font-bold text-slate-200">{mechanic.rating.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>{mechanic.totalJobsCompleted} jobs</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(mechanic);
          }}
          className="text-slate-400 hover:text-blue-400 h-7 text-[11px] px-2"
        >
          <Wrench className="w-3 h-3 mr-1" />
          View
        </Button>
      </div>
    </div>
  );
}
