import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Star, SlidersHorizontal, Grid3X3, List, X, Heart, Bed, Bath, Users } from 'lucide-react';
import { Listing } from '../types';
import GemCard from './ui/GemCard';

interface PropertyListingViewProps {
  listings: Listing[];
  onSelectListing: (listing: Listing) => void;
}

export default function PropertyListingView({ listings, onSelectListing }: PropertyListingViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [bedroomFilter, setBedroomFilter] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'newest'>('rating');

  const locations = useMemo(() => {
    const locs = new Set(listings.map(l => l.location));
    return ['all', ...Array.from(locs)];
  }, [listings]);

  const filteredListings = useMemo(() => {
    let result = listings.filter(l => l.isActive);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q)
      );
    }

    if (locationFilter !== 'all') {
      result = result.filter(l => l.location === locationFilter);
    }

    result = result.filter(l => l.nightlyRate >= priceRange[0] && l.nightlyRate <= priceRange[1]);

    if (bedroomFilter > 0) {
      result = result.filter(l => l.bedrooms >= bedroomFilter);
    }

    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.nightlyRate - b.nightlyRate); break;
      case 'price-desc': result.sort((a, b) => b.nightlyRate - a.nightlyRate); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
    }

    return result;
  }, [listings, searchQuery, locationFilter, priceRange, bedroomFilter, sortBy]);

  return (
    <div className="flex-grow flex flex-col animate-fade-in">
      <section className="relative w-full py-12 sm:py-16 px-4 sm:px-6 md:px-12 xl:px-20 max-w-[1440px] mx-auto">
        <div className="text-center mb-8">
          <span className="text-gold-dark font-bold text-[10px] tracking-[0.25em] uppercase block mb-2">
            Browse Properties
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal mb-3">
            Find Your Perfect Stay
          </h1>
          <p className="text-sm text-charcoal/60 max-w-2xl mx-auto">
            Discover luxury apartments, penthouses, and villas across Lagos.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
            <input
              type="text"
              placeholder="Search by name, location, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-12 py-4 bg-white border border-charcoal/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-charcoal/5 rounded-full"
              >
                <X className="w-4 h-4 text-charcoal/40" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                showFilters ? 'bg-charcoal text-parchment' : 'bg-charcoal/5 text-charcoal/60 hover:bg-charcoal/10'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-4 py-2 bg-charcoal/5 border-none rounded-xl text-xs font-bold text-charcoal/60 focus:outline-none focus:ring-2 focus:ring-gold/30"
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc === 'all' ? 'All Locations' : loc}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-charcoal/5 border-none rounded-xl text-xs font-bold text-charcoal/60 focus:outline-none focus:ring-2 focus:ring-gold/30"
            >
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-charcoal text-parchment' : 'bg-charcoal/5 text-charcoal/60'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-charcoal text-parchment' : 'bg-charcoal/5 text-charcoal/60'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl border border-charcoal/5 p-6 mb-8 shadow-sm"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-widest mb-2">
                  Price Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full px-3 py-2 bg-parchment border border-charcoal/10 rounded-lg text-xs"
                    placeholder="Min"
                  />
                  <span className="text-charcoal/40">-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full px-3 py-2 bg-parchment border border-charcoal/10 rounded-lg text-xs"
                    placeholder="Max"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-widest mb-2">
                  Min Bedrooms
                </label>
                <select
                  value={bedroomFilter}
                  onChange={(e) => setBedroomFilter(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-parchment border border-charcoal/10 rounded-lg text-xs"
                >
                  <option value={0}>Any</option>
                  <option value={1}>1+</option>
                  <option value={2}>2+</option>
                  <option value={3}>3+</option>
                  <option value={4}>4+</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setLocationFilter('all');
                    setPriceRange([0, 1000000]);
                    setBedroomFilter(0);
                  }}
                  className="w-full px-4 py-2 bg-charcoal/5 hover:bg-charcoal/10 rounded-xl text-xs font-bold text-charcoal transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mb-6">
          <p className="text-sm text-charcoal/60">
            <span className="font-bold text-charcoal">{filteredListings.length}</span> propert{filteredListings.length !== 1 ? 'ies' : 'y'} found
          </p>
        </div>

        {filteredListings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-charcoal/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-charcoal/30" />
            </div>
            <p className="text-lg font-semibold text-charcoal mb-2">No properties found</p>
            <p className="text-sm text-charcoal/50">Try adjusting your filters or search query.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map((listing, index) => (
              <GemCard
                key={listing.id}
                listing={listing}
                index={index}
                onClick={() => onSelectListing(listing)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredListings.map((listing) => (
              <motion.div
                key={listing.id}
                whileHover={{ y: -2 }}
                onClick={() => onSelectListing(listing)}
                className="bg-white rounded-2xl border border-charcoal/5 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer flex"
              >
                <div className="w-48 h-40 bg-gradient-to-br from-gold/20 to-charcoal/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-8 h-8 text-charcoal/20" />
                </div>
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-charcoal text-lg">{listing.title}</h3>
                      <div className="flex items-center gap-1 text-xs text-charcoal/50 mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{listing.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-gold fill-current" />
                      <span className="text-sm font-bold">{listing.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-charcoal/60 line-clamp-2 mb-3">{listing.description}</p>
                  <div className="flex items-center gap-4 text-xs text-charcoal/50 mb-3">
                    <span className="flex items-center gap-1"><Bed className="w-3 h-3" /> {listing.bedrooms} beds</span>
                    <span className="flex items-center gap-1"><Bath className="w-3 h-3" /> {listing.bathrooms} baths</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {listing.maxGuests} guests</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gold-dark">₦{listing.nightlyRate.toLocaleString()}<span className="text-charcoal/40 font-normal">/night</span></span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
