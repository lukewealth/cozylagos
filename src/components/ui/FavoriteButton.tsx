import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';
import { isFavorite, addFavorite, removeFavorite } from '../../data-new-sections';

interface FavoriteButtonProps {
  type: 'listing' | 'experience' | 'restaurant' | 'beach' | 'service';
  itemId: string;
  title: string;
  subtitle: string;
  image: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function FavoriteButton({
  type,
  itemId,
  title,
  subtitle,
  image,
  className = '',
  size = 'md',
  showLabel = false,
}: FavoriteButtonProps) {
  const [isFav, setIsFav] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    setIsFav(isFavorite(type, itemId));
  }, [type, itemId]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isFav) {
      removeFavorite(type, itemId);
      setIsFav(false);
    } else {
      addFavorite({
        id: `fav-${itemId}-${Date.now()}`,
        type,
        itemId,
        title,
        subtitle,
        image,
      });
      setIsFav(true);
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 600);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={`relative ${className}`}>
      <motion.button
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1.1 }}
        onClick={handleClick}
        className={`${sizeClasses[size]} rounded-full bg-white/90 backdrop-blur-md shadow-lg flex items-center justify-center transition-all ${
          isFav ? 'text-red-500' : 'text-charcoal/60 hover:text-red-400'
        }`}
        aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      >
        <motion.div
          animate={isFav ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={`${iconSizes[size]} ${isFav ? 'fill-current' : ''}`}
          />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {showParticles && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: [0, 1, 0],
                  x: Math.cos((i * Math.PI) / 3) * 30,
                  y: Math.sin((i * Math.PI) / 3) * 30,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-400 rounded-full pointer-events-none"
                style={{ transform: 'translate(-50%, -50%)' }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {showLabel && (
        <motion.span
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-charcoal/60 whitespace-nowrap"
        >
          {isFav ? 'Saved' : 'Save'}
        </motion.span>
      )}
    </div>
  );
}
