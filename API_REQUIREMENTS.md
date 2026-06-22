# API Requirements & Endpoint Specifications

To transition from the current offline-first prototype to a full-scale production environment, the following RESTful API services are required.

## 1. Authentication & Identity Service (`/api/auth`)

| Endpoint | Method | Payload | Description |
| :--- | :--- | :--- | :--- |
| `/register` | `POST` | `{email, password, name, role}` | Create a new user account |
| `/login` | `POST` | `{email, password}` | Authenticate and return JWT |
| `/verify` | `POST` | `{userId, documentUrl}` | Submit ID for admin verification |
| `/profile` | `GET` | `Header: Authorization` | Fetch current user profile |

## 2. Property & Listing Service (`/api/listings`)

| Endpoint | Method | Payload | Description |
| :--- | :--- | :--- | :--- |
| `/` | `GET` | `?location=&category=` | Search and filter listings |
| `/{id}` | `GET` | - | Get full property details |
| `/` | `POST` | `{title, description, price, ...}` | Create new listing (Owner only) |
| `/{id}` | `PUT` | `{isActive, ...}` | Update listing status/details |
| `/{id}` | `DELETE` | - | Remove listing (Owner/Admin) |

## 3. Booking & Transaction Service (`/api/bookings`)

| Endpoint | Method | Payload | Description |
| :--- | :--- | :--- | :--- |
| `/` | `GET` | `?guestId=` | Fetch user's booking history |
| `/` | `POST` | `{listingId, checkIn, checkOut, ...}` | Initiate a new booking |
| `/{id}/confirm`| `POST` | - | Confirm booking and process payment |
| `/{id}/cancel` | `POST` | - | Cancel booking and handle refund |

| Endpoint | Method | Payload | Description |
| :--- | :--- | :--- | :--- |
| `/ledger` | `GET` | `?userId=` | Fetch transaction history |
| `/payout` | `POST` | `{amount, destination}` | Trigger owner payout |

## 4. Service & Experience Service (`/api/services`)

| Endpoint | Method | Payload | Description |
| :--- | :--- | :--- | :--- |
| `/` | `GET` | `?category=` | List available services/experiences |
| `/` | `POST` | `{providerId, title, price, ...}` | Register new service (Provider only) |
| `/{id}/book` | `POST` | `{bookingDate, guestId}` | Book a service |

## 5. AI Concierge & Messaging (`/api/concierge`)

| Endpoint | Method | Payload | Description |
| :--- | :--- | :--- | :--- |
| `/chat` | `POST` | `{message, contextId}` | Interface with Amara AI |
| `/messages` | `GET` | `?userId=` | Fetch chat history |
| `/messages/send`| `POST` | `{text, recipientId}` | Send manual concierge message |

## 6. Administrative Control (`/api/admin`)

| Endpoint | Method | Payload | Description |
| :--- | :--- | :--- | :--- |
| `/users/{id}/role`| `PATCH` | `{role}` | Update user privileges |
| `/system/health` | `GET` | - | Return infrastructure status |
| `/system/lock` | `POST` | `{mode: 'maintenance' \| 'lockdown'}` | Trigger global emergency protocols |
