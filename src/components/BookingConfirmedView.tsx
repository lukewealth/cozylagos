import React from 'react';
import { CheckCircle2, Calendar, MapPin, MessageCircle, Download, ArrowRight, Star } from 'lucide-react';
import { Listing } from '../types';
import PillButton from './ui/PillButton';

interface BookingConfirmedViewProps {
  listing: Listing;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  bookingId: string;
  onGoHome: () => void;
  onViewBooking: () => void;
}

export default function BookingConfirmedView({
  listing,
  checkIn,
  checkOut,
  totalAmount,
  bookingId,
  onGoHome,
  onViewBooking
}: BookingConfirmedViewProps) {
  return (
    <div className="flex-grow bg-parchment animate-fade-in-up min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto animate-fade-in-up">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-charcoal mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-base text-charcoal/60 max-w-md mx-auto">
              Your luxury stay has been secured. A confirmation has been sent to your email.
            </p>
          </div>
        </div>

        <div className="bg-white border border-charcoal/5 rounded-[24px] overflow-hidden">
          <div className="relative h-48 md:h-64">
            <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h3 className="font-serif text-2xl font-bold">{listing.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs">{listing.location}</span>
                <span className="flex items-center gap-1 ml-2">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-xs">{listing.rating}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b border-charcoal/5">
              <div>
                <span className="block text-[9px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">
                  Booking ID
                </span>
                <span className="text-xs font-mono font-bold text-charcoal">{bookingId}</span>
              </div>
              <div>
                <span className="block text-[9px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">
                  Check-in
                </span>
                <span className="text-xs font-bold text-charcoal flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {checkIn}
                </span>
              </div>
              <div>
                <span className="block text-[9px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">
                  Check-out
                </span>
                <span className="text-xs font-bold text-charcoal flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {checkOut}
                </span>
              </div>
              <div>
                <span className="block text-[9px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">
                  Total Paid
                </span>
                <span className="text-xs font-serif font-bold text-gold-dark">
                  ₦{totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <PillButton variant="primary" size="md" className="flex-1" onClick={onViewBooking}>
                <span>View Booking Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </PillButton>
              <PillButton variant="ghost" size="md" className="flex-1">
                <Download className="w-3.5 h-3.5" />
                <span>Download Receipt</span>
              </PillButton>
            </div>
          </div>
        </div>

        <div className="bg-gold/5 border border-gold/10 rounded-[24px] p-6 text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <MessageCircle className="w-5 h-5 text-gold-dark" />
            <h4 className="font-serif text-base font-bold text-charcoal">
              WhatsApp Concierge Verification
            </h4>
          </div>
          <p className="text-xs text-charcoal/60 max-w-md mx-auto">
            Our concierge team will verify your booking via WhatsApp within 10 minutes. 
            You'll receive access codes and check-in instructions.
          </p>
          <PillButton variant="secondary" size="sm">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Contact Concierge Now</span>
          </PillButton>
        </div>

        <div className="text-center">
          <button
            onClick={onGoHome}
            className="text-xs font-bold text-charcoal/40 hover:text-charcoal uppercase tracking-widest transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}
