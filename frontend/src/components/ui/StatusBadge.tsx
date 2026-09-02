import React from 'react';
import { BookingStatus, MechanicStatus } from '@/types';
import {
  getBookingStatusBadgeConfig,
  getMechanicStatusBadgeConfig,
} from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface BookingStatusBadgeProps {
  status: BookingStatus;
  className?: string;
}

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const config = getBookingStatusBadgeConfig(status);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        config.className,
        className,
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dotClass)} />
      {config.label}
    </span>
  );
}

interface MechanicStatusBadgeProps {
  status: MechanicStatus;
  className?: string;
}

export function MechanicStatusBadge({ status, className }: MechanicStatusBadgeProps) {
  const config = getMechanicStatusBadgeConfig(status);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        config.className,
        className,
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dotClass)} />
      {config.label}
    </span>
  );
}
