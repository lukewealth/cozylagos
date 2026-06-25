import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plane, Hotel, Ship, MapPin, Clock, Star, ChevronRight, Check,
  Crown, Wine, Music, Camera, Anchor, Sun, Moon, Sparkles,
  ArrowRight, Package, Calendar, Users, DollarSign
} from 'lucide-react';
import { SERVICE_BUNDLES } from '../data';

interface JourneyStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  highlights: string[];
  image: string;
  time: string;
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 'airport',
    title: 'VIP Airport Pickup',
    description: 'Meet & greet at Murtala Muhammed International Airport with luxury sedan, cold water, and fast-track through arrivals.',
    icon: <Plane className="w-8 h-8" />,
    duration: '1 hour',
    highlights: ['Meet & greet service', 'Luxury sedan', 'Fast-track immigration', 'Cold water & refreshments', 'Luggage assistance'],
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80',
    time: 'Arrival Day'
  },
  {
    id: 'hotel',
    title: 'Luxury Apartment Check-in',
    description: 'Seamless check-in at your premium Victoria Island apartment with concierge welcome package and orientation.',
    icon: <Hotel className="w-8 h-8" />,
    duration: '30 mins',
    highlights: ['Premium apartment', 'Concierge welcome', 'Apartment orientation', 'Welcome package', '24/7 support'],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
    time: 'Arrival Day'
  },
  {
    id: 'yacht',
    title: 'Private Yacht Experience',
    description: 'Luxury yacht charter with crew, catering, and the freedom to explore Lagos Lagoon in style. Champagne, canapés, and sunset views.',
    icon: <Ship className="w-8 h-8" />,
    duration: '4-6 hours',
    highlights: ['Private yacht charter', 'Professional crew', 'Champagne & canapés', 'Sunset cruise', 'Lagos Lagoon tour', 'Photography service'],
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80',
    time: 'Day 2'
  },
  {
    id: 'checkout',
    title: 'Seamless Checkout',
    description: 'Hassle-free checkout with airport transfer arranged, luggage assistance, and departure coordination.',
    icon: <Plane className="w-8 h-8" />,
    duration: '30 mins',
    highlights: ['Flexible checkout', 'Airport transfer', 'Luggage assistance', 'Departure coordination', 'Farewell gift'],
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80',
    time: 'Departure Day'
  }
];

const YACHT_BUNDLES = SERVICE_BUNDLES.filter(b => 
  b.id === 'lavish-love' || b.id === 'executive-elite' || b.id === 'tourist-bundle'
);

export default function YachtExperienceView({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [selectedStep, setSelectedStep] = useState<JourneyStep | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<typeof SERVICE_BUNDLES[0] | null>(null);

  return (
    <div className="flex-grow flex flex-col animate-fade-in-up">
      {/* Hero Section */}
      <section className="relative w-full h-[500px] sm:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-charcoal">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover opacity-50 select-none pointer-events-none"
            src="https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=1600&q=80"
            alt="Yacht Experience"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/30 to-charcoal/90" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] px-4 sm:px-6 md:px-12 xl:px-20 mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3 mb-4"
          >
            <Anchor className="w-6 h-6 text-gold" />
            <span className="text-gold-light text-[10px] font-bold tracking-[0.4em] uppercase">
              Premium Experience
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl xl:text-7xl text-parchment leading-tight tracking-tight max-w-4xl mb-4"
          >
            Luxury Yacht <span className="italic font-light text-gold-light">Experience</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="font-sans text-sm sm:text-base text-parchment/70 max-w-2xl font-light leading-relaxed px-2"
          >
            From airport pickup to sunset yacht cruise — experience Lagos in ultimate luxury with our curated journey.
          </motion.p>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="py-16 px-4 sm:px-6 md:px-12 xl:px-20 max-w-[1440px] mx-auto w-full">
        <div className="text-center mb-12">
          <span className="text-gold-dark font-bold text-[10px] tracking-[0.25em] uppercase block mb-2">
            Your Journey
          </span>
          <h2 className="font-serif font-semibold text-3xl sm:text-4xl text-charcoal">
            From Arrival to Departure
          </h2>
          <p className="text-sm text-charcoal-light mt-2 max-w-xl mx-auto">
            Every detail meticulously planned for your perfect Lagos experience
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gold/20 transform sm:-translate-x-1/2" />

          {/* Journey Steps */}
          <div className="space-y-12">
            {JOURNEY_STEPS.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex items-center gap-8 ${
                  index % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 sm:left-1/2 w-4 h-4 bg-gold rounded-full transform -translate-x-1/2 border-4 border-parchment z-10" />

                {/* Content Card */}
                <div className={`flex-1 ml-16 sm:ml-0 ${index % 2 === 0 ? 'sm:pr-12' : 'sm:pl-12'}`}>
                  <div
                    onClick={() => setSelectedStep(step)}
                    className="bg-parchment border border-charcoal/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/assets/bundles/bundles-hero-background.jpeg'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <div className="bg-gold/90 backdrop-blur-md p-3 rounded-xl text-charcoal">
                          {step.icon}
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 text-gold-light text-xs mb-1">
                          <Clock className="w-3 h-3" />
                          <span>{step.time}</span>
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-parchment">{step.title}</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-charcoal/70 mb-4">{step.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-charcoal/60">
                          <Clock className="w-4 h-4" />
                          <span>{step.duration}</span>
                        </div>
                        <button className="flex items-center gap-1 text-xs font-bold text-gold-dark hover:text-charcoal transition-colors">
                          <span>View Details</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden sm:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle Integration */}
      <section className="py-16 px-4 sm:px-6 md:px-12 xl:px-20 max-w-[1440px] mx-auto w-full bg-charcoal/5">
        <div className="text-center mb-12">
          <span className="text-gold-dark font-bold text-[10px] tracking-[0.25em] uppercase block mb-2">
            Book This Experience
          </span>
          <h2 className="font-serif font-semibold text-3xl sm:text-4xl text-charcoal">
            Choose Your Bundle
          </h2>
          <p className="text-sm text-charcoal-light mt-2 max-w-xl mx-auto">
            This yacht experience is included in our premium bundles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {YACHT_BUNDLES.map((bundle, index) => (
            <motion.div
              key={bundle.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedBundle(bundle)}
              className="bg-parchment border border-charcoal/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={bundle.image}
                  alt={bundle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-gold-light text-[9px] font-bold tracking-[0.3em] uppercase block mb-1">
                    {bundle.tagline}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-parchment">{bundle.title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs text-charcoal/60 mb-4 line-clamp-2">{bundle.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[9px] font-bold text-charcoal/40 uppercase tracking-widest block">Starting from</span>
                    <span className="font-serif text-2xl font-bold text-gold-dark">₦{bundle.tiers[0].price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-charcoal/60">
                    <Clock className="w-4 h-4" />
                    <span>{bundle.tiers[0].duration}</span>
                  </div>
                </div>
                <button className="w-full py-3 bg-charcoal text-parchment hover:bg-gold-dark font-bold text-xs tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2">
                  <span>View Bundle</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedStep && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setSelectedStep(null)}
          >
            <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" />
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-parchment w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-48 sm:h-64 overflow-hidden shrink-0">
                <img src={selectedStep.image} alt={selectedStep.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <button
                  onClick={() => setSelectedStep(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-gold/90 backdrop-blur-md p-2 rounded-lg text-charcoal">
                      {selectedStep.icon}
                    </div>
                    <span className="text-gold-light text-[9px] font-bold tracking-[0.3em] uppercase">
                      {selectedStep.time}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-parchment">{selectedStep.title}</h2>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <p className="text-sm text-charcoal/70 leading-relaxed mb-6">{selectedStep.description}</p>

                <div className="mb-6">
                  <h4 className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-3">What's Included</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedStep.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-gold/5 border border-gold/10">
                        <Check className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                        <span className="text-xs text-charcoal font-medium">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-charcoal text-parchment rounded-2xl p-4 sm:p-6">
                  <span className="text-[9px] font-bold text-gold uppercase tracking-widest block mb-1">Duration</span>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-gold" />
                    <span className="font-serif text-xl font-bold text-parchment">{selectedStep.duration}</span>
                  </div>
                  <p className="text-xs text-parchment/70 mb-4">
                    This experience is included in our premium bundles. Book now for a seamless luxury experience.
                  </p>
                  <button
                    onClick={() => { setSelectedStep(null); onNavigate('bundles'); }}
                    className="w-full py-3 bg-gold text-charcoal hover:bg-gold-dark font-bold text-xs tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <span>View Bundles</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bundle Detail Modal */}
      <AnimatePresence>
        {selectedBundle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setSelectedBundle(null)}
          >
            <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" />
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative bg-parchment w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-48 overflow-hidden shrink-0">
                <img src={selectedBundle.image} alt={selectedBundle.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <button
                  onClick={() => setSelectedBundle(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-gold-light text-[9px] font-bold tracking-[0.3em] uppercase block mb-1">
                    {selectedBundle.tagline}
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-parchment">{selectedBundle.title}</h2>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <p className="text-sm text-charcoal/70 leading-relaxed mb-6">{selectedBundle.description}</p>

                <div className="mb-6">
                  <h4 className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest mb-3">Package Highlights</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedBundle.highlights.slice(0, 6).map((h, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-gold/5 border border-gold/10">
                        <Check className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                        <span className="text-xs text-charcoal font-medium">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-charcoal text-parchment rounded-2xl p-4 sm:p-6">
                  <span className="text-[9px] font-bold text-gold uppercase tracking-widest block mb-1">Starting From</span>
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="font-serif text-3xl font-bold text-parchment">
                      ₦{selectedBundle.tiers[0].price.toLocaleString()}
                    </span>
                    <span className="text-xs text-parchment/60">{selectedBundle.tiers[0].duration}</span>
                  </div>
                  <button
                    onClick={() => { setSelectedBundle(null); onNavigate('bundles'); }}
                    className="w-full py-3 bg-gold text-charcoal hover:bg-gold-dark font-bold text-xs tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <span>Book This Bundle</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
