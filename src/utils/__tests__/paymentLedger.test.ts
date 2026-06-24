import { describe, it, expect } from 'vitest';
import { Booking, PaymentLedgerEntry, PaymentLineItem } from '../types';

describe('PaymentLedger Types', () => {
  it('should create a valid PaymentLedgerEntry', () => {
    const ledger: PaymentLedgerEntry = {
      id: 'ledger-1',
      bookingId: 'booking-1',
      reference: 'CL-TEST123',
      guestName: 'John Doe',
      guestEmail: 'john@example.com',
      date: new Date().toISOString(),
      lineItems: [
        {
          id: 'li-1',
          description: 'Stay: Test Property (3 nights)',
          category: 'accommodation',
          quantity: 3,
          unitPrice: 150000,
          total: 450000,
        },
        {
          id: 'li-2',
          description: 'Platform Service Fee (5%)',
          category: 'fee',
          quantity: 1,
          unitPrice: 22500,
          total: 22500,
        },
      ],
      subtotal: 450000,
      serviceFee: 22500,
      tax: 35438,
      totalAmount: 507938,
      platformCut: 76191,
      providerCut: 431747,
      paymentMethod: 'whatsapp_confirmation',
      paymentStatus: 'pending',
      cartItemCount: 1,
      servicesCount: 0,
      experiencesCount: 0,
      createdAt: new Date().toISOString(),
    };

    expect(ledger.id).toBe('ledger-1');
    expect(ledger.bookingId).toBe('booking-1');
    expect(ledger.reference).toBe('CL-TEST123');
    expect(ledger.lineItems).toHaveLength(2);
    expect(ledger.totalAmount).toBe(507938);
    expect(ledger.platformCut + ledger.providerCut).toBe(ledger.totalAmount);
    expect(ledger.paymentStatus).toBe('pending');
  });

  it('should calculate platform and provider cuts correctly', () => {
    const totalAmount = 1000000;
    const platformCut = Math.round(totalAmount * 0.15);
    const providerCut = totalAmount - platformCut;

    expect(platformCut).toBe(150000);
    expect(providerCut).toBe(850000);
    expect(platformCut + providerCut).toBe(totalAmount);
  });

  it('should create valid PaymentLineItem for accommodation', () => {
    const lineItem: PaymentLineItem = {
      id: 'li-accom-1',
      description: 'Stay: Bourdillon Penthouse (5 nights)',
      category: 'accommodation',
      quantity: 5,
      unitPrice: 450000,
      total: 2250000,
    };

    expect(lineItem.category).toBe('accommodation');
    expect(lineItem.quantity * lineItem.unitPrice).toBe(lineItem.total);
  });

  it('should create valid PaymentLineItem for service', () => {
    const lineItem: PaymentLineItem = {
      id: 'li-svc-1',
      description: 'VIP Chauffeur',
      category: 'addon',
      quantity: 3,
      unitPrice: 180000,
      total: 540000,
    };

    expect(lineItem.category).toBe('addon');
    expect(lineItem.total).toBe(540000);
  });

  it('should handle multiple line items in ledger', () => {
    const lineItems: PaymentLineItem[] = [
      { id: '1', description: 'Accommodation', category: 'accommodation', quantity: 1, unitPrice: 500000, total: 500000 },
      { id: '2', description: 'Chef Service', category: 'addon', quantity: 1, unitPrice: 150000, total: 150000 },
      { id: '3', description: 'Service Fee', category: 'fee', quantity: 1, unitPrice: 32500, total: 32500 },
      { id: '4', description: 'VAT', category: 'tax', quantity: 1, unitPrice: 51188, total: 51188 },
    ];

    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    expect(subtotal).toBe(733688);
    expect(lineItems).toHaveLength(4);
  });
});

describe('Booking with Payment Ledger', () => {
  it('should create booking with payment ledger', () => {
    const booking: Booking = {
      id: 'booking-1',
      listingId: 'listing-1',
      listingTitle: 'Test Property',
      guestId: 'guest-1',
      guestName: 'John Doe',
      guestEmail: 'john@example.com',
      checkIn: '2026-07-01',
      checkOut: '2026-07-05',
      guestsCount: 2,
      status: 'Pending',
      totalAmount: 500000,
      services: ['VIP Chauffeur', 'Private Chef'],
      selectedServiceIds: ['svc-1', 'svc-2'],
      providerAssignmentStatus: 'unassigned',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(booking.status).toBe('Pending');
    expect(booking.services).toHaveLength(2);
    expect(booking.providerAssignmentStatus).toBe('unassigned');
  });

  it('should track provider assignment status', () => {
    const booking: Booking = {
      id: 'booking-1',
      listingId: 'listing-1',
      listingTitle: 'Test Property',
      guestId: 'guest-1',
      guestName: 'John Doe',
      guestEmail: 'john@example.com',
      checkIn: '2026-07-01',
      checkOut: '2026-07-05',
      guestsCount: 2,
      status: 'Confirmed',
      totalAmount: 500000,
      services: [],
      providerId: 'provider-1',
      providerName: 'Elite Services Ltd',
      providerAssignmentStatus: 'assigned',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(booking.providerAssignmentStatus).toBe('assigned');
    expect(booking.providerId).toBe('provider-1');
    expect(booking.providerName).toBe('Elite Services Ltd');
  });

  it('should support booking status transitions', () => {
    const statuses: Booking['status'][] = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    expect(statuses).toContain('Pending');
    expect(statuses).toContain('Confirmed');
    expect(statuses).toContain('Completed');
    expect(statuses).toContain('Cancelled');
  });

  it('should support provider assignment status transitions', () => {
    const assignmentStatuses: Booking['providerAssignmentStatus'][] = [
      'unassigned',
      'assigned',
      'in_progress',
      'completed',
    ];
    expect(assignmentStatuses).toHaveLength(4);
    expect(assignmentStatuses).toContain('unassigned');
    expect(assignmentStatuses).toContain('assigned');
  });
});
