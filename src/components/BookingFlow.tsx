import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Calendar, User, Mail, Info, ArrowRight, ArrowLeft, Sparkles, ShieldCheck, Star } from 'lucide-react';
import { Listing } from '../types';

interface BookingFlowProps {
  listing: Listing;
  onCancel: () => void;
  onComplete: (bookingData: any) => void;
  initialData?: any;
}

type Step = 'request' | 'confirmation' | 'cta';

export default function BookingFlow({ listing, onCancel, onComplete, initialData }: BookingFlowProps) {
  const [step, setStep] = useState<Step>('request');
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    checkIn: initialData?.checkIn || '',
    checkOut: initialData?.checkOut || '',
    guestsCount: initialData?.guestsCount || 2,
  });

  const [includeVipDriver, setIncludeVipDriver] = useState(false);
  const [includeChef, setIncludeChef] = useState(false);

  const totalNights = useMemo(() => {
    if (!formData.checkIn || !formData.checkOut) return 1;
    try {
      const d1 = new Date(formData.checkIn);
      const d2 = new Date(formData.checkOut);
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return isNaN(nights) || nights <= 0 ? 1 : nights;
    } catch {
      return 1;
    }
  }, [formData.checkIn, formData.checkOut]);

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

  const nextStep = () => {
    if (step === 'request') setStep('confirmation');
    else if (step === 'confirmation') setStep('cta');
  };

  const prevStep = () => {
    if (step === 'confirmation') setStep('request');
    else if (step === 'cta') setStep('confirmation');
  };

  const handleComplete = () => {
    onComplete({
      ...formData,
      totalAmount: totalBilling,
      includeVipDriver,
      includeChef,
      totalNights
    });
  };

  return (
    <div className="min-h-screen bg-parchment flex flex-col">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-charcoal/5">
        <motion.div 
          className="h-full bg-gold"
          initial={{ width: '33%' }}
          animate={{ width: step === 'request' ? '33%' : step === 'confirmation' ? '66%' : '100%' }}
        />
      </div>

      <main className="flex-grow flex items-center justify-center px-6 py-12">
        <AnimatePresence mode="wait">
          {step === 'request' && (
            <motion.div
              key="request"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-xl bg-white p-8 md:p-12 rounded-3xl shadow-2xl space-y-8"
            >
              <div className="text-center space-y-2">
                <h2 className="font-serif text-3xl text-charcoal font-bold">Reservation Request</h2>
                <p className="text-sm text-charcoal/60">Tell us a bit about your stay</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/30" />
                    <input 
                      required
                      type="text"
                      placeholder="Full Name"
                      className="w-full pl-12 pr-4 py-3 bg-parchment/50 border border-charcoal/10 rounded-xl outline-none focus:border-gold transition-colors"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/30" />
                    <input 
                      required
                      type="email"
                      placeholder="Email Address"
                      className="w-full pl-12 pr-4 py-3 bg-parchment/50 border border-charcoal/10 rounded-xl outline-none focus:border-gold transition-colors"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-charcoal/40 uppercase tracking-widest">Check-in</label>
                      <input 
                        required
                        type="date"
                        className="w-full px-4 py-3 bg-parchment/50 border border-charcoal/10 rounded-xl outline-none focus:border-gold transition-colors text-xs"
                        value={formData.checkIn}
                        onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-charcoal/40 uppercase tracking-widest">Check-out</label>
                      <input 
                        required
                        type="date"
                        className="w-full px-4 py-3 bg-parchment/50 border border-charcoal/10 rounded-xl outline-none focus:border-gold transition-colors text-xs"
                        value={formData.checkOut}
                        onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-4 text-charcoal/60 font-bold text-xs uppercase tracking-widest hover:text-charcoal transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-4 bg-charcoal text-parchment font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gold-dark transition-all shadow-lg"
                  >
                    Continue
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 'confirmation' && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-xl bg-white p-8 md:p-12 rounded-3xl shadow-2xl space-y-8"
            >
              <div className="text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-gold mx-auto mb-4" />
                <h2 className="font-serif text-3xl text-charcoal font-bold">Ready to Book?</h2>
                <p className="text-sm text-charcoal/60">Review your reservation details</p>
              </div>

              <div className="bg-parchment/50 p-6 rounded-2xl space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-charcoal/40">Stay</span>
                  <span className="font-bold text-charcoal">{formData.checkIn} — {formData.checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/40">Guest</span>
                  <span className="font-bold text-charcoal">{formData.name}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-charcoal/10">
                  <span className="text-charcoal/40 font-bold">Total Estimate</span>
                  <span className="font-serif font-bold text-xl text-gold-dark">₦{totalBilling.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-charcoal/40 italic">*Final price subject to availability and taxes</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-charcoal">Common Questions</h3>
                <div className="space-y-3">
                  <details className="group bg-parchment/30 rounded-xl p-3">
                    <summary className="list-none flex items-center justify-between cursor-pointer text-xs font-bold text-charcoal">
                      What is the cancellation policy?
                      <Info className="w-4 h-4 text-charcoal/30 group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="text-[10px] text-charcoal/60 mt-2 leading-relaxed">
                      Full refund if cancelled up to 7 days before arrival. 50% refund if cancelled within 7 days.
                    </p>
                  </details>
                  <details className="group bg-parchment/30 rounded-xl p-3">
                    <summary className="list-none flex items-center justify-between cursor-pointer text-xs font-bold text-charcoal">
                      Is security included?
                      <Info className="w-4 h-4 text-charcoal/30 group-open:rotate-90 transition-transform" />
                    </summary>
                    <p className="text-[10px] text-charcoal/60 mt-2 leading-relaxed">
                      Yes, all residences are within gated estates with 24/7 professional security.
                    </p>
                  </details>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={prevStep}
                  className="flex-1 py-4 text-charcoal/60 font-bold text-xs uppercase tracking-widest hover:text-charcoal transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="flex-[2] py-4 bg-charcoal text-parchment font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gold-dark transition-all shadow-lg"
                >
                  Proceed to Final Step
                </button>
              </div>
            </motion.div>
          )}

          {step === 'cta' && (
            <motion.div
              key="cta"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full max-w-xl bg-white p-12 rounded-3xl shadow-2xl text-center space-y-8"
            >
              <div className="space-y-2">
                <h2 className="font-serif text-4xl text-charcoal font-bold">Make Yourself at Home</h2>
                <p className="text-sm text-charcoal/60">Your luxury oasis awaits.</p>
              </div>

              <p className="text-sm text-charcoal-light leading-relaxed">
                We are processing your request. One of our luxury concierges will reach out within 15 minutes to finalize your bespoke stay.
              </p>

              <div className="py-8">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold-dark"
                >
                  <CheckCircle2 className="w-12 h-12" />
                </motion.div>
              </div>

              <button
                onClick={handleComplete}
                className="w-full py-4 bg-gold text-charcoal font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gold-dark transition-all shadow-lg"
              >
                Confirm & Complete
              </button>

              <button
                onClick={prevStep}
                className="w-full py-4 text-charcoal/40 font-bold text-xs uppercase tracking-widest hover:text-charcoal transition-colors"
              >
                Return to Residence
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
