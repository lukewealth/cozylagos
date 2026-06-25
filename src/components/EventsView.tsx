import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, Ticket, Filter, ChevronRight, Star, Users, Music, Theater, Briefcase, Utensils, Baby, Trophy, Waves } from 'lucide-react';
import { CalendarIcon, MusicalNoteIcon, FireIcon, PaintBrushIcon, BriefcaseIcon, MoonIcon, ArrowPathIcon, ClockIcon, SparklesIcon, FlagIcon } from '@heroicons/react/24/outline';
import { LAGOS_EVENTS, LagosEvent } from '../data-new-sections';

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Events', icon: CalendarIcon },
  { id: 'concert', label: 'Concerts', icon: MusicalNoteIcon },
  { id: 'festival', label: 'Festivals', icon: FireIcon },
  { id: 'exhibition', label: 'Exhibitions', icon: PaintBrushIcon },
  { id: 'conference', label: 'Conferences', icon: BriefcaseIcon },
  { id: 'nightlife', label: 'Nightlife', icon: MoonIcon },
  { id: 'weekly', label: 'Weekly', icon: ArrowPathIcon },
];

const TIME_FILTERS = [
  { id: 'today', label: 'Today', icon: ClockIcon },
  { id: 'weekend', label: 'This Weekend', icon: SparklesIcon },
  { id: 'week', label: 'This Week', icon: CalendarIcon },
  { id: 'month', label: 'This Month', icon: FlagIcon },
  { id: 'annual', label: 'Annual Events', icon: FireIcon },
];

function getEventDate(event: LagosEvent): Date {
  // Parse date string or return future date for recurring events
  if (event.date.includes('Every') || event.date.includes('Last')) {
    // For recurring events, return next occurrence
    const now = new Date();
    now.setDate(now.getDate() + 7); // Assume next week
    return now;
  }
  
  // Parse specific date
  const dateMatch = event.date.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch) {
    return new Date(parseInt(dateMatch[1]), parseInt(dateMatch[2]) - 1, parseInt(dateMatch[3]));
  }
  
  // Default to future date
  const now = new Date();
  now.setDate(now.getDate() + 30);
  return now;
}

function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function isThisWeekend(date: Date): boolean {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilSaturday = 6 - dayOfWeek;
  const saturday = new Date(today);
  saturday.setDate(today.getDate() + daysUntilSaturday);
  const sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);
  
  return date.toDateString() === saturday.toDateString() || 
         date.toDateString() === sunday.toDateString();
}

function isThisWeek(date: Date): boolean {
  const today = new Date();
  const weekFromNow = new Date(today);
  weekFromNow.setDate(today.getDate() + 7);
  return date >= today && date <= weekFromNow;
}

function isThisMonth(date: Date): boolean {
  const today = new Date();
  return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
}

function isAnnual(date: Date): boolean {
  // Annual events are those with specific dates that recur yearly
  return !isToday(date) && !isThisWeek(date);
}

function EventCard({ event, index }: { event: LagosEvent; index: number }) {
  const categoryColors: Record<string, string> = {
    concert: 'bg-purple-100 text-purple-700',
    festival: 'bg-orange-100 text-orange-700',
    exhibition: 'bg-blue-100 text-blue-700',
    conference: 'bg-slate-100 text-slate-700',
    nightlife: 'bg-pink-100 text-pink-700',
    weekly: 'bg-green-100 text-green-700',
  };

  const eventDate = getEventDate(event);
  const dateStr = eventDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

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
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${categoryColors[event.category]}`}>
            {event.category}
          </span>
          {isToday(eventDate) && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700">
              TODAY
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg">
          <div className="text-center">
            <div className="text-[10px] font-bold text-charcoal/60 uppercase">
              {eventDate.toLocaleDateString('en-US', { month: 'short' })}
            </div>
            <div className="text-lg font-bold text-charcoal leading-none">
              {eventDate.getDate()}
            </div>
          </div>
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
            <span>{dateStr}</span>
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
  const [selectedTime, setSelectedTime] = useState('all');

  const filteredEvents = useMemo(() => {
    let events = LAGOS_EVENTS;

    // Filter by category
    if (selectedCategory !== 'all') {
      events = events.filter(e => e.category === selectedCategory);
    }

    // Filter by time
    if (selectedTime !== 'all') {
      events = events.filter(e => {
        const eventDate = getEventDate(e);
        switch (selectedTime) {
          case 'today':
            return isToday(eventDate);
          case 'weekend':
            return isThisWeekend(eventDate);
          case 'week':
            return isThisWeek(eventDate);
          case 'month':
            return isThisMonth(eventDate);
          case 'annual':
            return isAnnual(eventDate);
          default:
            return true;
        }
      });
    }

    return events;
  }, [selectedCategory, selectedTime]);

  const todayEvents = LAGOS_EVENTS.filter(e => isToday(getEventDate(e)));
  const weekendEvents = LAGOS_EVENTS.filter(e => isThisWeekend(getEventDate(e)));

  return (
    <div className="flex-grow flex flex-col animate-fade-in-up">
      <section className="relative w-full h-[250px] sm:h-[350px] flex items-center justify-center overflow-hidden bg-rose-900">
        <div className="absolute inset-0">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover opacity-40"
            src="/assets/bundles/eventherobackground.png"
            alt="Lagos Events"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-rose-900/80 via-rose-900/50 to-rose-900/90" />
        </div>
        <div className="relative z-10 w-full max-w-[1440px] px-4 sm:px-6 md:px-12 xl:px-20 mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3 mb-4"
          >
            <CalendarIcon className="w-6 h-6 text-gold" />
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

      {/* Quick Access: Today & This Weekend */}
      {(todayEvents.length > 0 || weekendEvents.length > 0) && (
        <section className="py-8 px-4 sm:px-6 md:px-12 xl:px-20 max-w-[1440px] mx-auto w-full bg-gold/5 border-b border-gold/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {todayEvents.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <ClockIcon className="w-6 h-6 text-gold-dark" />
                  <h3 className="font-serif text-xl font-bold text-charcoal">Happening Today</h3>
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full">
                    {todayEvents.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {todayEvents.slice(0, 2).map((event, i) => (
                    <div key={event.id} className="bg-white rounded-xl p-4 border border-charcoal/5 hover:shadow-md transition-all">
                      <h4 className="font-semibold text-charcoal text-sm mb-1">{event.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-charcoal/60">
                        <MapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {weekendEvents.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <SparklesIcon className="w-6 h-6 text-gold-dark" />
                  <h3 className="font-serif text-xl font-bold text-charcoal">This Weekend</h3>
                  <span className="px-2 py-0.5 bg-gold/20 text-gold-dark text-[10px] font-bold rounded-full">
                    {weekendEvents.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {weekendEvents.slice(0, 2).map((event, i) => (
                    <div key={event.id} className="bg-white rounded-xl p-4 border border-charcoal/5 hover:shadow-md transition-all">
                      <h4 className="font-semibold text-charcoal text-sm mb-1">{event.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-charcoal/60">
                        <MapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="py-10 sm:py-16 px-4 sm:px-6 md:px-12 xl:px-20 max-w-[1440px] mx-auto w-full">
        {/* Time-Based Navigation */}
        <div className="mb-8">
          <h3 className="font-serif text-lg font-bold text-charcoal mb-4">Browse by Time</h3>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            <button
              onClick={() => setSelectedTime('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedTime === 'all'
                  ? 'bg-charcoal text-parchment'
                  : 'bg-charcoal/5 text-charcoal/60 hover:bg-charcoal/10'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>All Time</span>
            </button>
            {TIME_FILTERS.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedTime(filter.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                    selectedTime === filter.id
                      ? 'bg-charcoal text-parchment'
                      : 'bg-charcoal/5 text-charcoal/60 hover:bg-charcoal/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-gold-dark font-bold text-[10px] tracking-[0.25em] uppercase block mb-1">
              {filteredEvents.length} Events
            </span>
            <h2 className="font-serif font-semibold text-2xl text-charcoal">
              {selectedTime === 'all' ? 'All Events' : TIME_FILTERS.find(f => f.id === selectedTime)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            {CATEGORY_FILTERS.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedCategory(filter.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                    selectedCategory === filter.id
                      ? 'bg-charcoal text-parchment'
                      : 'bg-charcoal/5 text-charcoal/60 hover:bg-charcoal/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-charcoal/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-charcoal/30" />
            </div>
            <p className="text-lg font-semibold text-charcoal mb-2">No events found</p>
            <p className="text-sm text-charcoal/50">Try selecting a different time period or category</p>
          </div>
        )}
      </section>
    </div>
  );
}
