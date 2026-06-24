# Cozy Lagos - Technical Documentation

## Overview

Cozy Lagos is a luxury property rental and experience booking platform built with React 19, TypeScript, and Vite. The application provides a comprehensive solution for property management, booking, and service delivery in the Lagos luxury market.

## Tech Stack

### Frontend Framework
- **React 19** - Latest React with concurrent features
- **TypeScript 5.8** - Type-safe development
- **Vite 6** - Fast build tool and dev server

### Styling & UI
- **Tailwind CSS v4** - Utility-first CSS framework
- **Framer Motion (motion/react)** - Animation library
- **Lucide React** - Icon library
- **Recharts** - Data visualization

### Data & State Management
- **IndexedDB** - Client-side database via custom `db.ts` wrapper
- **React Context API** - Global state management
- **LocalStorage** - Persistent cart and session data
- **Custom Hooks** - `useDatabase`, `useCart`, `useAuth`

### Authentication
- **Custom Auth System** - Email/password authentication
- **Role-based Access Control** - guest, user, service_provider, admin, super_admin
- **Session Persistence** - IndexedDB + LocalStorage caching

## Architecture

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── TopNavBar.tsx   # Navigation with auth
│   ├── LagosCruiseView.tsx
│   ├── ExplorerView.tsx
│   ├── ExperienceDetailView.tsx
│   ├── ServiceBundlesView.tsx
│   ├── CartDrawer.tsx
│   └── ...
├── portals/            # Role-specific dashboards
│   ├── UserDashboard.tsx
│   ├── ServiceProviderDashboard.tsx
│   ├── AdminDashboard.tsx
│   └── SuperAdminDashboard.tsx
├── context/            # React Context providers
│   └── CartContext.tsx
├── hooks/              # Custom React hooks
│   ├── useDatabase.ts
│   └── useCart.ts
├── data.ts            # Initial data and service bundles
├── db.ts              # IndexedDB wrapper and utilities
├── types.ts           # TypeScript type definitions
├── auth.tsx           # Authentication context and logic
├── App.tsx            # Main app component
└── main.tsx           # Entry point
```

## Pages & Routes

### Guest Pages (Unauthenticated)
1. **Home** (`/`) - Landing page with featured properties
2. **Lagos Cruise** (`/lagos-cruise`) - Curated property collection
3. **Explorer** (`/explorer`) - Property search and filtering
4. **Experiences** (`/experience`) - Yacht charter booking
5. **Bundles** (`/bundles`) - Premium service packages

### User Dashboard (Authenticated Users)
- **Browse** - Property listing
- **Stays** - Search and filter
- **Experiences** - Experience booking
- **Bundles** - Service packages
- **My Dashboard** - User bookings and profile

### Service Provider Dashboard
- **Dashboard** - Overview and analytics
- **My Services** - Service listing management
- **Schedule** - Calendar and availability
- **Earnings** - Financial reports and payouts

### Admin Dashboard
- **Admin Panel** - System management
- **All Properties** - Property moderation
- **Analytics** - Platform metrics

### Super Admin Dashboard
- **Super Admin** - Full system control
- **Management** - Admin oversight
- **System Stats** - Technical metrics

## Components

### Navigation
- **TopNavBar** - Dynamic navigation based on auth state
  - Logo with blended edges (radial gradient mask)
  - Role-based menu items
  - Login/logout functionality
  - Cart icon with count badge

### Property Components
- **ApartmentCard** - Property listing card
- **ListingDetailView** - Full property details
- **ExplorerView** - Property search with filters
- **LagosCruiseView** - Curated property collection

### Experience Components
- **ExperienceDetailView** - Yacht charter booking
- **ServiceBundlesView** - Premium service packages

### Cart Components
- **CartDrawer** - Slide-out cart panel
- **CartContext** - Cart state management

### Dashboard Components
- **UserDashboard** - User booking history
- **ServiceProviderDashboard** - Provider management
- **AdminDashboard** - Admin controls
- **SuperAdminDashboard** - System administration

## Data Synchronization

### IndexedDB Layer (`db.ts`)
```typescript
// Database: cozy_lagos_db (version 1)
// Object Stores:
- users (keyPath: id, indexes: email, role)
- listings (keyPath: id, indexes: ownerId, location, isActive)
- bookings (keyPath: id, indexes: guestId, listingId, status)
- transactions (keyPath: id, indexes: userId, type)
- services (keyPath: id, indexes: providerId, category)
- experiences (keyPath: id, indexes: vendorId, category)
- chatMessages (keyPath: id, indexes: userId)
- cache (keyPath: key)
```

### CRUD Operations
- `dbGet(storeName, id)` - Get single record
- `dbGetAll(storeName)` - Get all records
- `dbGetByIndex(storeName, indexName, value)` - Query by index
- `dbPut(storeName, record)` - Create/update record
- `dbDelete(storeName, id)` - Delete record
- `dbClear(storeName)` - Clear all records

### Caching Strategy
```typescript
// TTL-based cache (default: 1 hour)
cacheSet(key, value, ttlMs)
cacheGet(key)
cacheGetOrFallback(key, fallback, ttlMs)

// Multi-layer fallback
getListingsWithFallback(fallbackListings)
// 1. Try IndexedDB
// 2. Try TTL cache
// 3. Try LocalStorage
// 4. Use static fallback data
```

### Data Flow
1. **Initialization** - `seedDatabase()` populates stores if empty
2. **Reactive Updates** - `useDatabase()` hook subscribes to changes
3. **Persistence** - `syncToLocalStorage()` backs up to LocalStorage
4. **Cache Invalidation** - TTL-based expiry with automatic cleanup

## State Management

### React Context Providers

#### AuthProvider (`auth.tsx`)
```typescript
interface AuthContextType {
  currentUser: UserRecord | null;
  isLoading: boolean;
  login: (email, password) => Promise<boolean>;
  register: (email, name, password, role) => Promise<boolean>;
  logout: () => void;
  switchRole: (role) => void;
  updateUser: (updates) => Promise<void>;
  isAuthenticated: boolean;
}
```

#### CartProvider (`context/CartContext.tsx`)
```typescript
interface CartContextType {
  cart: CartItem[];
  addToCart: (listing, guestsCount, checkIn, checkOut) => void;
  removeFromCart: (listingId, checkIn, checkOut) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
}
```

### LocalStorage Keys
- `cozy_lagos_cart` - Cart items
- `cozy_lagos_users` - User data backup
- `cozy_lagos_listings` - Listings backup
- `cozy_lagos_bookings` - Bookings backup
- `cozy_lagos_transactions` - Transactions backup

## Authentication System

### User Roles
1. **guest** - Unauthenticated visitor
2. **user** - Registered customer
3. **service_provider** - Property/service owner
4. **admin** - Platform administrator
5. **super_admin** - System administrator

### Demo Accounts
```
User: lukeokagha@gmail.com
Admin: contact@tricode.pro
Super Admin: luke.o@tricode.pro
Provider: chef@cozylagos.ng
```

### Authentication Flow
1. User enters email/password
2. `login()` checks IndexedDB for user
3. If not found, checks DEMO_USERS array
4. Updates `lastLogin` timestamp
5. Caches user in IndexedDB with 24h TTL
6. Sets `currentUser` in AuthContext
7. Syncs to LocalStorage

### Session Persistence
- **IndexedDB** - Primary storage with TTL cache
- **LocalStorage** - Backup for cross-tab sync
- **Session Restoration** - Auto-login on page reload

## Cart System

### Cart Item Structure
```typescript
interface CartItem {
  listing: Listing;
  guestsCount: number;
  checkIn: string;
  checkOut: string;
}
```

### Cart Operations
- **Add to Cart** - Prevents duplicates (same listing + dates)
- **Remove from Cart** - By listing ID and dates
- **Clear Cart** - Empty all items
- **Calculate Total** - Nights × nightly rate + cleaning fee

### Cart Persistence
- Auto-saves to LocalStorage on every change
- Restores on app mount
- Syncs across browser tabs

## Database Schema

### Users
```typescript
interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  verified: boolean;
  createdAt: string;
  lastLogin: string;
  preferences?: Record<string, any>;
  loyaltyPoints: number;
}
```

### Listings
```typescript
interface ListingRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  nightlyRate: number;
  weekendPremium: number;
  cleaningFee: number;
  securityDeposit: number;
  image: string;
  images: string[];
  amenities: string[];
  ownerId: string;
  isActive: boolean;
  reviewsCount: number;
  rating: number;
  aiMatchPercent: number;
  createdAt: string;
  updatedAt: string;
}
```

### Bookings
```typescript
interface BookingRecord {
  id: string;
  listingId: string;
  listingTitle: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestAvatar?: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  totalAmount: number;
  services: string[];
  createdAt: string;
  updatedAt: string;
}
```

### Transactions
```typescript
interface TransactionRecord {
  id: string;
  date: string;
  reference: string;
  type: 'payout' | 'booking_revenue' | 'refund' | 'redemption';
  amount: number;
  status: 'pending' | 'processed';
  description: string;
  userId: string;
  createdAt: string;
}
```

## Properties Listed

### Current Listings (15 Properties)
1. **The Bourdillon Penthouse** - Ikoyi, ₦450,000/night
2. **Lagoon View Villa** - Banana Island, ₦650,000/night
3. **The Eko Loft Sanctuary** - Victoria Island, ₦250,000/night
4. **Ekpo - Luxury 1-Bedroom** - Lekki Phase 1, ₦180,000/night
5. **Studio Suite with Pool** - Lekki Phase 1, ₦130,000/night
6. **Whitestone - Luxury 2BR** - Lekki Phase 1, ₦270,000/night
7. **Lekki Maisonette** - Lekki Phase 1, ₦210,000/night
8. **Victoria Penthouse** - Victoria Island, ₦380,000/night
9. **Oniru Serviced Apartment** - Victoria Island, ₦180,000/night
10. **Cozy Admiralty 2BR** - Lekki Phase 1, ₦190,000/night
11. **Admiralty Luxury 2BR** - Lekki Phase 1, ₦240,000/night
12. **Ikoyi Executive 3BR** - Ikoyi, ₦320,000/night
13. **VI Oceanview 2BR** - Victoria Island, ₦220,000/night
14. **Lekki Garden 1BR** - Lekki Phase 1, ₦150,000/night
15. **Oniru Premium 3BR** - Victoria Island, ₦350,000/night

## Service Bundles

### 7 Premium Bundles × 3 Tiers Each

1. **Business Bundle** - Corporate Executive
   - Economy (3 Days): ₦1,650,000
   - Standard (7 Days): ₦6,000,000
   - Premium (21 Days): ₦27,000,000

2. **Diaspora Bundle** - Reconnect with Lagos
   - Economy (3 Days): ₦1,200,000
   - Standard (7 Days): ₦4,200,000
   - Premium (21 Days): ₦17,000,000

3. **Tourist Bundle** - Hassle-Free Discovery
   - Economy (3 Days): ₦750,000
   - Standard (7 Days): ₦2,400,000
   - Premium (21 Days): ₦9,500,000

4. **Executive Elite** - Total Mobility
   - Economy (3 Days): ₦4,500,000
   - Standard (7 Days): ₦18,500,000
   - Premium (21 Days): ₦88,000,000

5. **Edu-Care Package** - Families & Sabbaticals
   - Economy (3 Days): ₦1,200,000
   - Standard (7 Days): ₦4,200,000
   - Premium (21 Days): ₦18,000,000

6. **Lavish Love** - Romance & Milestones
   - Economy (3 Days): ₦2,800,000
   - Standard (7 Days): ₦9,500,000
   - Premium (21 Days): ₦42,000,000

7. **Pulse & Zen** - Wellness & Nightlife
   - Economy (3 Days): ₦1,500,000
   - Standard (7 Days): ₦5,200,000
   - Premium (21 Days): ₦24,000,000

## AI Features & Considerations

### Current AI Implementations
1. **AI Match Percent** - Property matching score (85-99%)
2. **Smart Recommendations** - Personalized property suggestions
3. **Concierge Chat** - FAQ-based automated responses

### Future AI Opportunities
1. **Dynamic Pricing** - ML-based rate optimization
2. **Predictive Analytics** - Demand forecasting
3. **Image Recognition** - Auto-tagging property photos
4. **Natural Language Processing** - Enhanced concierge chat
5. **Fraud Detection** - Booking anomaly detection
6. **Customer Segmentation** - Behavioral clustering
7. **Sentiment Analysis** - Review sentiment tracking

## Admin & Management Features

### Service Provider Dashboard
**Current Features:**
- Property listing management
- Booking calendar
- Earnings tracking
- Service scheduling

**Recommended Improvements:**
- Automated pricing suggestions
- Guest communication templates
- Performance analytics
- Review response automation
- Inventory management
- Staff scheduling
- Maintenance request tracking

### Admin Dashboard
**Current Features:**
- Property moderation
- User management
- Transaction oversight
- Platform analytics

**Recommended Improvements:**
- Automated content moderation
- Fraud detection alerts
- Revenue optimization tools
- Customer support ticketing
- Marketing campaign management
- A/B testing framework
- Compliance monitoring

### Super Admin Dashboard
**Current Features:**
- Full system control
- Admin oversight
- Technical metrics

**Recommended Improvements:**
- System health monitoring
- Automated backup management
- API rate limiting
- Security audit logs
- Performance optimization
- Disaster recovery planning
- Multi-tenant support

## Data Flow Architecture

### Booking Flow
```
User → Browse Properties → Select Property → Add to Cart → Checkout → Create Booking → Update Transactions → Notify Owner
```

### Property Management Flow
```
Provider → Login → Dashboard → Add/Edit Listing → Upload Images → Set Availability → Publish → Admin Review → Live
```

### Payment Flow
```
Booking Confirmed → Calculate Revenue (85% to owner) → Create Transaction → Process Payout → Update Ledger
```

## State Management Strategy

### Global State (Context)
- **Auth State** - Current user, authentication status
- **Cart State** - Cart items, totals
- **Database State** - Reactive data from IndexedDB

### Local State (useState)
- **UI State** - Modals, drawers, active tabs
- **Form State** - Input values, validation
- **Filter State** - Search parameters

### Persistent State
- **IndexedDB** - Primary data store
- **LocalStorage** - Cart, session backup
- **TTL Cache** - Temporary data with expiry

## Performance Optimizations

### Current Optimizations
1. **Lazy Loading** - Images with `loading="lazy"`
2. **Code Splitting** - Route-based component splitting
3. **Memoization** - `useMemo`, `useCallback` for expensive computations
4. **Virtual Scrolling** - For large lists (future)
5. **Image Fallback** - SVG fallback for broken images
6. **Cache Strategy** - Multi-layer caching with TTL

### Recommended Optimizations
1. **Service Worker** - Offline support
2. **Image Optimization** - WebP conversion, responsive images
3. **Bundle Analysis** - Tree shaking, code splitting
4. **Database Indexing** - Optimize query performance
5. **Debouncing** - Search input optimization
6. **Pagination** - Large dataset handling

## Security Considerations

### Current Security
1. **Client-side Auth** - Email/password validation
2. **Role-based Access** - UI-level permission checks
3. **Data Validation** - TypeScript type safety

### Recommended Security Enhancements
1. **Backend API** - Server-side authentication
2. **JWT Tokens** - Secure session management
3. **Password Hashing** - bcrypt/argon2 for passwords
4. **CSRF Protection** - Token-based form protection
5. **XSS Prevention** - Input sanitization
6. **Rate Limiting** - API request throttling
7. **Audit Logging** - Track all admin actions
8. **Data Encryption** - Sensitive data at rest

## Testing Strategy

### Recommended Tests
1. **Unit Tests** - Component logic, utilities
2. **Integration Tests** - Data flow, auth flow
3. **E2E Tests** - Booking flow, dashboard interactions
4. **Performance Tests** - Load time, bundle size
5. **Accessibility Tests** - WCAG compliance

### Testing Tools
- **Jest** - Unit testing
- **React Testing Library** - Component testing
- **Cypress/Playwright** - E2E testing
- **Lighthouse** - Performance auditing

## Deployment

### Build Process
```bash
npm run build    # Vite production build
npm run preview  # Preview production build
```

### Environment Variables
- `DISABLE_HMR` - Disable hot module replacement
- Future: API endpoints, analytics keys

### Hosting Recommendations
- **Vercel/Netlify** - Static site hosting
- **Cloudflare** - CDN and DDoS protection
- **AWS S3** - Image storage
- **Supabase/Firebase** - Backend-as-a-service

## Future Roadmap

### Phase 1: Core Features (Current)
- ✅ Property listing and browsing
- ✅ Authentication system
- ✅ Cart and booking
- ✅ Service bundles
- ✅ Role-based dashboards

### Phase 2: Enhanced Features
- [ ] Payment gateway integration (Paystack/Flutterwave)
- [ ] Real-time chat between guests and hosts
- [ ] Review and rating system
- [ ] Email notifications
- [ ] Mobile app (React Native)

### Phase 3: Advanced Features
- [ ] AI-powered recommendations
- [ ] Dynamic pricing engine
- [ ] Multi-language support
- [ ] Currency conversion
- [ ] Loyalty program
- [ ] Affiliate system

### Phase 4: Scale & Optimize
- [ ] Backend API (Node.js/Express)
- [ ] Database migration (PostgreSQL)
- [ ] Microservices architecture
- [ ] CI/CD pipeline
- [ ] Monitoring and analytics

## Packages & Dependencies

### Production Dependencies
```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "motion": "^11.0.0",
  "lucide-react": "^0.454.0",
  "recharts": "^2.13.0",
  "@google/genai": "^0.21.0",
  "lottie-react": "^2.4.0"
}
```

### Development Dependencies
```json
{
  "typescript": "^5.8.0",
  "vite": "^6.0.0",
  "@vitejs/plugin-react": "^4.3.0",
  "tailwindcss": "^4.0.0",
  "@tailwindcss/vite": "^4.0.0"
}
```

## Contributing

### Code Style
- Use TypeScript for all new code
- Follow existing component patterns
- Use Tailwind utility classes
- Add JSDoc comments for complex functions
- Keep components under 200 lines

### Git Workflow
1. Create feature branch from `main`
2. Make changes and test locally
3. Run `npm run lint` before committing
4. Create pull request with description
5. Request review from team

## UI/UX Design System & User Flow

### Design Principles

1. **Luxury Minimalism** - Clean, spacious layouts with gold accents
2. **Progressive Disclosure** - Show essential info first, details on demand
3. **Micro-interactions** - Subtle animations for feedback and delight
4. **Accessibility** - WCAG 2.1 AA compliance with proper contrast and focus states
5. **Responsive First** - Mobile-optimized with progressive enhancement

### Color System

```css
/* Primary Palette */
--color-primary: #735C00;              /* Gold - Primary actions */
--color-primary-container: #D4AF37;    /* Light Gold - Highlights */
--color-on-primary: #FFFFFF;           /* White text on primary */

/* Surface Colors */
--color-parchment: #FAF9F8;            /* Background */
--color-surface: #FAF9F8;              /* Card surfaces */
--color-surface-container: #EEEEED;    /* Elevated surfaces */

/* Text Colors */
--color-charcoal: #1A1C1C;             /* Primary text */
--color-charcoal-light: #474746;       /* Secondary text */
--color-secondary: #5F5E5E;            /* Muted text */

/* Status Colors */
--color-success: #10B981;              /* Green - Active/Success */
--color-warning: #F59E0B;              /* Amber - Pending/Warning */
--color-error: #BA1A1A;                /* Red - Error/Critical */
```

### Typography Scale

```css
/* Display */
--text-display-lg: 64px;               /* Hero headlines */
--text-headline-lg: 48px;              /* Page titles */
--text-headline-md: 32px;              /* Section titles */
--text-headline-sm: 24px;              /* Card titles */

/* Body */
--text-body-lg: 18px;                  /* Emphasized body */
--text-body-md: 16px;                  /* Standard body */

/* Labels */
--text-label-caps: 12px;               /* Uppercase labels */
```

### Spacing System

```css
--spacing-unit: 8px;                   /* Base unit */
--spacing-stack-sm: 16px;              /* Small gaps */
--spacing-stack-md: 32px;              /* Medium gaps */
--spacing-stack-lg: 64px;              /* Large gaps */
--spacing-gutter: 32px;                /* Grid gutters */
--spacing-container-padding: 80px;     /* Page padding */
```

### Component Library

#### Reusable UI Components (`src/components/ui/`)

1. **CollapsibleSidebar**
   - Expandable/collapsible navigation
   - Icon indicators with animated transitions
   - Tooltip popups when collapsed
   - Active state indicator with spring animation
   - Role-specific navigation items

2. **Tooltip**
   - Position-aware (top, bottom, left, right)
   - Animated entrance/exit
   - Optional description text
   - Arrow indicator

3. **LoadingSpinner**
   - Three sizes (sm, md, lg)
   - Color variants (primary, secondary, white)
   - Optional text label
   - Full-screen overlay mode
   - Smooth rotation animation

4. **Button**
   - Primary, Secondary, Ghost variants
   - Loading state with spinner
   - Icon support (left/right)
   - Ripple effect on click
   - Disabled state styling

### Micro-interactions

#### Page Transitions
```typescript
// Fade + slide up on page change
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -8 }}
  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
>
```

#### Card Hover Effects
```typescript
// Subtle lift on hover
<motion.div
  whileHover={{ y: -4, boxShadow: '0 20px 50px rgba(0,0,0,0.08)' }}
  transition={{ duration: 0.2 }}
>
```

#### Button Press
```typescript
// Scale down on press
<button className="active:scale-95 transition-transform" />
```

#### Loading States
- Skeleton screens for content loading
- Spinner overlays for actions
- Progress bars for long operations
- Shimmer animations for placeholders

### User Flow by Role

#### Guest User (Unauthenticated)
```
Landing Page → Browse Properties → View Details → Add to Cart → 
Login/Register → Checkout → Booking Confirmation
```

**Key Features:**
- Property search with filters
- Image galleries with zoom
- AI-powered recommendations
- WhatsApp concierge integration
- Cart persistence across sessions

#### User Dashboard (Authenticated)
```
Login → Dashboard → My Bookings → Upcoming Trips → 
Experience Itinerary → Concierge Chat → Points Redemption
```

**Key Features:**
- Active trip overview with timeline
- AI concierge chat (Amara)
- Loyalty points wallet
- Quick action buttons
- Coordinator inbox

#### Service Provider Dashboard
```
Login → Dashboard → My Services → Add/Edit Service → 
Schedule Management → Booking Requests → Earnings → Payouts
```

**Key Features:**
- Service catalog management
- Calendar with drag-and-drop
- Booking request notifications
- Earnings tracking
- Staff orchestration
- Inventory management

#### Admin Dashboard
```
Login → Dashboard → Arrival Operations → Live Stream → 
Booking Requests → Property Management → Analytics
```

**Key Features:**
- Arrival Operations Center
- Live arrival stream with status
- Security logs timeline
- Booking confirmation/rejection
- Property moderation
- Revenue analytics

#### Super Admin Dashboard
```
Login → System Control → User Management → Credentials → 
Infrastructure Health → Critical Controls → Audit Logs
```

**Key Features:**
- User credential management (email/password display)
- Role-based access control
- System health monitoring
- Critical controls (lockout, cache flush, maintenance)
- Infrastructure metrics
- Audit trail

### Authentication Flow

1. **Login Process**
   - User enters email + password
   - Validate against DEMO_USERS or IndexedDB
   - Set currentUser in AuthContext
   - Cache in IndexedDB (24h TTL)
   - Redirect to role-specific dashboard

2. **Role-Based Routing**
   ```typescript
   user → 'user-dashboard'
   service_provider → 'service-dashboard'
   admin → 'admin-dashboard'
   super_admin → 'super-admin-dashboard'
   guest → 'home'
   ```

3. **Demo Credentials**
   
   Demo accounts are configured in `src/utils/credentials.ts`. For security reasons, passwords are not displayed in documentation. 
   
   **Demo Email Addresses:**
   - Guest User: `lukeokagha@gmail.com`
   - Service Provider: `chef@cozylagos.ng`
   - Admin: `contact@tricode.pro`
   - Super Admin: `luke.o@tricode.pro`
   - Visitor: `guest@cozylagos.ng`
   
   **Note:** Passwords are stored securely and never exposed in client-side code or documentation. Contact the system administrator for demo credentials.

### Responsive Breakpoints

```css
/* Mobile First */
sm: 640px;   /* Large phones */
md: 768px;   /* Tablets */
lg: 1024px;  /* Small laptops */
xl: 1280px;  /* Desktops */
2xl: 1536px; /* Large screens */
```

### Accessibility Features

1. **Keyboard Navigation**
   - All interactive elements focusable
   - Visible focus indicators
   - Tab order follows visual hierarchy
   - Escape closes modals/drawers

2. **Screen Reader Support**
   - Semantic HTML structure
   - ARIA labels on icon buttons
   - Live regions for dynamic content
   - Descriptive alt text for images

3. **Color Contrast**
   - WCAG AA compliance (4.5:1 ratio)
   - Never rely on color alone
   - High contrast mode support

4. **Motion Preferences**
   - Respect `prefers-reduced-motion`
   - Provide non-animated alternatives
   - No flashing content

### Performance Optimizations

1. **Code Splitting**
   - Route-based lazy loading
   - Dynamic imports for heavy components
   - Tree shaking unused code

2. **Image Optimization**
   - Lazy loading with `loading="lazy"`
   - Responsive images with `srcset`
   - WebP format with fallbacks
   - Blur-up placeholder technique

3. **Bundle Analysis**
   - Keep chunks under 500KB
   - Analyze with `rollup-plugin-visualizer`
   - Remove unused dependencies

4. **Caching Strategy**
   - IndexedDB for offline support
   - LocalStorage for cart persistence
   - TTL-based cache invalidation
   - Service Worker for assets (future)

## Support & Contact

- **Email**: contact@tricode.pro
- **Super Admin**: luke.o@tricode.pro
- **Repository**: https://github.com/lukewealth/cozylagos

---

**Last Updated**: June 23, 2026
**Version**: 1.0.0
**Status**: Production Ready
