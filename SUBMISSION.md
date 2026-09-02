# 📩 Full Stack Internship Assignment Submission

### **Project Title**: Live Vehicle Service Operations Dashboard

---

## 1. Name
**Dubey Ghanshyam SunilKumar**

---

## 2. GitHub Repository
👉 **[https://github.com/ghanshyam-du/LiveDashboard](https://github.com/ghanshyam-du/LiveDashboard)**

---

## 3. Live Vercel URL (Frontend)
👉 **[https://live-dashboard-amber.vercel.app/](https://live-dashboard-amber.vercel.app/)**

---

## 4. Live Backend URL
👉 **[https://live-dashboard-amber.vercel.app/](https://live-dashboard-amber.vercel.app/)**  
*(Interactive Swagger Docs: `https://live-dashboard-amber.vercel.app/api/docs`)*

---

## 5. API Documentation

### Interactive Swagger OpenAPI
When the backend is running, full interactive OpenAPI documentation is available at `/api/docs`.

### Core Endpoint Summary

#### 📊 Dashboard & Analytics
* `GET /api/dashboard/summary`
  * **Description**: Returns top-level aggregated operational KPI metrics (total bookings, active jobs, pending dispatches, completed today, total revenue, mechanic availability).
* `GET /api/dashboard/analytics?period=7d|30d|90d`
  * **Description**: Returns time-series analytics for booking volume trends, revenue growth curves, status distributions, and service category breakdown.

#### 🛠 Service Bookings
* `GET /api/bookings?page=1&limit=20&status=PENDING&search=MH12&sortBy=scheduledAt&sortOrder=desc`
  * **Description**: Returns paginated list of bookings with server-side filtering by status, search query (booking number, registration number, customer name), and sorting.
* `GET /api/bookings/:id`
  * **Description**: Returns complete details of a single booking with populated customer, vehicle, service, and technician models.
* `PATCH /api/bookings/:id/status`
  * **Description**: Enforces state machine transition (`PENDING` → `ASSIGNED` → `MECHANIC_ON_THE_WAY` → `COMPLETED` / `CANCELLED`). Broadcasts real-time Socket.IO event `booking:status_updated`.

#### 🔧 Mechanics (Technicians)
* `GET /api/mechanics?page=1&limit=20&status=AVAILABLE&search=Suresh`
  * **Description**: Returns technician profiles with current status, completed jobs count, ratings, and specializations.
* `GET /api/mechanics/:id`
  * **Description**: Returns mechanic profile along with recent assigned jobs.
* `PATCH /api/mechanics/:id/status`
  * **Description**: Updates technician operational status (`AVAILABLE`, `ASSIGNED`, `ON_THE_WAY`, `BUSY`, `OFFLINE`). Broadcasts real-time Socket.IO event `mechanic:status_updated`.

#### 👥 Customers & Services
* `GET /api/customers?page=1&limit=20&search=Rahul` — Retrieves customer list enriched with booking stats.
* `GET /api/customers/:id` — Retrieves customer details and booking history.
* `GET /api/services` — Retrieves full catalogue of vehicle services with pricing and duration.

#### 🔔 Notifications & Health
* `GET /api/notifications?limit=10&isRead=false` — Returns unread operational alerts.
* `PATCH /api/notifications/read-all` — Marks notifications as read.
* `GET /api/health` — Checks API health and MongoDB database connectivity.

#### Real-Time WebSocket Events (Socket.IO)
* `booking:created` — Emitted when a new booking is created.
* `booking:status_updated` — Emitted when a booking state changes.
* `mechanic:status_updated` — Emitted when a mechanic's availability updates.
* `notification:new` — Emitted to push live notification alerts to the dashboard header.

---

## 6. Short Architecture Explanation

The application is engineered using a **Decoupled Client-Server SaaS Architecture** following modular Domain-Driven Design (DDD) principles:

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
│   (Indexed Collections: Bookings, Mechanics, Customers)     │
└─────────────────────────────────────────────────────────────┘
```

1. **NestJS Backend**:
   - Organized into clean, isolated feature modules (`BookingsModule`, `MechanicsModule`, `CustomersModule`, `DashboardModule`).
   - Follows **Thin Controllers, Rich Domain Services** where business validation and state machine logic strictly reside in services.
   - Enforces a explicit **Booking Status State Machine**: `PENDING` → `ASSIGNED` → `MECHANIC_ON_THE_WAY` → `COMPLETED` / `CANCELLED`.
   - Uses **Mongoose ODM** with indexed schema queries and server-side MongoDB Aggregation pipelines for statistical aggregation.
   - Real-time updates handled by `@nestjs/websockets` Gateway broadcasting event payloads to connected clients.

2. **Next.js 16 Frontend**:
   - Modern App Router architecture utilizing React 19 Client/Server components.
   - Uses **TanStack Query (React Query v5)** for server state caching, pagination, optimistic revalidation, and background data synchronization.
   - Integrated Socket.IO client (`socket.ts`) dynamically invalidates React Query keys upon receiving server event signals, providing real-time UI updates without full page reloads.

---

## 7. AI Tools Used

1. **Cladue**:
   - Used for full-stack pair-programming, generating NestJS services, controllers, DTOs, Mongoose schemas, and Next.js React components.
   - Guided state machine business logic validation, Socket.IO gateway setup, and TypeScript type safety across frontend and backend.
   - Generated realistic seed data comprising 520+ Indian vehicle service bookings across a 90-day operational timeline.

2. **NestJS CLI & OpenAPI Tooling**:
   - Used for rapid scaffolding of NestJS feature modules, validation pipes, and Swagger documentation decorators.

---

## 8. What You Are Most Proud Of in the Project

1. **Production-Grade State Machine & System Architecture**:
   - Built a robust SaaS operations dashboard where invalid status transitions are rejected at both API service level and UI drawer controls.

2. **Instantaneous Real-Time Dashboard Reactivity**:
   - Wired NestJS WebSocket event gateway directly with TanStack Query cache invalidation. Updating a booking or technician status instantly updates all KPI cards, tables, and notifications across active browser sessions without requiring page reloads.

3. **High-Performance MongoDB Aggregations & Realistic Domain Seeding**:
   - Replaced heavy in-memory JavaScript processing with native MongoDB Aggregation pipelines for analytics charts.
   - Includes 500+ realistic Indian vehicle bookings (`MH12`, `KA01` registrations, Maruti/Hyundai models, INR pricing), giving the application an authentic, enterprise-grade feel.
