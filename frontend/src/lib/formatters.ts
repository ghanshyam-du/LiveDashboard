import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { BookingStatus, MechanicStatus } from '@/types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string | Date | undefined): string => {
  if (!dateString) return '-';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return format(date, 'dd MMM yyyy, hh:mm a');
};

export const formatDateShort = (dateString: string | Date | undefined): string => {
  if (!dateString) return '-';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return format(date, 'dd MMM yyyy');
};

export const formatRelativeTime = (dateString: string | Date | undefined): string => {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  return formatDistanceToNow(date, { addSuffix: true });
};

export const getBookingStatusBadgeConfig = (status: BookingStatus) => {
  switch (status) {
    case BookingStatus.PENDING:
      return {
        label: 'Pending',
        className: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        dotClass: 'bg-amber-400',
      };
    case BookingStatus.ASSIGNED:
      return {
        label: 'Assigned',
        className: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
        dotClass: 'bg-blue-400',
      };
    case BookingStatus.MECHANIC_ON_THE_WAY:
      return {
        label: 'On The Way',
        className: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
        dotClass: 'bg-purple-400',
      };
    case BookingStatus.COMPLETED:
      return {
        label: 'Completed',
        className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        dotClass: 'bg-emerald-400',
      };
    case BookingStatus.CANCELLED:
      return {
        label: 'Cancelled',
        className: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
        dotClass: 'bg-rose-400',
      };
    default:
      return {
        label: status,
        className: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
        dotClass: 'bg-slate-400',
      };
  }
};

export const getMechanicStatusBadgeConfig = (status: MechanicStatus) => {
  switch (status) {
    case MechanicStatus.AVAILABLE:
      return {
        label: 'Available',
        className: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        dotClass: 'bg-emerald-400 animate-pulse',
      };
    case MechanicStatus.ASSIGNED:
      return {
        label: 'Assigned',
        className: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
        dotClass: 'bg-blue-400',
      };
    case MechanicStatus.ON_THE_WAY:
      return {
        label: 'On The Way',
        className: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
        dotClass: 'bg-purple-400',
      };
    case MechanicStatus.BUSY:
      return {
        label: 'Busy',
        className: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        dotClass: 'bg-amber-400',
      };
    case MechanicStatus.OFFLINE:
      return {
        label: 'Offline',
        className: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
        dotClass: 'bg-slate-400',
      };
    default:
      return {
        label: status,
        className: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
        dotClass: 'bg-slate-400',
      };
  }
};
