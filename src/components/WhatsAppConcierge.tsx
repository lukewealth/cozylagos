import React, { useState } from 'react';
import { MessageCircle, X, Clock, CheckCircle } from 'lucide-react';
import { Listing } from '../types';

interface WhatsAppConciergeProps {
  listing?: Listing;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export default function WhatsAppConcierge({ listing, checkIn, checkOut, guests = 2 }: WhatsAppConciergeProps) {
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
    let message = 'Hello Cozy Lagos Concierge! ';

    if (listing) {
      message += `I'm interested in booking "${listing.title}" in ${listing.location}. `;
      if (checkIn && checkOut) {
        message += `Check-in: ${checkIn}, Check-out: ${checkOut}. `;
      }
      message += `Guests: ${guests}. `;
      message += `Nightly rate: ₦${listing.nightlyRate.toLocaleString()}. `;
    } else {
      message += 'I would like to learn more about your luxury properties and services.';
    }

    message += 'Please assist me with the booking process.';
    return encodeURIComponent(message);
  };

  const whatsappUrl = `https://wa.me/2348012345678?text=${generateWhatsAppMessage()}`;

  return (
    <>
      {/* Floating WhatsApp Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group"
        aria-label="Contact WhatsApp Concierge"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-charcoal text-parchment px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Chat with Concierge
        </span>
      </button>

      {/* WhatsApp Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm">
          <div className="bg-parchment rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-[#25D366] text-white p-6 relative">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold">Luxe Lagos Concierge</h3>
                  <p className="text-sm opacity-90">VIP Response Guaranteed</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {listing ? (
                <>
                  <div className="bg-surface-container-low rounded-xl p-4 mb-4 border border-outline/10">
                    <div className="flex justify-between items-center mb-2 border-b border-outline/10 pb-2">
                      <span className="text-[10px] font-bold text-charcoal/60 uppercase tracking-widest">Property</span>
                      <span className="text-sm font-bold text-charcoal">{listing.title}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-charcoal/60 uppercase tracking-widest">Location</span>
                      <span className="text-sm text-charcoal">{listing.location}</span>
                    </div>
                    {checkIn && checkOut && (
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-charcoal/60 uppercase tracking-widest">Dates</span>
                        <span className="text-sm text-charcoal">{checkIn} → {checkOut}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-charcoal/60 uppercase tracking-widest">Rate</span>
                      <span className="text-sm font-bold text-gold-dark">₦{listing.nightlyRate.toLocaleString()}/night</span>
                    </div>
                  </div>

                  <p className="text-sm text-charcoal/70 mb-4 leading-relaxed">
                    Tap below to connect with your dedicated concierge agent via WhatsApp. They will verify your details and assist with booking.
                  </p>
                </>
              ) : (
                <p className="text-sm text-charcoal/70 mb-4 leading-relaxed">
                  Connect with our luxury concierge team for personalized assistance with property selection, bookings, and bespoke experiences.
                </p>
              )}

              {/* WhatsApp Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white py-4 px-6 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mb-4"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                Verify via WhatsApp
              </a>

              {/* Timer */}
              <div className="text-center">
                <span className="text-[10px] font-bold text-charcoal/60 uppercase tracking-widest block mb-1">
                  Response Within
                </span>
                <div className="flex items-center justify-center gap-2 text-gold-dark font-bold">
                  <Clock className="w-4 h-4" />
                  <span className="font-serif text-lg">{countdown}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-surface-container-low px-6 py-3 border-t border-outline/10">
              <p className="text-[10px] text-charcoal/50 text-center">
                By tapping "Verify via WhatsApp", you agree to our concierge communication terms.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
