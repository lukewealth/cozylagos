import React from 'react';
import { Bed, Bath, Star, MapPin, ArrowRight, Wifi, Shield, Waves, Coffee, Dumbbell, Tv, ShoppingCart } from 'lucide-react';
import { Listing } from '../../types';
import GlassCard from './GlassCard';
import { useCart } from '../../context/CartContext';

interface ApartmentCardProps {
  listing: Listing;
  onClick: () => void;
  key?: string;
}

export default function ApartmentCard({ listing, onClick }: ApartmentCardProps) {
  const { addToCart } = useCart();

  const getAmenityIcon = (amenity: string) => {
    const a = amenity.toLowerCase();
    if (a.includes('wifi') || a.includes('internet')) return <Wifi className="w-3 h-3" />;
    if (a.includes('security') || a.includes('shield') || a.includes('safety')) return <Shield className="w-3 h-3" />;
    if (a.includes('pool') || a.includes('waves') || a.includes('swimming')) return <Waves className="w-3 h-3" />;
    if (a.includes('breakfast') || a.includes('chef') || a.includes('coffee') || a.includes('dining')) return <Coffee className="w-3 h-3" />;
    if (a.includes('gym') || a.includes('fitness')) return <Dumbbell className="w-3 h-3" />;
    if (a.includes('tv') || a.includes('netflix') || a.includes('dstv')) return <Tv className="w-3 h-3" />;
    return null;
  };

  return (
    <GlassCard 
      className="group flex flex-col h-full transition-all duration-500 hover:-translate-y-2"
      onClick={onClick}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={listing.image} 
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-parchment/90 backdrop-blur-md px-2 py-1 rounded-full border border-gold/20 flex items-center gap-1 shadow-sm">
          <Star className="w-3 h-3 text-gold-dark fill-current" />
          <span className="text-[10px] font-bold text-charcoal">{listing.rating}</span>
        </div>
        <div className="absolute bottom-3 left-3 bg-charcoal/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10">
          <span className="text-[9px] font-bold uppercase tracking-widest text-parchment">
            {listing.category}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="font-serif text-xl font-bold text-charcoal group-hover:text-gold-dark transition-colors line-clamp-1">
            {listing.title}
          </h3>
          <div className="flex items-center gap-1 text-charcoal/50 mt-1">
            <MapPin className="w-3 h-3" />
            <span className="text-[11px] font-medium">{listing.location}</span>
          </div>
        </div>

        <p className="text-charcoal/70 text-xs leading-relaxed line-clamp-2 mb-6 flex-grow">
          {listing.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex items-center gap-1 bg-gold/5 px-2 py-1 rounded text-[10px] font-bold text-gold-dark">
            <Bed className="w-3 h-3" />
            {listing.bedrooms}
          </div>
          <div className="flex items-center gap-1 bg-gold/5 px-2 py-1 rounded text-[10px] font-bold text-gold-dark">
            <Bath className="w-3 h-3" />
            {listing.bathrooms}
          </div>
          {listing.amenities.slice(0, 3).map((amenity, idx) => {
            const Icon = getAmenityIcon(amenity);
            return (
              <div key={idx} className="flex items-center gap-1 bg-gold/5 px-2 py-1 rounded text-[10px] font-bold text-gold-dark">
                {Icon ? Icon : <div className="w-3 h-3" />}
                {amenity.split(' ')[0]}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-charcoal/5">
          <div>
            <span className="text-xs text-charcoal/40 block uppercase font-bold tracking-tighter">Nightly Rate</span>
            <span className="font-serif text-lg font-bold text-gold-dark">
              ₦{listing.nightlyRate.toLocaleString()}
            </span>
          </div>
          <div className="flex gap-2">
            <button 
              className="p-2 bg-charcoal text-parchment rounded-full hover:bg-gold hover:text-charcoal transition-all shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              title="View Details"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              className="p-2 bg-gold text-charcoal rounded-full hover:bg-parchment transition-all shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(listing);
              }}
              title="Add to Cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
