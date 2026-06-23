import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Home } from 'lucide-react';
import { INITIAL_LISTINGS } from '../data';
import { Listing } from '../types';
import ApartmentCard from './ui/ApartmentCard';

interface LandingPageProps {
  onSelectListing: (listing: Listing) => void;
  setActiveTab: (tab: string) => void;
}

export default function LandingPage({ onSelectListing, setActiveTab }: LandingPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredListings = INITIAL_LISTINGS.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.amenities.some(amenity => amenity.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-grow flex flex-col animate-fade-in">
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover scale-105" 
            src="home HQ 1.jpg" 
            alt="Luxury Resort"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl w-full">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl text-parchment mb-6"
          >
            Find Your Perfect <br /> Sanctuary
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-parchment/80 text-lg md:text-xl font-light mb-10"
          >
            Discover curated luxury stays in the heart of Lagos
          </motion.p>

          {/* Glass-morphic Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative max-w-2xl mx-auto"
          >
            <div className="absolute inset-0 bg-white/20 backdrop-blur-xl rounded-full shadow-2xl border border-white/30 -z-10" />
            <div className="relative flex items-center px-6 py-4">
              <Search className="text-parchment/70 w-5 h-5 mr-3" />
              <input
                type="text"
                placeholder="Search destination, apartment type or amenities..."
                className="bg-transparent w-full outline-none text-parchment placeholder:text-parchment/50 text-lg font-light"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex items-center gap-2 ml-2 border-l border-parchment/20 pl-4">
                <Home className="text-parchment/70 w-5 h-5" />
                <span className="text-parchment/70 text-sm hidden sm:inline">Home</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. APARTMENT LISTINGS SECTION */}
      <section className="py-24 px-6 md:px-12 xl:px-20 max-w-[1440px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="text-left">
            <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">Featured Residences</h2>
            <div className="w-24 h-1 bg-gold"></div>
          </div>
          <p className="text-charcoal/60 max-w-md">
            Hand-picked, premium apartments designed for the ultimate Lagos experience.
          </p>
        </div>

        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredListings.map((listing) => {
              const cardKey = listing.id;
              return (
                <ApartmentCard 
                  key={cardKey} 
                  listing={listing} 
                  onClick={() => onSelectListing(listing)} 
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-charcoal/40 font-serif text-2xl">No residences found matching your search.</p>
          </div>
        )}
      </section>
    </div>
  );
}
