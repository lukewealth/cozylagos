# Cozy Lagos: Technical Documentation

## 1. System Overview
Cozy Lagos is a multi-tenant, role-based management platform. The architecture is designed for high performance and low latency, utilizing an offline-first approach via IndexedDB.

## 2. Data Model & Schema
The system utilizes a relational-style schema within IndexedDB.

### 2.1 User Model (`users`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique UUID |
| `role` | `enum` | `guest`, `user`, `service_provider`, `admin`, `super_admin` |
| `verified` | `boolean` | Identity verification status |
| `loyaltyPoints`| `number` | Current Cozy Reserve balance |

### 2.2 Listing Model (`listings`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique Property ID |
| `ownerId` | `string` | Reference to `users.id` |
| `nightlyRate` | `number` | Base price per night |
| `isActive` | `boolean` | Visibility on explorer |

### 2.3 Booking Model (`bookings`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Unique Booking ID |
| `listingId` | `string` | Reference to `listings.id` |
| `guestId` | `string` | Reference to `users.id` |
| `status` | `enum` | `pending`, `confirmed`, `completed`, `cancelled` |

## 3. Core Logic & Hooks

### 3.1 `useDatabase<T>(storeName)`
The primary data access layer. It provides:
- `data`: Reactive array of records.
- `addRecord(record)`: Writes to IndexedDB and triggers a global refresh.
- `removeRecord(id)`: Deletes from IndexedDB and triggers a global refresh.

### 3.2 Synchronization Strategy
The system implements a dual-layer persistence strategy:
- **Primary**: `IndexedDB` for complex queries and large datasets.
- **Secondary**: `localStorage` for lightweight state persistence and rapid recovery.

## 4. Security Implementation
- **Role-Based Access Control (RBAC)**: Components and routes are gated by the user's `role` attribute.
- **Data Integrity**: All writes are handled via a centralized `db.ts` module to ensure schema compliance.
- **Sanitization**: Input handling for the AI Concierge includes sanitization to prevent injection attacks.
