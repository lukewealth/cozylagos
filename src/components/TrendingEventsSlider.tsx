import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Ticket, ChevronLeft, ChevronRight, Flame, Clock, CreditCard, X, Check } from 'lucide-react';
import { LagosEvent } from '../types';
import { LAGOS_EVENTS as STATIC_EVENTS } from '../data-new-sections';
import api from '../services/api';

function getEventDate(dateStr: string): Date {
  if (dateStr.includes('Every') || dateStr.includes('Last')) {
    const now = new Date();
    now.setDate(now.getDate() + 7);
    return now;
  }
  const dateMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (dateMatch) {
    return new Date(parseInt(dateMatch[1]), parseInt(dateMatch[2]) - 1, parseInt(dateMatch[3]));
  }
  const now = new Date();
  now.setDate(now.getDate() + 30);
  return now;
}

function formatPrice(price: string | number): string {
  if (typeof price === 'number') return `₦${price.toLocaleString()}`;
  return price;
}

interface TicketPurchaseState {
  isOpen: boolean;
  event: LagosEvent | null;
  ticketCount: number;
  attendeeName: string;
  attendeeEmail: string;
  isProcessing: boolean;
  purchaseComplete: boolean;
}

function TicketPurchaseModal({ event, onClose }: { event: LagosEvent; onClose: () => void }) {
  const [ticketCount, setTicketCount] = useState(1);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  const pricePerTicket = 25000;
  const totalPrice = pricePerTicket * ticketCount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const ticket = {
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

      try {
        const tickets = JSON.parse(localStorage.getItem('cozy_lagos_event_tickets') || '[]');
        tickets.unshift(ticket);
        localStorage.setItem('cozy_lagos_event_tickets', JSON.stringify(tickets));
      } catch {}

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
        <div className="sticky top-0 bg-parchment border-b border-charcoal/10 px-6 py-4 flex items-center justify-between z-10">
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

function EventSlide({ event, isActive, onGetTickets }: { event: LagosEvent; isActive: boolean; onGetTickets: (event: LagosEvent) => void }) {
  const eventDate = getEventDate(event.date);
  const dateStr = eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
      <div className="absolute inset-0">
        <motion.img
          key={event.id}
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.4, 0, 0.2, 1] }}
          src={event.image || event.images?.[0] || '/assets/bundles/eventherobackground.png'}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/bundles/eventherobackground.png';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/50 to-charcoal/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8 md:p-12 lg:p-16 max-w-[1440px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-2 mb-3"
        >
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-orange-400 text-[10px] font-bold tracking-[0.3em] uppercase">Trending Now</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-parchment font-bold mb-3 max-w-2xl leading-tight"
        >
          {event.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-parchment/80 text-xs sm:text-sm md:text-base max-w-lg mb-5 line-clamp-2 leading-relaxed"
        >
          {event.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap items-center gap-4 mb-6"
        >
          <div className="flex items-center gap-1.5 text-parchment/90 text-xs sm:text-sm">
            <Calendar className="w-4 h-4 text-gold" />
            <span>{dateStr}</span>
          </div>
          <div className="flex items-center gap-1.5 text-parchment/90 text-xs sm:text-sm">
            <MapPin className="w-4 h-4 text-gold" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gold text-xs sm:text-sm font-bold">
            <Ticket className="w-4 h-4" />
            <span>{formatPrice(event.price)}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex items-center gap-3"
        >
          <button
            onClick={() => onGetTickets(event)}
            className="px-6 sm:px-8 py-3 sm:py-3.5 bg-gold text-charcoal font-bold text-[10px] sm:text-xs tracking-widest uppercase rounded-xl hover:bg-gold-dark hover:text-parchment transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            Get Tickets
          </button>
          {event.ticketsAvailable > 0 && (
            <span className="text-parchment/60 text-[10px] sm:text-xs">
              {event.ticketsAvailable} tickets left
            </span>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function TrendingEventsSlider() {
  const [events, setEvents] = useState<LagosEvent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [ticketModal, setTicketModal] = useState<{ isOpen: boolean; event: LagosEvent | null }>({ isOpen: false, event: null });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const result = await api.events.getTrending();
        if (result.success && result.data && result.data.length > 0) {
          setEvents(result.data);
          return;
        }
      } catch (e) {}
      setEvents(STATIC_EVENTS.slice(0, 5).map(e => ({
        ...e,
        images: [e.image],
        highlights: e.highlights || [],
        tags: [],
        isTrending: true,
        isActive: true,
        ticketsSold: 0,
        ticketsAvailable: 100,
        rating: 0,
        reviewsCount: 0,
        createdBy: 'system',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })) as unknown as LagosEvent[]);
    };
    fetchTrending();
  }, []);

  useEffect(() => {
    if (isAutoPlaying && events.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % events.length);
      }, 6000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoPlaying, events.length]);

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % events.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 12000);
  };

  const goToPrev = () => {
    setCurrentIndex(prev => (prev - 1 + events.length) % events.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 12000);
  };

  const handleGetTickets = (event: LagosEvent) => {
    setTicketModal({ isOpen: true, event });
  };

  if (events.length === 0) return null;

  return (
    <>
      <div className="relative w-full h-full overflow-hidden">
        {events.map((event, index) => (
          <EventSlide
            key={event.id}
            event={event}
            isActive={index === currentIndex}
            onGetTickets={handleGetTickets}
          />
        ))}

        <button
          onClick={goToPrev}
          className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-parchment hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 z-20 border border-white/10"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-parchment hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 z-20 border border-white/10"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => { setCurrentIndex(index); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 12000); }}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === currentIndex ? 'w-10 bg-gold' : 'w-3 bg-parchment/30 hover:bg-parchment/50'
              }`}
            />
          ))}
        </div>

        <div className="absolute top-4 sm:top-6 right-4 sm:right-6 flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full z-20 border border-white/10">
          <Clock className="w-3 h-3 text-parchment/70" />
          <span className="text-parchment/70 text-[10px] font-medium">
            {currentIndex + 1} / {events.length}
          </span>
        </div>
      </div>

      <AnimatePresence>
        {ticketModal.isOpen && ticketModal.event && (
          <TicketPurchaseModal
            event={ticketModal.event}
            onClose={() => setTicketModal({ isOpen: false, event: null })}
          />
        )}
      </AnimatePresence>
    </>
  );
}
