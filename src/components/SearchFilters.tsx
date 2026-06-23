import React from 'react';
import { Search, MapPin, Home, DollarSign, BedDouble, Bath, SlidersHorizontal, ChevronDown, Sparkles } from 'lucide-react';

interface SearchFiltersProps {
  filters: {
    location: string;
    category: string;
    priceRange: [number, number];
    beds: number;
    baths: number;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  locations: string[];
  categories: string[];
  maxPrice: number;
}

export default function SearchFilters({ filters, setFilters, locations, categories, maxPrice }: SearchFiltersProps) {
  return (
    <div className="w-full max-w-6xl mx-auto bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/20 p-2 sm:p-3 md:p-4 relative group">
      {/* Decorative highlight */}
      <div className="absolute -top-1 -left-1 -right-1 -bottom-1 bg-gradient-to-r from-gold/20 via-transparent to-gold/20 rounded-[2.6rem] -z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex flex-col md:flex-row items-center gap-2">
        
        {/* Location */}
        <div className="group/item flex items-center gap-4 flex-[1.5] w-full px-6 py-4 hover:bg-white/10 transition-all rounded-[2rem] cursor-pointer relative overflow-hidden">
          <MapPin className="text-gold-light w-5 h-5 relative z-10" />
          <div className="flex flex-col flex-1 relative z-10">
            <span className="text-[9px] font-bold text-white/50 uppercase tracking-[0.2em]">Location</span>
            <div className="flex items-center justify-between">
              <select 
                className="bg-transparent outline-none text-white text-sm font-semibold w-full appearance-none cursor-pointer"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              >
                <option value="" className="text-charcoal">Where to?</option>
                {locations.map(loc => (
                  <option key={loc} value={loc} className="text-charcoal">{loc}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-white/30 absolute right-8 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="group/item flex items-center gap-4 flex-1 w-full px-6 py-4 hover:bg-white/10 transition-all rounded-[2rem] cursor-pointer relative border-l border-white/10 overflow-hidden">
          <Home className="text-gold-light w-5 h-5 relative z-10" />
          <div className="flex flex-col flex-1 relative z-10">
            <span className="text-[9px] font-bold text-white/50 uppercase tracking-[0.2em]">Residence Type</span>
            <div className="flex items-center justify-between">
              <select 
                className="bg-transparent outline-none text-white text-sm font-semibold w-full appearance-none cursor-pointer"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="" className="text-charcoal">All Types</option>
                {categories.map(cat => (
                  <option key={cat} value={cat} className="text-charcoal">{cat}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-white/30 absolute right-8 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Beds & Baths */}
        <div className="group/item flex items-center gap-8 flex-1 w-full px-6 py-4 hover:bg-white/10 transition-all rounded-[2rem] cursor-pointer relative border-l border-white/10 overflow-hidden">
          <div className="flex items-center gap-3">
            <BedDouble className="text-gold-light w-5 h-5 relative z-10" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-white/50 uppercase tracking-[0.2em]">Beds</span>
              <select 
                className="bg-transparent outline-none text-white text-sm font-semibold w-full appearance-none cursor-pointer"
                value={filters.beds}
                onChange={(e) => setFilters({ ...filters, beds: Number(e.target.value) })}
              >
                <option value={0} className="text-charcoal">Any</option>
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num} className="text-charcoal">{num}+</option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-white/30 absolute right-16 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Bath className="text-gold-light w-5 h-5 relative z-10" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-white/50 uppercase tracking-[0.2em]">Baths</span>
              <select 
                className="bg-transparent outline-none text-white text-sm font-semibold w-full appearance-none cursor-pointer"
                value={filters.baths}
                onChange={(e) => setFilters({ ...filters, baths: Number(e.target.value) })}
              >
                <option value={0} className="text-charcoal">Any</option>
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num} className="text-charcoal">{num}+</option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-white/30 absolute right-28 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Price Range */}
        <div className="group/item flex items-center gap-4 flex-1 w-full px-6 py-4 hover:bg-white/10 transition-all rounded-[2rem] cursor-pointer relative border-l border-white/10 overflow-hidden">
          <DollarSign className="text-gold-light w-5 h-5 relative z-10" />
          <div className="flex flex-col flex-1 relative z-10">
            <span className="text-[9px] font-bold text-white/50 uppercase tracking-[0.2em]">Price Limit</span>
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-semibold">
                {filters.priceRange[1] === maxPrice ? 'Any' : `₦${filters.priceRange[1].toLocaleString()}`}
              </span>
            </div>
            <input 
              type="range"
              min="0"
              max={maxPrice}
              step="10000"
              value={filters.priceRange[1]}
              onChange={(e) => setFilters({ ...filters, priceRange: [0, Number(e.target.value)] })}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-gold-light mt-1"
            />
          </div>
        </div>

        {/* Search Button */}
        <button className="bg-gold text-charcoal px-8 py-4 rounded-[2rem] hover:bg-white hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-2 group active:scale-95 overflow-hidden relative">
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <Search className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-xs uppercase tracking-widest relative z-10 hidden lg:block">Search</span>
        </button>

      </div>
    </div>
  );
}
