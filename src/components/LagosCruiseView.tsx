import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Calendar, Bed, Eye, ArrowRight, Star, Anchor, Shield, Waves, Wifi } from 'lucide-react';
import { Listing } from '../types';

interface HomeViewProps {
  listings: Listing[];
  onSelectListing: (listing: Listing) => void;
  setSearchDestination: (dest: string) => void;
  setActiveTab: (tab: any) => void;
}

const FALLBACK_IMG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzFBMUMxQyIvPjx0ZXh0IHg9IjQwMCIgeT0iMzAwIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iI0Q0QUYzNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Q296eSBMYWdvczwvdGV4dD48L3N2Zz4=';

function useImageFallback(src: string) {
  const [imgSrc, setImgSrc] = useState(src);
  const handleError = useCallback(() => {
    setImgSrc(FALLBACK_IMG);
  }, []);
  return { imgSrc, handleError };
}

function ListingCard({ stay, onSelect, index }: { stay: Listing; onSelect: () => void; index: number; key?: string }) {
  const { imgSrc, handleError } = useImageFallback(stay.image);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onClick={onSelect}
      className="group cursor-pointer bg-parchment border border-charcoal/5 rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-charcoal">
        <img
          src={imgSrc}
          alt={stay.title}
          onError={handleError}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute top-4 left-4 bg-parchment/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-charcoal/5 shadow-sm text-[9px] font-bold tracking-widest uppercase text-charcoal">
          {stay.location}
        </div>

        <div className="absolute top-4 right-4 bg-charcoal/80 text-gold-light backdrop-blur-md px-3 py-1.5 rounded-full space-x-1 flex items-center text-[9px] font-bold tracking-widest uppercase">
          <span>★</span>
          <span>{stay.aiMatchPercent}% Match</span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
          {stay.amenities.slice(0, 4).map((amenity, i) => {
            const a = amenity.toLowerCase();
            let icon = null;
            if (a.includes('wifi') || a.includes('internet')) icon = <Wifi className="w-3 h-3" />;
            else if (a.includes('security') || a.includes('safety')) icon = <Shield className="w-3 h-3" />;
            else if (a.includes('pool') || a.includes('swimming')) icon = <Waves className="w-3 h-3" />;
            if (!icon) return null;
            return (
              <div key={i} className="bg-parchment/90 backdrop-blur-md p-1.5 rounded-full text-gold-dark">
                {icon}
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-6 text-left">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-xl font-bold text-charcoal group-hover:text-gold-dark transition-colors duration-300">
            {stay.title}
          </h3>
          <div className="text-right shrink-0 ml-3">
            <span className="font-serif font-bold text-lg text-gold-dark">
              ₦{stay.nightlyRate.toLocaleString()}
            </span>
            <span className="text-[10px] text-charcoal/50 block">/ night</span>
          </div>
        </div>

        <p className="text-xs text-charcoal/60 font-light line-clamp-2 mb-6 leading-relaxed">
          {stay.description}
        </p>

        <div className="flex items-center justify-between border-t border-charcoal/5 pt-4 text-[11px] text-charcoal/70 uppercase tracking-wider font-semibold">
          <div className="flex items-center gap-1.5">
            <Bed className="w-3.5 h-3.5 text-gold-dark" />
            <span>{stay.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-gold-dark" />
            <span>{stay.category}</span>
          </div>
          <div className="text-gold-dark flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{stay.rating} ({stay.reviewsCount})</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HomeView({ listings, onSelectListing, setSearchDestination, setActiveTab }: HomeViewProps) {
  const [destInput, setDestInput] = useState('');
  const [checkInInput, setCheckInInput] = useState('');
  const [heroImgError, setHeroImgError] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchDestination(destInput);
    setActiveTab('explorer');
  };

  const heroImgSrc = heroImgError
    ? FALLBACK_IMG
    : 'assets/images/horizontal/CozyLagos.jpeg';

  return (
    <div className="flex-grow flex flex-col animate-fade-in-up">
      <section className="relative w-full h-[540px] md:h-[640px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-charcoal">
          <motion.img
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover opacity-50 select-none pointer-events-none"
            src={heroImgSrc}
            alt="Lagos cruise"
            onError={() => setHeroImgError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-charcoal/20 to-charcoal/90" />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] px-6 md:px-12 xl:px-20 mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-10 h-[1px] bg-gold/50" />
            <span className="text-gold-light text-[10px] font-bold tracking-[0.4em] uppercase">
              Lagos Cruise Collection
            </span>
            <div className="w-10 h-[1px] bg-gold/50" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="w-full max-w-4xl"
          >
            <div className="bg-parchment/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-gold/10">
              <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
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

                <button
                  type="submit"
                  className="w-full md:w-auto px-10 py-4 bg-charcoal text-parchment hover:bg-gold-dark hover:text-parchment font-bold text-xs tracking-widest uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Enclaves</span>
                </button>
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center gap-6 mt-8 text-parchment/60 text-[10px] font-bold uppercase tracking-widest"
          >
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-gold-light" /> 24/7 Security</span>
            <span className="w-1 h-1 rounded-full bg-gold/40" />
            <span className="flex items-center gap-1.5"><Waves className="w-3.5 h-3.5 text-gold-light" /> Ocean Views</span>
            <span className="w-1 h-1 rounded-full bg-gold/40" />
            <span className="flex items-center gap-1.5"><Wifi className="w-3.5 h-3.5 text-gold-light" /> Fiber Internet</span>
          </motion.div>
        </div>
      </section>

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
            className="group/btn flex items-center gap-2 text-gold-dark hover:text-charcoal font-bold text-xs tracking-wider uppercase border-b-2 border-gold/40 hover:border-charcoal pb-1 transition-all"
          >
            <span>Explore Stay Database</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((stay, index) => (
            <ListingCard
              key={stay.id}
              stay={stay}
              index={index}
              onSelect={() => onSelectListing(stay)}
            />
          ))}
        </div>
      </section>

      <section className="bg-charcoal text-parchment py-16 px-6 md:px-12 xl:px-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-dark/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-gold-dark/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-[1440px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 text-left"
        >
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
            className="px-8 py-4 bg-gold hover:bg-parchment text-charcoal font-bold text-xs tracking-widest uppercase rounded-xl transition-all flex items-center gap-3 shrink-0 active:scale-95"
          >
            <Anchor className="w-4 h-4" />
            <span>Curate My Charter</span>
          </button>
        </motion.div>
      </section>
    </div>
  );
}
