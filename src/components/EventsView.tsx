import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Clock, Ticket, Filter, ChevronRight, Star, Users, Music, Theater, Briefcase, Utensils, Baby, Trophy, Waves, X, Check, CreditCard } from 'lucide-react';
import { CalendarIcon, MusicalNoteIcon, FireIcon, PaintBrushIcon, BriefcaseIcon, MoonIcon, ArrowPathIcon, ClockIcon, SparklesIcon, FlagIcon } from '@heroicons/react/24/outline';
import { LAGOS_EVENTS, LagosEvent } from '../data-new-sections';
import TrendingEventsSlider from './TrendingEventsSlider';

interface PurchasedTicket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  ticketCount: number;
  totalPrice: number;
  purchaseDate: string;
  attendeeName: string;
  attendeeEmail: string;
}

const STORAGE_KEY = 'cozy_lagos_event_tickets';

function getPurchasedTickets(): PurchasedTicket[] {
  try {
    const tickets = localStorage.getItem(STORAGE_KEY);
    return tickets ? JSON.parse(tickets) : [];
  } catch {
    return [];
  }
}

function savePurchasedTicket(ticket: PurchasedTicket): void {
  try {
    const tickets = getPurchasedTickets();
    tickets.unshift(ticket);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch {
    // Silent fail
  }
}

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

function EventCard({ event, index, onPurchaseTicket }: { event: LagosEvent; index: number; onPurchaseTicket: (event: LagosEvent) => void }) {
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
        <button 
          onClick={() => onPurchaseTicket(event)}
          className="w-full py-2.5 bg-charcoal text-parchment hover:bg-gold-dark font-bold text-[10px] tracking-widest uppercase rounded-lg transition-all"
        >
          Get Tickets
        </button>
      </div>
    </motion.div>
  );
}

function TicketPurchaseModal({ event, onClose }: { event: LagosEvent; onClose: () => void }) {
  const [ticketCount, setTicketCount] = useState(1);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  const pricePerTicket = 25000; // Default price
  const totalPrice = pricePerTicket * ticketCount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const ticket: PurchasedTicket = {
        id: `ticket-${Date.now()}`,
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventLocation: event.location,
        ticketCount,
        totalPrice,
        purchaseDate: new Date().toISOString(),
        attendeeName,
        attendeeEmail,
      };

      savePurchasedTicket(ticket);
      setIsProcessing(false);
      setPurchaseComplete(true);

      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1500);
  };

  if (purchaseComplete) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-parchment rounded-3xl overflow-hidden shadow-2xl p-8 text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-charcoal mb-2">Purchase Complete!</h2>
          <p className="text-sm text-charcoal/60 mb-4">
            Your tickets for {event.title} have been confirmed.
          </p>
          <p className="text-xs text-charcoal/50">
            {ticketCount} {ticketCount === 1 ? 'ticket' : 'tickets'} • ₦{totalPrice.toLocaleString()}
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-parchment rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-parchment border-b border-charcoal/10 px-6 py-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-charcoal">Purchase Tickets</h2>
          <button onClick={onClose} className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors">
            <X className="w-5 h-5 text-charcoal/60" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 bg-charcoal/5 rounded-xl">
            <h3 className="font-serif text-lg font-bold text-charcoal mb-1">{event.title}</h3>
            <div className="space-y-1 text-xs text-charcoal/60">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-1.5 block">Full Name</label>
              <input
                type="text"
                value={attendeeName}
                onChange={(e) => setAttendeeName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-1.5 block">Email</label>
              <input
                type="email"
                value={attendeeEmail}
                onChange={(e) => setAttendeeEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-1.5 block">Number of Tickets</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                  className="w-10 h-10 bg-charcoal/5 rounded-lg flex items-center justify-center hover:bg-charcoal/10 transition-colors"
                >
                  -
                </button>
                <span className="text-lg font-bold text-charcoal w-12 text-center">{ticketCount}</span>
                <button
                  type="button"
                  onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                  className="w-10 h-10 bg-charcoal/5 rounded-lg flex items-center justify-center hover:bg-charcoal/10 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-charcoal/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-charcoal/60">Total Price</span>
                <span className="text-2xl font-bold text-gold-dark">₦{totalPrice.toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-3">
                <button type="button" onClick={onClose} className="flex-1 py-3 bg-charcoal/5 text-charcoal font-bold text-sm rounded-xl hover:bg-charcoal/10 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-gold text-charcoal font-bold text-sm rounded-xl hover:bg-gold-dark hover:text-parchment transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      Purchase
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function EventsView() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTime, setSelectedTime] = useState('all');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<LagosEvent | null>(null);

  const handlePurchaseTicket = (event: LagosEvent) => {
    setSelectedEvent(event);
    setShowTicketModal(true);
  };

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
      <section className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden bg-charcoal group">
        <TrendingEventsSlider />
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-2"
          >
            <CalendarIcon className="w-5 h-5 text-gold" />
            <span className="text-gold text-[10px] font-bold tracking-[0.4em] uppercase">
              What's Happening
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-2xl sm:text-3xl md:text-4xl text-parchment leading-tight tracking-tight drop-shadow-lg"
          >
            Lagos <span className="italic font-light text-gold">Events</span>
          </motion.h1>
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
            <React.Fragment key={event.id}>
              <EventCard event={event} index={index} onPurchaseTicket={handlePurchaseTicket} />
            </React.Fragment>
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

      <AnimatePresence>
        {showTicketModal && selectedEvent && (
          <TicketPurchaseModal
            event={selectedEvent}
            onClose={() => {
              setShowTicketModal(false);
              setSelectedEvent(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
