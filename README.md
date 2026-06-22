# Cozy Lagos

**Cozy Lagos** is a premium, luxury lifestyle enclave management platform designed for high-end property hosts, service providers, and elite travelers in Lagos, Nigeria. It offers a seamless, secure, and highly personalized experience through AI-driven concierge services, real-time local database synchronization, and a multi-portal management ecosystem.

## 🚀 Features

### 🌍 For Guests (Travelers)
- **Luxury Discovery**: Browse exclusive penthouses, villas, and executive studios in Ikoyi, Victoria Island, and Banana Island.
- **AI Concierge (Amara AI)**: 24/7 intelligent assistance for booking private chefs, luxury chauffeurs, yacht charters, and more.
- **Personalized Itinerary**: Real-time updates on check-ins, amenities, and curated local experiences.
- **Cozy Reserve**: A loyalty program where guests earn points for every stay and service, redeemable for premium perks.

### 🏠 For Owners (Property Hosts)
- **Listing Management**: Comprehensive wizard for onboarding luxury properties with high-fidelity media.
- **Performance Analytics**: Real-time dashboard tracking occupancy, revenue, and guest feedback.
- **Payout Ledger**: Secure, transparent tracking of booking revenues and automated payouts.
- **Availability Control**: Instant management of property status and calendar synchronization.

### 🛠️ For Service Providers (Vendors)
- **Service Catalog**: Dedicated portal to manage offerings (Chef, Driver, Photographer, etc.).
- **Booking Management**: Real-time request handling and schedule management.
- **Earnings Tracker**: Transparent ledger for all completed service transactions.

### 🛡️ For Admin & Super Admins
- **User Moderation**: Full control over user roles, verification status, and platform safety.
- **System Audit**: Comprehensive logging of all transactions and administrative actions.
- **Infrastructure Monitoring**: Real-time health checks of database, payment gateways, and AI engines.
- **Emergency Controls**: Global platform lockout and maintenance mode capabilities.

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) (Mobile-first, responsive design)
- **Animations**: [Motion](https://www.framer.com/motion/) (Framer Motion)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database & Persistence**: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) with custom reactive hooks for offline-first capability.
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: Custom reactive `useDatabase` hook leveraging IndexedDB events.

## 🏗️ Architecture

The application uses an **Offline-First, Reactive Architecture**:
1. **Data Layer**: All data is stored locally in `IndexedDB` for instant access and offline capability.
2. **Synchronization Layer**: An automatic synchronization mechanism ensures local data can be reconciled with a remote server (planned).
3. **Reactivity Layer**: A custom event-driven system notifies UI components whenever the underlying database changes, ensuring zero-latency updates across the dashboard.

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/lukewealth/cozylagos.git
   cd cozylagos
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 📜 License

Copyright © 2026 Cozy Lagos Ltd. All rights reserved.
