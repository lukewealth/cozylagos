import React from 'react';
import { Star, MapPin, Flame, ArrowUpRight } from 'lucide-react';
import { Listing } from '../../types';

interface GemCardProps {
  listing: Listing;
  onClick: () => void;
  index: number;
}

const HOT_TAGS = ['Hot Deal', 'Trending', 'Limited', 'Exclusive', 'New', 'Popular', 'Flash'];

export default function GemCard({ listing, onClick, index }: GemCardProps) {
  const tag = HOT_TAGS[index % HOT_TAGS.length];

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-charcoal/5"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />

        {/* Hot tag */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-red-500 text-white px-2 py-0.5 rounded-full shadow-lg">
          <Flame className="w-3 h-3 fill-current" />
          <span className="text-[9px] font-bold uppercase tracking-wider">{tag}</span>
        </div>

        {/* Rating */}
        <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
          <Star className="w-2.5 h-2.5 text-gold-dark fill-current" />
          <span className="text-[9px] font-bold text-charcoal">{listing.rating}</span>
        </div>

        {/* Bottom overlay info */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5">
          <h3 className="font-serif text-sm sm:text-base font-bold text-white leading-tight line-clamp-1 drop-shadow-lg">
            {listing.title}
          </h3>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-2.5 h-2.5 text-white/80" />
            <span className="text-[10px] text-white/80 font-medium">{listing.location}</span>
          </div>
        </div>

        {/* Arrow icon on hover */}
        <div className="absolute bottom-2.5 right-2.5 w-7 h-7 bg-gold rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-lg">
          <ArrowUpRight className="w-3.5 h-3.5 text-charcoal" />
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[9px] text-charcoal/40 uppercase font-bold tracking-wider">From</span>
            <span className="font-serif text-base sm:text-lg font-bold text-gold-dark ml-1">
              {listing.nightlyRate.toLocaleString()}
            </span>
            <span className="text-[9px] text-charcoal/40 ml-0.5">/night</span>
          </div>
          <span className="text-[9px] font-bold text-charcoal/30 uppercase bg-charcoal/5 px-1.5 py-0.5 rounded">
            {listing.category}
          </span>
        </div>
      </div>
    </div>
  );
}
