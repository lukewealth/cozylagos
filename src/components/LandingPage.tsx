import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Listing } from '../types';
import ApartmentCard from './ui/ApartmentCard';
import Hero from './Hero';
import SearchFilters from './SearchFilters';
import PropertyMap from './PropertyMap';

interface LandingPageProps {
  listings: Listing[];
  onSelectListing: (listing: Listing) => void;
  setActiveTab: (tab: string) => void;
}

export default function LandingPage({ listings, onSelectListing, setActiveTab }: LandingPageProps) {
  const [filters, setFilters] = useState({
    location: '',
    category: '',
    priceRange: [0, 1000000] as [number, number],
    beds: 0,
    baths: 0,
  });

  const [showMap, setShowMap] = useState(false);

  const locations = useMemo(() =>
    Array.from(new Set(listings.map(l => l.location))),
  []);

  const categories = useMemo(() =>
    Array.from(new Set(listings.map(l => l.category))),
  []);

  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      const matchLocation = !filters.location || listing.location === filters.location;
      const matchCategory = !filters.category || listing.category === filters.category;
      const matchPrice = listing.nightlyRate >= filters.priceRange[0] && listing.nightlyRate <= filters.priceRange[1];
      const matchBeds = filters.beds === 0 || listing.bedrooms >= filters.beds;
      const matchBaths = filters.baths === 0 || listing.bathrooms >= filters.baths;

      return matchLocation && matchCategory && matchPrice && matchBeds && matchBaths;
    });
  }, [listings, filters]);

  return (
    <div className="flex-grow flex flex-col animate-fade-in">
      {/* 1. HERO SECTION */}
      <Hero>
        <SearchFilters
          filters={filters}
          setFilters={setFilters}
          locations={locations}
          categories={categories}
          maxPrice={1000000}
        />
      </Hero>

      {/* 2. MAP SECTION */}
      <section className="py-12 px-6 md:px-12 xl:px-20 max-w-[1440px] mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-2">
              Explore Properties on Map
            </h2>
            <p className="text-sm text-charcoal/60">
              Click on pins to view property details
            </p>
          </div>
          <button
            onClick={() => setShowMap(!showMap)}
            className="px-4 py-2 bg-charcoal text-parchment hover:bg-gold-dark rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
          >
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
        </div>
        {showMap && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PropertyMap
              listings={filteredListings}
              onSelectListing={onSelectListing}
            />
          </motion.div>
        )}
      </section>

      {/* 3. APARTMENT LISTINGS SECTION */}
      <section className="py-16 px-6 md:px-12 xl:px-20 max-w-[1440px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="text-left">
            <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">Featured Residences</h2>
            <div className="w-24 h-1 bg-gold"></div>
            <p className="text-charcoal/60 mt-4">
              {filteredListings.length} luxury properties available
            </p>
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
