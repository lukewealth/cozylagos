import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, MapPin, Star, Trash2, ExternalLink } from 'lucide-react';
import { getFavorites, removeFavorite, Favorite } from '../data-new-sections';

export default function FavoritesView({ onNavigate }: { onNavigate: (tab: string, data?: any) => void }) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleRemove = (type: string, itemId: string) => {
    removeFavorite(type, itemId);
    setFavorites(getFavorites());
  };

  const handleView = (favorite: Favorite) => {
    switch (favorite.type) {
      case 'listing':
        onNavigate('listing-detail', favorite.itemId);
        break;
      case 'experience':
        onNavigate('bundles');
        break;
      case 'restaurant':
      case 'beach':
        onNavigate('explore-lagos');
        break;
      case 'service':
        onNavigate('vip-services');
        break;
    }
  };

  const groupedFavorites = favorites.reduce((acc, fav) => {
    if (!acc[fav.type]) acc[fav.type] = [];
    acc[fav.type].push(fav);
    return acc;
  }, {} as Record<string, Favorite[]>);

  const typeLabels: Record<string, { label: string; icon: string }> = {
    listing: { label: 'Homes & Stays', icon: '🏡' },
    experience: { label: 'Experiences', icon: '✨' },
    restaurant: { label: 'Restaurants', icon: '🍽️' },
    beach: { label: 'Beaches', icon: '🏖️' },
    service: { label: 'Services', icon: '🤝' },
  };

  return (
    <div className="flex-grow flex flex-col animate-fade-in-up py-8 sm:py-12 px-4 sm:px-6 md:px-12 xl:px-20 max-w-[1440px] mx-auto w-full">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-6 h-6 text-rose-500 fill-current" />
          <span className="text-gold-dark text-[10px] font-bold tracking-[0.3em] uppercase">
            Your Collection
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
          Favorites
        </h1>
        <p className="text-sm text-charcoal/60 mt-2">
          {favorites.length} saved {favorites.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-10 h-10 text-rose-300" />
          </div>
          <h3 className="font-serif text-xl font-bold text-charcoal mb-2">No favorites yet</h3>
          <p className="text-sm text-charcoal/50 max-w-md mx-auto">
            Start saving your favorite homes, experiences, restaurants, and services to see them here.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedFavorites).map(([type, items]) => (
            <div key={type}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{typeLabels[type]?.icon || '📌'}</span>
                <h2 className="font-serif text-xl font-bold text-charcoal">
                  {typeLabels[type]?.label || type}
                </h2>
                <span className="text-xs text-charcoal/40">({items.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((favorite) => (
                  <motion.div
                    key={`${favorite.type}-${favorite.itemId}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-charcoal/5 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-charcoal/10">
                      <img
                        src={favorite.image}
                        alt={favorite.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/assets/bundles/bundles-hero-background.jpeg';
                        }}
                      />
                      <button
                        onClick={() => handleRemove(favorite.type, favorite.itemId)}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-full hover:bg-rose-100 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-charcoal text-sm mb-1 truncate">{favorite.title}</h3>
                      <p className="text-xs text-charcoal/50 truncate">{favorite.subtitle}</p>
                      <button
                        onClick={() => handleView(favorite)}
                        className="mt-3 flex items-center gap-1 text-[10px] font-bold text-gold-dark hover:text-charcoal transition-colors uppercase tracking-wider"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
