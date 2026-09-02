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

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  totalBookings?: number;
  totalAmountSpent?: number;
  lastBookingDate?: string;
}

export interface Vehicle {
  _id: string;
  customer: string;
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
  color?: string;
  fuelType: FuelType;
  createdAt: string;
}

export interface Mechanic {
  _id: string;
  name: string;
  email: string;
  phone: string;
  specializations: string[];
  currentStatus: MechanicStatus;
  totalJobsCompleted: number;
  rating: number;
  yearsOfExperience: number;
  isActive: boolean;
  createdAt: string;
}

export interface Service {
  _id: string;
  name: string;
  category: string;
  description?: string;
  basePrice: number;
  estimatedDurationMinutes: number;
  isActive: boolean;
}

export interface StatusHistoryEntry {
  status: BookingStatus;
  changedAt: string;
  notes?: string;
}

export interface Booking {
  _id: string;
  bookingNumber: string;
  customer: Customer | { _id: string; name: string; email: string; phone: string };
  vehicle: Vehicle | { _id: string; make: string; model: string; year: number; registrationNumber: string };
  service: Service | { _id: string; name: string; category: string };
  mechanic?: Mechanic | { _id: string; name: string; currentStatus: MechanicStatus; email?: string; phone?: string; rating?: number };
  status: BookingStatus;
  amount: number;
  notes?: string;
  scheduledAt: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  referenceId?: string;
  referenceType?: string;
  isRead: boolean;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export interface DashboardSummary {
  totalBookings: number;
  todaysBookings: number;
  completedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  activeMechanics: number;
  newCustomersToday: number;
}

export interface AnalyticsData {
  period: '7d' | '30d' | '90d';
  bookingTrend: { date: string; bookings: number }[];
  revenueTrend: { date: string; revenue: number }[];
  bookingStatusDistribution: { status: BookingStatus; count: number }[];
  serviceBreakdown: { service: string; count: number; revenue: number }[];
}

export interface LiveActivityItem {
  id: string;
  timestamp: Date;
  type: 'status_change' | 'mechanic_status' | 'notification';
  title: string;
  description: string;
  badgeText?: string;
  badgeVariant?: 'default' | 'outline' | 'secondary' | 'destructive';
}
