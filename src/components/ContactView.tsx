import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Mail, Phone, MapPin, Clock, Send, MessageCircle, Globe,
  ArrowLeft, CheckCircle, Building2, Users, Award
} from 'lucide-react';

interface ContactViewProps {
  onBack?: () => void;
}

export default function ContactView({ onBack }: ContactViewProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitted(true);
      setSubmitting(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
                <Mail className="w-6 h-6 text-gold" />
              </div>
              <div>
                <p className="text-[10px] text-gold-light tracking-[0.3em] uppercase font-bold">Get in Touch</p>
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-parchment font-bold">Contact Us</h1>
              </div>
            </div>
            <p className="text-sm text-parchment/60 max-w-2xl leading-relaxed mt-4">
              Have questions about our services? Need assistance with a booking? Our team is here to help you experience the best of Lagos.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-20 py-10 sm:py-14 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-gold-dark" />
                </div>
                <h3 className="font-serif text-lg font-bold text-charcoal">Email Us</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs font-bold text-charcoal uppercase tracking-wider mb-1">General Inquiries</p>
                  <a href="mailto:hello@cozylagos.com" className="text-charcoal/60 hover:text-gold-dark transition-colors">
                    hello@cozylagos.com
                  </a>
                </div>
                <div>
                  <p className="text-xs font-bold text-charcoal uppercase tracking-wider mb-1">Support</p>
                  <a href="mailto:support@cozylagos.com" className="text-charcoal/60 hover:text-gold-dark transition-colors">
                    support@cozylagos.com
                  </a>
                </div>
                <div>
                  <p className="text-xs font-bold text-charcoal uppercase tracking-wider mb-1">Privacy</p>
                  <a href="mailto:privacy@cozylagos.com" className="text-charcoal/60 hover:text-gold-dark transition-colors">
                    privacy@cozylagos.com
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-gold-dark" />
                </div>
                <h3 className="font-serif text-lg font-bold text-charcoal">Call or WhatsApp</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs font-bold text-charcoal uppercase tracking-wider mb-1">Phone</p>
                  <a href="tel:+2348064305782" className="text-charcoal/60 hover:text-gold-dark transition-colors">
                    +234 806 430 5782
                  </a>
                </div>
                <div>
                  <p className="text-xs font-bold text-charcoal uppercase tracking-wider mb-1">WhatsApp</p>
                  <a href="https://wa.me/2348064305782" target="_blank" rel="noopener noreferrer" className="text-charcoal/60 hover:text-gold-dark transition-colors">
                    +234 806 430 5782
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-gold-dark" />
                </div>
                <h3 className="font-serif text-lg font-bold text-charcoal">Visit Us</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs font-bold text-charcoal uppercase tracking-wider mb-1">Office Address</p>
                  <p className="text-charcoal/60">
                    Victoria Island, Lagos<br />
                    Nigeria
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-charcoal uppercase tracking-wider mb-1">Business Hours</p>
                  <div className="text-charcoal/60 space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gold-dark" />
                      <span>Monday - Friday: 9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gold-dark" />
                      <span>Saturday: 10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gold-dark" />
                      <span>Sunday: Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-br from-gold/10 to-gold-dark/10 rounded-2xl border border-gold/20 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-gold-dark" />
                <h3 className="font-serif text-lg font-bold text-charcoal">Why Choose Us?</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                  <p className="text-charcoal/70">Trusted by 10,000+ guests</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                  <p className="text-charcoal/70">24/7 customer support</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                  <p className="text-charcoal/70">Verified properties & services</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                  <p className="text-charcoal/70">Secure payment processing</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Send className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">Send Us a Message</h2>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-charcoal mb-2">Message Sent!</h3>
                  <p className="text-sm text-charcoal/60 mb-6">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 bg-charcoal text-parchment hover:bg-gold-dark rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-parchment/50 border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:border-gold/50 transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-parchment/50 border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:border-gold/50 transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-parchment/50 border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:border-gold/50 transition-colors"
                        placeholder="+234 800 000 0000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-parchment/50 border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:border-gold/50 transition-colors"
                      >
                        <option value="">Select a subject</option>
                        <option value="booking">Booking Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="partnership">Partnership Opportunity</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-parchment/50 border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:border-gold/50 transition-colors resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gold/5 border border-gold/20 rounded-xl">
                    <MessageCircle className="w-5 h-5 text-gold-dark shrink-0 mt-0.5" />
                    <div className="text-xs text-charcoal/60">
                      <p className="font-bold text-charcoal mb-1">Response Time</p>
                      <p>We typically respond within 24 hours. For urgent matters, please call or WhatsApp us directly.</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-charcoal text-parchment hover:bg-gold-dark rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-parchment/30 border-t-parchment rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="bg-charcoal/5 border-t border-charcoal/10 py-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal/50">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gold" />
              <span>COZYLAGOS LTD • Victoria Island, Lagos, Nigeria</span>
            </div>
            <div className="flex items-center gap-4">
              <span>&copy; 2026 All Rights Reserved</span>
              <span className="text-gold">RC: 1234567</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
