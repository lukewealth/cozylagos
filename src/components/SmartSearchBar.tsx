import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Sparkles, TrendingUp, X, Loader2, SlidersHorizontal, Flame, Star, Clock } from 'lucide-react';
import { Listing } from '../types';

interface SmartSearchBarProps {
  listings: Listing[];
  onResultsChange: (results: Listing[], query: string) => void;
}

const TRENDING_SEARCHES = [
  { label: 'Ikoyi Penthouse', icon: '🏙️', category: 'location' },
  { label: 'Lekki Pool Villa', icon: '🏊', category: 'amenity' },
  { label: 'Victoria Island 2BR', icon: '🌊', category: 'location' },
  { label: 'Banana Island Luxury', icon: '🏝️', category: 'location' },
  { label: 'Cinema Room', icon: '🎬', category: 'amenity' },
  { label: 'Ocean View', icon: '🌅', category: 'feature' },
  { label: 'Private Chef', icon: '👨‍🍳', category: 'service' },
  { label: 'Under ₦200k', icon: '💰', category: 'price' },
];

const AI_SUGGESTIONS = [
  'Romantic getaway with ocean view',
  'Family-friendly with pool and gym',
  'Business trip near Victoria Island',
  'Luxury penthouse with cinema',
  'Budget-friendly studio in Lekki',
  'Waterfront villa with yacht access',
];

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[₦,]/g, '')
    .split(/[\s,;|]+/)
    .map(t => t.trim())
    .filter(t => t.length >= 2);
}

function scoreListing(listing: Listing, tokens: string[]): number {
  if (tokens.length === 0) return 0;
  let score = 0;
  const searchable = [
    { text: listing.title, weight: 10 },
    { text: listing.location, weight: 8 },
    { text: listing.category, weight: 6 },
    { text: listing.description, weight: 4 },
    { text: (listing.keywords || []).join(' '), weight: 7 },
    { text: listing.amenities.join(' '), weight: 5 },
  ];

  for (const token of tokens) {
    for (const { text, weight } of searchable) {
      const lower = text.toLowerCase();
      if (lower.includes(token)) {
        score += weight;
        if (lower.startsWith(token)) score += weight * 0.5;
        if (lower === token) score += weight * 2;
      }
    }
  }

  // Price token handling
  const priceToken = tokens.find(t => /^\d+$/.test(t) || t.includes('k') || t.includes('m'));
  if (priceToken) {
    let priceLimit = 0;
    if (priceToken.includes('k')) priceLimit = parseInt(priceToken.replace('k', '')) * 1000;
    else if (priceToken.includes('m')) priceLimit = parseInt(priceToken.replace('m', '')) * 1000000;
    else if (/^\d+$/.test(priceToken)) {
      const num = parseInt(priceToken);
      priceLimit = num < 10000 ? num * 1000 : num;
    }
    if (priceLimit > 0 && listing.nightlyRate <= priceLimit) {
      score += 15;
    }
  }

  // Bedroom token
  const bedToken = tokens.find(t => t.includes('br') || t.includes('bed'));
  if (bedToken) {
    const beds = parseInt(bedToken);
    if (!isNaN(beds) && listing.bedrooms >= beds) score += 10;
  }

  return score;
}

export default function SmartSearchBar({ listings, onResultsChange }: SmartSearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tokens = useMemo(() => tokenize(query), [query]);

  const searchResults = useMemo(() => {
    if (tokens.length === 0) return [];
    const scored = listings
      .map(l => ({ listing: l, score: scoreListing(l, tokens) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score);
    return scored.map(s => s.listing);
  }, [tokens, listings]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setIsLoading(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setIsLoading(false);
      onResultsChange(searchResults, value);
    }, 300);
  };

  const handleTrendingClick = (label: string) => {
    setQuery(label);
    setIsFocused(true);
    setShowSuggestions(false);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newTokens = tokenize(label);
      const scored = listings
        .map(l => ({ listing: l, score: scoreListing(l, newTokens) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score);
      onResultsChange(scored.map(s => s.listing), label);
      setSearchHistory(prev => [label, ...prev.filter(h => h !== label)].slice(0, 5));
    }, 400);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setIsFocused(true);
    setShowSuggestions(false);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newTokens = tokenize(suggestion);
      const scored = listings
        .map(l => ({ listing: l, score: scoreListing(l, newTokens) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score);
      onResultsChange(scored.map(s => s.listing), suggestion);
      setSearchHistory(prev => [suggestion, ...prev.filter(h => h !== suggestion)].slice(0, 5));
    }, 400);
  };

  const clearSearch = () => {
    setQuery('');
    setIsLoading(false);
    onResultsChange(listings, '');
    inputRef.current?.focus();
  };

  const filteredTrending = useMemo(() => {
    if (tokens.length > 0) return [];
    return TRENDING_SEARCHES;
  }, [tokens]);

  const filteredSuggestions = useMemo(() => {
    if (tokens.length === 0) return AI_SUGGESTIONS;
    return AI_SUGGESTIONS.filter(s => {
      const lower = s.toLowerCase();
      return tokens.some(t => lower.includes(t));
    }).slice(0, 4);
  }, [tokens]);

  const resultCount = searchResults.length;

  return (
    <div ref={containerRef} className="w-full max-w-3xl mx-auto relative">
      {/* Main Search Input */}
      <div className={`relative bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-full shadow-2xl border transition-all duration-300 ${
        isFocused ? 'border-gold/40 shadow-gold/10 shadow-lg' : 'border-white/20'
      }`}>
        <div className="flex items-center px-4 sm:px-6 py-3 sm:py-4 gap-3">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-gold-dark animate-spin shrink-0" />
          ) : (
            <Search className="w-5 h-5 text-charcoal/40 shrink-0" />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => { setIsFocused(true); setShowSuggestions(true); }}
            placeholder="Search Lagos homes, areas, or experiences..."
            className="flex-1 bg-transparent outline-none text-sm sm:text-base text-charcoal placeholder:text-charcoal/30 font-medium min-w-0"
          />
          {query && (
            <button
              onClick={clearSearch}
              className="p-1.5 hover:bg-charcoal/5 rounded-full transition-colors shrink-0"
            >
              <X className="w-4 h-4 text-charcoal/40" />
            </button>
          )}
          <button className="hidden sm:flex items-center gap-1.5 bg-charcoal text-parchment px-4 py-2 rounded-full text-xs font-bold hover:bg-gold-dark transition-colors shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </button>
        </div>

        {/* Result count badge */}
        <AnimatePresence>
          {query && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute -top-3 right-6 bg-gold text-charcoal text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md"
            >
              {resultCount} {resultCount === 1 ? 'result' : 'results'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isFocused && showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-charcoal/5 overflow-hidden z-50 max-h-[70vh] overflow-y-auto"
          >
            {/* Search History */}
            {searchHistory.length > 0 && !query && (
              <div className="p-4 border-b border-charcoal/5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-3.5 h-3.5 text-charcoal/40" />
                  <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">Recent</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((h, i) => (
                    <button
                      key={i}
                      onClick={() => handleTrendingClick(h)}
                      className="px-3 py-1.5 bg-charcoal/5 hover:bg-charcoal/10 rounded-full text-xs text-charcoal font-medium transition-colors"
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            {filteredTrending.length > 0 && !query && (
              <div className="p-4 border-b border-charcoal/5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-3.5 h-3.5 text-gold-dark" />
                  <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">Trending in Lagos</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {filteredTrending.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleTrendingClick(item.label)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-charcoal/5 transition-colors text-left group"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-xs font-medium text-charcoal group-hover:text-gold-dark transition-colors truncate">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Suggestions */}
            {filteredSuggestions.length > 0 && (
              <div className="p-4 border-b border-charcoal/5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
                  <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">AI Suggestions</span>
                </div>
                <div className="space-y-1.5">
                  {filteredSuggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-charcoal/5 transition-colors text-left group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
                      </div>
                      <span className="text-xs font-medium text-charcoal group-hover:text-gold-dark transition-colors">
                        {suggestion}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Results Preview */}
            {query && searchResults.length > 0 && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">Top Matches</span>
                </div>
                <div className="space-y-2">
                  {searchResults.slice(0, 4).map((listing) => (
                    <button
                      key={listing.id}
                      onClick={() => {
                        onResultsChange([listing], query);
                        setIsFocused(false);
                        setShowSuggestions(false);
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-charcoal/5 transition-colors text-left group"
                    >
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="w-12 h-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-charcoal truncate group-hover:text-gold-dark transition-colors">
                            {listing.title}
                          </span>
                          <Star className="w-3 h-3 text-gold-dark fill-current shrink-0" />
                          <span className="text-[10px] font-bold text-charcoal/60">{listing.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="w-2.5 h-2.5 text-charcoal/40" />
                          <span className="text-[10px] text-charcoal/50">{listing.location}</span>
                          <span className="text-[10px] text-charcoal/30 mx-1">•</span>
                          <span className="text-[10px] font-bold text-gold-dark">₦{listing.nightlyRate.toLocaleString()}/night</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {searchResults.length > 4 && (
                  <p className="text-[10px] text-charcoal/40 text-center mt-2">
                    +{searchResults.length - 4} more results
                  </p>
                )}
              </div>
            )}

            {/* No Results */}
            {query && !isLoading && searchResults.length === 0 && (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-charcoal/5 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search className="w-5 h-5 text-charcoal/30" />
                </div>
                <p className="text-sm font-semibold text-charcoal mb-1">No matches found</p>
                <p className="text-xs text-charcoal/50">Try searching for a location, amenity, or property type</p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && query && (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Loader2 className="w-5 h-5 text-gold-dark animate-spin" />
                </div>
                <p className="text-sm font-semibold text-charcoal mb-1">Searching Lagos...</p>
                <p className="text-xs text-charcoal/50">Finding your perfect stay</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
