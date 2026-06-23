import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, CreditCard, Building2, Bitcoin, CheckCircle2, MessageCircle } from 'lucide-react';
import { Listing } from '../types';
import PillButton from './ui/PillButton';

interface CheckoutViewProps {
  listing: Listing;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  totalAmount: number;
  onBack: () => void;
  onProceedToPayment: () => void;
}

export default function CheckoutView({
  listing,
  checkIn,
  checkOut,
  guestsCount,
  totalAmount,
  onBack,
  onProceedToPayment
}: CheckoutViewProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'crypto'>('card');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const serviceFee = Math.round(totalAmount * 0.05);
  const tax = Math.round(totalAmount * 0.075);
  const grandTotal = totalAmount + serviceFee + tax;

  const generateWhatsAppMessage = () => {
    const lines: string[] = [];
    lines.push(`*RESERVATION REQUEST — Cozy Lagos*`);
    lines.push(``);
    lines.push(`*Property:* ${listing.title}`);
    lines.push(`*Location:* ${listing.location}`);
    lines.push(`*Category:* ${listing.category}`);
    lines.push(``);
    lines.push(`*Check-in:* ${checkIn}`);
    lines.push(`*Check-out:* ${checkOut}`);
    lines.push(`*Guests:* ${guestsCount}`);
    lines.push(``);
    lines.push(`*— Cost Breakdown —*`);
    lines.push(`Accommodation: ₦${totalAmount.toLocaleString()}`);
    lines.push(`Service Fee (5%): ₦${serviceFee.toLocaleString()}`);
    lines.push(`VAT (7.5%): ₦${tax.toLocaleString()}`);
    lines.push(``);
    lines.push(`*TOTAL: ₦${grandTotal.toLocaleString()}*`);
    lines.push(``);
    lines.push(`I would like to confirm availability for the above dates and proceed with booking. Payment method: ${paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'bank' ? 'Bank Transfer' : 'Cryptocurrency'}. Please assist.`);
    return encodeURIComponent(lines.join('\n'));
  };

  const whatsappUrl = `https://wa.me/2348064305782?text=${generateWhatsAppMessage()}`;

  return (
    <div className="flex-grow bg-parchment animate-fade-in-up">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 xl:px-20 py-6 md:py-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-charcoal/60 hover:text-charcoal text-xs font-bold uppercase tracking-widest mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Residence</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-gold-dark font-bold text-[10px] tracking-[0.25em] uppercase block mb-1">
                Secure Checkout
              </span>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-charcoal">
                Confirm Your Stay
              </h1>
            </div>

            <div className="bg-white border border-charcoal/5 rounded-[24px] p-6 space-y-4">
              <h3 className="font-serif text-lg font-bold text-charcoal border-b border-charcoal/5 pb-3">
                Stay Details
              </h3>
              <div className="flex items-center gap-4">
                <img src={listing.image} alt={listing.title} className="w-20 h-20 rounded-xl object-cover" />
                <div>
                  <h4 className="font-serif text-base font-bold text-charcoal">{listing.title}</h4>
                  <p className="text-xs text-charcoal/60">{listing.location}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-charcoal/5">
                <div>
                  <span className="block text-[9px] font-bold text-charcoal/40 uppercase tracking-widest">Check-in</span>
                  <span className="text-sm font-bold text-charcoal">{checkIn}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-charcoal/40 uppercase tracking-widest">Check-out</span>
                  <span className="text-sm font-bold text-charcoal">{checkOut}</span>
                </div>
                <div>
                  <span className="block text-[9px] font-bold text-charcoal/40 uppercase tracking-widest">Guests</span>
                  <span className="text-sm font-bold text-charcoal">{guestsCount}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-charcoal/5 rounded-[24px] p-6 space-y-4">
              <h3 className="font-serif text-lg font-bold text-charcoal border-b border-charcoal/5 pb-3">
                Payment Method
              </h3>
              <div className="space-y-3">
                {[
                  { id: 'card' as const, icon: CreditCard, label: 'Credit/Debit Card', desc: 'Visa, Mastercard, Verve' },
                  { id: 'bank' as const, icon: Building2, label: 'Bank Transfer', desc: 'Direct bank payment' },
                  { id: 'crypto' as const, icon: Bitcoin, label: 'Cryptocurrency', desc: 'BTC, ETH, USDT' }
                ].map(({ id, icon: Icon, label, desc }) => (
                  <button
                    key={id}
                    onClick={() => setPaymentMethod(id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                      paymentMethod === id
                        ? 'border-gold bg-gold/5'
                        : 'border-charcoal/10 hover:border-charcoal/30'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${paymentMethod === id ? 'text-gold-dark' : 'text-charcoal/40'}`} />
                    <div>
                      <span className="block text-sm font-bold text-charcoal">{label}</span>
                      <span className="block text-[10px] text-charcoal/50">{desc}</span>
                    </div>
                    {paymentMethod === id && <CheckCircle2 className="w-5 h-5 text-gold-dark ml-auto" />}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer p-4 bg-gold/5 border border-gold/10 rounded-xl">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={() => setAcceptTerms(!acceptTerms)}
                className="w-4 h-4 rounded text-gold border-charcoal/20 focus:ring-0 mt-0.5"
              />
              <span className="text-xs text-charcoal-light leading-relaxed">
                I agree to the Cozy Lagos Guest Protocol, cancellation policy, and confirm that all information provided is accurate.
              </span>
            </label>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white border border-charcoal/5 rounded-[24px] p-6 sticky top-24 space-y-4">
              <h3 className="font-serif text-lg font-bold text-charcoal border-b border-charcoal/5 pb-3">
                Cost Breakdown
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Accommodation</span>
                  <span className="font-bold text-charcoal">₦{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Service Fee (5%)</span>
                  <span className="font-bold text-charcoal">₦{serviceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">VAT (7.5%)</span>
                  <span className="font-bold text-charcoal">₦{tax.toLocaleString()}</span>
                </div>
                <div className="border-t border-charcoal/10 pt-3 flex justify-between items-baseline">
                  <span className="font-serif text-base font-bold text-charcoal">Total</span>
                  <span className="font-serif text-2xl text-gold-dark font-bold">₦{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[10px] text-emerald-700 font-semibold">
                  Secured by 256-bit encryption
                </span>
              </div>

              <PillButton
                variant="primary"
                size="lg"
                className="w-full"
                onClick={onProceedToPayment}
                disabled={!acceptTerms}
              >
                Proceed to Payment
              </PillButton>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                Confirm with Admin via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
