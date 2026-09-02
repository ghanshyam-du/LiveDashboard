import axios from 'axios';
import {
  Booking,
  Customer,
  Mechanic,
  Service,
  Notification,
  PaginatedResponse,
  DashboardSummary,
  AnalyticsData,
  BookingStatus,
  MechanicStatus,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Dashboard
  getDashboardSummary: async (): Promise<DashboardSummary> => {
    const res = await apiClient.get<DashboardSummary>('/dashboard/summary');
    return res.data;
  },

  getDashboardAnalytics: async (period: '7d' | '30d' | '90d' = '30d'): Promise<AnalyticsData> => {
    const res = await apiClient.get<AnalyticsData>(`/dashboard/analytics`, {
      params: { period },
    });
    return res.data;
  },

  // Bookings
  getBookings: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: BookingStatus | string;
    mechanicId?: string;
    serviceId?: string;
    from?: string;
    to?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Booking>> => {
    const res = await apiClient.get<PaginatedResponse<Booking>>('/bookings', { params });
    return res.data;
  },

  getBookingById: async (id: string): Promise<Booking> => {
    const res = await apiClient.get<Booking>(`/bookings/${id}`);
    return res.data;
  },

  updateBookingStatus: async (
    id: string,
    payload: { status: BookingStatus; notes?: string; cancellationReason?: string },
  ): Promise<Booking> => {
    const res = await apiClient.patch<Booking>(`/bookings/${id}/status`, payload);
    return res.data;
  },

  // Mechanics
  getMechanics: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: MechanicStatus | string;
  }): Promise<PaginatedResponse<Mechanic>> => {
    const res = await apiClient.get<PaginatedResponse<Mechanic>>('/mechanics', { params });
    return res.data;
  },

  getMechanicById: async (id: string): Promise<{ mechanic: Mechanic; recentBookings: Booking[] }> => {
    const res = await apiClient.get<{ mechanic: Mechanic; recentBookings: Booking[] }>(
      `/mechanics/${id}`,
    );
    return res.data;
  },

  updateMechanicStatus: async (
    id: string,
    payload: { status: MechanicStatus; notes?: string },
  ): Promise<Mechanic> => {
    const res = await apiClient.patch<Mechanic>(`/mechanics/${id}/status`, payload);
    return res.data;
  },

  // Customers
  getCustomers: async (params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Customer>> => {
    const res = await apiClient.get<PaginatedResponse<Customer>>('/customers', { params });
    return res.data;
  },

  getCustomerById: async (
    id: string,
  ): Promise<{ customer: Customer; recentBookings: Booking[]; totalBookings: number; totalAmountSpent: number }> => {
    const res = await apiClient.get(`/customers/${id}`);
    return res.data;
  },

  // Services
  getServices: async (): Promise<Service[]> => {
    const res = await apiClient.get<Service[]>('/services');
    return res.data;
  },

  // Notifications
  getNotifications: async (limit = 20, isRead?: boolean): Promise<{ data: Notification[] }> => {
    const res = await apiClient.get<{ data: Notification[] }>('/notifications', {
      params: { limit, isRead },
    });
    return res.data;
  },

  markNotificationRead: async (id: string): Promise<Notification> => {
    const res = await apiClient.patch<Notification>(`/notifications/${id}/read`);
    return res.data;
  },

  markAllNotificationsRead: async (): Promise<void> => {
    await apiClient.patch('/notifications/read-all');
  },
};
