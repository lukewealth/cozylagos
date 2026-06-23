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
  guests?: number;
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
  onGoHome: () => void;
  onViewBooking: () => void;
}

export default function BookingConfirmedView({
  listing,
  checkIn,
  checkOut,
  totalAmount,
  bookingId,
  guests = 2,
  nightlyTotal,
  serviceFee,
  tax,
  grandTotal,
  includeVipDriver,
  includeChef,
  vipDriverTotal,
  chefTotal,
  cleaningFee,
  totalNights,
  onGoHome,
  onViewBooking
}: BookingConfirmedViewProps) {
  const generateWhatsAppMessage = () => {
    const lines: string[] = [];
    lines.push(`*BOOKING CONFIRMATION — Cozy Lagos*`);
    lines.push(``);
    lines.push(`Booking ID: ${bookingId}`);
    lines.push(``);
    lines.push(`*Property:* ${listing.title}`);
    lines.push(`*Location:* ${listing.location}`);
    lines.push(`*Category:* ${listing.category}`);
    lines.push(``);
    lines.push(`*Check-in:* ${checkIn}`);
    lines.push(`*Check-out:* ${checkOut}`);
    if (totalNights) lines.push(`*Duration:* ${totalNights} night(s)`);
    lines.push(`*Guests:* ${guests}`);
    lines.push(``);
    lines.push(`*— Cost Breakdown —*`);
    if (nightlyTotal) lines.push(`Accommodation: ₦${nightlyTotal.toLocaleString()}`);
    if (includeVipDriver && vipDriverTotal) lines.push(`Private Chauffeur: ₦${vipDriverTotal.toLocaleString()}`);
    if (includeChef && chefTotal) lines.push(`Personal Chef: ₦${chefTotal.toLocaleString()}`);
    if (cleaningFee) lines.push(`Sanitation Fee: ${cleaningFee.toLocaleString()}`);
    if (serviceFee) lines.push(`Service Fee (5%): ₦${serviceFee.toLocaleString()}`);
    if (tax) lines.push(`VAT (7.5%): ₦${tax.toLocaleString()}`);
    lines.push(``);
    lines.push(`*TOTAL: ₦${(grandTotal || totalAmount).toLocaleString()}*`);
    lines.push(``);
    lines.push(`I have completed the reservation request above. Please confirm availability and send check-in instructions.`);
    return encodeURIComponent(lines.join('\n'));
  };

  const whatsappUrl = `https://wa.me/2348064305782?text=${generateWhatsAppMessage()}`;

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
              Your luxury stay has been secured. Confirm with our admin via WhatsApp to receive check-in instructions.
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
                  ₦{(grandTotal || totalAmount).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Cost Breakdown */}
            {(nightlyTotal || serviceFee || tax) && (
              <div className="space-y-2 text-xs">
                {nightlyTotal && (
                  <div className="flex justify-between text-charcoal/60">
                    <span>Accommodation</span>
                    <span className="font-semibold text-charcoal">₦{nightlyTotal.toLocaleString()}</span>
                  </div>
                )}
                {includeVipDriver && vipDriverTotal && (
                  <div className="flex justify-between text-charcoal/60">
                    <span>Private Chauffeur</span>
                    <span className="font-semibold text-charcoal">₦{vipDriverTotal.toLocaleString()}</span>
                  </div>
                )}
                {includeChef && chefTotal && (
                  <div className="flex justify-between text-charcoal/60">
                    <span>Personal Chef</span>
                    <span className="font-semibold text-charcoal">{chefTotal.toLocaleString()}</span>
                  </div>
                )}
                {cleaningFee && (
                  <div className="flex justify-between text-charcoal/60">
                    <span>Sanitation Fee</span>
                    <span className="font-semibold text-charcoal">₦{cleaningFee.toLocaleString()}</span>
                  </div>
                )}
                {serviceFee && (
                  <div className="flex justify-between text-charcoal/60">
                    <span>Service Fee (5%)</span>
                    <span className="font-semibold text-charcoal">₦{serviceFee.toLocaleString()}</span>
                  </div>
                )}
                {tax && (
                  <div className="flex justify-between text-charcoal/60">
                    <span>VAT (7.5%)</span>
                    <span className="font-semibold text-charcoal">₦{tax.toLocaleString()}</span>
                  </div>
                )}
              </div>
            )}

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

        {/* WhatsApp Confirmation */}
        <div className="bg-[#25D366]/5 border border-[#25D366]/20 rounded-[24px] p-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#25D366]" />
            <h4 className="font-serif text-base font-bold text-charcoal">
              Confirm Booking with Admin
            </h4>
          </div>
          <p className="text-xs text-charcoal/60 max-w-md mx-auto">
            Send your booking details with the full cost breakdown to our admin team via WhatsApp. 
            They will verify availability and send check-in instructions within 10 minutes.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            Confirm via WhatsApp
          </a>
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
