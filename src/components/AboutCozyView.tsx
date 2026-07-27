import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Anchor, ArrowLeft, Sparkles, Shield, TrendingUp, Users, Building2,
  Landmark, Brain, Package, Handshake, Award, Mail, Phone, MapPin,
  CheckCircle, Globe, Wifi, Flame, Compass, HandHelping, Star,
  Zap, Target, Eye, Heart, Briefcase, Music, Palette, Camera
} from 'lucide-react';

interface AboutCozyViewProps {
  onBack?: () => void;
  onNavigate?: (tab: string) => void;
}

export default function AboutCozyView({ onBack, onNavigate }: AboutCozyViewProps) {
  const [activeSection, setActiveSection] = useState<string>('story');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const sections = [
    { id: 'story', title: 'Our Story', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'vision', title: 'Vision & Mission', icon: <Target className="w-4 h-4" /> },
    { id: 'ecosystem', title: 'Connected Ecosystem', icon: <Globe className="w-4 h-4" /> },
    { id: 'government', title: 'Lagos State Alignment', icon: <Landmark className="w-4 h-4" /> },
    { id: 'ai', title: 'Agentic AI & Automation', icon: <Brain className="w-4 h-4" /> },
    { id: 'services', title: 'Services & Bundles', icon: <Package className="w-4 h-4" /> },
    { id: 'partnerships', title: 'Partnerships', icon: <Handshake className="w-4 h-4" /> },
    { id: 'excellence', title: 'Global Excellence', icon: <Award className="w-4 h-4" /> },
    { id: 'contact', title: 'Contact & DPO', icon: <Mail className="w-4 h-4" /> },
  ];

  const stats = [
    { label: 'Verified Properties', value: '500+', icon: <Building2 className="w-5 h-5" /> },
    { label: 'Happy Guests', value: '10,000+', icon: <Heart className="w-5 h-5" /> },
    { label: 'Local Partners', value: '200+', icon: <Users className="w-5 h-5" /> },
    { label: 'Cities Covered', value: '1', icon: <MapPin className="w-5 h-5" /> },
  ];

  return (
    <div className="flex-grow flex flex-col bg-parchment">
      {/* Hero Section */}
      <div className="relative bg-charcoal overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-dark/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-dark/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/3 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-20 py-12 sm:py-16">
          {onBack && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              onClick={onBack}
              className="flex items-center gap-2 text-parchment/60 hover:text-gold text-sm mb-6 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </motion.button>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.2, type: 'spring' }}
                className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center border border-gold/20"
              >
                <Anchor className="w-7 h-7 text-gold" />
              </motion.div>
              <div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-[10px] text-gold-light tracking-[0.3em] uppercase font-bold"
                >
                  About Cozy Lagos
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="font-serif text-3xl sm:text-4xl md:text-5xl text-parchment font-bold"
                >
                  Building Lagos's Connected Future
                </motion.h1>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-sm sm:text-base text-parchment/60 max-w-3xl leading-relaxed mt-4"
            >
              Your trusted guide to Lagos. We turn a fragmented city of extraordinary potential into a seamless, 
              verified, and unforgettable experience — for visitors, residents, and partners alike.
            </motion.p>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 text-center"
                >
                  <div className="flex items-center justify-center mb-2 text-gold">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-parchment mb-1">{stat.value}</div>
                  <div className="text-[10px] text-parchment/50 uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-20 py-10 sm:py-14 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sticky Sidebar Navigation */}
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

          {/* Content Sections */}
          <div className="lg:col-span-9 space-y-10">
            {/* Our Story */}
            <motion.section
              id="story"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">Our Story</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>
                  Lagos has everything it takes to become Africa's tourism capital: world-class culture, creativity, 
                  hospitality, beaches, nightlife, music, art, and an unmatched entrepreneurial spirit. Yet for too long, 
                  experiencing the city has felt fragmented.
                </p>
                <p>
                  Accommodation, transportation, restaurants, events, museums, beaches, and concierge services have 
                  operated in silos. Visitors spend hours searching across apps, websites, and social media. Trust is 
                  hard to establish. Great local businesses remain invisible. Data that could guide policy and growth 
                  stays scattered.
                </p>
                <div className="bg-gold/5 border border-gold/20 rounded-xl p-4 mt-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-gold-dark shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-charcoal mb-1">Our Solution</p>
                      <p className="text-xs text-charcoal/60">
                        Cozy Lagos was founded to close that gap. We are building the connected tourism and lifestyle 
                        ecosystem Lagos deserves — one that makes discovering, staying, and experiencing the city simple, 
                        trusted, and memorable.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Vision & Mission */}
            <motion.section
              id="vision"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">Vision & Mission</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <div className="bg-parchment/50 rounded-xl p-4 border border-charcoal/5">
                  <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-gold-dark" />
                    Vision
                  </h4>
                  <p className="text-xs text-charcoal/70">
                    To position Lagos as Africa's premier connected tourism and lifestyle destination through verified 
                    experiences, intelligent curation, and seamless digital infrastructure.
                  </p>
                </div>
                <div className="bg-parchment/50 rounded-xl p-4 border border-charcoal/5">
                  <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-gold-dark" />
                    Mission
                  </h4>
                  <p className="text-xs text-charcoal/70">
                    To empower visitors with confidence, amplify local businesses with visibility, generate high-quality 
                    data for policymakers, and deliver a consistent five-star experience that reflects the excellence of 
                    Lagos and Nigeria on the global stage.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Connected Ecosystem */}
            <motion.section
              id="ecosystem"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">A Connected Ecosystem</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>We solve the five core challenges identified by our founder:</p>
                <div className="space-y-3">
                  {[
                    { title: 'Fragmentation', desc: 'One platform for stays, exploration, dining, culture, and assistance', icon: <Globe className="w-4 h-4" /> },
                    { title: 'Trust', desc: 'Every listing and partner is verified', icon: <Shield className="w-4 h-4" /> },
                    { title: 'Visibility', desc: 'Exceptional local businesses gain digital presence and bookings', icon: <Eye className="w-4 h-4" /> },
                    { title: 'Planning Friction', desc: 'Curated bundles turn hours of research into minutes of delight', icon: <Zap className="w-4 h-4" /> },
                    { title: 'Data Silos', desc: 'Aggregated, privacy-respecting insights support smarter tourism policy', icon: <TrendingUp className="w-4 h-4" /> },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="flex items-start gap-3 p-3 bg-parchment/30 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center shrink-0 text-gold-dark">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-charcoal">{item.title}</p>
                        <p className="text-[11px] text-charcoal/60">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <p className="text-xs text-charcoal/60 mt-4">
                  The result benefits everyone: smoother guest journeys, stronger local enterprises, new jobs, better 
                  government intelligence, and a rising global reputation for Lagos.
                </p>
              </div>
            </motion.section>

            {/* Lagos State Alignment */}
            <motion.section
              id="government"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Landmark className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">Aligned with Lagos State Ambition</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>
                  Cozy Lagos operates in full support of the Lagos State Government's strategic priorities in tourism, 
                  arts, culture, business empowerment, and data-driven governance. We recognise the state's leadership 
                  under Governor Babajide Sanwo-Olu and the Ministry of Tourism, Arts and Culture in positioning Lagos 
                  as Africa's leading cultural and tourism destination.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {[
                    { title: 'Data for Decision-Making', desc: 'Privacy-first visitor analytics that inform infrastructure and marketing strategies', icon: <TrendingUp className="w-4 h-4" /> },
                    { title: 'Business Empowerment', desc: 'Digital visibility and curated demand for hotels, restaurants, and creatives', icon: <Briefcase className="w-4 h-4" /> },
                    { title: 'Arts, Music & Culture', desc: 'Integration of galleries, festivals, and heritage sites into visitor journeys', icon: <Palette className="w-4 h-4" /> },
                    { title: 'Tourism & Trade', desc: 'Supporting Lagos as a global hub through high-quality hospitality standards', icon: <Globe className="w-4 h-4" /> },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="bg-parchment/50 rounded-xl p-4 border border-charcoal/5"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center text-gold-dark">
                          {item.icon}
                        </div>
                        <h4 className="text-xs font-bold text-charcoal">{item.title}</h4>
                      </div>
                      <p className="text-[11px] text-charcoal/60">{item.desc}</p>
                    </motion.div>
                  ))}
                </div>
                <p className="text-xs text-charcoal/60 mt-4">
                  We welcome structured public-private partnership opportunities that advance the state's THEMES+ agenda 
                  and the broader goal of a Greater Lagos Rising.
                </p>
              </div>
            </motion.section>

            {/* Agentic AI */}
            <motion.section
              id="ai"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">Agentic AI & Business Automation</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>
                  Cozy Lagos is building the best agentic AI business automation experience for hospitality and tourism 
                  in Nigeria. Our intelligent agents handle personalised itinerary creation, dynamic pricing guidance, 
                  guest communication, inventory synchronisation, and predictive demand insights — all while remaining 
                  fully compliant with Nigerian data protection law.
                </p>
                <div className="bg-charcoal/5 rounded-xl p-4 mt-4">
                  <p className="text-xs text-charcoal/70">
                    <strong className="text-charcoal">This is not generic chatbot technology.</strong> It is purpose-built 
                    automation that frees hosts and partners to focus on hospitality excellence while guests receive a 
                    consistently elevated, five-star digital experience.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* Services & Bundles */}
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
                  <Package className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">Services, Apartment Renting & Curated Bundles</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>
                  At the heart of Cozy Lagos is a portfolio of verified short- and medium-term apartment rentals and 
                  lifestyle stays across Lagos's most desirable locations. Every property meets rigorous standards of 
                  cleanliness, safety, design, and guest readiness.
                </p>
                <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mt-6">Structured Practices for Business Growth</h4>
                <div className="space-y-2">
                  {[
                    'Verified stays with transparent pricing and real guest reviews',
                    'Curated experience bundles (stay + culture + dining + mobility)',
                    'Lagos Assist concierge for arrivals, transport, and on-ground support',
                    'Partner dashboard with performance analytics and AI recommendations',
                    'Compliance-ready operations under Nigerian law and NDPR',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                      <span className="text-xs text-charcoal/70">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-charcoal/60 mt-4">
                  Whether you are a guest seeking a flawless Lagos stay or a property owner ready to scale with 
                  professional systems, Cozy Lagos provides the infrastructure for sustainable growth.
                </p>
              </div>
            </motion.section>

            {/* Partnerships */}
            <motion.section
              id="partnerships"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-charcoal/5 p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                  <Handshake className="w-5 h-5 text-gold-dark" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">Partnership Opportunities</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>We actively seek partnerships with:</p>
                <div className="space-y-2">
                  {[
                    'Property owners and hospitality operators seeking professional management',
                    'Restaurants, cultural venues, tour companies, and creative businesses',
                    'Technology and AI solution providers',
                    'Corporate travel and event planners',
                    'Lagos State agencies and development partners focused on tourism and data',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                      <span className="text-xs text-charcoal/70">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-charcoal/60 mt-4">
                  Together we can build the connected ecosystem that turns Lagos's extraordinary potential into daily excellence.
                </p>
              </div>
            </motion.section>

            {/* Global Excellence */}
            <motion.section
              id="excellence"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-charcoal rounded-2xl p-6 sm:p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center border border-gold/20">
                  <Award className="w-5 h-5 text-gold" />
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-parchment">Global Excellence — Five-Star Experience</h2>
              </div>
              <div className="space-y-4 text-sm text-parchment/80 leading-relaxed">
                <h3 className="text-gold font-bold text-base">Structured. Curated. Uncompromising.</h3>
                <p className="text-parchment/70">
                  Every Cozy Lagos experience is designed to world-class standards. From the moment a guest lands to the 
                  moment they leave, we aim for the quiet confidence of five-star hospitality — delivered through verified 
                  homes, intelligent curation, and human care.
                </p>
                <p className="text-parchment/70">
                  This is how Lagos competes globally.
                </p>
              </div>
            </motion.section>

            {/* Contact & DPO */}
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
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">Data Protection & Contact</h2>
              </div>
              <div className="space-y-4 text-sm text-charcoal/70 leading-relaxed">
                <p>
                  Cozy Lagos LTD is committed to full compliance with the Nigeria Data Protection Act 2023 and the 
                  Nigeria Data Protection Regulation (NDPR). We treat guest and partner data with the highest standards 
                  of security, transparency, and purpose limitation.
                </p>
                <div className="bg-parchment/50 rounded-xl p-4 border border-charcoal/5 mt-4">
                  <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-3">Data Protection Officer</h4>
                  <div className="space-y-2 text-xs text-charcoal/70">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gold-dark" />
                      <span><strong>Email:</strong> dpo@cozylagos.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gold-dark" />
                      <span><strong>General:</strong> hello@cozylagos.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gold-dark" />
                      <span><strong>WhatsApp:</strong> +234 806 430 5782</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gold-dark" />
                      <span><strong>Website:</strong> www.cozylagos.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-charcoal/5 border-t border-charcoal/10 py-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal/50">
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-gold" />
              <span>In partnership with Lagos State Ministry of Tourism, Arts & Culture</span>
            </div>
            <div className="flex items-center gap-4">
              <span>&copy; 2026 COZYLAGOS LTD</span>
              <span className="text-gold">www.cozylagos.com</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-charcoal/5 text-center">
            <p className="text-[10px] text-charcoal/40 uppercase tracking-wider">
              Verified stays · Curated bundles · Explore Lagos · Lagos Assist
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
