# 🚗 Live Vehicle Service Operations Dashboard

A real-world, production-grade SaaS operations dashboard built for automobile/vehicle-service operations teams to monitor live service bookings, technician dispatching, customer profiles, revenue analytics, and real-time operational feeds.

---

## 5. API Documentation

### Interactive Swagger OpenAPI
When the backend is running, full interactive OpenAPI documentation is available at:
👉 **`http://localhost:3001/api/docs`**

---

### Core Endpoint Summary

#### 📊 Dashboard & Analytics
* `GET /api/dashboard/summary`
  * **Summary**: Retrieves high-level aggregated operational KPI metrics (total bookings, active jobs, pending dispatches, completed today, total revenue, mechanic availability).
  * **Response**: `200 OK`
* `GET /api/dashboard/analytics?period=7d|30d|90d`
  * **Summary**: Returns time-series data for booking trends, revenue growth, status distributions, and service category breakdown.
  * **Response**: `200 OK`

#### 🛠 Service Bookings
* `GET /api/bookings?page=1&limit=20&status=PENDING&search=MH12&sortBy=scheduledAt&sortOrder=desc`
  * **Summary**: Retrieves paginated list of vehicle bookings with server-side filtering by status, search (booking number, vehicle reg, customer name), and sorting.
  * **Response**: `200 OK`
* `GET /api/bookings/:id`
  * **Summary**: Retrieves complete details of a single booking including populated customer, vehicle, service, and mechanic objects.
  * **Response**: `200 OK`
* `PATCH /api/bookings/:id/status`
  * **Summary**: Executes state machine status transition for a booking (`PENDING` → `ASSIGNED` → `MECHANIC_ON_THE_WAY` → `COMPLETED` / `CANCELLED`).
  * **Request Body**:
    ```json
    {
      "status": "ASSIGNED",
      "notes": "Technician dispatched to site.",
      "cancellationReason": null
    }
    ```
  * **Response**: `200 OK` (Emits real-time WebSocket event `booking:status_updated`)

#### 🔧 Mechanics (Technicians)
* `GET /api/mechanics?page=1&limit=20&status=AVAILABLE&search=Suresh`
  * **Summary**: Retrieves field mechanics with availability status, total completed jobs, ratings, and specializations.
  * **Response**: `200 OK`
* `GET /api/mechanics/:id`
  * **Summary**: Retrieves mechanic profile with recent assigned jobs history.
  * **Response**: `200 OK`
* `PATCH /api/mechanics/:id/status`
  * **Summary**: Updates mechanic operational status (`AVAILABLE`, `ASSIGNED`, `ON_THE_WAY`, `BUSY`, `OFFLINE`).
  * **Request Body**: `{ "status": "AVAILABLE" }`
  * **Response**: `200 OK` (Emits real-time WebSocket event `mechanic:status_updated`)

#### 👥 Customers & Services
* `GET /api/customers?page=1&limit=20&search=Rahul` — Retrieves customer directory with total spend & order count.
* `GET /api/customers/:id` — Retrieves customer details & recent service bookings.
* `GET /api/services` — Retrieves full catalogue of vehicle services with base prices and duration.

#### 🔔 Notifications & System Health
* `GET /api/notifications?limit=10&isRead=false` — Retrieves recent operational alerts.
* `PATCH /api/notifications/read-all` — Marks all alerts as read.
* `GET /api/health` — Returns system uptime and MongoDB database connection status.

---

### Real-Time WebSocket Events (Socket.IO)
* **Namespace**: `/`
* **Events Emitted by Server**:
  - `booking:created` — Sent when a new booking is submitted.
  - `booking:status_updated` — Sent to all connected clients when a booking state changes.
  - `mechanic:status_updated` — Sent when a mechanic's field availability changes.
  - `notification:new` — Pushed to client header popover for operational alerts.

---

## 6. Short Architecture Explanation

The project follows a **Decoupled Client-Server SaaS Architecture** structured cleanly around Domain-Driven Design (DDD) and Modular Architecture principles:

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 16 Client                        │
│   (App Router + TanStack Query + Socket.IO + Tailwind CSS)  │
└──────────────┬──────────────────────────────▲───────────────┘
               │ HTTP REST APIs               │ Real-Time Socket.IO
               ▼                              │ Push Events
┌─────────────────────────────────────────────┴───────────────┐
│                    NestJS Backend API                       │
│  (Modules: Bookings, Mechanics, Customers, Dashboard, Ws)   │
└──────────────┬──────────────────────────────────────────────┘
               │ Mongoose ODM (Aggregation Pipelines)
               ▼
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas Database                   │
│   (Indexed Collections: Bookings, Mechanics, Customers, etc)│
└─────────────────────────────────────────────────────────────┘
```

1. **Backend (NestJS + MongoDB Atlas)**:
   - Built with NestJS modular architecture (`AppModule`, `BookingsModule`, `MechanicsModule`, etc.).
   - Employs **Thin Controllers, Rich Domain Services** pattern where business rules and state machines reside strictly in services.
   - Database operations use **Mongoose ODM** leveraging indexes (`bookingNumber`, `status`, `scheduledAt`, `email`) and **MongoDB Aggregation Pipelines** for high-performance statistical summaries (averages, date-histogram groupings).
   - Enforces an explicit **Booking Status State Machine**:
     `PENDING` → `ASSIGNED` → `MECHANIC_ON_THE_WAY` → `COMPLETED` / `CANCELLED`.
   - Real-time reactivity is powered by `@nestjs/websockets` (Socket.IO Gateway), broadcasting state changes instantaneously across connected operation dashboards without client polling.

2. **Frontend (Next.js 16 App Router + TanStack Query)**:
   - Uses Next.js App Router with React Server/Client Components.
   - Server state, background revalidation, and caching are managed via **TanStack Query (React Query v5)**.
   - A single Socket.IO singleton client (`socket.ts`) listens to server events and dynamically invalidates React Query cache keys (`['bookings']`, `['dashboard-summary']`), updating the UI smoothly without full page reloads.
   - Designed with custom dark-themed CSS design tokens (`oklch` color spaces, glassmorphism, responsive data density).

---

## 7. AI Tools Used

1. **Google Antigravity (Agentic AI Assistant)**:
   - Used for end-to-end full-stack pair programming, generating modular NestJS services/controllers, schema definitions, and Next.js UI components.
   - Assisted in architecting the backend status state machine logic, establishing Socket.IO event emission patterns, and generating TypeScript types across backend and frontend.
   - Guided seed data generation for 520+ realistic Indian vehicle service bookings across a 90-day timeline.

2. **NestJS CLI & Open-Source Tooling**:
   - Used to generate modular application skeletons, DTO validation pipes, and Swagger OpenAPI metadata decorators.

---

## 8. What You Are Most Proud Of in the Project

1. **Strict Production Realism & Zero Compromises on Business Architecture**:
   - Rather than building a generic demo CRUD app, this project implements a true **production-oriented state machine** where illegal status skips (e.g. `PENDING` directly to `COMPLETED`) are rejected by both backend service validation guards and the frontend UI drawer.

2. **Seamless Instantaneous Real-Time Synchronization**:
   - The integration between NestJS events gateway and TanStack Query cache invalidation creates a true "live ops control room" feel. When a status is changed or a mechanic is reassigned in one window, all active dashboard feeds, KPI cards, and notification banners instantly update across connected clients without page reloads.

3. **High-Performance MongoDB Aggregations & Realistic Indian Domain Data**:
   - All dashboard analytics (30-day volume trends, revenue growth curves, mechanic job totals) are computed using native MongoDB Aggregation pipelines rather than slow in-memory JavaScript array iteration.
   - The included seed script generates 500+ realistic Indian vehicle bookings (`MH12`, `KA01` vehicle registrations, Maruti/Hyundai models, INR currency formatting), making the application feel immediately authentic and ready for enterprise operations deployment.
