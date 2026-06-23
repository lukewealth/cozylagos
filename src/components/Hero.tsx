import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, MapPin, Star, Sun, Moon } from 'lucide-react';

interface HeroProps {
  children?: React.ReactNode;
}

export default function Hero({ children }: HeroProps) {
  const [isNight, setIsNight] = useState(false);
  const [imgError, setImgError] = useState({ day: false, night: false });

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

  return (
    <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
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
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 12, ease: "easeOut" }}
              className="w-full h-full object-cover"
              src={dayImg}
              alt="Lagos Day View"
              onError={() => setImgError(prev => ({ ...prev, day: true }))}
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
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 12, ease: "easeOut" }}
              className="w-full h-full object-cover brightness-75"
              src={nightImg}
              alt="Lagos Night View"
              onError={() => setImgError(prev => ({ ...prev, night: true }))}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/30 to-charcoal/90" />
          </motion.div>
        )}
      </AnimatePresence>

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
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-[1px] bg-gold/50" />
            <span className="text-gold-light text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase">
              Exquisite Lagos Living
            </span>
            <div className="w-12 h-[1px] bg-gold/50" />
          </div>

          <h1 className="font-serif text-4xl md:text-7xl xl:text-8xl text-white mb-6 md:mb-8 drop-shadow-2xl leading-[1.1]">
            Find Your Perfect <br /> <span className="text-gold-light italic">Sanctuary</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-white/80 text-sm md:text-lg xl:text-xl font-light mb-8 md:mb-12 max-w-2xl mx-auto drop-shadow-md leading-relaxed px-4"
          >
            Experience the pinnacle of luxury through our curated collection of Lagos' most prestigious residences.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {children}
        </motion.div>

        {/* Day/Night Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-8 md:mt-10 flex items-center justify-center"
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
