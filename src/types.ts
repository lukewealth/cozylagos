/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'guest' | 'service_provider' | 'admin' | 'super_admin';

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  providerId: string;
  image: string;
  rating: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: "Penthouse" | "Luxury Villa" | "Executive Studio" | "Serviced Apartment" | "Premium Package";
  location: "Ikoyi" | "Victoria Island" | "Banana Island" | "Lekki Phase 1";
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  squareFootage?: number;
  nightlyRate: number;
  weekendPremium: number;
  cleaningFee: number;
  securityDeposit: number;
  image: string;
  images: string[];
  amenities: string[];
  packageDetails?: string[];
  keywords?: string[];
  ownerId: string;
  isActive: boolean;
  reviewsCount: number;
  rating: number;
  aiMatchPercent: number;
  createdAt: string;
  updatedAt: string;
  lat?: number;
  lng?: number;
}

export interface Booking {
  id: string;
  listingId: string;
  listingTitle: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  guestAvatar?: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  totalAmount: number;
  nightlyTotal?: number;
  serviceFee?: number;
  tax?: number;
  cleaningFee?: number;
  totalNights?: number;
  chefAdded?: boolean;
  photographerAdded?: boolean;
  jetskiAdded?: boolean;
  driverAdded?: boolean;
  services: string[];
  selectedServiceIds?: string[];
  providerId?: string;
  providerName?: string;
  providerAssignmentStatus?: 'unassigned' | 'assigned' | 'in_progress' | 'completed';
  paymentLedger?: PaymentLedgerEntry;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentLedgerEntry {
  id: string;
  bookingId: string;
  reference: string;
  guestName: string;
  guestEmail: string;
  date: string;
  lineItems: PaymentLineItem[];
  subtotal: number;
  serviceFee: number;
  tax: number;
  totalAmount: number;
  platformCut: number;
  providerCut: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'processed' | 'refunded' | 'disputed';
  cartItemCount: number;
  servicesCount: number;
  experiencesCount: number;
  createdAt: string;
}

export interface PaymentLineItem {
  id: string;
  description: string;
  category: 'accommodation' | 'service' | 'experience' | 'fee' | 'tax' | 'addon';
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Transaction {
  id: string;
  date: string;
  reference: string;
  type: "Payout" | "Booking Revenue" | "Refund" | "Redemption";
  amount: number;
  status: "Pending" | "Processed";
  description: string;
  userId: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "concierge" | "host";
  text: string;
  timestamp: string;
}

export interface CartItem {
  listing: Listing;
  guestsCount: number;
  checkIn: string;
  checkOut: string;
}

export interface BundleActivity {
  name: string;
  description: string;
  icon: string;
  duration: string;
  included: boolean;
}

export interface ServiceBundle {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  image: string;
  tiers: { duration: string; nights: number; price: number; components: { name: string; cost: number; notes: string }[] }[];
  activities: BundleActivity[];
  highlights: string[];
}

export type ArrivalStatus = 'en_route' | 'arriving' | 'checked_in' | 'awaiting_concierge' | 'departed';
export type GuestTier = 'vip' | 'platinum' | 'gold' | 'new';

export interface ArrivalRecord {
  id: string;
  guestName: string;
  guestInitials: string;
  guestTier: GuestTier;
  listingTitle: string;
  unitCode: string;
  status: ArrivalStatus;
  eta?: string;
  checkedInAt?: string;
  bookingId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityLogEntry {
  id: string;
  timestamp: string;
  type: 'access_granted' | 'service_pass' | 'auth_entry' | 'alert' | 'key_entry';
  title: string;
  description: string;
  propertyRef?: string;
  guestRef?: string;
}

export type StaffRole = 'butler' | 'concierge' | 'driver' | 'chef' | 'security' | 'housekeeping' | 'wellness' | 'photographer';
export type StaffStatus = 'on_duty' | 'available' | 'off_duty' | 'on_leave';

export interface StaffRecord {
  id: string;
  name: string;
  role: StaffRole;
  status: StaffStatus;
  avatar?: string;
  certifications: string[];
  specializations: string[];
  rating: number;
  phone?: string;
  email?: string;
  availabilityFrom?: string;
  currentAssignment?: string;
  tenureYears: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequest {
  id: string;
  title: string;
  category: string;
  location: string;
  scheduledTime: string;
  guestName?: string;
  skillsRequired: string[];
  priority: 'urgent' | 'high' | 'normal' | 'low';
  assignedStaffIds: string[];
  status: 'unassigned' | 'partially_assigned' | 'assigned' | 'in_progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface StaffScheduleEntry {
  id: string;
  staffId: string;
  staffName: string;
  role: StaffRole;
  date: string;
  startTime: string;
  endTime: string;
  shiftType: 'day' | 'night' | 'event' | 'off';
  assignmentTitle?: string;
  assignmentType?: 'arrival_pickup' | 'dinner_transfer' | 'escort' | 'catering' | 'maintenance' | 'general';
  hasConflict?: boolean;
  createdAt: string;
}

export interface TimeOffRequest {
  id: string;
  staffId: string;
  staffName: string;
  staffInitials: string;
  type: 'sick_leave' | 'annual_leave' | 'personal' | 'emergency';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  requestedAt: string;
  reviewedAt?: string;
}

export type AssetCategory = 'fleet' | 'culinary' | 'comms_security' | 'tech' | 'access';
export type AssetStatus = 'available' | 'in_use' | 'service_required' | 'maintenance' | 'decommissioned';

export interface AssetRecord {
  id: string;
  name: string;
  category: AssetCategory;
  status: AssetStatus;
  assetCode: string;
  image?: string;
  assignedTo?: string;
  lastServiceDate?: string;
  tags: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StaffAssetAssignment {
  id: string;
  staffId: string;
  staffName: string;
  staffAvatar?: string;
  assetId: string;
  assetCode: string;
  missionContext: string;
  checkoutTime: string;
  status: 'active' | 'on_site' | 'returned';
  createdAt: string;
}
