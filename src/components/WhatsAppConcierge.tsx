import React, { useState } from 'react';
import { MessageCircle, X, Clock, CheckCircle, FileText } from 'lucide-react';
import { Listing } from '../types';

interface WhatsAppConciergeProps {
  listing?: Listing;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  totalAmount?: number;
  bookingId?: string;
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
}

const WHATSAPP_NUMBER = '2348064305782';

export default function WhatsAppConcierge({
  listing,
  checkIn,
  checkOut,
  guests = 2,
  totalAmount,
  bookingId,
  nightlyTotal,
  serviceFee,
  tax,
  grandTotal,
  includeVipDriver,
  includeChef,
  vipDriverTotal,
  chefTotal,
  cleaningFee,
  totalNights
}: WhatsAppConciergeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState('15:00');

  React.useEffect(() => {
    if (isOpen) {
      let minutes = 14;
      let seconds = 59;
      const timer = setInterval(() => {
        const m = minutes < 10 ? '0' + minutes : minutes;
        const s = seconds < 10 ? '0' + seconds : seconds;
        setCountdown(`${m}:${s}`);
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(timer);
            return;
          }
          minutes--;
          seconds = 59;
        } else {
          seconds--;
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  const generateWhatsAppMessage = () => {
    const lines: string[] = [];

    if (bookingId) {
      lines.push(`*BOOKING CONFIRMATION — Cozy Lagos*`);
      lines.push(``);
      lines.push(`Booking ID: ${bookingId}`);
      lines.push(``);
    } else if (listing) {
      lines.push(`*RESERVATION REQUEST — Cozy Lagos*`);
      lines.push(``);
    } else {
      lines.push(`*GENERAL INQUIRY — Cozy Lagos*`);
      lines.push(``);
    }

    if (listing) {
      lines.push(`*Property:* ${listing.title}`);
      lines.push(`*Location:* ${listing.location}`);
      lines.push(`*Category:* ${listing.category}`);
      lines.push(``);
    }

    if (checkIn && checkOut) {
      lines.push(`*Check-in:* ${checkIn}`);
      lines.push(`*Check-out:* ${checkOut}`);
      if (totalNights) {
        lines.push(`*Duration:* ${totalNights} night(s)`);
      }
      lines.push(`*Guests:* ${guests}`);
      lines.push(``);
    }

    if (nightlyTotal || totalAmount) {
      lines.push(`*— Cost Breakdown —*`);
      if (nightlyTotal) {
        lines.push(`Accommodation: ₦${nightlyTotal.toLocaleString()}`);
      } else if (totalAmount) {
        lines.push(`Accommodation: ${totalAmount.toLocaleString()}`);
      }
      if (includeVipDriver && vipDriverTotal) {
        lines.push(`Private Chauffeur: ${vipDriverTotal.toLocaleString()}`);
      }
      if (includeChef && chefTotal) {
        lines.push(`Personal Chef: ₦${chefTotal.toLocaleString()}`);
      }
      if (cleaningFee) {
        lines.push(`Sanitation Fee: ₦${cleaningFee.toLocaleString()}`);
      }
      if (serviceFee) {
        lines.push(`Service Fee (5%): ₦${serviceFee.toLocaleString()}`);
      }
      if (tax) {
        lines.push(`VAT (7.5%): ₦${tax.toLocaleString()}`);
      }
      lines.push(``);
      const finalTotal = grandTotal || totalAmount || 0;
      lines.push(`*TOTAL: ₦${finalTotal.toLocaleString()}*`);
      lines.push(``);
    }

    if (bookingId) {
      lines.push(`I have completed the reservation request above. Please confirm availability and send check-in instructions.`);
    } else if (listing) {
      lines.push(`I would like to confirm availability for the above dates and proceed with booking. Please assist.`);
    } else {
      lines.push(`I would like to learn more about your luxury properties and services. Please assist me.`);
    }

    return encodeURIComponent(lines.join('\n'));
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${generateWhatsAppMessage()}`;

  const hasBookingDetails = listing && totalAmount;
  const hasBreakdown = nightlyTotal || serviceFee || tax || grandTotal;

  return (
    <>
      {/* Floating WhatsApp Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group"
        aria-label="Contact WhatsApp Concierge"
      >
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-charcoal text-parchment px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat with Admin
        </span>
      </button>

      {/* WhatsApp Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-charcoal/60 backdrop-blur-sm">
          <div className="bg-parchment rounded-t-3xl sm:rounded-2xl max-w-md w-full shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-[#25D366] text-white p-5 sm:p-6 relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold">Cozy Lagos Admin</h3>
                  <p className="text-xs sm:text-sm opacity-90">Confirm & Book via WhatsApp</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-6">
              {/* Booking Summary */}
              {listing && (
                <div className="bg-white rounded-xl p-4 mb-4 border border-charcoal/10">
                  <div className="flex gap-3 mb-3">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-16 h-16 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-charcoal truncate">{listing.title}</h4>
                      <p className="text-[11px] text-charcoal/60">{listing.location}</p>
                      {checkIn && checkOut && (
                        <p className="text-[11px] text-charcoal/50 mt-0.5">{checkIn} → {checkOut}</p>
                      )}
                    </div>
                  </div>

                  {hasBreakdown && (
                    <div className="border-t border-charcoal/5 pt-3 space-y-1.5">
                      {nightlyTotal && (
                        <div className="flex justify-between text-[11px]">
                          <span className="text-charcoal/60">Accommodation</span>
                          <span className="font-semibold text-charcoal">₦{nightlyTotal.toLocaleString()}</span>
                        </div>
                      )}
                      {includeVipDriver && vipDriverTotal && (
                        <div className="flex justify-between text-[11px]">
                          <span className="text-charcoal/60">Chauffeur</span>
                          <span className="font-semibold text-charcoal">₦{vipDriverTotal.toLocaleString()}</span>
                        </div>
                      )}
                      {includeChef && chefTotal && (
                        <div className="flex justify-between text-[11px]">
                          <span className="text-charcoal/60">Chef</span>
                          <span className="font-semibold text-charcoal">₦{chefTotal.toLocaleString()}</span>
                        </div>
                      )}
                      {cleaningFee && (
                        <div className="flex justify-between text-[11px]">
                          <span className="text-charcoal/60">Sanitation</span>
                          <span className="font-semibold text-charcoal">₦{cleaningFee.toLocaleString()}</span>
                        </div>
                      )}
                      {serviceFee && (
                        <div className="flex justify-between text-[11px]">
                          <span className="text-charcoal/60">Service Fee</span>
                          <span className="font-semibold text-charcoal">₦{serviceFee.toLocaleString()}</span>
                        </div>
                      )}
                      {tax && (
                        <div className="flex justify-between text-[11px]">
                          <span className="text-charcoal/60">VAT (7.5%)</span>
                          <span className="font-semibold text-charcoal">₦{tax.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 mt-1 border-t border-gold/20">
                        <span className="text-xs font-bold text-charcoal">Total</span>
                        <span className="font-serif text-lg font-bold text-gold-dark">
                          ₦{(grandTotal || totalAmount || 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {!hasBreakdown && totalAmount && (
                    <div className="flex justify-between pt-2 border-t border-charcoal/5">
                      <span className="text-xs font-bold text-charcoal">Total</span>
                      <span className="font-serif text-lg font-bold text-gold-dark">
                        ₦{totalAmount.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {bookingId && (
                <div className="flex items-center gap-2 bg-gold/5 border border-gold/10 rounded-lg p-3 mb-4">
                  <FileText className="w-4 h-4 text-gold-dark shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-charcoal/60 uppercase tracking-widest block">Booking ID</span>
                    <span className="text-xs font-mono font-bold text-charcoal">{bookingId}</span>
                  </div>
                </div>
              )}

              <p className="text-xs sm:text-sm text-charcoal/70 mb-5 leading-relaxed">
                {bookingId
                  ? 'Tap below to send your booking confirmation to our admin team. They will verify and send check-in instructions.'
                  : listing
                  ? 'Tap below to send your reservation request with the calculated bill. Our admin will confirm availability within 10 minutes.'
                  : 'Connect with our admin team for personalized assistance with property selection, bookings, and bespoke experiences.'}
              </p>

              {/* WhatsApp Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white py-4 px-6 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mb-4"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                {bookingId ? 'Confirm Booking with Admin' : 'Send Request via WhatsApp'}
              </a>

              {/* Timer */}
              <div className="text-center">
                <span className="text-[10px] font-bold text-charcoal/60 uppercase tracking-widest block mb-1">
                  Admin Response Within
                </span>
                <div className="flex items-center justify-center gap-2 text-gold-dark font-bold">
                  <Clock className="w-4 h-4" />
                  <span className="font-serif text-lg">{countdown}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-charcoal/5 px-5 sm:px-6 py-3 border-t border-charcoal/10">
              <p className="text-[10px] text-charcoal/50 text-center">
                By tapping, you agree to our concierge communication terms.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
