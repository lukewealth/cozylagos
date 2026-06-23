import React, { useState } from 'react';
import { Search, MapPin, Calendar, Bed, Eye, ArrowRight, Star, Anchor } from 'lucide-react';
import { Listing } from '../types';

interface HomeViewProps {
  listings: Listing[];
  onSelectListing: (listing: Listing) => void;
  setSearchDestination: (dest: string) => void;
  setActiveTab: (tab: any) => void;
}

export default function HomeView({ listings, onSelectListing, setSearchDestination, setActiveTab }: HomeViewProps) {
  const [destInput, setDestInput] = useState('');
  const [checkInInput, setCheckInInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchDestination(destInput);
    setActiveTab('explorer');
  };

  return (
    <div className="flex-grow flex flex-col animate-fade-in-up">
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[640px] md:h-[750px] flex items-center justify-center overflow-hidden">
        {/* Cinematic Background Image */}
        <div className="absolute inset-0 z-0 bg-charcoal">
          <img 
            className="w-full h-full object-cover opacity-60 scale-105 select-none pointer-events-none transition-transform duration-1000" 
            src="Lagos ride.jpg"
            alt="Lagos cruise"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-transparent to-charcoal/90"></div>
        </div>

        {/* Hero Overlay Content */}
        <div className="relative z-10 w-full max-w-[1440px] px-6 md:px-12 xl:px-20 mx-auto flex flex-col items-center text-center">
          <span className="bg-gold/25 border border-gold/40 text-gold-light font-bold text-[10px] md:text-xs tracking-[0.3em] uppercase px-4 py-1.5 rounded-full mb-6">
            The Horizon of West African Luxury
          </span>
          <h1 className="font-serif text-5xl md:text-7xl xl:text-8xl text-parchment leading-tight tracking-tight max-w-5xl mb-6">
            Curate Your Perfect <br />
            <span className="italic font-light text-gold-light">Lagos Cruise</span>
          </h1>
          <p className="font-sans text-base md:text-lg xl:text-xl text-parchment/80 max-w-2xl font-light mb-12 leading-relaxed">
            Exclusive residences, fully catered luxury ocean charters, and proactive concierge services tailored exclusively for high-end travelers and residents.
          </p>

          {/* Luxury Search Widget */}
          <div className="w-full max-w-4xl bg-parchment/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-gold/10">
            <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
              
              {/* Destination column */}
              <div className="flex-1 w-full px-5 py-3.5 flex items-center gap-3.5 border-b md:border-b-0 md:border-r border-charcoal/10">
                <MapPin className="w-5 h-5 text-gold-dark shrink-0" />
                <div className="text-left w-full">
                  <label className="block text-[9px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">
                    Select Enclave
                  </label>
                  <input 
                    type="text" 
                    value={destInput} 
                    onChange={(e) => setDestInput(e.target.value)}
                    placeholder="Ikoyi, Banana Island, V.I..."
                    className="w-full bg-transparent text-charcoal text-sm font-medium border-0 p-0 focus:ring-0 placeholder:text-charcoal/30 outline-none"
                  />
                </div>
              </div>

              {/* Dates Column */}
              <div className="flex-1 w-full px-5 py-3.5 flex items-center gap-3.5 border-b md:border-b-0 md:border-r border-charcoal/10">
                <Calendar className="w-5 h-5 text-gold-dark shrink-0" />
                <div className="text-left w-full">
                  <label className="block text-[9px] font-bold text-charcoal/40 uppercase tracking-widest mb-1">
                    Check-in Target
                  </label>
                  <input 
                    type="date"
                    value={checkInInput}
                    onChange={(e) => setCheckInInput(e.target.value)}
                    className="w-full bg-transparent text-charcoal text-sm font-medium border-0 p-0 focus:ring-0 placeholder:text-charcoal/30 outline-none"
                  />
                </div>
              </div>

              {/* Action Button */}
              <button 
                type="submit"
                className="w-full md:w-auto px-10 py-4 bg-charcoal text-parchment hover:bg-gold-dark hover:text-parchment font-bold text-xs tracking-widest uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Search Enclaves</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. HANDPICKED COLLECTION SEGMENT */}
      <section className="py-20 md:py-28 px-6 md:px-12 xl:px-20 max-w-[1440px] mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-2xl text-left">
            <span className="text-gold-dark font-bold text-[10px] tracking-[0.25em] uppercase block mb-2">
              Curated Collections
            </span>
            <h2 className="font-serif font-semibold text-3xl md:text-5xl text-charcoal">
              Exclusive Enclaves of Lagos
            </h2>
            <p className="font-sans text-sm md:text-base text-charcoal-light mt-3 leading-relaxed">
              Every home undergoes meticulous spatial and security auditing. Complete with integrated in-house fiber connectivity and robust 100% silent power backup ecosystems.
            </p>
          </div>
          <button 
            onClick={() => {
              setSearchDestination('');
              setActiveTab('explorer');
            }}
            className="flex items-center gap-2 text-gold-dark hover:text-charcoal font-bold text-xs tracking-wider uppercase border-b-2 border-gold/40 hover:border-charcoal pb-1 transition-all"
          >
            <span>Explore Stay Database</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Curry Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((stay) => (
            <div 
              key={stay.id}
              onClick={() => onSelectListing(stay)}
              className="group cursor-pointer bg-parchment border border-charcoal/5 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500"
            >
              {/* Cover slot */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-charcoal">
                <img 
                  src={stay.image} 
                  alt={stay.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Location badge */}
                <div className="absolute top-4 left-4 bg-parchment/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-charcoal/5 shadow-sm text-[9px] font-bold tracking-widest uppercase text-charcoal">
                  {stay.location}
                </div>

                {/* Match badge */}
                <div className="absolute top-4 right-4 bg-charcoal/80 text-gold-light backdrop-blur-md px-3 py-1.5 rounded-full space-x-1 flex items-center text-[9px] font-bold tracking-widest uppercase">
                  <span>★</span>
                  <span>{stay.aiMatchPercent}% Match</span>
                </div>
              </div>

              {/* Property metadata */}
              <div className="p-6 text-left">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-serif text-xl font-bold text-charcoal group-hover:text-gold-dark transition-colors">
                    {stay.title}
                  </h3>
                  <div className="text-right">
                    <span className="font-serif font-bold text-lg text-gold-dark">
                      ₦{stay.nightlyRate.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-charcoal/50 block">/ night</span>
                  </div>
                </div>

                <p className="text-xs text-charcoal/60 font-light line-clamp-2 mb-6 leading-relaxed">
                  {stay.description}
                </p>

                {/* Specs */}
                <div className="flex items-center justify-between border-t border-charcoal/5 pt-4 text-[11px] text-charcoal/70 uppercase tracking-wider font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Bed className="w-3.5 h-3.5 text-gold-dark" />
                    <span>{stay.bedrooms} Beds</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-gold-dark" />
                    <span>Ocean Vibe</span>
                  </div>
                  <div className="text-gold-dark flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{stay.rating} ({stay.reviewsCount})</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. EXPERIENCE CALL OUT BANNER */}
      <section className="bg-charcoal text-parchment py-16 px-6 md:px-12 xl:px-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-dark/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-gold-dark/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 text-left">
          <div className="max-w-xl">
            <span className="text-gold uppercase tracking-[0.3em] font-bold text-[10px] block mb-3">
              WEEKEND SPECIAL
            </span>
            <h3 className="font-serif text-3xl md:text-5xl text-parchment leading-tight">
              Private Yacht <span className="italic font-light">Lagos Island Party</span>
            </h3>
            <p className="text-sm md:text-base text-parchment/70 font-light mt-4 leading-relaxed">
              Rent our pristine 65ft luxury executive boat for custom lagoon cruising. Complete with multi-course dining, premium champagnes, jet ski options, and state-of-the-art acoustics.
            </p>
          </div>
          
          <button 
            onClick={() => setActiveTab('experience')}
            className="px-8 py-4 bg-gold hover:bg-parchment text-charcoal font-bold text-xs tracking-widest uppercase rounded-xl transition-all flex items-center gap-3 shrink-0"
          >
            <Anchor className="w-4 h-4" />
            <span>Curate My Charter</span>
          </button>
        </div>
      </section>
    </div>
  );
}
