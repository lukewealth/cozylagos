import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, Ticket, Filter } from 'lucide-react';
import { LAGOS_EVENTS, LagosEvent } from '../data-new-sections';

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Events', icon: '📅' },
  { id: 'concert', label: 'Concerts', icon: '🎵' },
  { id: 'festival', label: 'Festivals', icon: '🎉' },
  { id: 'exhibition', label: 'Exhibitions', icon: '🎨' },
  { id: 'conference', label: 'Conferences', icon: '💼' },
  { id: 'nightlife', label: 'Nightlife', icon: '🌙' },
  { id: 'weekly', label: 'Weekly', icon: '🔄' },
];

function EventCard({ event, index }: { event: LagosEvent; index: number }) {
  const categoryColors: Record<string, string> = {
    concert: 'bg-purple-100 text-purple-700',
    festival: 'bg-orange-100 text-orange-700',
    exhibition: 'bg-blue-100 text-blue-700',
    conference: 'bg-slate-100 text-slate-700',
    nightlife: 'bg-pink-100 text-pink-700',
    weekly: 'bg-green-100 text-green-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white border border-charcoal/5 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-charcoal/10">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/bundles/bundles-hero-background.jpeg';
          }}
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${categoryColors[event.category]}`}>
            {event.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-serif text-lg font-bold text-charcoal mb-2 group-hover:text-gold-dark transition-colors">
          {event.title}
        </h3>
        <p className="text-xs text-charcoal/60 mb-4 line-clamp-2">{event.description}</p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs text-charcoal/60">
            <Calendar className="w-3.5 h-3.5 text-gold-dark" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-charcoal/60">
            <MapPin className="w-3.5 h-3.5 text-gold-dark" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-charcoal/60">
            <Ticket className="w-3.5 h-3.5 text-gold-dark" />
            <span className="font-semibold text-gold-dark">{event.price}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {event.highlights.slice(0, 3).map((h, i) => (
            <span key={i} className="text-[9px] font-medium text-charcoal/50 bg-charcoal/5 px-2 py-0.5 rounded-full">
              {h}
            </span>
          ))}
        </div>
        <button className="w-full py-2.5 bg-charcoal text-parchment hover:bg-gold-dark font-bold text-[10px] tracking-widest uppercase rounded-lg transition-all">
          Get Tickets
        </button>
      </div>
    </motion.div>
  );
}

export default function EventsView() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredEvents = selectedCategory === 'all'
    ? LAGOS_EVENTS
    : LAGOS_EVENTS.filter(e => e.category === selectedCategory);

  return (
    <div className="flex-grow flex flex-col animate-fade-in-up">
      <section className="relative w-full h-[250px] sm:h-[350px] flex items-center justify-center overflow-hidden bg-rose-900">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900 via-pink-800 to-purple-900" />
        <div className="relative z-10 w-full max-w-[1440px] px-4 sm:px-6 md:px-12 xl:px-20 mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-4"
          >
            <Calendar className="w-6 h-6 text-gold" />
            <span className="text-gold text-[10px] font-bold tracking-[0.4em] uppercase">
              What's Happening
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl text-parchment leading-tight tracking-tight"
          >
            Lagos <span className="italic font-light text-gold">Events</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-sans text-xs sm:text-sm text-parchment/70 max-w-xl font-light mt-4 px-2"
          >
            Concerts, festivals, exhibitions, and more. Discover the best events happening in Lagos.
          </motion.p>
        </div>
      </section>

      <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-12 xl:px-20 max-w-[1440px] mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-gold-dark font-bold text-[10px] tracking-[0.25em] uppercase block mb-1">
              {filteredEvents.length} Events
            </span>
            <h2 className="font-serif font-semibold text-2xl text-charcoal">
              Upcoming Events
            </h2>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            {CATEGORY_FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedCategory(filter.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                  selectedCategory === filter.id
                    ? 'bg-charcoal text-parchment'
                    : 'bg-charcoal/5 text-charcoal/60 hover:bg-charcoal/10'
                }`}
              >
                <span>{filter.icon}</span>
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-charcoal/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-charcoal/30" />
            </div>
            <p className="text-lg font-semibold text-charcoal mb-2">No events found</p>
            <p className="text-sm text-charcoal/50">Try selecting a different category</p>
          </div>
        )}
      </section>
    </div>
  );
}
