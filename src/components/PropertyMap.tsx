import React, { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { Listing } from '../types';

interface PropertyMapProps {
  listings: Listing[];
  onSelectListing?: (listing: Listing) => void;
}

export default function PropertyMap({ listings, onSelectListing }: PropertyMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<Listing | null>(null);

  // Lagos coordinates bounds (approximate)
  const bounds = {
    minLat: 6.42,
    maxLat: 6.47,
    minLng: 3.40,
    maxLng: 3.48
  };

  // Convert lat/lng to SVG coordinates
  const toSvgCoords = (lat: number, lng: number) => {
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 800;
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 400;
    return { x, y };
  };

  const handlePinClick = (listing: Listing) => {
    setSelectedProperty(listing);
    if (onSelectListing) {
      onSelectListing(listing);
    }
  };

  return (
    <div className="relative w-full h-[500px] bg-charcoal/5 rounded-2xl overflow-hidden border border-charcoal/10">
      {/* Map Background */}
      <svg
        viewBox="0 0 800 400"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background */}
        <rect width="800" height="400" fill="#f4f3f2" />

        {/* Water bodies (simplified Lagos lagoon) */}
        <path
          d="M 0 200 Q 200 180, 400 200 T 800 220 L 800 400 L 0 400 Z"
          fill="#e3e2e1"
          opacity="0.5"
        />

        {/* Major roads (simplified) */}
        <line x1="100" y1="150" x2="700" y2="150" stroke="#dadad9" strokeWidth="3" />
        <line x1="400" y1="50" x2="400" y2="350" stroke="#dadad9" strokeWidth="3" />
        <line x1="200" y1="100" x2="600" y2="300" stroke="#dadad9" strokeWidth="2" />

        {/* Area labels */}
        <text x="150" y="120" className="fill-charcoal/40 text-xs font-bold" style={{ fontSize: '12px' }}>IKOYI</text>
        <text x="350" y="180" className="fill-charcoal/40 text-xs font-bold" style={{ fontSize: '12px' }}>VICTORIA ISLAND</text>
        <text x="550" y="100" className="fill-charcoal/40 text-xs font-bold" style={{ fontSize: '12px' }}>LEKKI</text>
        <text x="250" y="250" className="fill-charcoal/40 text-xs font-bold" style={{ fontSize: '12px' }}>BANANA ISLAND</text>

        {/* Property Pins */}
        {listings.map((listing) => {
          if (!listing.lat || !listing.lng) return null;
          const { x, y } = toSvgCoords(listing.lat, listing.lng);
          const isSelected = selectedProperty?.id === listing.id;

          return (
            <g
              key={listing.id}
              onClick={() => handlePinClick(listing)}
              className="cursor-pointer"
            >
              {/* Pin shadow */}
              <circle
                cx={x}
                cy={y + 2}
                r={isSelected ? 14 : 10}
                fill="rgba(0,0,0,0.2)"
              />
              {/* Pin */}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 12 : 8}
                fill={isSelected ? '#D4AF37' : '#4A5568'}
                stroke="white"
                strokeWidth="2"
                className="transition-all duration-300 hover:fill-gold"
              />
              {/* Pin inner dot */}
              <circle
                cx={x}
                cy={y}
                r="3"
                fill="white"
              />
            </g>
          );
        })}
      </svg>

      {/* Property Info Popup */}
      {selectedProperty && (
        <div className="absolute bottom-4 left-4 right-4 bg-parchment rounded-xl shadow-2xl border border-charcoal/10 overflow-hidden">
          <div className="flex gap-4 p-4">
            <img
              src={selectedProperty.image}
              alt={selectedProperty.title}
              className="w-24 h-24 object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/images/horizontal/CozyLagos.jpeg';
              }}
            />
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-serif text-lg font-bold text-charcoal">
                    {selectedProperty.title}
                  </h3>
                  <p className="text-xs text-charcoal/60">{selectedProperty.location}</p>
                </div>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="p-1 hover:bg-charcoal/5 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-charcoal/60" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-charcoal/70">
                  <span>{selectedProperty.bedrooms} bed</span>
                  <span>•</span>
                  <span>{selectedProperty.bathrooms} bath</span>
                  <span>•</span>
                  <span>★ {selectedProperty.rating}</span>
                </div>
                <div className="text-right">
                  <span className="font-serif text-lg font-bold text-gold-dark">
                    ₦{selectedProperty.nightlyRate.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-charcoal/50 block">/night</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-parchment/95 backdrop-blur-md rounded-lg p-3 shadow-lg border border-charcoal/10">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-gold-dark" />
          <span className="text-xs font-bold text-charcoal">{listings.length} Properties</span>
        </div>
        <div className="space-y-1 text-[10px] text-charcoal/60">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gold" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-charcoal/70" />
            <span>Available</span>
          </div>
        </div>
      </div>
    </div>
  );
}
