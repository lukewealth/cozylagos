import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Star, Bed, Bath, Users, ShieldCheck, Heart, Share2, ClipboardCheck, AlertCircle, Sparkles, Maximize, Info, Clock, MapPin } from 'lucide-react';
import { Listing } from '../types';
import ImageGallery from './ui/ImageGallery';
import BookingFlow from './BookingFlow';
import { motion, AnimatePresence } from 'motion/react';

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
    guestsCount?: number;
    nightlyTotal?: number;
    serviceFee?: number;
    tax?: number;
    grandTotal?: number;
    includeVipDriver?: boolean;
    includeChef?: boolean;
    vipDriverTotal?: number;
    chefTotal?: number;
    cleaningFee?: number;
    totalNights?: number;
  }) => void;
  onUpdateBookingContext?: (ctx: {
    listing: Listing;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalAmount: number;
    nightlyTotal: number;
    serviceFee: number;
    tax: number;
    grandTotal: number;
    includeVipDriver: boolean;
    includeChef: boolean;
    vipDriverTotal: number;
    chefTotal: number;
    cleaningFee: number;
    totalNights: number;
  }) => void;
}

export default function ListingDetailView({ listing, onBack, onConfirmBooking, onUpdateBookingContext }: ListingDetailViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingFlow, setShowBookingFlow] = useState(false);
  const [bookingFlowData, setBookingFlowData] = useState<any>(null);
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
    return includeVipDriver ? 180000 * totalNights : 0;
  }, [includeVipDriver, totalNights]);

  const chefTotal = useMemo(() => {
    return includeChef ? 50000 * totalNights : 0;
  }, [includeChef, totalNights]);

  const grossTotal = useMemo(() => {
    return nightlyTotal + vipDriverTotal + chefTotal + listing.cleaningFee;
  }, [nightlyTotal, vipDriverTotal, chefTotal, listing.cleaningFee]);

  const calculatedTax = useMemo(() => {
    return Math.round(grossTotal * 0.075);
  }, [grossTotal]);

  const totalBilling = useMemo(() => {
    return grossTotal + calculatedTax;
  }, [grossTotal, calculatedTax]);

  const handleStartBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingFlowData({
      name: '',
      email: '',
      checkIn,
      checkOut,
      guestsCount: guestCount,
    });
    setShowBookingFlow(true);
  };

  const handleCompleteBooking = (finalData: any) => {
    onConfirmBooking({
      listingId: listing.id,
      listingTitle: listing.title,
      checkIn: finalData.checkIn,
      checkOut: finalData.checkOut,
      totalAmount: totalBilling,
      guestName: finalData.name,
      guestEmail: finalData.email,
      guestsCount: guestCount,
      nightlyTotal,
      serviceFee: Math.round(totalBilling * 0.05),
      tax: calculatedTax,
      grandTotal: totalBilling + Math.round(totalBilling * 0.05),
      includeVipDriver,
      includeChef,
      vipDriverTotal,
      chefTotal,
      cleaningFee: listing.cleaningFee,
      totalNights,
    });
    setBookingSuccess(true);
    setShowBookingFlow(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (onUpdateBookingContext && !showBookingFlow && !bookingSuccess) {
      onUpdateBookingContext({
        listing,
        checkIn,
        checkOut,
        guests: guestCount,
        totalAmount: totalBilling,
        nightlyTotal,
        serviceFee: Math.round(totalBilling * 0.05),
        tax: calculatedTax,
        grandTotal: totalBilling + Math.round(totalBilling * 0.05),
        includeVipDriver,
        includeChef,
        vipDriverTotal,
        chefTotal,
        cleaningFee: listing.cleaningFee,
        totalNights,
      });
    }
  }, [checkIn, checkOut, guestCount, includeVipDriver, includeChef, totalBilling, nightlyTotal, calculatedTax, vipDriverTotal, chefTotal, totalNights, showBookingFlow, bookingSuccess]);

  if (isLoading) {
    return (
      <div className="flex-grow bg-parchment flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-full"
            />
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sparkles className="w-6 h-6 text-gold" />
            </motion.div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="font-serif text-xl text-charcoal">Preparing your view</h3>
            <p className="text-xs font-mono text-charcoal/40 uppercase tracking-widest">Fetching luxury details...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (showBookingFlow) {
    return (
      <BookingFlow 
        listing={listing} 
        onCancel={() => setShowBookingFlow(false)}
        onComplete={handleCompleteBooking}
        initialData={bookingFlowData}
      />
    );
  }

  return (
    <div className="flex-grow bg-parchment animate-fade-in-up text-left">
      
      {/* 1. HERO SECTION - IMAGE GALLERY & HEADER */}
      <section className="relative w-full bg-charcoal select-none">
        <ImageGallery images={listing.images} />

        <div className="absolute top-6 left-6 md:left-12 z-20">
          <motion.button
            whileHover={{ x: -5 }}
            onClick={onBack}
            className="flex items-center gap-2.5 px-5 py-3 bg-white/90 backdrop-blur-md rounded-full border border-charcoal/10 hover:bg-charcoal hover:text-parchment font-bold text-[10px] tracking-widest uppercase transition-all shadow-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to search</span>
          </motion.button>
        </div>

        <div className="absolute top-6 right-6 md:right-12 z-20 flex gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsFavorited(!isFavorited)}
            className="w-11 h-11 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-charcoal hover:text-red-600 transition-colors"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current text-red-600' : ''}`} />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-11 h-11 bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-charcoal hover:text-gold-dark transition-colors"
          >
            <Share2 className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="relative z-10 w-full max-w-[1440px] px-4 sm:px-6 md:px-12 xl:px-20 mx-auto pb-8 sm:pb-10">
          <div className="max-w-4xl text-white space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <span className="bg-gold text-charcoal font-bold text-[10px] tracking-[0.2em] uppercase px-3 py-1 rounded-sm">
                {listing.category}
              </span>
              <span className="text-white/60 text-xs uppercase tracking-widest flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {listing.location}
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl md:text-6xl font-bold leading-tight"
            >
              {listing.title}
            </motion.h1>
          </div>
        </div>
      </section>

      {/* 2. DETAILS GRID */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-20 py-8 sm:py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-16">
        
        {/* LEFT CONTENT (8/12th) */}
        <div className="lg:col-span-8 space-y-16">
          
          {/* Quick Spec Bar (Image 3 style) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-8 py-6 border-y border-charcoal/5 text-charcoal"
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gold-dark" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-wider">Capacity</span>
                <span className="text-sm font-bold">Up to {listing.maxGuests} Guests</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Bed className="w-5 h-5 text-gold-dark" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-wider">Rooms</span>
                <span className="text-sm font-bold">{listing.bedrooms} Bedroom(s)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Bath className="w-5 h-5 text-gold-dark" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-wider">Bathrooms</span>
                <span className="text-sm font-bold">{listing.bathrooms} Bath(s)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Maximize className="w-5 h-5 text-gold-dark" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-wider">Size</span>
                <span className="text-sm font-bold">{listing.squareFootage?.toLocaleString()} sqft</span>
              </div>
            </div>
          </motion.div>

          {/* Description Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <h2 className="font-serif text-3xl font-bold text-charcoal">About this property</h2>
            <div className="prose prose-charcoal max-w-none">
              <p className="text-lg text-charcoal-light leading-relaxed font-light">
                {listing.description}
              </p>
            </div>
          </motion.div>

          {/* Amenities Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between border-b border-charcoal/5 pb-4">
              <h2 className="font-serif text-3xl font-bold text-charcoal">Amenities</h2>
              <span className="text-xs font-bold text-gold-dark uppercase tracking-widest">{listing.amenities.length} total</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
              {listing.amenities.map((am, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-charcoal-light font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                  {am}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Review Highlight (Image 3 style) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-8 bg-white border border-charcoal/5 rounded-3xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(listing.rating) ? 'text-gold fill-current' : 'text-charcoal/10'}`} />
                  ))}
                </div>
                <span className="font-bold text-charcoal">{listing.rating}</span>
              </div>
              <span className="text-xs text-charcoal-light uppercase tracking-widest font-bold">{listing.reviewsCount} reviews</span>
            </div>
            <p className="font-serif italic text-charcoal/70 text-lg leading-relaxed">
              "An absolutely spectacular sanctuary. The view from the penthouse at sunset is unmatched in Lagos. The housekeeping is impeccable and the atmosphere is pure tranquility."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-charcoal/5 flex items-center justify-center font-bold text-charcoal">A</div>
              <div>
                <span className="block text-sm font-bold text-charcoal">Alexander Sterling</span>
                <span className="text-[10px] text-charcoal-light uppercase font-bold">Verified Guest</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: BOOKING WIDGET (4/12th) */}
        <aside className="lg:col-span-4">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white border border-charcoal/5 p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] shadow-2xl text-left"
          >
            <div className="space-y-6">
              
              {/* Price Display */}
              <div className="pb-6 border-b border-charcoal/5">
                <div className="flex justify-between items-baseline">
                  <span className="text-charcoal/40 text-xs font-bold uppercase tracking-widest">Nightly Rate</span>
                  <span className="text-2xl font-serif font-bold text-gold-dark">₦{listing.nightlyRate.toLocaleString()}</span>
                </div>
              </div>

              {bookingSuccess ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold-dark">
                    <ClipboardCheck className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-charcoal">Stay Confirmed!</h4>
                  <p className="text-sm text-charcoal-light px-4">
                    Your luxury residence is locked. Check your email for arrival instructions.
                  </p>
                  <button 
                    onClick={() => setBookingSuccess(false)}
                    className="w-full py-4 bg-charcoal text-parchment font-bold text-xs tracking-widest uppercase rounded-2xl hover:bg-gold-dark transition-all"
                  >
                    Book Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleStartBooking} className="space-y-6">
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-charcoal-light/60 uppercase tracking-widest">Check-in</label>
                      <input 
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full bg-parchment/50 border-none text-sm font-semibold rounded-xl py-2 px-3 focus:ring-2 focus:ring-gold/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-charcoal-light/60 uppercase tracking-widest">Check-out</label>
                      <input 
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full bg-parchment/50 border-none text-sm font-semibold rounded-xl py-2 px-3 focus:ring-2 focus:ring-gold/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-charcoal-light/60 uppercase tracking-widest">Guests</label>
                    <div className="flex items-center gap-4 bg-parchment/50 rounded-xl px-4 py-2">
                      <Users className="w-4 h-4 text-charcoal/40" />
                      <input 
                        type="range"
                        min={1}
                        max={listing.maxGuests}
                        value={guestCount}
                        onChange={(e) => setGuestCount(Number(e.target.value))}
                        className="flex-1 accent-gold"
                      />
                      <span className="text-sm font-bold text-charcoal min-w-[2ch]">{guestCount}</span>
                    </div>
                  </div>

                  {/* Add-ons */}
                  <div className="space-y-3 pt-2">
                    <label className="text-[10px] font-bold text-charcoal-light/60 uppercase tracking-widest">Luxury Enhancements</label>
                    
                    <label className="flex items-center justify-between p-3 border border-charcoal/5 rounded-2xl cursor-pointer hover:bg-parchment/50 transition-all">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox"
                          checked={includeVipDriver}
                          onChange={() => setIncludeVipDriver(!includeVipDriver)}
                          className="rounded text-gold focus:ring-0 border-charcoal/10"
                        />
                        <span className="text-xs font-medium">Private Chauffeur</span>
                      </div>
                      <span className="text-[10px] font-bold text-gold-dark">₦180k/d</span>
                    </label>

                    <label className="flex items-center justify-between p-3 border border-charcoal/5 rounded-2xl cursor-pointer hover:bg-parchment/50 transition-all">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox"
                          checked={includeChef}
                          onChange={() => setIncludeChef(!includeChef)}
                          className="rounded text-gold focus:ring-0 border-charcoal/10"
                        />
                        <span className="text-xs font-medium">Personal Chef</span>
                      </div>
                      <span className="text-[10px] font-bold text-gold-dark">₦50k/d</span>
                    </label>
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-2 pt-4 border-t border-charcoal/5 text-xs">
                    <div className="flex justify-between text-charcoal-light">
                      <span>{totalNights} Nights x ₦{listing.nightlyRate.toLocaleString()}</span>
                      <span>₦{nightlyTotal.toLocaleString()}</span>
                    </div>
                    {includeVipDriver && (
                      <div className="flex justify-between text-charcoal-light">
                        <span>Chauffeur ({totalNights} days)</span>
                        <span>₦{vipDriverTotal.toLocaleString()}</span>
                      </div>
                    )}
                    {includeChef && (
                      <div className="flex justify-between text-charcoal-light">
                        <span>Chef ({totalNights} days)</span>
                        <span>₦{chefTotal.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-charcoal-light">
                      <span>Sanitation Fee</span>
                      <span>₦{listing.cleaningFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-charcoal-light">
                      <span>VAT (7.5%)</span>
                      <span>₦{calculatedTax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-4 text-base font-serif font-bold text-charcoal">
                      <span>Total</span>
                      <span className="text-gold-dark">₦{totalBilling.toLocaleString()}</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-4 bg-charcoal text-parchment font-bold text-xs tracking-widest uppercase rounded-2xl shadow-xl hover:bg-gold-dark transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Reserve Now</span>
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </aside>

      </section>
    </div>
  );
}
