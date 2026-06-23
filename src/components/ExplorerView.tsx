import React, { useState, useMemo, useEffect } from 'react';
import { Bed, Bath, Star, ShieldCheck, Heart, MapPin, ZoomIn, ZoomOut, Search, Sliders, CheckCircle } from 'lucide-react';
import { Listing } from '../types';
import LoadingView from './LoadingView';

interface ExplorerViewProps {
  listings: Listing[];
  onSelectListing: (listing: Listing) => void;
  searchDestination: string;
  setSearchDestination: (dest: string) => void;
}

export default function ExplorerView({ listings, onSelectListing, searchDestination, setSearchDestination }: ExplorerViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [onlyPremiumChef, setOnlyPremiumChef] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);

  // Simulate real-time fetching
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [searchDestination, selectedRegion, onlyPremiumChef]);

  // Filter listings based on region selector and search input
  const filteredListings = useMemo(() => {
    return listings.filter(item => {
      // Destination search text check
      const matchesSearch = searchDestination 
        ? item.location.toLowerCase().includes(searchDestination.toLowerCase()) || item.title.toLowerCase().includes(searchDestination.toLowerCase())
        : true;
      
      // Region capsule check
      const matchesRegion = selectedRegion === 'All' || item.location === selectedRegion;

      // Chef premium check
      const matchesChef = !onlyPremiumChef || item.amenities.includes("Private Chef");

      return matchesSearch && matchesRegion && matchesChef;
    });
  }, [listings, selectedRegion, searchDestination, onlyPremiumChef]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  // Mock locations for pins on our gorgeous SVG interactive map
  const mockPins = [
    { id: "bourdillon-penthouse", x: 260, y: 190, label: "₦450k", title: "The Bourdillon Penthouse", top: "18%" },
    { id: "lagoon-view-villa", x: 420, y: 310, label: "₦650k", title: "Lagoon View Villa", top: "42%" },
    { id: "eko-loft", x: 190, y: 390, label: "₦250k", title: "Eko Loft Sanctuary", top: "65%" }
  ];

  if (isLoading) {
    return <LoadingView />;
  }

  return (
    <div className="flex-grow flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-charcoal/10 h-[calc(100vh-80px)] overflow-hidden animate-fade-in-up text-left">
      
      {/* LEFT COLUMN: LIST FILTER & CARDS (5/12th width) */}
      <section className="w-full lg:w-[45%] xl:w-[40%] flex flex-col h-full bg-parchment overflow-y-auto">
        <div className="p-6 md:p-8 space-y-6">
          
          <div>
            <span className="text-gold-dark font-bold text-[9px] tracking-[0.3em] uppercase block mb-1">
              Stay Database
            </span>
            <h1 className="font-serif text-3xl font-semibold text-charcoal">
              Curated Residences
            </h1>
          </div>

          {/* Search text slot */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text"
              value={searchDestination}
              onChange={(e) => setSearchDestination(e.target.value)}
              placeholder="Search enclaves (Ikoyi, Banana Island)..."
              className="w-full pl-10 pr-4 py-3 bg-white/70 border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gold text-charcoal font-medium"
            />
          </div>

          {/* Filter Region Capsules */}
          <div className="space-y-2">
            <label className="block text-[9px] font-bold text-charcoal/40 uppercase tracking-widest leading-none">
              Filter Enclave
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {['All', 'Ikoyi', 'Banana Island', 'Victoria Island'].map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-4 py-2 text-[10px] uppercase font-bold tracking-widest rounded-full transition-all border ${
                    selectedRegion === region 
                      ? 'bg-charcoal text-parchment border-charcoal' 
                      : 'bg-white/40 text-charcoal/60 border-charcoal/10 hover:border-gold hover:text-gold-dark'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle buttons */}
          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input 
                type="checkbox"
                checked={onlyPremiumChef}
                onChange={() => setOnlyPremiumChef(!onlyPremiumChef)}
                className="w-4 h-4 rounded text-gold-dark border-charcoal/20 focus:ring-gold focus:ring-offset-0 focus:ring-0 cursor-pointer"
              />
              <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-light">
                Private Chef Included
              </span>
            </label>
          </div>

          {/* Render List results */}
          <div className="space-y-6 pt-4">
            {filteredListings.length > 0 ? (
              filteredListings.map((item) => (
                <article
                  key={item.id}
                  onClick={() => onSelectListing(item)}
                  className="group relative flex flex-col sm:flex-row bg-white/75 border border-charcoal/5 rounded-2xl overflow-hidden hover:shadow-xl hover:border-gold/30 transition-all duration-300 cursor-pointer"
                >
                  {/* Photo cover */}
                  <div className="w-full sm:w-[40%] aspect-[4/3] sm:aspect-auto min-h-[170px] relative overflow-hidden bg-charcoal">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Elite Tag */}
                    <div className="absolute top-3 left-3 bg-parchment/95 backdrop-blur-md px-2 py-1 rounded-full border border-gold/15 flex items-center gap-1.5 shadow-sm">
                      <CheckCircle className="w-2.5 h-2.5 text-gold-dark" />
                      <span className="text-[8px] font-bold tracking-widest uppercase text-gold-dark">
                        Elite Stay
                      </span>
                    </div>

                    {/* Favorite heart */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(item.id, e)}
                      className="absolute top-3 right-3 text-gold-dark hover:text-gold-light bg-parchment/90 backdrop-blur-md p-1.5 rounded-full transition-colors shadow-sm select-none"
                    >
                      <Heart 
                        className={`w-3.5 h-3.5 ${favorites.includes(item.id) ? 'fill-current' : ''}`} 
                      />
                    </button>
                  </div>

                  {/* Metadata body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-charcoal group-hover:text-gold-dark transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-charcoal/40 mt-0.5">
                        {item.location} &bull; {item.category}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {item.amenities.slice(0, 3).map((am, i) => (
                          <span 
                            key={i}
                            className="text-[8px] font-bold uppercase tracking-wider bg-gold/10 border border-gold/15 text-gold-dark px-2 py-0.5 rounded-md"
                          >
                            {am}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-end border-t border-charcoal/5 pt-4 mt-4">
                      <div>
                        <span className="font-serif font-bold text-base text-gold-dark">
                          ₦{item.nightlyRate.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-charcoal/50">/ Night</span>
                      </div>

                      <button
                        onClick={() => onSelectListing(item)}
                        className="px-4 py-2 bg-charcoal hover:bg-gold-dark text-parchment font-bold text-[9px] tracking-widest uppercase rounded-lg transition-colors select-none"
                      >
                        Reserve
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="py-12 bg-white/40 border border-dashed border-charcoal/10 rounded-xl text-center">
                <p className="font-serif italic text-charcoal/60">No residences found matching your query</p>
                <button 
                  onClick={() => {
                    setSelectedRegion('All');
                    setOnlyPremiumChef(false);
                    setSearchDestination('');
                  }}
                  className="mt-3 text-[10px] font-bold uppercase tracking-widest text-[#735c00] hover:underline"
                >
                  Reset Parameters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RIGHT COLUMN: LUXURY INTERACTIVE DEEP MAP (7/12th width) */}
      <section className="hidden lg:block lg:flex-1 h-full relative bg-charcoal overflow-hidden select-none">
        
        {/* Style vector map canvas mockup */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
          style={{ 
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBQevBNesmApe_VGDeEGn072iu4WXvfZnwVrV0zpp-pYGNxKmf9XW1CXlTQXUrUr-KbvAvR38bfLamIkujI8SetpwRiofASCZByuYXunExEu4bPoNyVVLY_Fwn6MLkn2uSZd0kkv6HsYwCiCzoku7L1pwWd6L8PTvP-0jN_nmQMPgfxGeBl5ivMHbaZqJRpbXcfVVEuTez7C6z7RNYMT5sgoIKkP8dTGvB_AML78nw6sHIxloM_xox-qC-GUZGXfCeVYBFp-yZQ4v99')`,
            transform: `scale(${mapZoom})`,
            opacity: 0.85
          }}
        >
          {/* Ambient overlay */}
          <div className="absolute inset-0 bg-charcoal/15 mix-blend-overlay"></div>
        </div>

        {/* Map control widgets */}
        <div className="absolute top-6 right-6 flex flex-col gap-2 z-20">
          <button 
            onClick={() => setMapZoom(prev => Math.min(prev + 0.25, 2.5))}
            className="w-10 h-10 bg-parchment/90 hover:bg-parchment border border-charcoal/10 rounded-full shadow-lg flex items-center justify-center text-charcoal transition-transform hover:scale-105 active:scale-95"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => setMapZoom(prev => Math.max(prev - 0.25, 0.75))}
            className="w-10 h-10 bg-parchment/90 hover:bg-parchment border border-charcoal/10 rounded-full shadow-lg flex items-center justify-center text-charcoal transition-transform hover:scale-105 active:scale-95"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Golden Pins representing real properties */}
        {mockPins.map((pin) => {
          const associatedStay = listings.find(l => l.id === pin.id);
          const isSelected = selectedPin === pin.id;

          return (
            <div
              key={pin.id}
              onClick={() => {
                setSelectedPin(pin.id);
                if (associatedStay) onSelectListing(associatedStay);
              }}
              className="absolute transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 hover:scale-110"
              style={{
                top: pin.top,
                left: pin.id === 'bourdillon-penthouse' ? "45%" : pin.id === 'lagoon-view-villa' ? "75%" : "30%"
              }}
            >
              <div className={`px-4 py-2 rounded-full font-bold text-[10px] tracking-widest uppercase transition-all shadow-xl flex items-center gap-1.5 ${
                isSelected 
                  ? 'bg-gold text-charcoal scale-110 border border-gold-dark' 
                  : 'bg-parchment/90 hover:bg-gold text-charcoal border border-charcoal/10'
              }`}>
                <MapPin className="w-3.5 h-3.5 text-gold-dark" />
                <span>{pin.label}</span>
              </div>
              
              {/* Arrow */}
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-gold-dark mx-auto -mt-[1px] relative opacity-0 hover:opacity-100 transition-opacity"></div>
            </div>
          );
        })}

        {/* Map Legend Overlay Card */}
        <div className="absolute bottom-6 left-6 max-w-sm bg-parchment/90 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-charcoal/5 text-left z-20">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-gold" />
            <span className="font-serif font-bold text-sm text-charcoal">Ecosystem Coordinates</span>
          </div>
          <p className="text-[10px] text-charcoal/60 leading-relaxed font-medium">
            Active tracking representing Banana Island Coastline, Ikoyi Enclaves and Victoria Island districts. Select a pin to load coordinates.
          </p>
        </div>
      </section>
    </div>
  );
}
