import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText, Scale, Users, CreditCard, Shield, AlertCircle,
  CheckCircle, Clock, ArrowLeft, Mail, Phone, MapPin,
  Building2, Landmark, Home, Anchor, Star, Ban
} from 'lucide-react';

interface TermsOfServiceViewProps {
  onBack?: () => void;
}

export default function TermsOfServiceView({ onBack }: TermsOfServiceViewProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    { id: 'acceptance', title: 'Acceptance of Terms', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'services', title: 'Our Services', icon: <Home className="w-4 h-4" /> },
    { id: 'eligibility', title: 'Eligibility', icon: <Users className="w-4 h-4" /> },
    { id: 'booking', title: 'Booking & Payments', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'cancellation', title: 'Cancellation & Refunds', icon: <Clock className="w-4 h-4" /> },
    { id: 'guest-obligations', title: 'Guest Obligations', icon: <Shield className="w-4 h-4" /> },
    { id: 'prohibited', title: 'Prohibited Activities', icon: <Ban className="w-4 h-4" /> },
    { id: 'liability', title: 'Limitation of Liability', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'ip', title: 'Intellectual Property', icon: <Star className="w-4 h-4" /> },
    { id: 'disputes', title: 'Dispute Resolution', icon: <Scale className="w-4 h-4" /> },
    { id: 'contact', title: 'Contact Us', icon: <Mail className="w-4 h-4" /> },
  ];

  return (
    <div className="flex-grow flex flex-col bg-parchment">
      <div className="relative bg-charcoal overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-dark/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-dark/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-20 py-12 sm:py-16">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-parchment/60 hover:text-gold text-sm mb-6 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </button>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center border border-gold/20">
                <Scale className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-[10px] text-gold-light tracking-[0.3em] uppercase font-bold">Legal Document</p>
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-parchment font-bold">Terms of Service</h1>
              </div>
            </div>
            <p className="text-sm text-parchment/60 max-w-2xl leading-relaxed mt-4">
              These Terms of Service govern your use of Cozy Lagos platform and services. 
              By accessing or using our platform, you agree to be bound by these terms.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-parchment/50">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-gold" />
                <span>Effective: July 27, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Scale className="w-3.5 h-3.5 text-gold" />
                <span>Nigerian Law Governed</span>
              </div>
              <div className="flex items-center gap-2">
                <Landmark className="w-3.5 h-3.5 text-gold" />
                <span>Lagos State Government Partnership</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-20 py-10 sm:py-14 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <aside className="lg:col-span-3">
            <div className="sticky top-24">
              <h3 className="text-[10px] font-bold text-gold-dark uppercase tracking-widest mb-4">Contents</h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSection(section.id);
                      document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs transition-all ${
                      activeSection === section.id
                        ? 'bg-charcoal text-parchment'
                        : 'text-charcoal/60 hover:bg-charcoal/5 hover:text-charcoal'
                    }`}
                  >
                    {section.icon}
                    <span className="font-medium">{section.title}</span>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="lg:col-span-9 space-y-10">
            <motion.section
              id="acceptance"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">1. Acceptance of Terms</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>
                  Welcome to <strong className="text-charcoal">Cozy Lagos</strong> ("Platform"), operated by <strong className="text-charcoal">COZYLAGOS LTD</strong> ("Company", "we", "us", "our"). 
                  These Terms of Service ("Terms") constitute a legally binding agreement between you ("User", "Guest", "you") and COZYLAGOS LTD.
                </p>
                <p>
                  By accessing, browsing, or using cozylagos.com, creating an account, or making a booking, you acknowledge that you have read, understood, 
                  and agree to be bound by these Terms, our Privacy Policy, and all applicable laws and regulations.
                </p>
                <div className="bg-gold/5 border border-gold/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-gold-dark shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-charcoal mb-1">Important Notice</p>
                      <p className="text-xs text-charcoal/60">
                        If you do not agree to these Terms, you must not access or use our Platform. We reserve the right to modify these Terms at any time, 
                        with changes posted on this page and the "Last Updated" date revised accordingly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              id="services"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Home className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">2. Our Services</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>Cozy Lagos provides the following luxury hospitality services:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: <Home className="w-4 h-4" />, title: 'Luxury Accommodations', desc: 'Premium apartments and villas across Lagos' },
                    { icon: <Anchor className="w-4 h-4" />, title: 'Yacht Experiences', desc: 'Private yacht charters and cruises' },
                    { icon: <Star className="w-4 h-4" />, title: 'VIP Services', desc: 'Concierge, chauffeur, and personal chef' },
                    { icon: <Building2 className="w-4 h-4" />, title: 'Corporate Housing', desc: 'Business accommodation solutions' },
                    { icon: <Landmark className="w-4 h-4" />, title: 'Tourism Packages', desc: 'Curated Lagos experiences and tours' },
                    { icon: <Users className="w-4 h-4" />, title: 'Event Spaces', desc: 'Premium venues for events and gatherings' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-parchment/30 rounded-lg">
                      <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-charcoal">{item.title}</p>
                        <p className="text-[11px] text-charcoal/50">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-charcoal/50">
                  We act as an intermediary platform connecting guests with property owners and service providers. 
                  We do not own or operate the listed properties directly.
                </p>
              </div>
            </motion.section>

            <motion.section
              id="eligibility"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">3. Eligibility</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>To use Cozy Lagos, you must:</p>
                <div className="space-y-2">
                  {[
                    'Be at least 18 years of age or the age of majority in your jurisdiction',
                    'Have the legal capacity to enter into binding contracts',
                    'Provide accurate, current, and complete information during registration',
                    'Not be prohibited from using the Platform under applicable laws',
                    'Agree to comply with these Terms and all applicable regulations',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                      <span className="text-xs text-charcoal/70">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-charcoal/70">
                      <strong className="text-charcoal">Age Restriction:</strong> Users under 18 are not permitted to create accounts or make bookings. 
                      By using our Platform, you represent and warrant that you meet the eligibility requirements.
                    </p>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              id="booking"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">4. Booking & Payments</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider">Booking Process</h4>
                <p>All bookings are subject to availability and confirmation. A booking is confirmed only upon receipt of payment and written confirmation from Cozy Lagos.</p>
                
                <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mt-6">Payment Terms</h4>
                <div className="space-y-2">
                  {[
                    'Full payment is required at the time of booking confirmation',
                    'All prices are quoted in Nigerian Naira (₦) and include applicable taxes',
                    'Platform service fee of 5% applies to all bookings',
                    'VAT at 7.5% is charged as required by Nigerian law',
                    'Additional services (chauffeur, chef, etc.) are billed separately',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                      <span className="text-xs text-charcoal/70">{item}</span>
                    </div>
                  ))}
                </div>

                <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mt-6">Payment Methods</h4>
                <p>We accept the following payment methods:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {['Bank Transfer', 'Credit/Debit Card', 'WhatsApp Confirmation', 'Mobile Money'].map((method, i) => (
                    <div key={i} className="p-2 bg-parchment/50 rounded-lg text-center text-xs text-charcoal/70 border border-charcoal/5">
                      {method}
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            <motion.section
              id="cancellation"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">5. Cancellation & Refunds</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider">Cancellation Policy</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-charcoal/10 rounded-xl overflow-hidden">
                    <thead className="bg-charcoal/5">
                      <tr>
                        <th className="text-left p-3 font-bold text-charcoal">Cancellation Period</th>
                        <th className="text-left p-3 font-bold text-charcoal">Refund Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal/5">
                      <tr>
                        <td className="p-3 text-charcoal/70">7+ days before check-in</td>
                        <td className="p-3 text-green-600 font-medium">100% refund</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-charcoal/70">3-6 days before check-in</td>
                        <td className="p-3 text-yellow-600 font-medium">50% refund</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-charcoal/70">Less than 3 days before check-in</td>
                        <td className="p-3 text-red-500 font-medium">No refund</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-charcoal/70">No-show</td>
                        <td className="p-3 text-red-500 font-medium">No refund</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-charcoal mb-1">Important Notes</p>
                      <ul className="space-y-1 text-xs text-charcoal/60">
                        <li>• Service fees (5%) are non-refundable</li>
                        <li>• Refunds are processed within 7-14 business days</li>
                        <li>• Cancellations must be made in writing via email or WhatsApp</li>
                        <li>• Special event bookings may have different cancellation terms</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              id="guest-obligations"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">6. Guest Obligations</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>As a guest of Cozy Lagos, you agree to:</p>
                <div className="space-y-2">
                  {[
                    'Provide accurate identification and contact information',
                    'Respect property rules and house guidelines',
                    'Maintain the property in good condition during your stay',
                    'Report any damages or issues immediately',
                    'Comply with all local laws and regulations',
                    'Not exceed the maximum occupancy stated in the listing',
                    'Not sublet or transfer your booking to third parties',
                    'Pay for any damages caused during your stay',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                      <span className="text-xs text-charcoal/70">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            <motion.section
              id="prohibited"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Ban className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">7. Prohibited Activities</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>The following activities are strictly prohibited and may result in immediate termination of your booking without refund:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Illegal activities or drug use',
                    'Excessive noise or disturbance',
                    'Smoking in non-smoking areas',
                    'Pets without prior approval',
                    'Unauthorized guests or parties',
                    'Damage to property or furnishings',
                    'Theft or vandalism',
                    'Commercial use of residential properties',
                    'Subletting without permission',
                    'Violation of house rules',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-red-50 rounded-lg">
                      <Ban className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span className="text-xs text-charcoal/70">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            <motion.section
              id="liability"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">8. Limitation of Liability</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>
                  To the maximum extent permitted by Nigerian law, Cozy Lagos shall not be liable for any indirect, incidental, special, consequential, 
                  or punitive damages, including but not limited to loss of profits, data, use, or goodwill.
                </p>
                <div className="bg-charcoal/5 rounded-xl p-4">
                  <p className="text-xs text-charcoal/60">
                    <strong className="text-charcoal">Our Total Liability:</strong> In no event shall our total liability exceed the amount paid by you for the specific service giving rise to the claim.
                  </p>
                </div>
                <p className="text-xs text-charcoal/50">
                  This limitation applies to all causes of action, whether in contract, tort, or otherwise.
                </p>
              </div>
            </motion.section>

            <motion.section
              id="ip"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">9. Intellectual Property</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>
                  All content on the Cozy Lagos platform, including but not limited to text, graphics, logos, images, software, and compilation of data, 
                  is the property of COZYLAGOS LTD or its licensors and is protected by Nigerian and international copyright laws.
                </p>
                <div className="space-y-2">
                  {[
                    'You may not reproduce, distribute, or create derivative works without written permission',
                    'The Cozy Lagos name and logo are registered trademarks',
                    'User-generated content remains your property but grants us a license to use',
                    'Unauthorized use may result in legal action',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                      <span className="text-xs text-charcoal/70">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            <motion.section
              id="disputes"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Scale className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">10. Dispute Resolution</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>
                  These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes arising from these Terms shall be resolved as follows:
                </p>
                <div className="space-y-3">
                  <div className="border-l-2 border-gold pl-4">
                    <h4 className="text-xs font-bold text-charcoal mb-1">Step 1: Informal Resolution</h4>
                    <p className="text-xs text-charcoal/60">Contact our support team to resolve the issue directly. We aim to resolve disputes within 14 days.</p>
                  </div>
                  <div className="border-l-2 border-gold pl-4">
                    <h4 className="text-xs font-bold text-charcoal mb-1">Step 2: Mediation</h4>
                    <p className="text-xs text-charcoal/60">If informal resolution fails, parties agree to mediation under the Lagos Multi-Door Courthouse (LMDC).</p>
                  </div>
                  <div className="border-l-2 border-gold pl-4">
                    <h4 className="text-xs font-bold text-charcoal mb-1">Step 3: Arbitration</h4>
                    <p className="text-xs text-charcoal/60">Unresolved disputes shall be referred to arbitration in Lagos State, Nigeria, under the Arbitration and Conciliation Act.</p>
                  </div>
                </div>
                <p className="text-xs text-charcoal/50">
                  The courts of Lagos State shall have exclusive jurisdiction over any matters not subject to arbitration.
                </p>
              </div>
            </motion.section>

            <motion.section
              id="contact"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">11. Contact Us</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>For questions about these Terms of Service, contact us:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-parchment/50 rounded-xl border border-charcoal/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-gold-dark" />
                      <p className="text-xs font-bold text-charcoal">Legal Department</p>
                    </div>
                    <p className="text-xs text-charcoal/60">legal@cozylagos.com</p>
                  </div>
                  <div className="p-4 bg-parchment/50 rounded-xl border border-charcoal/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4 text-gold-dark" />
                      <p className="text-xs font-bold text-charcoal">Phone / WhatsApp</p>
                    </div>
                    <p className="text-xs text-charcoal/60">+234 806 430 5782</p>
                  </div>
                  <div className="p-4 bg-parchment/50 rounded-xl border border-charcoal/5">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gold-dark" />
                      <p className="text-xs font-bold text-charcoal">Office Address</p>
                    </div>
                    <p className="text-xs text-charcoal/60">Victoria Island, Lagos, Nigeria</p>
                  </div>
                  <div className="p-4 bg-parchment/50 rounded-xl border border-charcoal/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4 text-gold-dark" />
                      <p className="text-xs font-bold text-charcoal">Company</p>
                    </div>
                    <p className="text-xs text-charcoal/60">COZYLAGOS LTD</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-charcoal/5 rounded-xl">
                  <p className="text-xs text-charcoal/60">
                    <strong className="text-charcoal">Response Time:</strong> We will respond to all legal inquiries within 5 business days. 
                    For urgent matters, please contact us via WhatsApp.
                  </p>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>

      <div className="bg-charcoal/5 border-t border-charcoal/10 py-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal/50">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-gold" />
              <span>In partnership with Lagos State Ministry of Tourism, Arts & Culture</span>
            </div>
            <div className="flex items-center gap-4">
              <span>&copy; 2026 COZYLAGOS LTD</span>
              <span className="text-gold">All Rights Reserved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
