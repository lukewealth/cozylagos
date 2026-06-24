import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Sparkles, TrendingUp, X, Loader2, Flame, Star, Clock, Home, Compass, HandHelping, Crown, Briefcase, CalendarDays } from 'lucide-react';
import { Listing } from '../types';
import { 
  buildSearchIndex, 
  searchIndex, 
  getCategorySuggestions, 
  getSearchHistory, 
  addToSearchHistory, 
  clearSearchHistory,
  SEARCH_CATEGORIES,
  SearchResult 
} from '../utils/searchIndex';

interface SmartSearchBarProps {
  listings: Listing[];
  onResultsChange: (results: Listing[], query: string) => void;
  onNavigate?: (tab: string, data?: any) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  stay: <Home className="w-4 h-4" />,
  explore: <Compass className="w-4 h-4" />,
  assist: <HandHelping className="w-4 h-4" />,
  experience: <Crown className="w-4 h-4" />,
  business: <Briefcase className="w-4 h-4" />,
  event: <CalendarDays className="w-4 h-4" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  stay: 'bg-amber-100 text-amber-700',
  explore: 'bg-emerald-100 text-emerald-700',
  assist: 'bg-blue-100 text-blue-700',
  experience: 'bg-purple-100 text-purple-700',
  business: 'bg-slate-100 text-slate-700',
  event: 'bg-rose-100 text-rose-700',
};

export default function SmartSearchBar({ listings, onResultsChange, onNavigate }: SmartSearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const searchIndexData = useMemo(() => buildSearchIndex(listings), [listings]);

  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

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

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return searchIndex(searchIndexData, query);
  }, [query, searchIndexData]);

  const categorySuggestions = useMemo(() => {
    return getCategorySuggestions(query);
  }, [query]);

  const listingResults = useMemo(() => {
    return searchResults.filter(r => r.category === 'stay').slice(0, 5);
  }, [searchResults]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setIsLoading(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setIsLoading(false);
      const listings = searchResults.filter(r => r.category === 'stay').map(r => r.data as Listing);
      onResultsChange(listings.length > 0 ? listings : listings, value);
    }, 300);
  };

  const handleResultClick = (result: SearchResult) => {
    addToSearchHistory(query);
    setIsFocused(false);
    setShowSuggestions(false);

    switch (result.action) {
      case 'view_listing':
        onNavigate?.('listing-detail', result.data);
        break;
      case 'view_bundle':
        onNavigate?.('bundles', result.data);
        break;
      case 'view_service':
        onNavigate?.('vip-services', result.data);
        break;
      case 'view_explore':
        onNavigate?.('explore-lagos', result.data);
        break;
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    const category = SEARCH_CATEGORIES.find(c => c.id === categoryId);
    if (category) {
      setQuery(category.label);
      addToSearchHistory(category.label);
      
      switch (categoryId) {
        case 'stay':
          onNavigate?.('explorer');
          break;
        case 'explore':
          onNavigate?.('explore-lagos');
          break;
        case 'assist':
          onNavigate?.('vip-services');
          break;
        case 'experience':
          onNavigate?.('bundles');
          break;
        case 'business':
          onNavigate?.('business-lagos');
          break;
        case 'event':
          onNavigate?.('events');
          break;
      }
    }
    setIsFocused(false);
    setShowSuggestions(false);
  };

  const handleHistoryClick = (historyItem: string) => {
    setQuery(historyItem);
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const clearSearch = () => {
    setQuery('');
    setIsLoading(false);
    onResultsChange(listings, '');
    inputRef.current?.focus();
  };

  const clearHistory = () => {
    clearSearchHistory();
    setSearchHistory([]);
  };

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto relative">
      {/* Main Search Input */}
      <div className={`relative bg-white/98 backdrop-blur-xl rounded-2xl sm:rounded-full shadow-2xl border transition-all duration-300 ${
        isFocused ? 'border-gold/40 shadow-gold/10 shadow-lg scale-[1.02]' : 'border-white/20 hover:scale-[1.01]'
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
            placeholder="Stay. Explore. Get Assisted."
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
          <button className="hidden sm:flex items-center gap-1.5 bg-charcoal text-parchment px-4 py-2 rounded-full text-xs font-bold hover:bg-gold-dark hover:scale-105 transition-all duration-300 shrink-0">
            <Search className="w-3.5 h-3.5" />
            Search
          </button>
        </div>

        {/* Result count badge */}
        <AnimatePresence>
          {query && !isLoading && searchResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute -top-3 right-6 bg-gold text-charcoal text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md"
            >
              {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Suggestions Dropdown - Full Width Without Overlay */}
      <AnimatePresence>
        {isFocused && showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-charcoal/5 overflow-hidden z-50"
          >
            <div className="max-h-[60vh] overflow-y-auto">
              {/* Search History */}
              {searchHistory.length > 0 && !query && (
                <div className="p-4 border-b border-charcoal/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-charcoal/40" />
                      <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">Recent</span>
                    </div>
                    <button 
                      onClick={clearHistory}
                      className="text-[10px] text-charcoal/40 hover:text-charcoal transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.slice(0, 8).map((h, i) => (
                      <button
                        key={i}
                        onClick={() => handleHistoryClick(h)}
                        className="px-3 py-1.5 bg-charcoal/5 hover:bg-charcoal/10 hover:scale-105 rounded-full text-xs text-charcoal font-medium transition-all duration-200"
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Quick Access */}
              {!query && (
                <div className="p-4 border-b border-charcoal/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
                    <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">Browse Categories</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {SEARCH_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className="flex items-center gap-2 p-3 rounded-xl hover:bg-charcoal/5 hover:scale-[1.02] transition-all duration-200 text-left group"
                      >
                        <span className="text-lg">{cat.icon}</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold text-charcoal group-hover:text-gold-dark transition-colors block truncate">
                            {cat.label}
                          </span>
                          <span className="text-[9px] text-charcoal/40">
                            {cat.items.length} options
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Suggestions when searching */}
              {query && categorySuggestions.length > 0 && categorySuggestions.length < SEARCH_CATEGORIES.length && (
                <div className="p-4 border-b border-charcoal/5">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-3.5 h-3.5 text-gold-dark" />
                    <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">Categories</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categorySuggestions.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 ${CATEGORY_COLORS[cat.id]}`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {query && searchResults.length > 0 && (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Flame className="w-3.5 h-3.5 text-red-500" />
                    <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">Top Matches</span>
                  </div>
                  <div className="space-y-1">
                    {searchResults.slice(0, 8).map((result) => (
                      <button
                        key={`${result.category}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-charcoal/5 hover:scale-[1.01] transition-all duration-200 text-left group"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${CATEGORY_COLORS[result.category]}`}>
                          <span className="text-lg">{result.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-charcoal truncate group-hover:text-gold-dark transition-colors">
                              {result.title}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${CATEGORY_COLORS[result.category]}`}>
                              {result.category.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-[10px] text-charcoal/50 truncate mt-0.5">
                            {result.subtitle}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {searchResults.length > 8 && (
                    <p className="text-[10px] text-charcoal/40 text-center mt-2">
                      +{searchResults.length - 8} more results
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
                  <p className="text-xs text-charcoal/50">Try searching for stays, experiences, or services</p>
                </div>
              )}

              {/* Loading State */}
              {isLoading && query && (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Loader2 className="w-5 h-5 text-gold-dark animate-spin" />
                  </div>
                  <p className="text-sm font-semibold text-charcoal mb-1">Searching Lagos...</p>
                  <p className="text-xs text-charcoal/50">Finding your perfect experience</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
