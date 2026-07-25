# Cozy Lagos - Full Stack Backend Architecture

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Tech Stack](#tech-stack)
3. [Security Layer](#security-layer)
4. [API Endpoints](#api-endpoints)
5. [Database Schema](#database-schema)
6. [Authentication & Authorization](#authentication--authorization)
7. [Business Logic Flows](#business-logic-flows)
8. [Hybrid Database Sync](#hybrid-database-sync)
9. [Image Management System](#image-management-system)
10. [State Management](#state-management)
11. [Service Provider Operations](#service-provider-operations)
12. [Admin Financial Audit](#admin-financial-audit)
13. [Data Relationships](#data-relationships)
14. [Deployment & Infrastructure](#deployment--infrastructure)

---

## Architecture Overview

Cozy Lagos is a luxury hospitality/short-term rental marketplace for Lagos, Nigeria. The platform operates as an Airbnb-like service with VIP services, curated experience bundles, staff management, asset tracking, and a concierge system.

### Architecture Pattern
```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Vite + React)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ Zustand  │  │ IndexedDB│  │ React    │  │ Image Manager│   │
│  │ Stores   │  │ (Local)  │  │ Query    │  │ + Preloading │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘   │
│       │              │              │               │            │
│  ┌────┴──────────────┴──────────────┴───────────────┴────────┐  │
│  │              Sync Engine (Bidirectional)                    │  │
│  └────────────────────────┬───────────────────────────────────┘  │
└───────────────────────────┼──────────────────────────────────────┘
                            │ HTTPS + JWT
┌───────────────────────────┼──────────────────────────────────────┐
│                    VERCEL SERVERLESS                              │
│  ┌────────────────────────┴──────────────────────────────────┐   │
│  │              API Layer (Vercel Functions)                    │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │   │
│  │  │ /auth  │ │/admin  │ │/listing│ │/book  │ │/servic │ │   │
│  │  │[path]  │ │[path]  │ │  s     │ │ ings  │ │  es    │ │   │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │   │
│  │  │/staff  │ │/trans  │ │/assets │ │/exper  │ │/health │ │   │
│  │  │        │ │actions │ │        │ │ iences │ │        │ │   │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ │   │
│  └────────────────────────┬──────────────────────────────────┘   │
│                           │                                       │
│  ┌────────────────────────┴──────────────────────────────────┐   │
│  │           Security Middleware Layer                          │   │
│  │  JWT Auth │ Rate Limiting │ Input Validation │ Audit Log   │   │
│  └────────────────────────┬──────────────────────────────────┘   │
└───────────────────────────┼──────────────────────────────────────┘
                            │
┌───────────────────────────┼──────────────────────────────────────┐
│                    MONGODB ATLAS                                  │
│  ┌────────────────────────┴──────────────────────────────────┐   │
│  │  Collections: users, listings, bookings, transactions,      │   │
│  │  services, staff, assets, experiences, chatMessages         │   │
│  └───────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 19 + Vite | SPA with HMR |
| Styling | Tailwind CSS 4 | Utility-first CSS |
| State | Zustand 5 | Lightweight state management |
| Data Fetching | TanStack React Query | Server state caching |
| Local DB | IndexedDB | Offline-first data persistence |
| API | Vercel Serverless Functions | Edge-deployed API |
| Database | MongoDB Atlas | Cloud document database |
| Auth | JWT + bcrypt (scrypt) | Token-based authentication |
| Encryption | AES-256-GCM | Field-level encryption |
| Images | WebP + Preloading | Optimized image delivery |

---

## Security Layer

### Location: `/src/lib/security.ts`

#### Password Hashing
- Algorithm: **scrypt** (Node.js crypto module)
- Salt: 16-byte random salt per password
- Output: `salt:hash` format (hex encoded)
- Comparison: **timing-safe** (prevents timing attacks)

#### JWT Tokens
- Algorithm: **HS256** (HMAC-SHA256)
- Expiration: Configurable via `JWT_EXPIRES_IN` env var (default: 7 days)
- Payload: `userId`, `email`, `role`, `name`, `exp`, `iat`
- Signature: timing-safe verification

#### Field Encryption (AES-256-GCM)
- Used for sensitive data fields (phone numbers, emails)
- Format: `iv:authTag:encrypted` (hex encoded)
- Key derivation: scrypt from `ENCRYPTION_KEY` env var

#### Input Sanitization
- XSS prevention: HTML entity encoding
- Email validation: RFC 5322 compliant regex
- Phone validation: E.164 format
- SQL injection: N/A (MongoDB uses parameterized queries)

#### Rate Limiting
- In-memory store (per serverless instance)
- Default: 60 requests per 60 seconds per IP+endpoint
- Auth endpoints: 30 requests per 60 seconds
- Returns: `429 Too Many Requests` when exceeded

#### Security Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; img-src 'self' data: https:
Referrer-Policy: strict-origin-when-cross-origin
```

#### Audit Logging
All mutations are logged with:
- Timestamp
- Action type
- User ID
- Affected resource IDs
- Changed fields

---

## API Endpoints

### Implemented Endpoints

| Endpoint | Methods | Auth | Description |
|----------|---------|------|-------------|
| `/api/health` | GET | None | MongoDB connection health check |
| `/api/auth/[...path]` | GET, POST, PUT, PATCH | Bearer | Login, register, logout, profile, password |
| `/api/users` | GET, POST, PUT, DELETE | Bearer | User CRUD (admin creates, self-updates) |
| `/api/listings` | GET, POST, PUT, DELETE | Bearer | Property listing CRUD |
| `/api/bookings` | GET, POST, PATCH, DELETE | Bearer | Booking management with payment ledger |
| `/api/services` | GET, POST, PUT, DELETE | Bearer | Service provider offerings CRUD |
| `/api/staff` | GET, POST, PUT, PATCH, DELETE | Bearer | Staff management CRUD |
| `/api/transactions` | GET, POST, PATCH, DELETE | Bearer | Financial transaction tracking |
| `/api/assets` | GET, POST, PUT, PATCH, DELETE | Bearer | Physical asset/fleet management |
| `/api/experiences` | GET, POST, PUT, DELETE | Bearer | Experience catalog CRUD |
| `/api/admin/[...path]` | GET, POST | Admin | Stats, audit, payout processing |

### Auth Sub-Routes (`/api/auth/[...path]`)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/auth/login` | POST | Email + password login, returns JWT |
| `/api/auth/register` | POST | Create account (guest/user/service_provider) |
| `/api/auth/logout` | POST | Invalidate session |
| `/api/auth/me` | GET | Get current user profile |
| `/api/auth/me` | PUT | Update profile (name, phone, preferences) |
| `/api/auth/me` | PATCH | Change password |

### Admin Sub-Routes (`/api/admin/[...path]`)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/admin/stats` | GET | Platform overview (revenue, bookings, users) |
| `/api/admin/audit` | GET | Financial audit trail with date filters |
| `/api/admin/process-payout` | POST | Process provider payout |

### Query Parameters

**Listings**: `location`, `category`, `isActive`, `ownerId`, `search`, `minPrice`, `maxPrice`, `bedrooms`, `sortBy` (price_asc, price_desc, rating, newest)

**Bookings**: `status`, `guestId`, `listingId`, `providerId`

**Services**: `providerId`, `category`, `isActive`, `search`

**Transactions**: `userId`, `type`, `status`, `startDate`, `endDate`

**Staff**: `role`, `status`, `providerId`, `search`

**Assets**: `category`, `status`, `assignedTo`, `search`

**Experiences**: `category`, `vendorId`, `isActive`, `search`

---

## Database Schema

### MongoDB Collections

#### `users`
```typescript
{
  _id: ObjectId,
  email: string (unique, indexed),
  name: string,
  password: string (scrypt hash: salt:hash),
  role: 'guest' | 'user' | 'service_provider' | 'admin' | 'super_admin',
  phone: string,
  verified: boolean,
  avatar: string,
  preferences: Record<string, any>,
  createdAt: string (ISO),
  lastLogin: string (ISO),
  loyaltyPoints: number,
  updatedAt: string (ISO)
}
// Indexes: email (unique), role
```

#### `listings`
```typescript
{
  _id: ObjectId,
  title: string,
  description: string,
  category: 'Penthouse' | 'Luxury Villa' | 'Executive Studio' | 'Serviced Apartment',
  location: 'Ikoyi' | 'Victoria Island' | 'Banana Island' | 'Lekki Phase 1',
  bedrooms: number,
  bathrooms: number,
  maxGuests: number,
  nightlyRate: number,
  weekendPremium: number,
  cleaningFee: number,
  securityDeposit: number,
  image: string,
  images: string[],
  amenities: string[],
  ownerId: string,
  isActive: boolean,
  reviewsCount: number,
  rating: number,
  aiMatchPercent: number (85-99),
  lat: number,
  lng: number,
  createdAt: string (ISO),
  updatedAt: string (ISO)
}
// Indexes: ownerId, location, isActive
```

#### `bookings`
```typescript
{
  _id: ObjectId,
  listingId: string,
  listingTitle: string,
  guestId: string,
  guestName: string,
  guestEmail: string,
  guestPhone: string,
  checkIn: string,
  checkOut: string,
  guestsCount: number,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
  totalAmount: number,
  services: string[],
  providerId: string,
  providerName: string,
  providerAssignmentStatus: 'unassigned' | 'assigned',
  paymentLedger: {
    id: string,
    bookingId: string,
    reference: string (CL-XXXXXX),
    guestName: string,
    guestEmail: string,
    date: string (ISO),
    lineItems: PaymentLineItem[],
    subtotal: number,
    serviceFee: number,
    tax: number,
    totalAmount: number,
    platformCut: number (15%),
    providerCut: number (85%),
    paymentMethod: string,
    paymentStatus: 'pending' | 'processed' | 'refunded' | 'disputed',
    cartItemCount: number,
    servicesCount: number,
    experiencesCount: number,
    createdAt: string (ISO)
  },
  confirmationNotes: string,
  rejectionReason: string,
  confirmedAt: string (ISO),
  specialRequests: string,
  createdAt: string (ISO),
  updatedAt: string (ISO)
}
// Indexes: guestId, listingId, status
```

#### `transactions`
```typescript
{
  _id: ObjectId,
  date: string,
  reference: string (TX-XXXXXX),
  type: 'payout' | 'booking_revenue' | 'refund' | 'redemption',
  amount: number,
  status: 'pending' | 'processed',
  description: string,
  userId: string,
  bookingId: string,
  method: string,
  processedBy: string,
  createdAt: string (ISO),
  updatedAt: string (ISO)
}
// Indexes: userId, type
```

#### `services`
```typescript
{
  _id: ObjectId,
  title: string,
  providerId: string,
  providerName: string,
  category: string,
  description: string,
  price: number,
  priceUnit: 'per_day' | 'per_session' | 'per_hour',
  image: string,
  location: string,
  rating: number,
  reviewsCount: number,
  isActive: boolean,
  verified: boolean,
  amenities: string[],
  duration: string,
  createdAt: string (ISO),
  updatedAt: string (ISO)
}
// Indexes: providerId, category
```

#### `staff`
```typescript
{
  _id: ObjectId,
  name: string,
  role: 'butler' | 'concierge' | 'driver' | 'chef' | 'security' | 'housekeeping' | 'wellness' | 'photographer',
  status: 'available' | 'on_duty' | 'off_duty' | 'on_leave',
  email: string,
  phone: string,
  avatar: string,
  providerId: string,
  certifications: string[],
  specializations: string[],
  rating: number,
  tenureYears: number,
  currentAssignment: string,
  createdAt: string (ISO),
  updatedAt: string (ISO)
}
```

#### `assets`
```typescript
{
  _id: ObjectId,
  name: string,
  category: 'fleet' | 'culinary' | 'comms_security' | 'tech' | 'access',
  status: 'available' | 'in_use' | 'maintenance' | 'retired',
  assetCode: string (unique),
  image: string,
  assignedTo: string,
  lastServiceDate: string,
  tags: string[],
  notes: string,
  createdAt: string (ISO),
  updatedAt: string (ISO)
}
```

#### `experiences`
```typescript
{
  _id: ObjectId,
  vendorId: string,
  vendorName: string,
  title: string,
  description: string,
  category: 'yacht' | 'tour' | 'dining' | 'wellness' | 'adventure',
  price: number,
  duration: string,
  maxGuests: number,
  images: string[],
  includes: string[],
  rating: number,
  reviewsCount: number,
  isActive: boolean,
  verified: boolean,
  createdAt: string (ISO),
  updatedAt: string (ISO)
}
// Indexes: vendorId, category
```

### Client-Side IndexedDB (Two Databases)

**Database 1: `cozy_lagos_db`** (Primary)
- 8 stores: `users`, `listings`, `bookings`, `transactions`, `services`, `experiences`, `chatMessages`, `cache`
- Used for offline-first data persistence
- TTL-based caching layer
- localStorage sync/restore backup

**Database 2: `CozyLagosCMS`** (CMS Dashboard)
- 5 stores: `trendingGems`, `vipServices`, `staff`, `exploreItems`, `announcements`
- Used by Admin/SP CMS dashboards

---

## Authentication & Authorization

### Flow
```
1. User submits email + password
2. Server verifies password hash (scrypt + timing-safe compare)
3. Server generates JWT (HS256) with userId, email, role, name
4. Token stored in localStorage as `cozy_lagos_auth_token`
5. All subsequent requests include `Authorization: Bearer <token>`
6. Server verifies JWT signature + expiration on every request
7. Role-based access control enforced per endpoint
```

### Role Hierarchy
```
super_admin (4) > admin (3) > service_provider (2) > user (1) > guest (0)
```

### Permission Matrix

| Action | Guest | User | Service Provider | Admin | Super Admin |
|--------|-------|------|-----------------|-------|-------------|
| Browse listings | Yes | Yes | Yes | Yes | Yes |
| Create booking | Yes | Yes | Yes | Yes | Yes |
| View own bookings | Yes | Yes | Yes | Yes | Yes |
| Create listing | No | No | Yes | Yes | Yes |
| Manage own services | No | No | Yes | Yes | Yes |
| View all users | No | No | No | Yes | Yes |
| Create users | No | No | No | Yes | Yes |
| Delete users | No | No | No | No | Yes |
| Access admin stats | No | No | No | Yes | Yes |
| Process payouts | No | No | No | Yes | Yes |
| View financial audit | No | No | No | Yes | Yes |

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| User | lukeokagha@gmail.com | cozy_guest_2024 |
| Admin | contact@tricode.pro | cozy_admin_2024 |
| Super Admin | luke.o@tricode.pro | cozy_super_2024 |
| Guest | guest@cozylagos.ng | cozy_visitor_2024 |
| Service Provider | chef@cozylagos.ng | cozy_host_2024 |

---

## Business Logic Flows

### 1. Booking Flow
```
Guest selects listing
    │
    ▼
POST /api/bookings (creates booking + payment ledger)
    │
    ├── Auto-generates reference (CL-XXXXXX)
    ├── Calculates platform cut (15%) and provider cut (85%)
    ├── Creates line items (accommodation, fees, taxes, addons)
    ├── Sets status: pending, providerAssignmentStatus: unassigned
    │
    ▼
Admin reviews booking
    │
    ├── CONFIRM: PATCH /api/bookings { status: 'confirmed' }
    │   ├── Sets confirmedAt timestamp
    │   ├── Updates paymentStatus to 'processed'
    │   └── Sends WhatsApp confirmation
    │
    ├── REJECT: PATCH /api/bookings { status: 'cancelled', reason }
    │   └── Records rejection reason
    │
    └── ASSIGN STAFF: PATCH /api/bookings { providerId, providerAssignmentStatus: 'assigned' }
        └── Links service provider to booking
```

### 2. Payment/Transaction Flow
```
Booking confirmed
    │
    ▼
Transaction created (type: booking_revenue)
    │
    ▼
Admin processes payout
    │
    ├── POST /api/admin/process-payout
    │   ├── Creates payout transaction
    │   ├── Updates booking paymentStatus to 'processed'
    │   └── Records processedBy admin ID
    │
    ▼
Provider receives payment (bank transfer)
```

### 3. Service Provider Operations
```
Service Provider Dashboard
    │
    ├── LISTINGS: Add/Edit/Delete properties
    │   ├── POST /api/listings (create)
    │   ├── PUT /api/listings (update)
    │   ├── DELETE /api/listings (remove)
    │   └── Toggle active/inactive status
    │
    ├── SERVICES: Manage service offerings
    │   ├── POST /api/services (create)
    │   ├── PUT /api/services (update)
    │   └── DELETE /api/services (remove)
    │
    ├── STAFF: Manage team members
    │   ├── POST /api/staff (create)
    │   ├── PUT /api/staff (update)
    │   ├── PATCH /api/staff (status/assignment)
    │   └── DELETE /api/staff (remove)
    │
    ├── BOOKINGS: View and manage booking requests
    │   ├── Confirm/Reject bookings
    │   ├── Assign staff to bookings
    │   └── View booking details
    │
    └── EARNINGS: Track revenue
        ├── View transaction history
        ├── See pending/processed payouts
        └── Revenue breakdown by service
```

### 4. Admin Financial Audit
```
Admin Dashboard → Ledger/Analytics
    │
    ├── OVERVIEW STATS (GET /api/admin/stats)
    │   ├── Total bookings (pending/confirmed)
    │   ├── Total revenue
    │   ├── Platform cut (15%)
    │   ├── Provider cut (85%)
    │   ├── Revenue by month (aggregation)
    │   └── Bookings by status (aggregation)
    │
    ├── AUDIT TRAIL (GET /api/admin/audit)
    │   ├── Filter by date range
    │   ├── Filter by status
    │   ├── Per-booking breakdown:
    │   │   ├── Reference number
    │   │   ├── Guest details
    │   │   ├── Total amount
    │   │   ├── Platform cut
    │   │   ├── Provider cut
    │   │   └── Payment status
    │   └── Summary totals
    │
    └── PAYOUT PROCESSING (POST /api/admin/process-payout)
        ├── Select booking
        ├── Enter payout amount
        ├── Select method (bank_transfer, etc.)
        └── Creates transaction + updates booking
```

---

## Hybrid Database Sync

### Location: `/src/lib/syncEngine.ts`

### Architecture
```
┌─────────────────────────────────────────────────┐
│                FRONTEND                           │
│                                                   │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │ IndexedDB │◄──►│  Sync    │◄──►│   API    │  │
│  │ (Local)   │    │  Engine  │    │ (Cloud)  │  │
│  └──────────┘    └──────────┘    └──────────┘  │
│       ▲                                │         │
│       │         ┌──────────┐          │         │
│       └────────►│localStorage│◄────────┘         │
│                 │ (Backup)  │                     │
│                 └──────────┘                      │
└─────────────────────────────────────────────────┘
```

### Sync Modes

| Mode | Direction | Description |
|------|-----------|-------------|
| Push | Local → Cloud | Upload local changes to MongoDB |
| Pull | Cloud → Local | Download latest data from MongoDB |
| Bidirectional | Both | Full sync (push then pull) |

### Sync Queue
- Offline mutations are queued in localStorage
- Each item: `{ id, store, action, data, timestamp, retryCount, maxRetries: 3 }`
- On reconnect: queue is flushed to API
- Failed items are retried up to 3 times

### Auto-Sync
- Interval: 30 seconds (configurable)
- Triggers: `online` event, interval timer
- Status: `idle` | `syncing` | `error` | `offline`
- Listeners: `onSyncStatusChange(callback)`

### Conflict Resolution
- Last-write-wins strategy
- Server timestamp is source of truth
- Local changes are pushed first, then server data is pulled

### API
```typescript
syncNow(direction?: SyncDirection): Promise<SyncResult>
syncCreate(store: string, data: any): Promise<void>
syncUpdate(store: string, data: any): Promise<void>
syncDelete(store: string, id: string): Promise<void>
startAutoSync(intervalMs?: number): void
stopAutoSync(): void
getSyncStatus(): SyncStatus
getLastSyncTime(): Date | null
getPendingSyncCount(): number
onSyncStatusChange(listener: (status: SyncStatus) => void): () => void
```

---

## Image Management System

### Location: `/src/lib/imageManager.ts`

### Strategy
- Local images stored in `/public/assets/images/`
- WebP conversion for modern browsers
- Preloading with `requestIdleCallback` for non-blocking
- Fallback chain: Local → Unsplash → Placeholder

### Image Resolution
```typescript
resolveExploreImage(title: string, fallbackUrl?: string): string
resolveServiceImage(category: string, title?: string, fallbackUrl?: string): string
resolveAssetImage(name: string, category: string, fallbackUrl?: string): string
```

### Naming Convention
- Explore Lagos items: mapped by title (case-insensitive)
- Service images: mapped by category
- Asset images: mapped by name + category
- Same-name handling: `.jpeg`, `.webp`, `.jpg`, `.png` all resolve to same entry

### Preloading
```typescript
preloadExploreImages(): void  // Priority images for Explore Lagos
preloadServiceImages(): void  // Category images for VIP services
preloadImage(src: string): Promise<void>  // Single image
preloadImages(srcs: string[]): Promise<void[]>  // Batch
```

### Performance
- In-memory cache (`Map<string, string>`)
- Lazy loading for below-fold images
- `loading="lazy"` + `decoding="async"` on all images
- WebP source in `<picture>` element for modern browsers

---

## State Management

### Zustand Stores

#### `useAuthStore` (Persisted)
```typescript
{
  currentUser: UserRecord | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  login(email, password): Promise<boolean>,
  logout(): void,
  updateUser(updates): Promise<void>,
  switchRole(role): void,
}
// Persisted to localStorage: cozy-lagos-auth
```

#### `useCartStore` (Persisted)
```typescript
{
  items: CartItem[],
  serviceItems: ServiceCartItem[],
  experienceItems: ExperienceCartItem[],
  isCartOpen: boolean,
  addItem(item): void,
  removeItem(id): void,
  updateQuantity(id, qty): void,
  clearCart(): void,
  getTotalItems(): number,
  getTotalPrice(): number,
}
// Persisted to localStorage: cozy-lagos-cart
```

#### `useCMSStore` (IndexedDB-backed)
```typescript
{
  trendingGems: TrendingGem[],
  vipServices: VIPService[],
  staff: StaffMember[],
  exploreItems: ExploreItem[],
  announcements: Announcement[],
  init(): Promise<void>,
  addTrendingGem(gem): Promise<void>,
  updateTrendingGem(gem): Promise<void>,
  deleteTrendingGem(id): Promise<void>,
  toggleTrending(id): void,
  addVIPService(service): Promise<void>,
  updateVIPService(service): Promise<void>,
  deleteVIPService(id): Promise<void>,
  addStaff(member): Promise<void>,
  updateStaff(member): Promise<void>,
  deleteStaff(id): Promise<void>,
}
// Backed by CozyLagosCMS IndexedDB
```

#### `useUIStore`
```typescript
{
  activeTab: ActiveTab,
  searchDestination: string,
  isCartOpen: boolean,
  isCheckoutOpen: boolean,
  isMobileMenuOpen: boolean,
  isSidebarCollapsed: boolean,
}
// Not persisted
```

### React Query Configuration
```typescript
{
  staleTime: 5 * 60 * 1000,     // 5 minutes
  gcTime: 10 * 60 * 1000,       // 10 minutes
  retry: 2,
  refetchOnWindowFocus: false,
}
```

---

## Service Provider Operations

### Dashboard Sections
1. **Overview** - Stats, booking requests, staff command
2. **Listings** - Property management (CRUD + toggle active)
3. **My Services** - Service catalog management
4. **Booking Requests** - Confirm/reject/assign staff
5. **Schedule/Calendar** - Calendar view with booked dates
6. **Earnings** - Revenue tracking and transaction history
7. **Inventory/Assets** - Asset management (CRUD)

### Key Components
- `SPCMSView.tsx` - Service Provider CMS (IndexedDB-backed)
- `ServiceProviderDashboard.tsx` - Full dashboard portal
- `ListingWizardView.tsx` - Multi-step listing creation
- `AssetCreateModal.tsx` - Asset creation form
- `StaffAssignModal.tsx` - Staff assignment to bookings

### Data Flow
```
SP Dashboard → Zustand Store → IndexedDB (local)
                              → API (cloud) → MongoDB
```

---

## Admin Financial Audit

### Dashboard Sections
1. **Dashboard** - Arrival operations, live stream, security logs
2. **Listings** - Property management with edit/delete
3. **Bookings** - Confirm/reject with WhatsApp notification
4. **Ledger** - Payment ledger with full billing metadata
5. **Analytics** - Revenue charts, booking stats, user metrics

### Financial Controls
- **Platform Cut**: 15% of every booking
- **Provider Cut**: 85% of every booking
- **Service Fee**: 5% (displayed to guest)
- **VAT**: 7.5% (displayed to guest)
- **Payout Processing**: Admin-triggered with audit trail

### Audit Trail
Every financial operation is logged:
- Booking creation
- Payment status changes
- Payout processing
- Refund processing
- Transaction updates

### Export
- CSV export for ledger data
- Date range filtering for audit reports
- Status filtering (pending/processed/refunded)

---

## Data Relationships

```
users (1) ──────────< (N) bookings        [via guestId]
users (1) ──────────< (N) bookings        [via providerId]
users (1) ──────────< (N) listings        [via ownerId]
users (1) ──────────< (N) transactions    [via userId]
users (1) ──────────< (N) services        [via providerId]

listings (1) ───────< (N) bookings        [via listingId]
listings (1) ───────< (1) paymentLedger   [embedded in booking]

bookings (1) ─────── (1) paymentLedger    [embedded object]
paymentLedger (1) ──< (N) lineItems       [embedded array]

services (1) ───────< (N) staff           [via providerId]

staff (1) ──────────< (N) serviceRequests [via assignedStaffIds]
staff (1) ──────────< (N) scheduleEntries [via staffId]
staff (1) ──────────< (N) timeOffRequests [via staffId]

assets (1) ─────────< (N) staffAssetAssignments [via assetId]
staff (1) ──────────< (N) staffAssetAssignments [via staffId]

chatMessages (N) ──> (1) users           [via userId]
```

---

## Deployment & Infrastructure

### Vercel Configuration (`vercel.json`)
```json
{
  "builds": [
    { "src": "api/**/*.ts", "use": "@vercel/node" },
    { "src": "package.json", "use": "@vercel/static-build" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/assets/(.*)", "headers": { "Cache-Control": "public, max-age=31536000, immutable" } },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### Environment Variables
```
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=cozy_lagos
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
ENCRYPTION_KEY=your-32-byte-encryption-key
VITE_API_BASE_URL=/api
```

### Connection Pool
- Max pool size: 10
- Min pool size: 5
- Retry writes: enabled
- Retry reads: enabled
- Singleton pattern for serverless reuse

### Caching Strategy
- Static assets: 1 year immutable
- API responses: React Query (5 min stale)
- IndexedDB: TTL-based (1 hour default)
- localStorage: Sync backup

---

## File Structure

```
cozylagoss/
├── api/                          # Vercel Serverless Functions
│   ├── auth/[...path].ts         # Auth (login, register, profile)
│   ├── admin/[...path].ts        # Admin (stats, audit, payouts)
│   ├── users.ts                  # User CRUD
│   ├── listings.ts               # Property CRUD
│   ├── bookings.ts               # Booking management
│   ├── services.ts               # Service CRUD
│   ├── staff.ts                  # Staff management
│   ├── transactions.ts           # Transaction tracking
│   ├── assets.ts                 # Asset management
│   ├── experiences.ts            # Experience catalog
│   └── health.ts                 # Health check
├── src/
│   ├── lib/
│   │   ├── security.ts           # Auth, encryption, validation
│   │   ├── middleware.ts         # Request middleware
│   │   ├── mongodb.ts            # MongoDB connection
│   │   ├── syncEngine.ts         # Hybrid sync engine
│   │   └── imageManager.ts       # Image resolution + preloading
│   ├── services/
│   │   └── api.ts                # Frontend API client
│   ├── stores/
│   │   ├── authStore.ts          # Auth state
│   │   ├── cartStore.ts          # Cart state
│   │   ├── cmsStore.ts           # CMS state
│   │   └── uiStore.ts            # UI state
│   ├── db.ts                     # IndexedDB (primary)
│   ├── db/indexedDb.ts           # IndexedDB (CMS)
│   ├── components/
│   │   ├── ExploreLagosView.tsx  # Explore Lagos with local images
│   │   ├── SPCMSView.tsx         # Service Provider CMS
│   │   ├── AdminCMSView.tsx      # Admin CMS
│   │   └── ...                   # Other components
│   ├── portals/
│   │   ├── AdminDashboard.tsx    # Admin portal
│   │   ├── ServiceProviderDashboard.tsx  # SP portal
│   │   ├── UserDashboard.tsx     # User portal
│   │   └── SuperAdminDashboard.tsx  # Super admin portal
│   ├── hooks/
│   │   ├── useApi.ts             # React Query hooks
│   │   ├── useDatabase.ts        # IndexedDB reactive hook
│   │   ├── useBackendHealth.ts   # Health monitoring
│   │   └── useCachedListings.ts  # Cached listings
│   ├── auth.tsx                  # Auth context provider
│   ├── types.ts                  # TypeScript types
│   └── data.ts                   # Initial seed data
├── public/
│   └── assets/
│       ├── images/horizontal/    # Horizontal images
│       ├── images/vertical/      # Vertical images
│       └── bundles/              # Bundle thumbnails
└── scripts/
    └── seed-database.ts          # MongoDB seed script
```

---

## Security Audit Checklist

- [x] Password hashing (scrypt with salt)
- [x] JWT token authentication
- [x] Timing-safe comparisons
- [x] Input sanitization (XSS prevention)
- [x] Rate limiting per endpoint
- [x] Role-based access control
- [x] Security headers (HSTS, CSP, X-Frame-Options)
- [x] Audit logging for all mutations
- [x] Field-level encryption (AES-256-GCM)
- [x] Sensitive data masking in responses
- [x] CORS configuration
- [x] MongoDB connection pooling with retry
- [x] Token expiration and refresh
- [x] Password change with current password verification
- [x] Email validation
- [x] Phone validation
- [x] SQL injection prevention (parameterized queries)
- [x] No secrets in client bundle
- [x] Environment variable management

---

*Document generated: 2026-07-25*
*Last updated: 2026-07-25*
