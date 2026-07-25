import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Ticket, ChevronLeft, ChevronRight, Flame, Clock } from 'lucide-react';
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

function EventSlide({ event, isActive }: { event: LagosEvent; isActive: boolean }) {
  const eventDate = getEventDate(event.date);
  const dateStr = eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className={`relative w-full h-full transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0">
        <img
          src={event.image || event.images?.[0] || '/assets/bundles/eventherobackground.png'}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/bundles/eventherobackground.png';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8 md:p-12 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-orange-400 text-[10px] font-bold tracking-[0.3em] uppercase">Trending Now</span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-parchment font-bold mb-2 max-w-lg">
          {event.title}
        </h2>

        <p className="text-parchment/70 text-xs sm:text-sm max-w-md mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-5">
          <div className="flex items-center gap-1.5 text-parchment/80 text-xs">
            <Calendar className="w-3.5 h-3.5 text-gold" />
            <span>{dateStr}</span>
          </div>
          <div className="flex items-center gap-1.5 text-parchment/80 text-xs">
            <MapPin className="w-3.5 h-3.5 text-gold" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gold text-xs font-bold">
            <Ticket className="w-3.5 h-3.5" />
            <span>{formatPrice(event.price)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-6 py-2.5 bg-gold text-charcoal font-bold text-[10px] tracking-widest uppercase rounded-lg hover:bg-gold-dark transition-all">
            Get Tickets
          </button>
          {event.ticketsAvailable > 0 && (
            <span className="text-parchment/50 text-[10px]">
              {event.ticketsAvailable} tickets left
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TrendingEventsSlider() {
  const [events, setEvents] = useState<LagosEvent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
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
      setEvents(STATIC_EVENTS.slice(0, 4).map(e => ({
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
      }, 5000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoPlaying, events.length]);

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % events.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrev = () => {
    setCurrentIndex(prev => (prev - 1 + events.length) % events.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (events.length === 0) return null;

  return (
    <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] overflow-hidden rounded-2xl group">
      <AnimatePresence mode="wait">
        {events[currentIndex] && (
          <div key={events[currentIndex].id}>
            <EventSlide event={events[currentIndex]} isActive={true} />
          </div>
        )}
      </AnimatePresence>

      <button
        onClick={goToPrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-parchment hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-parchment hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => { setCurrentIndex(index); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 10000); }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-8 bg-gold' : 'w-3 bg-parchment/30 hover:bg-parchment/50'
            }`}
          />
        ))}
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full">
        <Clock className="w-3 h-3 text-parchment/70" />
        <span className="text-parchment/70 text-[10px] font-medium">
          {currentIndex + 1} / {events.length}
        </span>
      </div>
    </div>
  );
}
