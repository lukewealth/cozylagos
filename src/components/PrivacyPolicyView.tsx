import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Shield, Lock, Eye, FileText, Users, Cookie, Database,
  Globe, Mail, Phone, MapPin, ChevronRight, ArrowLeft,
  CheckCircle, AlertCircle, Clock, Scale, Building2, Landmark
} from 'lucide-react';

interface PrivacyPolicyViewProps {
  onBack?: () => void;
}

export default function PrivacyPolicyView({ onBack }: PrivacyPolicyViewProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    { id: 'overview', title: 'Overview', icon: <FileText className="w-4 h-4" /> },
    { id: 'data-collection', title: 'Data Collection', icon: <Database className="w-4 h-4" /> },
    { id: 'data-usage', title: 'How We Use Data', icon: <Eye className="w-4 h-4" /> },
    { id: 'data-sharing', title: 'Data Sharing', icon: <Users className="w-4 h-4" /> },
    { id: 'cookies', title: 'Cookies & Tracking', icon: <Cookie className="w-4 h-4" /> },
    { id: 'security', title: 'Security Measures', icon: <Lock className="w-4 h-4" /> },
    { id: 'your-rights', title: 'Your Rights', icon: <Shield className="w-4 h-4" /> },
    { id: 'retention', title: 'Data Retention', icon: <Clock className="w-4 h-4" /> },
    { id: 'compliance', title: 'Legal Compliance', icon: <Scale className="w-4 h-4" /> },
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
                <Shield className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-[10px] text-gold-light tracking-[0.3em] uppercase font-bold">Legal Document</p>
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-parchment font-bold">Privacy Policy</h1>
              </div>
            </div>
            <p className="text-sm text-parchment/60 max-w-2xl leading-relaxed mt-4">
              At Cozy Lagos, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This policy outlines how we collect, use, and safeguard your data in compliance with Nigerian regulations.
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-6 text-xs text-parchment/50">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-gold" />
                <span>Last Updated: July 27, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Scale className="w-3.5 h-3.5 text-gold" />
                <span>NDPR Compliant</span>
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
              id="overview"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">1. Overview</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>
                  <strong className="text-charcoal">COZYLAGOS LTD</strong> ("we", "us", "our") operates the website <strong className="text-charcoal">cozylagos.com</strong> and provides luxury hospitality services across Lagos State, Nigeria.
                </p>
                <p>
                  We are committed to protecting your privacy in accordance with the <strong className="text-charcoal">Nigeria Data Protection Regulation (NDPR) 2019</strong>, the <strong className="text-charcoal">Nigeria Data Protection Act 2023</strong>, and other applicable laws.
                </p>
                <div className="bg-gold/5 border border-gold/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-gold-dark shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-charcoal mb-1">Our Commitment</p>
                      <p className="text-xs text-charcoal/60">
                        We process your personal data lawfully, fairly, and transparently. We collect data only for specified, explicit, and legitimate purposes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              id="data-collection"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Database className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">2. Data Collection</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>We collect the following types of information:</p>
                
                <div className="space-y-3">
                  <div className="bg-parchment/50 rounded-xl p-4 border border-charcoal/5">
                    <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-2">Personal Information</h4>
                    <ul className="space-y-1.5 text-xs text-charcoal/60">
                      <li className="flex items-start gap-2"><span className="text-gold-dark">•</span> Full name and preferred name</li>
                      <li className="flex items-start gap-2"><span className="text-gold-dark">•</span> Email address and phone number</li>
                      <li className="flex items-start gap-2"><span className="text-gold-dark">•</span> Government-issued ID (for verification)</li>
                      <li className="flex items-start gap-2"><span className="text-gold-dark">•</span> Billing address and payment information</li>
                    </ul>
                  </div>
                  <div className="bg-parchment/50 rounded-xl p-4 border border-charcoal/5">
                    <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-2">Booking Information</h4>
                    <ul className="space-y-1.5 text-xs text-charcoal/60">
                      <li className="flex items-start gap-2"><span className="text-gold-dark">•</span> Check-in and check-out dates</li>
                      <li className="flex items-start gap-2"><span className="text-gold-dark">•</span> Number of guests and special requests</li>
                      <li className="flex items-start gap-2"><span className="text-gold-dark">•</span> Property preferences and service selections</li>
                      <li className="flex items-start gap-2"><span className="text-gold-dark">•</span> Payment history and transaction records</li>
                    </ul>
                  </div>
                  <div className="bg-parchment/50 rounded-xl p-4 border border-charcoal/5">
                    <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-2">Technical Data</h4>
                    <ul className="space-y-1.5 text-xs text-charcoal/60">
                      <li className="flex items-start gap-2"><span className="text-gold-dark">•</span> IP address and browser type</li>
                      <li className="flex items-start gap-2"><span className="text-gold-dark">•</span> Device information and operating system</li>
                      <li className="flex items-start gap-2"><span className="text-gold-dark">•</span> Browsing history and search preferences</li>
                      <li className="flex items-start gap-2"><span className="text-gold-dark">•</span> Cookie data and analytics information</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              id="data-usage"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">3. How We Use Your Data</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>We use your personal data for the following purposes:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { title: 'Booking Processing', desc: 'To process and manage your property reservations' },
                    { title: 'Payment Processing', desc: 'To handle transactions securely' },
                    { title: 'Communication', desc: 'To send booking confirmations and updates' },
                    { title: 'Customer Support', desc: 'To respond to inquiries and resolve issues' },
                    { title: 'Service Improvement', desc: 'To enhance our platform and user experience' },
                    { title: 'Marketing', desc: 'To send promotional offers (with consent)' },
                    { title: 'Legal Compliance', desc: 'To comply with Nigerian laws and regulations' },
                    { title: 'Security', desc: 'To protect against fraud and unauthorized access' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-parchment/30 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-charcoal">{item.title}</p>
                        <p className="text-[11px] text-charcoal/50">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            <motion.section
              id="data-sharing"
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
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">4. Data Sharing</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>
                  We do <strong className="text-charcoal">not sell</strong> your personal information to third parties. We may share your data only in the following circumstances:
                </p>
                <div className="space-y-3">
                  <div className="border-l-2 border-gold pl-4">
                    <h4 className="text-xs font-bold text-charcoal mb-1">Service Providers</h4>
                    <p className="text-xs text-charcoal/60">Property owners, concierge services, and payment processors who help deliver our services.</p>
                  </div>
                  <div className="border-l-2 border-gold pl-4">
                    <h4 className="text-xs font-bold text-charcoal mb-1">Government Authorities</h4>
                    <p className="text-xs text-charcoal/60">Lagos State Ministry of Tourism, Arts & Culture, and other regulatory bodies as required by law.</p>
                  </div>
                  <div className="border-l-2 border-gold pl-4">
                    <h4 className="text-xs font-bold text-charcoal mb-1">Legal Requirements</h4>
                    <p className="text-xs text-charcoal/60">When required by court order, law enforcement, or to protect our legal rights.</p>
                  </div>
                  <div className="border-l-2 border-gold pl-4">
                    <h4 className="text-xs font-bold text-charcoal mb-1">Business Transfers</h4>
                    <p className="text-xs text-charcoal/60">In connection with a merger, acquisition, or sale of assets, with prior notice to you.</p>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              id="cookies"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">5. Cookies & Tracking</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>We use cookies and similar tracking technologies to enhance your experience:</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-charcoal/10 rounded-xl overflow-hidden">
                    <thead className="bg-charcoal/5">
                      <tr>
                        <th className="text-left p-3 font-bold text-charcoal">Cookie Type</th>
                        <th className="text-left p-3 font-bold text-charcoal">Purpose</th>
                        <th className="text-left p-3 font-bold text-charcoal">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal/5">
                      <tr>
                        <td className="p-3 text-charcoal/70">Essential</td>
                        <td className="p-3 text-charcoal/60">Site functionality, authentication</td>
                        <td className="p-3 text-charcoal/60">Session</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-charcoal/70">Analytics</td>
                        <td className="p-3 text-charcoal/60">Understand usage patterns</td>
                        <td className="p-3 text-charcoal/60">1 year</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-charcoal/70">Preferences</td>
                        <td className="p-3 text-charcoal/60">Remember your settings</td>
                        <td className="p-3 text-charcoal/60">6 months</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-charcoal/70">Marketing</td>
                        <td className="p-3 text-charcoal/60">Show relevant offers</td>
                        <td className="p-3 text-charcoal/60">30 days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-charcoal/50">
                  You can manage your cookie preferences at any time through your browser settings or our cookie consent banner.
                </p>
              </div>
            </motion.section>

            <motion.section
              id="security"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">6. Security Measures</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>We implement industry-standard security measures to protect your data:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    '256-bit SSL encryption for all data transmission',
                    'PCI-DSS compliant payment processing',
                    'Regular security audits and penetration testing',
                    'Encrypted data storage with access controls',
                    'Multi-factor authentication for admin access',
                    'Automated backup and disaster recovery',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg border border-green-100">
                      <Shield className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-charcoal/70">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            <motion.section
              id="your-rights"
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
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">7. Your Rights</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>Under the NDPR and Nigeria Data Protection Act 2023, you have the right to:</p>
                <div className="space-y-2">
                  {[
                    { right: 'Access', desc: 'Request a copy of your personal data' },
                    { right: 'Rectification', desc: 'Correct inaccurate or incomplete data' },
                    { right: 'Erasure', desc: 'Request deletion of your data ("right to be forgotten")' },
                    { right: 'Restriction', desc: 'Limit how we use your data' },
                    { right: 'Portability', desc: 'Receive your data in a portable format' },
                    { right: 'Objection', desc: 'Object to processing of your data' },
                    { right: 'Withdraw Consent', desc: 'Withdraw consent at any time' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-parchment/30 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-charcoal">{item.right}</p>
                        <p className="text-[11px] text-charcoal/50">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-charcoal/50">
                  To exercise any of these rights, contact our Data Protection Officer at privacy@cozylagos.com
                </p>
              </div>
            </motion.section>

            <motion.section
              id="retention"
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
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">8. Data Retention</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>We retain your personal data only for as long as necessary:</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-charcoal/10 rounded-xl overflow-hidden">
                    <thead className="bg-charcoal/5">
                      <tr>
                        <th className="text-left p-3 font-bold text-charcoal">Data Category</th>
                        <th className="text-left p-3 font-bold text-charcoal">Retention Period</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal/5">
                      <tr>
                        <td className="p-3 text-charcoal/70">Account Information</td>
                        <td className="p-3 text-charcoal/60">Duration of account + 2 years</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-charcoal/70">Booking Records</td>
                        <td className="p-3 text-charcoal/60">7 years (tax compliance)</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-charcoal/70">Payment Data</td>
                        <td className="p-3 text-charcoal/60">7 years (financial regulations)</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-charcoal/70">Marketing Preferences</td>
                        <td className="p-3 text-charcoal/60">Until consent withdrawn</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-charcoal/70">Analytics Data</td>
                        <td className="p-3 text-charcoal/60">2 years</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.section>

            <motion.section
              id="compliance"
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
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">9. Legal Compliance</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>Cozy Lagos operates in full compliance with:</p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-gold/5 border border-gold/20 rounded-xl">
                    <Landmark className="w-5 h-5 text-gold-dark shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-charcoal mb-1">Lagos State Government Partnership</p>
                      <p className="text-xs text-charcoal/60">
                        Cozy Lagos operates in partnership with the Lagos State Ministry of Tourism, Arts & Culture, 
                        supporting the promotion of Lagos as a premier tourism destination. We comply with all state 
                        tourism regulations and contribute to cultural preservation initiatives.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      'Nigeria Data Protection Regulation (NDPR) 2019',
                      'Nigeria Data Protection Act 2023',
                      'Consumer Protection Council (CPC) Regulations',
                      'Lagos State Tourism Regulations',
                      'Electronic Transactions Protection Guidelines',
                      'Central Bank of Nigeria (CBN) Payment Regulations',
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-charcoal/60">
                        <CheckCircle className="w-3.5 h-3.5 text-gold-dark" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
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
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">10. Contact Us</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>For privacy-related inquiries or to exercise your rights, contact us:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-parchment/50 rounded-xl border border-charcoal/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-gold-dark" />
                      <p className="text-xs font-bold text-charcoal">Data Protection Officer</p>
                    </div>
                    <p className="text-xs text-charcoal/60">privacy@cozylagos.com</p>
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
                    <strong className="text-charcoal">Response Time:</strong> We will respond to all privacy-related inquiries within 30 days. 
                    For urgent matters, please contact us via WhatsApp for faster assistance.
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
              <span className="text-gold">NDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
