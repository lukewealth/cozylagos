import React from 'react';
import { Star, MapPin, Clock, Phone, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface NewHomeViewProps {
  onSelectListing: (listing: any) => void;
  setActiveTab: (tab: string) => void;
}

export default function NewHomeView({ onSelectListing, setActiveTab }: NewHomeViewProps) {
  return (
    <div className="flex-grow flex flex-col animate-fade-in">
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover scale-105" 
            src="home HQ 1.jpg" 
            alt="Luxury Resort"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl text-parchment mb-6"
          >
            Experience <br /> Five-Star Luxury
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-parchment/80 text-lg md:text-xl font-light mb-10"
          >
            Unmatched comfort and elegance tailored to perfection
          </motion.p>
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onClick={() => setActiveTab('explorer')}
            className="px-8 py-4 bg-gold text-charcoal font-bold text-sm tracking-widest uppercase rounded hover:bg-parchment transition-colors shadow-xl"
          >
            BOOK YOUR STAY
          </motion.button>
        </div>

        {/* Quick Info Bar */}
        <div className="absolute bottom-0 w-full bg-charcoal/80 backdrop-blur-md text-parchment py-6 px-6 md:px-20 hidden md:grid grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <Clock className="text-gold w-6 h-6" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-parchment/50">Check-in / Out</p>
              <p className="text-sm font-medium">3:00 PM / 11:00 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <MapPin className="text-gold w-6 h-6" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-parchment/50">Service Time</p>
              <p className="text-sm font-medium">24/7 Concierge</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Phone className="text-gold w-6 h-6" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-parchment/50">Customer Support</p>
              <p className="text-sm font-medium">+1 555 997 5543</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ROOM TYPES SECTION */}
      <section className="py-24 px-6 md:px-12 xl:px-20 max-w-[1440px] mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">Our Exquisite Suites</h2>
          <div className="w-24 h-1 bg-gold mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { title: 'Superior Suite', price: '189', img: 'assets/images/horizontal/IMG-20260621-WA0002.jpg' },
            { title: 'Executive Room', price: '229', img: 'assets/images/horizontal/IMG-20260621-WA0003.jpg' },
            { title: 'Grand Suite', price: '500', img: 'assets/images/horizontal/IMG-20260621-WA0004.jpg' },
          ].map((room, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg group"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={room.img} alt={room.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="p-8 text-center">
                <h3 className="font-serif text-2xl text-charcoal mb-2">{room.title}</h3>
                <p className="text-charcoal/60 text-sm mb-6">Luxury redefined for your comfort and style.</p>
                <div className="text-gold-dark font-bold text-xl mb-6">
                  FROM ${room.price} <span className="text-xs text-charcoal/40 font-normal">/ NIGHT</span>
                </div>
                <button 
                  onClick={() => onSelectListing({ title: room.title, image: room.img, nightlyRate: parseInt(room.price), description: '', location: '', bedrooms: 1, rating: 5, reviewsCount: 10, aiMatchPercent: 100 })}
                  className="w-full py-3 border-2 border-gold text-gold-dark font-bold text-xs tracking-widest uppercase rounded hover:bg-gold hover:text-charcoal transition-all"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. DISCOVER SECTION */}
      <section className="bg-charcoal py-24 px-6 md:px-12 xl:px-20">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="font-serif text-4xl md:text-5xl text-parchment mb-6">Discover Refined Luxury</h2>
            <p className="text-parchment/70 text-lg font-light leading-relaxed mb-8">
              Every detail of your stay is carefully orchestrated to provide an unparalleled experience of tranquility and sophistication. From our world-class spa to our gourmet dining, excellence is our standard.
            </p>
            <button className="flex items-center gap-2 text-gold font-bold tracking-widest uppercase text-sm group">
              Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            <img src="assets/images/horizontal/IMG-20260621-WA0122.jpg" className="rounded-lg shadow-2xl" alt="Luxury 1" />
            <img src="assets/images/horizontal/IMG-20260621-WA0124.jpg" className="rounded-lg shadow-2xl mt-8" alt="Luxury 2" />
          </div>
        </div>
      </section>
    </div>
  );
}
