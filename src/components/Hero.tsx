import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, MapPin, Star, Sun, Moon } from 'lucide-react';

interface HeroProps {
  children?: React.ReactNode;
}

const VIDEO_URL = '/assets/lagos-hero-video.mp4';
const FADE_DURATION = 1200;

export default function Hero({ children }: HeroProps) {
  const [isNight, setIsNight] = useState(false);
  const [imgError, setImgError] = useState({ day: false, night: false });
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const dayImg = imgError.day
    ? 'assets/images/horizontal/CozyLagos.jpeg'
    : 'assets/images/horizontal/day-hero.jpg';
  const nightImg = imgError.night
    ? 'assets/images/horizontal/CozyLagos.jpeg'
    : 'assets/images/horizontal/night-hero.jpg';

  useEffect(() => {
    const hour = new Date().getHours();
    setIsNight(hour >= 19 || hour < 6);
  }, []);

  // Attempt to play video on mount
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = async () => {
      try {
        video.muted = true;
        video.playsInline = true;
        await video.play();
      } catch (error) {
        console.warn('Video autoplay failed:', error);
        setVideoError(true);
      }
    };

    // Try to play immediately if ready
    if (video.readyState >= 2) {
      playVideo();
    } else {
      video.addEventListener('canplay', playVideo, { once: true });
    }

    return () => {
      video.removeEventListener('canplay', playVideo);
    };
  }, []);

  return (
    <section className="relative w-full h-[70vh] sm:h-[80vh] md:h-[85vh] min-h-[450px] sm:min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Day Image */}
      <AnimatePresence>
        {!isNight && (
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.img
              className="w-full h-full object-cover"
              src={dayImg}
              alt="Lagos Day View"
              onError={() => setImgError(prev => ({ ...prev, day: true }))}
              animate={{
                scale: 1,
                opacity: videoError ? 1 : 0
              }}
              transition={{
                scale: { duration: FADE_DURATION / 1000, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: FADE_DURATION / 1000, ease: [0.4, 0, 0.2, 1] }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-transparent to-charcoal/70" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Night Image */}
      <AnimatePresence>
        {isNight && (
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <motion.img
              className="w-full h-full object-cover brightness-75"
              src={nightImg}
              alt="Lagos Night View"
              onError={() => setImgError(prev => ({ ...prev, night: true }))}
              animate={{
                scale: 1,
                opacity: videoError ? 1 : 0
              }}
              transition={{
                scale: { duration: FADE_DURATION / 1000, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: FADE_DURATION / 1000, ease: [0.4, 0, 0.2, 1] }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/30 to-charcoal/90" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Background - Continuous Autoplay */}
      {!videoError && (
        <motion.div
          className="absolute inset-0 z-[1]"
          initial={{ opacity: 0 }}
          animate={{ opacity: videoLoaded ? 1 : 0 }}
          transition={{ duration: FADE_DURATION / 1000, ease: [0.4, 0, 0.2, 1] }}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={VIDEO_URL}
            muted
            playsInline
            loop
            preload="auto"
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => {
              setVideoError(true);
              setVideoLoaded(false);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/20 via-charcoal/10 to-charcoal/40" />
        </motion.div>
      )}

      {/* Animated Background Elements */}
      <motion.div
        animate={{ y: [0, -30, 0], rotate: [0, 5, 0], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 md:left-32 text-white z-0"
      >
        <Home size={120} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 30, 0], rotate: [0, -5, 0], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-40 right-10 md:right-32 text-gold z-0"
      >
        <MapPin size={80} />
      </motion.div>

      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.2, 0.08] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4 text-white/20 z-0"
      >
        <Star size={60} />
      </motion.div>

      <div className="relative z-10 text-center px-4 md:px-6 max-w-5xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-[1px] bg-gold/50" />
            <span className="text-gold-light text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase">
              Exquisite Lagos Living
            </span>
            <div className="w-12 h-[1px] bg-gold/50" />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-7xl xl:text-8xl text-white mb-4 sm:mb-5 md:mb-6 drop-shadow-2xl leading-[1.1]">
            Find Your Perfect <br /> <span className="text-gold-light italic">Sanctuary</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-white/80 text-xs sm:text-sm md:text-lg xl:text-xl font-light mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto drop-shadow-md leading-relaxed px-4"
          >
            Experience the pinnacle of luxury through our curated collection of Lagos' most prestigious residences.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="-mt-2 sm:-mt-4"
        >
          {children}
        </motion.div>

        {/* Day/Night Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-6 md:mt-8 flex items-center justify-center"
        >
          <div className="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
            <button
              onClick={() => setIsNight(false)}
              className={`flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all duration-500 ${
                !isNight
                  ? 'bg-gold text-charcoal shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span className="hidden sm:inline">Morning</span>
            </button>
            <button
              onClick={() => setIsNight(true)}
              className={`flex items-center gap-2 px-4 md:px-6 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all duration-500 ${
                isNight
                  ? 'bg-charcoal text-parchment shadow-lg'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span className="hidden sm:inline">Night</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
