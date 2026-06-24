import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Anchor, ArrowRight, Shield, Waves, Wifi, Flame, MapPin, Compass, HandHelping } from 'lucide-react';
import { Listing } from '../types';
import { INITIAL_LISTINGS } from '../data';
import ApartmentCard from './ui/ApartmentCard';
import GemCard from './ui/GemCard';
import Hero from './Hero';
import SmartSearchBar from './SmartSearchBar';
import PropertyMap from './PropertyMap';
import ExploreLagosView from './ExploreLagosView';
import VIPServicesView from './VIPServicesView';

interface LandingPageProps {
  listings: Listing[];
  onSelectListing: (listing: Listing) => void;
  setActiveTab: (tab: string) => void;
}

export default function LandingPage({ listings, onSelectListing, setActiveTab }: LandingPageProps) {
  const allListings = listings.length > 0 ? listings : INITIAL_LISTINGS;

  const [filteredListings, setFilteredListings] = useState<Listing[]>(allListings);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [homeTab, setHomeTab] = useState<'gems' | 'explore-lagos' | 'vip-services'>('gems');

  const handleSearchResults = (results: Listing[], query: string) => {
    setFilteredListings(results.length > 0 ? results : allListings);
    setSearchQuery(query);
  };

  const tabs = [
    { id: 'gems' as const, label: 'Lagos Gems', icon: Flame },
    { id: 'explore-lagos' as const, label: 'Explore Lagos', icon: Compass },
    { id: 'vip-services' as const, label: 'Lagos Assist', icon: HandHelping },
  ];

  return (
    <div className="flex-grow flex flex-col animate-fade-in">
      {/* 1. HERO SECTION WITH SEARCH */}
      <Hero>
        <SmartSearchBar
          listings={allListings}
          onResultsChange={handleSearchResults}
        />
        <div className="mt-6 flex items-center justify-center gap-1 sm:gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = homeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setHomeTab(tab.id)}
                className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-gold text-charcoal shadow-lg scale-105'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white backdrop-blur-md'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </Hero>

      <AnimatePresence mode="wait">
        {homeTab === 'gems' && (
          <motion.div
            key="gems"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* 2. LAGOS GEMS - HOT DEALS */}
            <section className="py-10 sm:py-16 md:py-24 px-4 sm:px-6 lg:px-12 xl:px-20 max-w-[1440px] mx-auto w-full">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 md:mb-12 gap-4">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-4 h-4 text-red-500 fill-current" />
                    <span className="text-red-500 font-bold text-[10px] tracking-[0.25em] uppercase">
                      Don't Miss Out
                    </span>
                  </div>
                  <h2 className="font-serif text-3xl md:text-5xl text-charcoal mb-2">Lagos Gems</h2>
                  <div className="w-20 h-1 bg-red-500 rounded-full"></div>
                </div>
                <button
                  onClick={() => setActiveTab('explorer')}
                  className="group/btn flex items-center gap-2 text-gold-dark hover:text-charcoal font-bold text-xs tracking-wider uppercase border-b-2 border-gold/40 hover:border-charcoal pb-1 transition-all self-start md:self-auto"
                >
                  <span>Explore All Stays</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>

              {filteredListings.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {filteredListings.slice(0, 8).map((listing, index) => (
                    <GemCard
                      key={listing.id}
                      listing={listing}
                      index={index}
                      onClick={() => onSelectListing(listing)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-charcoal/40 font-serif text-2xl">No gems found matching your search.</p>
                  <button
                    onClick={() => { setFilteredListings(allListings); setSearchQuery(''); }}
                    className="mt-4 text-gold-dark hover:text-charcoal text-sm font-bold underline"
                  >
                    Show all properties
                  </button>
                </div>
              )}
            </section>

            {/* 2B. ALL LISTINGS */}
            {filteredListings.length > 8 && (
              <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-12 xl:px-20 max-w-[1440px] mx-auto w-full">
                <div className="text-left mb-8">
                  <span className="text-gold-dark font-bold text-[10px] tracking-[0.25em] uppercase block mb-2">
                    {searchQuery ? 'Search Results' : 'Full Collection'}
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl text-charcoal">
                    {searchQuery ? `${filteredListings.length} Properties Found` : 'All Residences'}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {filteredListings.slice(8).map((listing) => (
                    <ApartmentCard
                      key={listing.id}
                      listing={listing}
                      onClick={() => onSelectListing(listing)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 3. MAP SECTION */}
            <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-12 xl:px-20 max-w-[1440px] mx-auto w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-1">
                    Explore Properties on Map
                  </h2>
                  <p className="text-sm text-charcoal/60">
                    Click on pins to view property details
                  </p>
                </div>
                <button
                  onClick={() => setShowMap(!showMap)}
                  className="px-5 py-2.5 bg-charcoal text-parchment hover:bg-gold-dark rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  {showMap ? 'Hide Map' : 'View Property Map'}
                </button>
              </div>
              <AnimatePresence>
                {showMap && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <PropertyMap
                      listings={filteredListings.length > 0 ? filteredListings : allListings}
                      onSelectListing={onSelectListing}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </section>

            {/* 4. EXPERIENCE & BUNDLES MERGED SECTION */}
            <section className="py-10 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-12 xl:px-20 bg-charcoal text-parchment relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-gold-dark/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-gold-dark/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-[1440px] mx-auto">
                <div className="text-center mb-12">
                  <span className="text-gold uppercase tracking-[0.3em] font-bold text-[10px] block mb-3">
                    Premium Experiences
                  </span>
                  <h2 className="font-serif text-3xl md:text-5xl text-parchment leading-tight mb-4">
                    Curate Your <span className="italic font-light">Lagos Experience</span>
                  </h2>
                  <p className="text-sm md:text-base text-parchment/70 font-light max-w-2xl mx-auto leading-relaxed">
                    From private yacht charters to bespoke service bundles, every experience is tailored to your desires.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="bg-parchment/5 backdrop-blur-md border border-parchment/10 rounded-2xl p-6 hover:bg-parchment/10 transition-all group cursor-pointer"
                    onClick={() => setActiveTab('yacht-experience')}
                  >
                    <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Anchor className="w-6 h-6 text-gold-light" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-parchment mb-2">Private Yacht Charter</h3>
                    <p className="text-sm text-parchment/60 leading-relaxed mb-4">
                      65ft luxury executive boat for custom lagoon cruising with multi-course dining and premium champagnes.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gold-light font-serif font-bold text-lg">₦2,500,000</span>
                      <span className="text-[10px] text-parchment/40 uppercase tracking-widest">From / 6hrs</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="bg-parchment/5 backdrop-blur-md border border-gold/20 rounded-2xl p-6 hover:bg-parchment/10 transition-all group cursor-pointer"
                    onClick={() => setActiveTab('bundles')}
                  >
                    <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Waves className="w-6 h-6 text-gold-light" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-parchment mb-2">Service Bundles</h3>
                    <p className="text-sm text-parchment/60 leading-relaxed mb-4">
                      7 premium bundles from ₦750K to ₦88M. Business, Diaspora, Tourist, Executive Elite, and more.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gold-light font-serif font-bold text-lg">₦750,000</span>
                      <span className="text-[10px] text-parchment/40 uppercase tracking-widest">From / 3 days</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-parchment/5 backdrop-blur-md border border-parchment/10 rounded-2xl p-6 hover:bg-parchment/10 transition-all group cursor-pointer"
                    onClick={() => setActiveTab('vip-services')}
                  >
                    <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Shield className="w-6 h-6 text-gold-light" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-parchment mb-2">Lagos Assist</h3>
                    <p className="text-sm text-parchment/60 leading-relaxed mb-4">
                      Premium concierge services, transportation, wellness, and personalized assistance for your stay.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gold-light font-serif font-bold text-lg">Premium</span>
                      <span className="text-[10px] text-parchment/40 uppercase tracking-widest">For all guests</span>
                    </div>
                  </motion.div>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setActiveTab('bundles')}
                    className="px-8 py-4 bg-gold hover:bg-parchment text-charcoal font-bold text-xs tracking-widest uppercase rounded-xl transition-all inline-flex items-center gap-3 active:scale-95"
                  >
                    <span>View All Packages</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* 5. TRUST BADGES */}
            <section className="py-12 px-4 md:px-6 lg:px-12 xl:px-20 max-w-[1440px] mx-auto w-full">
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-charcoal/50 text-xs font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-gold-dark" /> 24/7 Security</span>
                <span className="hidden md:block w-1 h-1 rounded-full bg-charcoal/20" />
                <span className="flex items-center gap-2"><Waves className="w-4 h-4 text-gold-dark" /> Ocean Views</span>
                <span className="hidden md:block w-1 h-1 rounded-full bg-charcoal/20" />
                <span className="flex items-center gap-2"><Wifi className="w-4 h-4 text-gold-dark" /> Fiber Internet</span>
                <span className="hidden md:block w-1 h-1 rounded-full bg-charcoal/20" />
                <span className="flex items-center gap-2"><Anchor className="w-4 h-4 text-gold-dark" /> Yacht Access</span>
              </div>
            </section>
          </motion.div>
        )}

        {homeTab === 'explore-lagos' && (
          <motion.div
            key="explore-lagos"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <ExploreLagosView onNavigateBundles={() => setActiveTab('bundles')} />
          </motion.div>
        )}

        {homeTab === 'vip-services' && (
          <motion.div
            key="vip-services"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <VIPServicesView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
