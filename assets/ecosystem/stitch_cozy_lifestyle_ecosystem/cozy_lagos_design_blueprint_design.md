# Design Blueprint: Cozy Lagos Lifestyle Ecosystem

## 1. Project Overview
Cozy Lagos is a high-fidelity "Lifestyle Commerce Ecosystem" targeting elite travelers and residents in Lagos, Nigeria. The platform integrates luxury apartment rentals, bespoke experiences (yachting, private dining), and professional services (private chefs, wellness) under a unified, AI-driven concierge layer.

## 2. Visual Identity & Design System
**Design System ID:** `{{DATA:DESIGN_SYSTEM:DESIGN_SYSTEM_1}}`
*   **Theme Name:** Luxury Lagos Lifestyle
*   **Typography:** Playfair Display (Headings), Montserrat/Inter (Body)
*   **Color Palette:**
    *   Primary: `#d4af37` (Luxury Gold)
    *   Surface: `#faf9f8` (Off-White/Parchment)
    *   On-Surface: `#1a1a1a` (Deep Charcoal)
*   **Visual Language:** High-impact photography, generous whitespace, gold accents, and a sophisticated light-mode interface.

## 3. Core Ecosystem Flows

### A. Guest Experience (Traveler)
1.  **Home / Discovery**: `{{DATA:SCREEN:SCREEN_31}}`
2.  **Apartment Exploration**: `{{DATA:SCREEN:SCREEN_36}}`
3.  **Experience Details**: `{{DATA:SCREEN:SCREEN_39}}`
4.  **Guest Dashboard**: `{{DATA:SCREEN:SCREEN_37}}`

### B. Elite AI Concierge (Interaction Layer)
1.  **Central Hub**: `{{DATA:SCREEN:SCREEN_3}}`
2.  **Proactive Itinerary**: `{{DATA:SCREEN:SCREEN_14}}`
3.  **Smart Recommendations**: `{{DATA:SCREEN:SCREEN_34}}`
4.  **Service Booking via AI**: `{{DATA:SCREEN:SCREEN_46}}`

### C. Owner Dashboard (Host)
1.  **Financial Overview**: `{{DATA:SCREEN:SCREEN_28}}`
2.  **Earnings & Payouts**: `{{DATA:SCREEN:SCREEN_5}}`
3.  **Booking Calendar**: `{{DATA:SCREEN:SCREEN_7}}`
4.  **Listing Management**: `{{DATA:SCREEN:SCREEN_12}}`

### D. Property Onboarding (Wizard Flow)
1.  **Step 1: Basic Details**: `{{DATA:SCREEN:SCREEN_13}}`
2.  **Step 2: Media Uploads**: `{{DATA:SCREEN:SCREEN_2}}`
3.  **Step 3: Pricing & Amenities**: `{{DATA:SCREEN:SCREEN_27}}` / `{{DATA:SCREEN:SCREEN_38}}`
4.  **Step 4: Review & Publish**: `{{DATA:SCREEN:SCREEN_35}}` / `{{DATA:SCREEN:SCREEN_43}}`

### E. Service Provider Onboarding
1.  **Step 1: Professional Identity**: `{{DATA:SCREEN:SCREEN_29}}`
2.  **Step 2: Service Catalog**: `{{DATA:SCREEN:SCREEN_10}}`
3.  **Step 3: Verification**: `{{DATA:SCREEN:SCREEN_40}}`
4.  **Step 4: Final Review**: `{{DATA:SCREEN:SCREEN_42}}`

### F. Experience Vendor Onboarding
1.  **Step 1: Establish Presence**: `{{DATA:SCREEN:SCREEN_44}}`
2.  **Step 2: Craft Experience**: `{{DATA:SCREEN:SCREEN_32}}`
3.  **Step 3: Curate Visuals**: `{{DATA:SCREEN:SCREEN_8}}`
4.  **Step 4: Review & Submit**: `{{DATA:SCREEN:SCREEN_33}}`

## 4. UI/UX Standards & Best Practices
*   **Navigation Hierarchy**: Standardized SideNavBar for management portals and TopNavBar for consumer-facing exploration.
*   **Progressive Disclosure**: Multi-step wizards (Onboarding) use persistent sidebars to show progress and reduce cognitive load.
*   **Contextual AI**: The AI Concierge is integrated as a conversational layer that can inject rich-media components (cards, lists) into the chat flow.
*   **Mobile Responsiveness**: All screens are designed for 1440px desktop width but must utilize a fluid grid system for mobile adaptation.

## 5. Implementation Roadmap for Agents
1.  **Phase 1: Backend Setup** - Database schema for Listings, Services, and Journeys.
2.  **Phase 2: Authentication** - Unified login for Guests, Hosts, and Vendors.
3.  **Phase 3: Transaction Engine** - Integration of payouts (`SCREEN_5`) and booking logic.
4.  **Phase 4: AI Integration** - Training LLM on Lagos neighborhood data and vendor catalogs for Concierge Hub (`SCREEN_3`).
5.  **Phase 5: Refinement** - Multi-device testing and performance optimization for high-res imagery.
