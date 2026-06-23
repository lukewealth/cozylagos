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
  weekendPremium: number; // percentage, e.g. 15
  cleaningFee: number;
  securityDeposit: number;
  image: string;
  images: string[];
  amenities: string[];
  packageDetails?: string[];
  ownerId: string;
  isActive: boolean;
  reviewsCount: number;
  rating: number;
  aiMatchPercent: number;
  createdAt: string;
  updatedAt: string;

}

export interface Booking {
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
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  totalAmount: number;
  chefAdded?: boolean;
  photographerAdded?: boolean;
  jetskiAdded?: boolean;
  services: string[];
  createdAt: string;
  updatedAt: string;
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
