import React from 'react';
import { motion } from 'motion/react';
import { Home, MapPin, Star, Sparkles } from 'lucide-react';

interface HeroProps {
  children?: React.ReactNode;
}

export default function Hero({ children }: HeroProps) {
  return (
    <section className="relative w-full h-[85vh] min-h-[650px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          className="w-full h-full object-cover"
          src="assets/images/horizontal/Horizotal view.jpg"
          alt="Luxury Lagos"
          onError={(e) => { (e.target as HTMLImageElement).src = 'assets/images/horizontal/CozyLagos.jpeg'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-transparent to-charcoal/60"></div>
      </div>

      {/* Animated Background Elements */}
      <motion.div 
        animate={{ 
          y: [0, -30, 0],
          rotate: [0, 5, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 md:left-32 text-white z-0"
      >
        <Home size={120} />
      </motion.div>
      
      <motion.div 
        animate={{ 
          y: [0, 30, 0],
          rotate: [0, -5, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-40 right-10 md:right-32 text-gold z-0"
      >
        <MapPin size={80} />
      </motion.div>

      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4 text-white/20 z-0"
      >
        <Star size={60} />
      </motion.div>

      <div className="relative z-10 text-center px-6 max-w-5xl w-full">
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
          
          <h1 className="font-serif text-5xl md:text-8xl text-white mb-8 drop-shadow-2xl leading-[1.1]">
            Find Your Perfect <br /> <span className="text-gold-light italic">Sanctuary</span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-white/80 text-lg md:text-2xl font-light mb-12 max-w-2xl mx-auto drop-shadow-md leading-relaxed"
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
      </div>
    </section>
  );
}
