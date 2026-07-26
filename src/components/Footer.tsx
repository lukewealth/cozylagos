import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Anchor, Mail, Phone, MapPin, Facebook, Twitter, Instagram,
  ArrowRight, Check, Heart, Shield, Award, Globe, Download,
  ChevronRight, Sparkles, Users, Building, Landmark, ExternalLink
} from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setSubscribing(true);
    setTimeout(() => {
      try {
        const subscribers = JSON.parse(localStorage.getItem('cozy_lagos_newsletter') || '[]');
        if (!subscribers.includes(email)) {
          subscribers.push(email);
          localStorage.setItem('cozy_lagos_newsletter', JSON.stringify(subscribers));
        }
      } catch {}
      
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
      setSubscribing(false);
    }, 1000);
  };

  const footerLinks = {
    company: [
      { label: 'About Cozy Lagos', href: '#about' },
      { label: 'Our Story', href: '#story' },
      { label: 'Careers', href: '#careers' },
      { label: 'Press & Media', href: '#press' },
      { label: 'Blog', href: '#blog' },
    ],
    services: [
      { label: 'Luxury Apartments', href: '#apartments' },
      { label: 'Service Bundles', href: '#bundles' },
      { label: 'Yacht Experiences', href: '#yacht' },
      { label: 'VIP Services', href: '#vip' },
      { label: 'Corporate Housing', href: '#corporate' },
    ],
    support: [
      { label: 'Help Center', href: '#help' },
      { label: 'Safety Information', href: '#safety' },
      { label: 'Cancellation Policy', href: '#cancellation' },
      { label: 'Report a Concern', href: '#report' },
      { label: 'Accessibility', href: '#accessibility' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
      { label: 'Cookie Policy', href: '#cookies' },
      { label: 'Guest Protocol', href: '#protocol' },
      { label: 'Refund Policy', href: '#refund' },
    ],
    partnerships: [
      { label: 'Lagos State Tourism', href: '#lagos-tourism' },
      { label: 'Become a Partner', href: '#partner' },
      { label: 'Host Your Property', href: '#host' },
      { label: 'Service Provider', href: '#provider' },
      { label: 'Corporate Partners', href: '#corporate-partners' },
    ],
  };

  return (
    <footer className="bg-charcoal text-parchment relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-dark/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-dark/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-20 pt-16 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center border border-gold/20">
                <Anchor className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-parchment">Cozy Lagos</h3>
                <p className="text-[10px] text-gold-light tracking-widest uppercase">Luxury Hospitality</p>
              </div>
            </div>
            
            <p className="text-sm text-parchment/60 leading-relaxed mb-6 max-w-sm">
              Experience the pinnacle of luxury living in Lagos. From premium apartments to exclusive yacht charters, 
              we curate unforgettable experiences for discerning travelers.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-parchment/60">
                <MapPin className="w-4 h-4 text-gold shrink-0" />
                <span>Victoria Island, Lagos, Nigeria</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-parchment/60">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <span>+234 806 430 5782</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-parchment/60">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <span>hello@cozylagos.com</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com/cozylagos"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-parchment/5 hover:bg-gold/20 border border-parchment/10 hover:border-gold/30 rounded-xl flex items-center justify-center transition-all group"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-parchment/60 group-hover:text-gold transition-colors" />
              </a>
              <a
                href="https://x.com/CozyLagos"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-parchment/5 hover:bg-gold/20 border border-parchment/10 hover:border-gold/30 rounded-xl flex items-center justify-center transition-all group"
                aria-label="X (Twitter)"
              >
                <Twitter className="w-4 h-4 text-parchment/60 group-hover:text-gold transition-colors" />
              </a>
              <a
                href="https://www.tiktok.com/@cozylagos?_r=1&_t=ZS-98L8TMYKrLc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-parchment/5 hover:bg-gold/20 border border-parchment/10 hover:border-gold/30 rounded-xl flex items-center justify-center transition-all group"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4 text-parchment/60 group-hover:text-gold transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.45a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.88z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com/cozylagos"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-parchment/5 hover:bg-gold/20 border border-parchment/10 hover:border-gold/30 rounded-xl flex items-center justify-center transition-all group"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-parchment/60 group-hover:text-gold transition-colors" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
              <div>
                <h4 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-4">Company</h4>
                <ul className="space-y-2.5">
                  {footerLinks.company.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-xs text-parchment/60 hover:text-gold transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-4">Services</h4>
                <ul className="space-y-2.5">
                  {footerLinks.services.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-xs text-parchment/60 hover:text-gold transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-4">Support</h4>
                <ul className="space-y-2.5">
                  {footerLinks.support.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-xs text-parchment/60 hover:text-gold transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-4">Legal</h4>
                <ul className="space-y-2.5">
                  {footerLinks.legal.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-xs text-parchment/60 hover:text-gold transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-4">Partnerships</h4>
                <ul className="space-y-2.5">
                  {footerLinks.partnerships.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-xs text-parchment/60 hover:text-gold transition-colors flex items-center gap-1">
                        {link.label}
                        {link.label.includes('Lagos State') && <ExternalLink className="w-3 h-3" />}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-parchment/10 pt-10 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Download className="w-5 h-5 text-gold" />
                <h4 className="font-serif text-lg font-bold text-parchment">Download Our App</h4>
              </div>
              <p className="text-xs text-parchment/60 mb-4">
                Get the full Cozy Lagos experience on your mobile device. Book stays, manage reservations, and access exclusive deals.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-parchment/5 hover:bg-parchment/10 border border-parchment/10 hover:border-gold/30 rounded-xl transition-all group">
                  <svg className="w-6 h-6 text-parchment/80" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[8px] text-parchment/50 uppercase tracking-wider">Download on</div>
                    <div className="text-xs font-bold text-parchment">App Store</div>
                  </div>
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-parchment/5 hover:bg-parchment/10 border border-parchment/10 hover:border-gold/30 rounded-xl transition-all group">
                  <svg className="w-6 h-6 text-parchment/80" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-[8px] text-parchment/50 uppercase tracking-wider">Get it on</div>
                    <div className="text-xs font-bold text-parchment">Google Play</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-gold" />
                <h4 className="font-serif text-lg font-bold text-parchment">Newsletter</h4>
              </div>
              <p className="text-xs text-parchment/60 mb-4">
                Subscribe for exclusive deals, new listings, and Lagos event updates delivered to your inbox.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 bg-parchment/5 border border-parchment/10 rounded-xl text-sm text-parchment placeholder:text-parchment/30 focus:outline-none focus:border-gold/30 transition-colors"
                  required
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="px-5 py-2.5 bg-gold text-charcoal font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gold-dark hover:text-parchment transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {subscribing ? (
                    <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                  ) : subscribed ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">{subscribed ? 'Subscribed!' : 'Subscribe'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-parchment/10 pt-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              <div className="flex items-center gap-2 text-xs text-parchment/50">
                <Shield className="w-4 h-4 text-gold" />
                <span>24/7 Security</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-parchment/20" />
              <div className="flex items-center gap-2 text-xs text-parchment/50">
                <Award className="w-4 h-4 text-gold" />
                <span>Licensed & Insured</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-parchment/20" />
              <div className="flex items-center gap-2 text-xs text-parchment/50">
                <Heart className="w-4 h-4 text-gold" />
                <span>Trusted by 10,000+ Guests</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-parchment/40">
              <Globe className="w-4 h-4" />
              <span>English (NGN ₦)</span>
            </div>
          </div>
        </div>

        <div className="border-t border-parchment/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px] text-parchment/40 uppercase tracking-wider">
              <span>&copy; {new Date().getFullYear()} Cozy Lagos Ltd</span>
              <span className="hidden sm:inline">&bull;</span>
              <span>Victoria Island Suite 416</span>
              <span className="hidden sm:inline">&bull;</span>
              <span className="text-gold">Nigeria Luxury Certified</span>
            </div>

            <div className="flex items-center gap-4 text-[10px] text-parchment/40">
              <a href="#privacy" className="hover:text-gold transition-colors">Privacy</a>
              <span>&bull;</span>
              <a href="#terms" className="hover:text-gold transition-colors">Terms</a>
              <span>&bull;</span>
              <a href="#sitemap" className="hover:text-gold transition-colors">Sitemap</a>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-parchment/5 text-center">
            <p className="text-[9px] text-parchment/30 uppercase tracking-wider">
              In partnership with Lagos State Ministry of Tourism, Arts & Culture
            </p>
            <p className="text-[9px] text-parchment/20 mt-2">
              Cozy Lagos is a registered hospitality platform operating under Nigerian law. 
              All rights reserved. RC: 1234567
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
