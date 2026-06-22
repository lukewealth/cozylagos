import React, { useState, useMemo } from 'react';
import { ArrowLeft, Star, Bed, Bath, Users, ShieldCheck, Heart, Share2, ClipboardCheck, AlertCircle, Sparkles } from 'lucide-react';
import { Listing } from '../types';

interface ListingDetailViewProps {
  listing: Listing;
  onBack: () => void;
  onConfirmBooking: (bookingData: {
    listingId: string;
    listingTitle: string;
    checkIn: string;
    checkOut: string;
    totalAmount: number;
    guestName: string;
    guestEmail: string;
  }) => void;
}

export default function ListingDetailView({ listing, onBack, onConfirmBooking }: ListingDetailViewProps) {
  const [checkIn, setCheckIn] = useState<string>('2026-10-12');
  const [checkOut, setCheckOut] = useState<string>('2026-10-18');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [includeVipDriver, setIncludeVipDriver] = useState<boolean>(false);
  const [includeChef, setIncludeChef] = useState<boolean>(false);

  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  // Calculate nights length
  const totalNights = useMemo(() => {
    try {
      const d1 = new Date(checkIn);
      const d2 = new Date(checkOut);
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return isNaN(nights) ? 1 : nights;
    } catch {
      return 1;
    }
  }, [checkIn, checkOut]);

  // Billing calculation details
  const nightlyTotal = useMemo(() => {
    return listing.nightlyRate * totalNights;
  }, [listing.nightlyRate, totalNights]);

  const vipDriverTotal = useMemo(() => {
    return includeVipDriver ? 180000 * totalNights : 0; // ₦180k daily driver retainment
  }, [includeVipDriver, totalNights]);

  const chefTotal = useMemo(() => {
    return includeChef ? 50000 * totalNights : 0; // ₦50k chef daily fee
  }, [includeChef, totalNights]);

  const grossTotal = useMemo(() => {
    return nightlyTotal + vipDriverTotal + chefTotal + listing.cleaningFee;
  }, [nightlyTotal, vipDriverTotal, chefTotal, listing.cleaningFee]);

  const calculatedTax = useMemo(() => {
    return Math.round(grossTotal * 0.075); // 7.5% Nigerian VAT
  }, [grossTotal]);

  const totalBilling = useMemo(() => {
    return grossTotal + calculatedTax;
  }, [grossTotal, calculatedTax]);

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmBooking({
      listingId: listing.id,
      listingTitle: listing.title,
      checkIn,
      checkOut,
      totalAmount: totalBilling,
      guestName: 'Alexander',
      guestEmail: 'alex.traveler@elite.com'
    });
    setBookingSuccess(true);
  };

  return (
    <div className="flex-grow bg-parchment animate-fade-in-up text-left">
      
      {/* 1. PHOTO COVER LAYOUT */}
      <section className="relative w-full h-[45vh] md:h-[55vh] flex items-end bg-charcoal select-none">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-85"
          style={{ backgroundImage: `url(${listing.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent"></div>
        </div>

        {/* Back control */}
        <div className="absolute top-6 left-6 md:left-12 z-20">
          <button
            onClick={onBack}
            className="flex items-center gap-2.5 px-5 py-3 bg-parchment/95 backdrop-blur-md rounded-full border border-charcoal/10 hover:bg-charcoal hover:text-parchment font-bold text-[10px] tracking-widest uppercase transition-colors shadow-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Residences List</span>
          </button>
        </div>

        {/* Top actions */}
        <div className="absolute top-6 right-6 md:right-12 z-20 flex gap-3">
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className="w-11 h-11 bg-parchment/95 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-charcoal hover:text-red-600 transition-colors"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current text-red-600' : ''}`} />
          </button>
          
          <button
            className="w-11 h-11 bg-parchment/95 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-charcoal hover:text-gold-dark transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Floating title layout */}
        <div className="relative z-10 w-full max-w-[1440px] px-6 md:px-12 xl:px-20 mx-auto pb-10">
          <div className="max-w-3xl text-white space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-gold/25 border border-gold/40 text-gold-light font-bold text-[9px] tracking-widest uppercase px-3 py-1 rounded-full backdrop-blur-sm">
                {listing.location} Peninsula
              </span>
              <span className="flex items-center gap-1 font-bold text-xs text-gold-light">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{listing.rating} ({listing.reviewsCount} reviews)</span>
              </span>
            </div>

            <h1 className="font-serif text-3.5xl md:text-5xl font-extrabold uppercase tracking-tight">
              {listing.title}
            </h1>
          </div>
        </div>
      </section>

      {/* 2. BODY SPECS & PRICE COLUMN GRID */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: RESIDENCE DETAILS (8/12th) */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Quick Specs Bento */}
          <div className="grid grid-cols-3 gap-4 border-b border-charcoal/5 pb-8 text-charcoal font-semibold text-center uppercase">
            <div className="p-4 bg-white border border-charcoal/5 rounded-2xl flex flex-col justify-center items-center gap-1">
              <Bed className="w-5 h-5 text-gold-dark" />
              <span className="text-[9px] text-charcoal/40 font-bold tracking-widest block">SUITE ROOMS</span>
              <span className="text-sm font-bold text-charcoal">{listing.bedrooms} Beds</span>
            </div>

            <div className="p-4 bg-white border border-charcoal/5 rounded-2xl flex flex-col justify-center items-center gap-1">
              <Bath className="w-5 h-5 text-gold-dark" />
              <span className="text-[9px] text-charcoal/40 font-bold tracking-widest block">BATHROOM UNITS</span>
              <span className="text-sm font-bold text-charcoal">{listing.bathrooms} Baths</span>
            </div>

            <div className="p-4 bg-white border border-charcoal/5 rounded-2xl flex flex-col justify-center items-center gap-1">
              <Users className="w-5 h-5 text-gold-dark" />
              <span className="text-[9px] text-charcoal/40 font-bold tracking-widest block">MAX OCCUPANCY</span>
              <span className="text-sm font-bold text-charcoal">Up to {listing.maxGuests} Guests</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-charcoal">About this sky residence</h3>
            <p className="text-sm md:text-base text-charcoal-light leading-relaxed font-light">
              {listing.description}
            </p>
          </div>

          {/* Insulation guarantees */}
          <div className="bg-white border border-charcoal/5 p-6 rounded-2.5xl space-y-4">
            <div className="flex items-center gap-2 text-gold-dark">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider">Lagos Power &amp; Security Shield</h4>
            </div>

            <p className="text-xs text-charcoal-light leading-relaxed font-medium">
              Your tranquility is insulated by redundant infrastructure. Equipped with 24/7 automated Cummins silent backup power generation, smart high-capacity solar inverter stacks, Starlink fiber internet, and highly vetted on-site estate gated guards.
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="space-y-6">
            <h3 className="font-serif text-xl font-bold text-charcoal">Residence Amenities</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {listing.amenities.map((am, idx) => (
                <div 
                  key={idx}
                  className="p-4 bg-white/60 border border-charcoal/5 rounded-2xl flex items-center gap-3 text-xs font-semibold text-charcoal-light"
                >
                  <span className="w-2 h-2 rounded-full bg-gold" />
                  <span>{am}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review spotlight */}
          <div className="space-y-6 pt-4 border-t border-charcoal/5">
            <h3 className="font-serif text-xl font-bold text-charcoal">Travelers Feedback</h3>
            
            <div className="p-6 bg-white/70 border border-charcoal/5 rounded-3xl relative text-left">
              <span className="absolute top-6 right-6 text-gold-dark text-lg font-bold">★★★★★</span>
              <p className="font-serif italic text-charcoal/80 text-sm leading-relaxed">
                "An incredible sanctuary. Perfect solar inverter back-up system meant we never noticed grid transitions. The in-house chef prepared standard-setting grilled ocean snappers."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-charcoal/5 flex items-center justify-center text-xs font-bold text-charcoal">
                  M
                </div>
                <div>
                  <span className="block text-xs font-bold text-charcoal">Marcus Thompson</span>
                  <span className="text-[10px] text-charcoal-light/60 block">London, UK</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: BOOKING ESTIMATOR (4/12th) */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-charcoal/5 p-8 rounded-3xl sticky top-28 shadow-xl text-left">
            
            <div className="border-b border-charcoal/5 pb-4 mb-6">
              <span className="text-[10px] uppercase font-bold text-charcoal/40 block">Guaranteed Rate</span>
              <div className="flex items-baseline">
                <span className="font-serif font-bold text-3xl text-gold-dark">
                  ₦{listing.nightlyRate.toLocaleString()}
                </span>
                <span className="text-xs text-charcoal-light ml-1">/ Night</span>
              </div>
            </div>

            {bookingSuccess ? (
              <div className="space-y-6 py-6 text-center animate-fade-in-up">
                <div className="w-14 h-14 bg-gold/15 rounded-full flex items-center justify-center mx-auto text-gold-dark">
                  <ClipboardCheck className="w-7 h-7" />
                </div>
                
                <div className="space-y-1.5">
                  <h4 className="font-serif text-xl font-bold text-charcoal">Booking Completed!</h4>
                  <p className="text-xs text-charcoal-light leading-relaxed">
                    Success! Your dates from <strong className="text-charcoal">{checkIn}</strong> to <strong className="text-charcoal">{checkOut}</strong> have been locked securely. Your host, Sarah, has been pinged.
                  </p>
                </div>

                <div className="p-3 bg-gold/10 border border-gold/15 text-[10px] uppercase tracking-wider font-bold text-gold-dark rounded-xl">
                  Points Earned: +{Math.round(totalBilling / 1000)} pts
                </div>

                <button
                  type="button"
                  onClick={() => setBookingSuccess(false)}
                  className="w-full py-3.5 bg-charcoal hover:bg-gold-dark text-parchment font-bold text-xs tracking-wider uppercase rounded-xl transition-all"
                >
                  Book New Slot
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateBooking} className="space-y-5">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-bold text-charcoal-light/60 uppercase tracking-widest">Check-in</label>
                    <input 
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-charcoal/15 pb-1 text-xs font-semibold focus:ring-0 focus:border-gold outline-none"
                    />
                  </div>
                  <div className="space-y-1.5 flex flex-col justify-end">
                    <label className="block text-[9px] font-bold text-charcoal-light/60 uppercase tracking-widest">Check-out</label>
                    <input 
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-charcoal/15 pb-1 text-xs font-semibold focus:ring-0 focus:border-gold outline-none animate"
                    />
                  </div>
                </div>

                {/* Guest size slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-charcoal-light font-bold">
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-charcoal-light/60">GUESTS SIZE</span>
                    <span>{guestCount} Travelers</span>
                  </div>
                  <input 
                    type="range"
                    min={1}
                    max={listing.maxGuests}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full accent-gold-dark"
                  />
                </div>

                {/* VIP ADD ONS */}
                <div className="pt-4 border-t border-charcoal/5 space-y-3">
                  <span className="block text-[9px] font-bold text-charcoal-light/60 uppercase tracking-widest">VIP ARRIVAL PERKS</span>
                  
                  <label className="flex items-center justify-between p-2.5 border border-charcoal/5 rounded-xl cursor-pointer hover:bg-parchment/60 transition-colors select-none text-xs">
                    <div className="flex items-center gap-2.5">
                      <input 
                        type="checkbox"
                        checked={includeVipDriver}
                        onChange={() => setIncludeVipDriver(!includeVipDriver)}
                        className="rounded text-gold focus:ring-0 focus:ring-offset-0 border-charcoal/10 w-4 h-4 cursor-pointer"
                      />
                      <span>Armed SUV + Driver Roster</span>
                    </div>
                    <span className="font-bold text-gold-dark">+₦180k/day</span>
                  </label>

                  <label className="flex items-center justify-between p-2.5 border border-charcoal/5 rounded-xl cursor-pointer hover:bg-parchment/60 transition-colors select-none text-xs">
                    <div className="flex items-center gap-2.5">
                      <input 
                        type="checkbox"
                        checked={includeChef}
                        onChange={() => setIncludeChef(!includeChef)}
                        className="rounded text-gold focus:ring-0 focus:ring-offset-0 border-charcoal/10 w-4 h-4 cursor-pointer"
                      />
                      <span>In-House Personal Gourmet Chef</span>
                    </div>
                    <span className="font-bold text-gold-dark">+₦50k/day</span>
                  </label>
                </div>

                {/* Real-time estimate bills breakdown */}
                <div className="border-t border-charcoal/5 pt-4 space-y-2 text-xs font-medium text-charcoal-light">
                  <div className="flex justify-between items-baseline">
                    <span>₦{listing.nightlyRate.toLocaleString()} x {totalNights} Nights</span>
                    <span className="font-mono text-charcoal font-bold">₦{nightlyTotal.toLocaleString()}</span>
                  </div>

                  {includeVipDriver && (
                    <div className="flex justify-between items-baseline">
                      <span>Armed Chauffeur Retention ({totalNights} days)</span>
                      <span className="font-mono text-charcoal font-bold">₦{vipDriverTotal.toLocaleString()}</span>
                    </div>
                  )}

                  {includeChef && (
                    <div className="flex justify-between items-baseline">
                      <span>Private gourmet catering ({totalNights} days)</span>
                      <span className="font-mono text-charcoal font-bold">₦{chefTotal.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-baseline">
                    <span>Deep-cleaning and key sanitation</span>
                    <span className="font-mono text-charcoal font-bold">₦{listing.cleaningFee.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span>Nigeria VAT Luxury Levy (7.5%)</span>
                    <span className="font-mono text-charcoal font-bold">₦{calculatedTax.toLocaleString()}</span>
                  </div>

                  {/* Absolute total */}
                  <div className="border-t border-charcoal/10 pt-4 flex justify-between items-baseline font-bold font-serif text-base text-charcoal">
                    <span>Estimated Total</span>
                    <span className="text-xl text-gold-dark">₦{totalBilling.toLocaleString()}</span>
                  </div>
                </div>

                {/* Primary action trigger */}
                <button
                  type="submit"
                  className="w-full py-4 bg-charcoal hover:bg-gold-dark hover:scale-102 text-parchment hover:text-parchment text-xs font-bold tracking-widest uppercase rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Request Luxury Stay</span>
                </button>

              </form>
            )}

          </div>
        </div>

      </section>

    </div>
  );
}
