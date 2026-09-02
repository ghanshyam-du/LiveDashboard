import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { BookingStatus, MechanicStatus } from '../common/enums';

/**
 * All real-time event names emitted to connected clients.
 * Centralised here to avoid magic strings elsewhere.
 */
export const SOCKET_EVENTS = {
  BOOKING_CREATED: 'booking:created',
  BOOKING_STATUS_UPDATED: 'booking:status_updated',
  BOOKING_ASSIGNED: 'booking:assigned',
  BOOKING_COMPLETED: 'booking:completed',
  BOOKING_CANCELLED: 'booking:cancelled',
  MECHANIC_STATUS_UPDATED: 'mechanic:status_updated',
  NOTIFICATION_NEW: 'notification:new',
  DASHBOARD_STATS_UPDATED: 'dashboard:stats_updated',
} as const;

@WebSocketGateway({
  cors: {
    origin: (requestOrigin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      const clientUrl = process.env.CLIENT_URL;
      if (!clientUrl || clientUrl === '*' || !requestOrigin) {
        return callback(null, true);
      }
      const allowed = clientUrl.split(',').map((s) => s.trim().replace(/\/$/, ''));
      if (allowed.includes(requestOrigin) || allowed.includes('*')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  },
  namespace: '/',
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private readonly server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  afterInit(): void {
    this.logger.log('WebSocket gateway initialised');
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /** Emit to all connected clients when a new booking is created */
  emitBookingCreated(booking: Record<string, unknown>): void {
    this.server.emit(SOCKET_EVENTS.BOOKING_CREATED, booking);
  }

  /** Emit when any booking status changes */
  emitBookingStatusUpdated(payload: {
    bookingId: string;
    bookingNumber: string;
    newStatus: BookingStatus;
    mechanicId?: string;
    mechanicName?: string;
  }): void {
    this.server.emit(SOCKET_EVENTS.BOOKING_STATUS_UPDATED, payload);

    // Also emit the specific event for focused listeners
    if (payload.newStatus === BookingStatus.COMPLETED) {
      this.server.emit(SOCKET_EVENTS.BOOKING_COMPLETED, payload);
    } else if (payload.newStatus === BookingStatus.CANCELLED) {
      this.server.emit(SOCKET_EVENTS.BOOKING_CANCELLED, payload);
    } else if (payload.newStatus === BookingStatus.ASSIGNED) {
      this.server.emit(SOCKET_EVENTS.BOOKING_ASSIGNED, payload);
    }
  }

  /** Emit when a mechanic's status changes */
  emitMechanicStatusUpdated(payload: {
    mechanicId: string;
    mechanicName: string;
    newStatus: MechanicStatus;
  }): void {
    this.server.emit(SOCKET_EVENTS.MECHANIC_STATUS_UPDATED, payload);
  }

  /** Emit a new notification to all clients */
  emitNewNotification(notification: Record<string, unknown>): void {
    this.server.emit(SOCKET_EVENTS.NOTIFICATION_NEW, notification);
  }

  /** Lightweight signal to clients that dashboard stats may have changed */
  emitDashboardStatsUpdated(): void {
    this.server.emit(SOCKET_EVENTS.DASHBOARD_STATS_UPDATED, { updatedAt: new Date() });
  }
}
