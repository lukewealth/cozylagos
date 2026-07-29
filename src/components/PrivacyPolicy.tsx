import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Cookie, ChevronRight } from 'lucide-react';
import UniversalModal from './ui/UniversalModal';

interface CookiesAlertProps {
  onAccept: () => void;
  onDecline: () => void;
  onPreferences: () => void;
  onNavigatePrivacy?: () => void;
}

export default function CookiesAlert({ onAccept, onDecline, onPreferences, onNavigatePrivacy }: CookiesAlertProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed bottom-0 left-0 right-0 z-[150] p-4 sm:p-6"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-charcoal/10 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center shrink-0">
            <Cookie className="w-6 h-6 text-gold-dark" />
          </div>
          <div className="flex-1">
            <h3 className="font-serif text-lg font-bold text-charcoal mb-1">We Value Your Privacy</h3>
            <p className="text-xs sm:text-sm text-charcoal/60 leading-relaxed mb-4">
              We use cookies and similar technologies to enhance your browsing experience, personalize content, and analyze site traffic. 
              By clicking "Accept All", you consent to our use of cookies. Read our{' '}
              <button 
                onClick={onNavigatePrivacy}
                className="text-gold-dark font-semibold underline hover:text-gold transition-colors"
              >
                Privacy Policy
              </button> for more details.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onAccept}
                className="px-5 py-2.5 bg-charcoal text-parchment hover:bg-gold-dark rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
              >
                Accept All
              </button>
              <button
                onClick={onDecline}
                className="px-5 py-2.5 border border-charcoal/20 text-charcoal hover:bg-charcoal/5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Decline
              </button>
              <button
                onClick={onPreferences}
                className="px-5 py-2.5 text-charcoal/60 hover:text-charcoal rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1"
              >
                Preferences
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export function PrivacyPolicyModal({ isOpen, onClose, onAccept }: PrivacyPolicyModalProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <UniversalModal isOpen={isOpen} onClose={onClose} title="Privacy Policy" size="lg" variant="auto">
      <div className="space-y-6 text-sm text-charcoal/70 leading-relaxed">
        <section>
          <h3 className="font-serif text-lg font-bold text-charcoal mb-2">1. Data Collection</h3>
          <p>Cozy Lagos collects personal information including name, email, phone number, and payment details to provide our luxury accommodation services. We also collect browsing data, search preferences, and booking history to personalize your experience.</p>
        </section>
        <section>
          <h3 className="font-serif text-lg font-bold text-charcoal mb-2">2. How We Use Your Data</h3>
          <p>Your data is used to process bookings, communicate with you about your stays, provide concierge services, and improve our platform. We never sell your personal information to third parties.</p>
        </section>
        <section>
          <h3 className="font-serif text-lg font-bold text-charcoal mb-2">3. Cookies & Tracking</h3>
          <p>We use essential cookies for site functionality, analytics cookies to understand usage patterns, and marketing cookies to show relevant content. You can manage your cookie preferences at any time.</p>
        </section>
        <section>
          <h3 className="font-serif text-lg font-bold text-charcoal mb-2">4. User Agreement</h3>
          <p>By using Cozy Lagos, you agree to provide accurate information, comply with our booking policies, respect property rules, and use our services lawfully. We reserve the right to suspend accounts that violate these terms.</p>
        </section>
        <section>
          <h3 className="font-serif text-lg font-bold text-charcoal mb-2">5. Cancellation & Refunds</h3>
          <p>Full refund if cancelled 7+ days before arrival. 50% refund within 7 days. No refund for no-shows. Service fees are non-refundable.</p>
        </section>
        <section>
          <h3 className="font-serif text-lg font-bold text-charcoal mb-2">6. Security</h3>
          <p>All data is encrypted with 256-bit SSL. Payment information is processed through secure, PCI-compliant providers. We conduct regular security audits.</p>
        </section>
        <section>
          <h3 className="font-serif text-lg font-bold text-charcoal mb-2">7. Contact</h3>
          <p>For privacy concerns, contact our Data Protection Officer at privacy@cozylagos.ng or WhatsApp +234 806 430 5782.</p>
        </section>
      </div>

      <div className="border-t border-charcoal/5 bg-white/50 -mx-4 sm:-mx-6 px-4 sm:px-6 pb-2 pt-4">
        <label className="flex items-start gap-3 cursor-pointer mb-4" onClick={() => setAccepted(!accepted)}>
          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${accepted ? 'bg-gold border-gold' : 'border-charcoal/30'}`}>
            {accepted && <span className="text-charcoal text-xs font-bold">✓</span>}
          </div>
          <span className="text-xs text-charcoal/70 leading-relaxed">
            I have read and agree to the Privacy Policy, Terms of Service, and Cookie Policy. I consent to the collection and processing of my personal data as described above.
          </span>
        </label>
        <button
          onClick={() => { if (accepted) onAccept(); }}
          disabled={!accepted}
          className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
            accepted
              ? 'bg-charcoal text-parchment hover:bg-gold-dark shadow-lg'
              : 'bg-charcoal/10 text-charcoal/30 cursor-not-allowed'
          }`}
        >
          {accepted ? 'Accept & Continue' : 'Please accept to continue'}
        </button>
      </div>
    </UniversalModal>
  );
}
