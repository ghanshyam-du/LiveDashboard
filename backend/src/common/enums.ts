/**
 * Canonical enums used throughout the backend.
 * Centralising here prevents magic strings and makes
 * status transition logic easy to find.
 */

export enum BookingStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  MECHANIC_ON_THE_WAY = 'MECHANIC_ON_THE_WAY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum MechanicStatus {
  AVAILABLE = 'AVAILABLE',
  ASSIGNED = 'ASSIGNED',
  ON_THE_WAY = 'ON_THE_WAY',
  BUSY = 'BUSY',
  OFFLINE = 'OFFLINE',
}

export enum FuelType {
  PETROL = 'PETROL',
  DIESEL = 'DIESEL',
  ELECTRIC = 'ELECTRIC',
  CNG = 'CNG',
  HYBRID = 'HYBRID',
}

export enum NotificationType {
  BOOKING_CREATED = 'BOOKING_CREATED',
  BOOKING_ASSIGNED = 'BOOKING_ASSIGNED',
  BOOKING_STATUS_UPDATED = 'BOOKING_STATUS_UPDATED',
  BOOKING_COMPLETED = 'BOOKING_COMPLETED',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  MECHANIC_STATUS_UPDATED = 'MECHANIC_STATUS_UPDATED',
}

/**
 * Defines which status transitions are valid.
 * Source of truth for booking state machine.
 * Any transition not listed here is forbidden.
 */
export const VALID_BOOKING_STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  [BookingStatus.PENDING]: [BookingStatus.ASSIGNED, BookingStatus.CANCELLED],
  [BookingStatus.ASSIGNED]: [BookingStatus.MECHANIC_ON_THE_WAY, BookingStatus.CANCELLED],
  [BookingStatus.MECHANIC_ON_THE_WAY]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
  [BookingStatus.COMPLETED]: [], // terminal state
  [BookingStatus.CANCELLED]: [], // terminal state
};
