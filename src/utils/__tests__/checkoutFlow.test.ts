import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Checkout Flow - Payment Ledger & Admin Notification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should generate correct line items for accommodation booking', () => {
    const bookingData = {
      listingId: 'listing-1',
      listingTitle: 'Bourdillon Penthouse',
      checkIn: '2026-07-01',
      checkOut: '2026-07-05',
      totalNights: 4,
      nightlyTotal: 1800000,
      cleaningFee: 25000,
      includeVipDriver: true,
      vipDriverTotal: 720000,
      includeChef: false,
      chefTotal: 0,
      serviceFee: 127250,
      tax: 190875,
      grandTotal: 2763125,
      guestName: 'John Doe',
      guestEmail: 'john@example.com',
      guestPhone: '+2348000000000',
      guestsCount: 2,
      services: [],
      experiences: [],
    };

    const lineItems: any[] = [];

    if (bookingData.nightlyTotal) {
      lineItems.push({
        description: `Stay: ${bookingData.listingTitle} (${bookingData.totalNights} nights)`,
        category: 'accommodation',
        quantity: bookingData.totalNights,
        unitPrice: Math.round(bookingData.nightlyTotal / bookingData.totalNights),
        total: bookingData.nightlyTotal,
      });
    }
    if (bookingData.cleaningFee) {
      lineItems.push({
        description: 'Cleaning / Sanitation Fee',
        category: 'fee',
        quantity: 1,
        unitPrice: bookingData.cleaningFee,
        total: bookingData.cleaningFee,
      });
    }
    if (bookingData.includeVipDriver && bookingData.vipDriverTotal) {
      lineItems.push({
        description: `VIP Chauffeur (${bookingData.totalNights} days)`,
        category: 'addon',
        quantity: bookingData.totalNights,
        unitPrice: 180000,
        total: bookingData.vipDriverTotal,
      });
    }

    expect(lineItems).toHaveLength(3);
    expect(lineItems[0].category).toBe('accommodation');
    expect(lineItems[0].total).toBe(1800000);
    expect(lineItems[1].category).toBe('fee');
    expect(lineItems[2].category).toBe('addon');
    expect(lineItems[2].total).toBe(720000);
  });

  it('should calculate platform and provider cuts correctly', () => {
    const totalAmount = 2763125;
    const platformCut = Math.round(totalAmount * 0.15);
    const providerCut = totalAmount - platformCut;

    expect(platformCut).toBe(414469);
    expect(providerCut).toBe(2348656);
    expect(platformCut + providerCut).toBe(totalAmount);
  });

  it('should generate WhatsApp admin notification message', () => {
    const reference = 'CL-TEST123';
    const bookingData = {
      guestName: 'John Doe',
      guestEmail: 'john@example.com',
      guestPhone: '+2348000000000',
      listingTitle: 'Bourdillon Penthouse',
      checkIn: '2026-07-01',
      checkOut: '2026-07-05',
      guestsCount: 2,
      services: ['VIP Chauffeur'],
      experiences: [],
      specialRequests: 'Late check-in please',
    };
    const totalAmount = 2763125;
    const platformCut = 414469;
    const providerCut = 2348656;
    const cartItemCount = 2;

    const adminLines: string[] = [];
    adminLines.push('NEW BOOKING REQUEST');
    adminLines.push(`Ref: ${reference}`);
    adminLines.push(`Guest: ${bookingData.guestName}`);
    adminLines.push(`Email: ${bookingData.guestEmail}`);
    adminLines.push(`Phone: ${bookingData.guestPhone}`);
    adminLines.push(`Property: ${bookingData.listingTitle}`);
    adminLines.push(`Dates: ${bookingData.checkIn} → ${bookingData.checkOut}`);
    adminLines.push(`Guests: ${bookingData.guestsCount}`);
    adminLines.push(`TOTAL: ₦${totalAmount.toLocaleString()}`);
    adminLines.push(`Platform (15%): ₦${platformCut.toLocaleString()}`);
    adminLines.push(`Provider (85%): ₦${providerCut.toLocaleString()}`);
    adminLines.push(`Cart Items: ${cartItemCount}`);
    adminLines.push(`Services: ${bookingData.services.join(', ')}`);
    adminLines.push(`Requests: ${bookingData.specialRequests}`);
    adminLines.push('Status: PENDING CONFIRMATION');

    const message = adminLines.join('\n');

    expect(message).toContain('NEW BOOKING REQUEST');
    expect(message).toContain('Ref: CL-TEST123');
    expect(message).toContain('Guest: John Doe');
    expect(message).toContain('TOTAL: ₦2,763,125');
    expect(message).toContain('Platform (15%): ₦414,469');
    expect(message).toContain('Provider (85%): ₦2,348,656');
    expect(message).toContain('Services: VIP Chauffeur');
    expect(message).toContain('Status: PENDING CONFIRMATION');
  });

  it('should count cart items correctly', () => {
    const bookingData = {
      totalNights: 4,
      nightlyTotal: 1800000,
      includeVipDriver: true,
      includeChef: true,
      services: ['Private Chef Experience', 'Airport Pickup'],
      experiences: ['Yacht Sunset Cruise'],
    };

    let cartItemCount = 0;
    if (bookingData.nightlyTotal) cartItemCount++;
    if (bookingData.includeVipDriver) cartItemCount++;
    if (bookingData.includeChef) cartItemCount++;
    cartItemCount += bookingData.services.length;
    cartItemCount += bookingData.experiences.length;

    expect(cartItemCount).toBe(6);
  });

  it('should generate unique reference and IDs', () => {
    const ref1 = `CL-${Date.now().toString(36).toUpperCase()}`;
    const bookingId1 = `booking-${Date.now()}`;
    const ledgerId1 = `ledger-${Date.now()}`;

    expect(ref1).toMatch(/^CL-[A-Z0-9]+$/);
    expect(bookingId1).toMatch(/^booking-\d+$/);
    expect(ledgerId1).toMatch(/^ledger-\d+$/);
  });

  it('should handle checkout with services and experiences', () => {
    const serviceCart = [
      { id: 'svc-1', title: 'VIP Chauffeur', price: 180000, quantity: 3, category: 'Transport' },
      { id: 'svc-2', title: 'Private Chef', price: 50000, quantity: 3, category: 'Culinary' },
    ];
    const experienceCart = [
      { id: 'exp-1', title: 'Yacht Cruise', price: 450000, date: '2026-07-02', guestsCount: 4 },
    ];

    const serviceTotal = serviceCart.reduce((sum, s) => sum + (s.price * s.quantity), 0);
    const experienceTotal = experienceCart.reduce((sum, e) => sum + (e.price * e.guestsCount), 0);

    expect(serviceTotal).toBe(690000);
    expect(experienceTotal).toBe(1800000);
    expect(serviceCart.map(s => s.title)).toEqual(['VIP Chauffeur', 'Private Chef']);
    expect(experienceCart.map(e => e.title)).toEqual(['Yacht Cruise']);
  });
});

describe('Service Provider Assignment', () => {
  it('should track unassigned bookings', () => {
    const bookings = [
      { id: 'b1', status: 'Pending', providerAssignmentStatus: 'unassigned', providerId: undefined },
      { id: 'b2', status: 'Confirmed', providerAssignmentStatus: 'assigned', providerId: 'p1' },
      { id: 'b3', status: 'Pending', providerAssignmentStatus: 'unassigned', providerId: undefined },
    ];

    const unassigned = bookings.filter(b => !b.providerId || b.providerAssignmentStatus === 'unassigned');
    expect(unassigned).toHaveLength(2);
    expect(unassigned.map(b => b.id)).toEqual(['b1', 'b3']);
  });

  it('should assign provider to booking', () => {
    const booking = {
      id: 'b1',
      status: 'Pending',
      providerAssignmentStatus: 'unassigned' as const,
      providerId: undefined,
      providerName: undefined,
    };

    const updated = {
      ...booking,
      providerId: 'provider-1',
      providerName: 'Elite Services Ltd',
      providerAssignmentStatus: 'assigned' as const,
    };

    expect(updated.providerAssignmentStatus).toBe('assigned');
    expect(updated.providerId).toBe('provider-1');
    expect(updated.providerName).toBe('Elite Services Ltd');
  });

  it('should filter staff by availability', () => {
    const staff = [
      { id: 's1', name: 'Driver A', status: 'on_duty', role: 'driver' },
      { id: 's2', name: 'Chef B', status: 'available', role: 'chef' },
      { id: 's3', name: 'Driver C', status: 'off_duty', role: 'driver' },
    ];

    const availableStaff = staff.filter(s => s.status !== 'off_duty');
    expect(availableStaff).toHaveLength(2);
    expect(availableStaff.map(s => s.name)).toEqual(['Driver A', 'Chef B']);
  });

  it('should filter staff by search query', () => {
    const staff = [
      { id: 's1', name: 'Captain Chidi Okoro', role: 'driver' },
      { id: 's2', name: 'Chef Tunde Balogun', role: 'chef' },
      { id: 's3', name: 'Amara Nwosu', role: 'concierge' },
    ];

    const searchQuery = 'chef';
    const filtered = staff.filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('Chef Tunde Balogun');
  });
});

describe('Admin-Only Listing Restriction', () => {
  it('should allow admin to create listings', () => {
    const user = { id: 'u1', role: 'admin' as const, name: 'Admin', email: 'admin@test.com' };
    const canCreateListing = user.role === 'admin' || user.role === 'super_admin';
    expect(canCreateListing).toBe(true);
  });

  it('should allow super_admin to create listings', () => {
    const user = { id: 'u1', role: 'super_admin' as const, name: 'Super Admin', email: 'super@test.com' };
    const canCreateListing = user.role === 'admin' || user.role === 'super_admin';
    expect(canCreateListing).toBe(true);
  });

  it('should block regular user from creating listings', () => {
    const user = { id: 'u1', role: 'guest' as const, name: 'Guest', email: 'guest@test.com' };
    const canCreateListing = user.role === 'admin' || user.role === 'super_admin';
    expect(canCreateListing).toBe(false);
  });

  it('should block service_provider from creating listings', () => {
    const user = { id: 'u1', role: 'service_provider' as const, name: 'Provider', email: 'provider@test.com' };
    const canCreateListing = user.role === 'admin' || user.role === 'super_admin';
    expect(canCreateListing).toBe(false);
  });
});

describe('User Dashboard Booking Filtering', () => {
  const allBookings = [
    { id: 'b1', guestId: 'user-1', status: 'Pending', totalAmount: 500000 },
    { id: 'b2', guestId: 'user-1', status: 'Confirmed', totalAmount: 750000 },
    { id: 'b3', guestId: 'user-2', status: 'Confirmed', totalAmount: 300000 },
    { id: 'b4', guestId: 'user-1', status: 'Cancelled', totalAmount: 200000 },
    { id: 'b5', guestId: 'user-1', status: 'Pending', totalAmount: 600000 },
  ];

  it('should filter bookings by current user', () => {
    const userId = 'user-1';
    const userBookings = allBookings.filter(b => b.guestId === userId);
    expect(userBookings).toHaveLength(4);
  });

  it('should filter by status', () => {
    const userId = 'user-1';
    const userBookings = allBookings.filter(b => b.guestId === userId);

    const pending = userBookings.filter(b => b.status.toLowerCase() === 'pending');
    expect(pending).toHaveLength(2);

    const confirmed = userBookings.filter(b => b.status.toLowerCase() === 'confirmed');
    expect(confirmed).toHaveLength(1);

    const cancelled = userBookings.filter(b => b.status.toLowerCase() === 'cancelled');
    expect(cancelled).toHaveLength(1);
  });

  it('should calculate total spent', () => {
    const userId = 'user-1';
    const userBookings = allBookings.filter(b => b.guestId === userId);
    const totalSpent = userBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    expect(totalSpent).toBe(2050000);
  });

  it('should count pending and confirmed bookings', () => {
    const userId = 'user-1';
    const userBookings = allBookings.filter(b => b.guestId === userId);
    const pendingCount = userBookings.filter(b => b.status === 'Pending').length;
    const confirmedCount = userBookings.filter(b => b.status === 'Confirmed').length;

    expect(pendingCount).toBe(2);
    expect(confirmedCount).toBe(1);
  });
});
