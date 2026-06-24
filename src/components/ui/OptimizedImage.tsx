import React, { useState } from 'react';
import { motion } from 'motion/react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  fallbackSrc?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  borderRadius?: string;
  aspectRatio?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 80,
  fallbackSrc = '/assets/placeholder.jpg',
  objectFit = 'cover',
  borderRadius = '0.75rem',
  aspectRatio,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(!priority);
  const [hasError, setHasError] = useState(false);

  const getWebPSrc = (originalSrc: string) => {
    if (originalSrc.startsWith('http') || originalSrc.startsWith('data:')) {
      return originalSrc;
    }
    return originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  };

  const webpSrc = getWebPSrc(src);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const objectFitClass = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
  }[objectFit];

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      style={{ borderRadius, aspectRatio }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-charcoal/5 animate-pulse" />
      )}

      <picture>
        <source
          srcSet={webpSrc}
          type="image/webp"
          sizes={sizes}
        />
        <img
          src={hasError ? fallbackSrc : src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          className={`${objectFitClass} w-full h-full transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          fetchPriority={priority ? 'high' : 'auto'}
        />
      </picture>
    </motion.div>
  );
}

export function ImageGallery({
  images,
  alt,
  className = '',
}: {
  images: string[];
  alt: string;
  className?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={`bg-charcoal/5 rounded-xl ${className}`}>
        <div className="flex items-center justify-center h-full text-charcoal/40">
          No images available
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <OptimizedImage
        src={images[currentIndex]}
        alt={`${alt} - Image ${currentIndex + 1}`}
        className="w-full h-full"
        priority={currentIndex === 0}
      />

      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
            aria-label="Previous image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
            aria-label="Next image"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-white w-8' : 'bg-white/50'
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
