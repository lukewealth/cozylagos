import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar, MapPin, CreditCard, Bell, Send, Star, Clock, CheckCircle,
  XCircle, Heart, Eye, MessageCircle, Filter, ChevronRight, Sparkles,
  Gift, ShieldCheck, Utensils, Car, Camera, Anchor, TrendingUp, AlertCircle,
  Trash2, ExternalLink, X
} from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';
import { useAuth } from '../auth';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';
import { Listing } from '../types';
import { INITIAL_LISTINGS } from '../data';

interface Message {
  sender: 'user' | 'concierge';
  text: string;
}

interface SavedPlace {
  id: string;
  title: string;
  location: string;
  type: 'beach' | 'restaurant' | 'attraction' | 'hotel';
  addedAt: string;
}

interface FavoriteApartment {
  listingId: string;
  addedAt: string;
}

type UserSection = 'bookings' | 'saved' | 'payments' | 'favorites';

const STORAGE_KEYS = {
  savedPlaces: 'cozy_lagos_saved_places',
  favoriteApartments: 'cozy_lagos_favorite_apartments',
};

export default function UserDashboard() {
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const [activeSection, setActiveSection] = useState<UserSection>('bookings');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessageList] = useState<Message[]>([
    { sender: 'concierge', text: `Good afternoon${currentUser?.name ? `, ${currentUser.name}` : ''}. How can I assist you today?` }
  ]);
  const [points] = useState(12450);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [favoriteApartments, setFavoriteApartments] = useState<FavoriteApartment[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const { data: bookings } = useDatabase('bookings');
  const { data: transactions } = useDatabase('transactions');

  useEffect(() => {
    const storedPlaces = localStorage.getItem(STORAGE_KEYS.savedPlaces);
    const storedFavorites = localStorage.getItem(STORAGE_KEYS.favoriteApartments);
    if (storedPlaces) setSavedPlaces(JSON.parse(storedPlaces));
    if (storedFavorites) setFavoriteApartments(JSON.parse(storedFavorites));
  }, []);

  const userBookings = useMemo(() => {
    const userId = currentUser?.id || 'guest-id';
    return (bookings as any[]).filter(
      (b: any) => b.guestId === userId || b.guestEmail === currentUser?.email
    );
  }, [bookings, currentUser]);

  const filteredBookings = useMemo(() => {
    if (statusFilter === 'all') return userBookings;
    return userBookings.filter((b: any) => b.status?.toLowerCase() === statusFilter.toLowerCase());
  }, [userBookings, statusFilter]);

  const userTransactions = useMemo(() => {
    const userId = currentUser?.id || 'guest-id';
    return (transactions as any[]).filter(
      (t: any) => t.userId === userId
    );
  }, [transactions, currentUser]);

  const favoriteListings = useMemo(() => {
    return favoriteApartments
      .map(fav => {
        const listing = INITIAL_LISTINGS.find(l => l.id === fav.listingId);
        return listing ? { ...listing, addedAt: fav.addedAt } : null;
      })
      .filter(Boolean) as (Listing & { addedAt: string })[];
  }, [favoriteApartments]);

  const totalSpent = userTransactions.reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
  const pendingCount = userBookings.filter((b: any) => b.status === 'Pending' || b.status === 'pending').length;
  const confirmedCount = userBookings.filter((b: any) => b.status === 'Confirmed' || b.status === 'confirmed').length;

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.savedPlaces, JSON.stringify(savedPlaces));
  }, [savedPlaces]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.favoriteApartments, JSON.stringify(favoriteApartments));
  }, [favoriteApartments]);

  const handleSendMessage = (textToSend?: string) => {
    const rawText = textToSend || chatInput;
    if (!rawText.trim()) return;
    setMessageList(prev => [...prev, { sender: 'user', text: rawText }]);
    if (!textToSend) setChatInput('');

    setTimeout(() => {
      let response = "I've noted your request. Our concierge team will respond shortly.";
      const lower = rawText.toLowerCase();
      if (lower.includes('chef')) response = "I'll arrange a private chef for you. Our top chefs specialize in Afro-Fusion and Continental cuisine. Rate starts at ₦50,000/day. Shall I proceed?";
      else if (lower.includes('driver') || lower.includes('car')) response = "VIP Chauffeur service available. Range Rover with professional driver at ₦180,000/day. When do you need pickup?";
      else if (lower.includes('checkout') || lower.includes('late')) response = "I'll check availability for late checkout. Standard checkout is 12 PM. Late checkout until 4 PM is ₦25,000. Subject to availability.";
      else if (lower.includes('yacht')) response = "Yacht experiences available! 4-hour sunset cruise at ₦450,000 or full-day at ₦800,000. Includes crew and refreshments.";
      else if (lower.includes('cancel')) response = "I understand you'd like to modify your booking. Cancellation policy: Free up to 48hrs before check-in. Let me connect you with our booking team.";
      setMessageList(prev => [...prev, { sender: 'concierge', text: response }]);
    }, 600);
  };

  const handleRemoveSavedPlace = (id: string) => {
    setSavedPlaces(prev => prev.filter(p => p.id !== id));
    addToast({ type: 'info', title: 'Removed', message: 'Place removed from saved list.' });
  };

  const handleRemoveFavorite = (listingId: string) => {
    setFavoriteApartments(prev => prev.filter(f => f.listingId !== listingId));
    addToast({ type: 'info', title: 'Removed', message: 'Apartment removed from favorites.' });
  };

  const handleAddSampleSavedPlace = () => {
    const samplePlaces: SavedPlace[] = [
      { id: `place-${Date.now()}`, title: 'Tarkwa Bay Beach', location: 'Tarkwa Bay', type: 'beach', addedAt: new Date().toISOString() },
      { id: `place-${Date.now() + 1}`, title: 'RSVP Restaurant', location: 'Victoria Island', type: 'restaurant', addedAt: new Date().toISOString() },
      { id: `place-${Date.now() + 2}`, title: 'Nike Art Gallery', location: 'Lekki Phase 1', type: 'attraction', addedAt: new Date().toISOString() },
    ];
    const randomPlace = samplePlaces[Math.floor(Math.random() * samplePlaces.length)];
    if (!savedPlaces.find(p => p.title === randomPlace.title)) {
      setSavedPlaces(prev => [...prev, randomPlace]);
      addToast({ type: 'success', title: 'Saved!', message: `${randomPlace.title} added to saved places.` });
    }
  };

  const handleAddSampleFavorite = () => {
    const availableListings = INITIAL_LISTINGS.filter(l => !favoriteApartments.find(f => f.listingId === l.id));
    if (availableListings.length > 0) {
      const randomListing = availableListings[Math.floor(Math.random() * availableListings.length)];
      setFavoriteApartments(prev => [...prev, { listingId: randomListing.id, addedAt: new Date().toISOString() }]);
      addToast({ type: 'success', title: 'Added!', message: `${randomListing.title} added to favorites.` });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle };
      case 'pending': return { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock };
      case 'cancelled': return { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle };
      case 'completed': return { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle };
      default: return { bg: 'bg-charcoal/5', text: 'text-charcoal/60', icon: Clock };
    }
  };

  const getServiceIcon = (service: string) => {
    const lower = service.toLowerCase();
    if (lower.includes('chef') || lower.includes('culinary')) return Utensils;
    if (lower.includes('driver') || lower.includes('car') || lower.includes('chauffeur')) return Car;
    if (lower.includes('photo')) return Camera;
    if (lower.includes('yacht') || lower.includes('boat')) return Anchor;
    if (lower.includes('security')) return ShieldCheck;
    return Sparkles;
  };

  const getPlaceTypeIcon = (type: string) => {
    switch (type) {
      case 'beach': return '🏖️';
      case 'restaurant': return '🍽️';
      case 'attraction': return '🎨';
      case 'hotel': return '🏨';
      default: return '📍';
    }
  };

  return (
    <div className="flex-grow w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 py-12 animate-fade-in-up text-left space-y-10">
      <header className="border-b border-charcoal/5 pb-6">
        <div className="flex items-center gap-2 text-gold-dark font-bold text-[10px] tracking-[0.25em] uppercase mb-1">
          <span>My Dashboard</span>
        </div>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-charcoal leading-none">
          Hello, {currentUser?.name || 'Guest'}
        </h1>
        <p className="text-sm text-charcoal-light mt-2 max-w-xl">
          Manage your bookings, saved places, and payment history.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: userBookings.length, icon: Calendar, color: 'text-gold-dark' },
          { label: 'Confirmed', value: confirmedCount, icon: CheckCircle, color: 'text-green-600' },
          { label: 'Saved Places', value: savedPlaces.length, icon: Heart, color: 'text-rose-500' },
          { label: 'Total Spent', value: `₦${(totalSpent / 1000).toFixed(0)}K`, icon: CreditCard, color: 'text-charcoal' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-5 rounded-2xl border border-charcoal/5 shadow-sm"
          >
            <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
            <p className="text-2xl font-serif font-bold text-charcoal">{stat.value}</p>
            <p className="text-[10px] text-charcoal/50 uppercase tracking-widest font-bold mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2 border-b border-charcoal/5 pb-0">
        {([
          { id: 'bookings', label: 'My Bookings', icon: Calendar },
          { id: 'saved', label: 'Saved Places', icon: Heart },
          { id: 'payments', label: 'Transactions', icon: CreditCard },
          { id: 'favorites', label: 'Favorites', icon: Star },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
              activeSection === tab.id
                ? 'border-gold-dark text-charcoal'
                : 'border-transparent text-charcoal/40 hover:text-charcoal/60'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {activeSection === 'bookings' && (
              <motion.div
                key="bookings"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold text-charcoal">Booking History</h3>
                  <div className="flex gap-2">
                    {['all', 'pending', 'confirmed', 'cancelled'].map(f => (
                      <button
                        key={f}
                        onClick={() => setStatusFilter(f)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                          statusFilter === f ? 'bg-charcoal text-parchment' : 'bg-charcoal/5 text-charcoal/60 hover:bg-charcoal/10'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredBookings.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-charcoal/5 p-12 text-center">
                    <Calendar className="w-12 h-12 text-charcoal/10 mx-auto mb-4" />
                    <p className="text-charcoal/40 text-sm">No bookings found.</p>
                    <p className="text-charcoal/30 text-xs mt-1">Browse properties to make your first reservation.</p>
                  </div>
                ) : (
                  filteredBookings.map((booking: any, idx: number) => {
                    const statusInfo = getStatusColor(booking.status);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <motion.div
                        key={booking.id || idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white rounded-2xl border border-charcoal/5 p-5 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gold/5 flex items-center justify-center shrink-0">
                              <Calendar className="w-6 h-6 text-gold-dark" />
                            </div>
                            <div>
                              <h4 className="font-bold text-charcoal text-sm">{booking.listingTitle}</h4>
                              <div className="flex items-center gap-2 text-xs text-charcoal/50 mt-1">
                                <Calendar className="w-3 h-3" />
                                <span>{booking.checkIn} → {booking.checkOut}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-charcoal/50 mt-1">
                                <MapPin className="w-3 h-3" />
                                <span>{booking.guestsCount} guests</span>
                              </div>
                              {booking.services && booking.services.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {booking.services.map((s: string, i: number) => {
                                    const SvcIcon = getServiceIcon(s);
                                    return (
                                      <span key={i} className="flex items-center gap-1 bg-charcoal/5 px-2 py-0.5 rounded text-[9px] font-bold text-charcoal/60">
                                        <SvcIcon className="w-3 h-3" />
                                        {s}
                                      </span>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusInfo.bg} ${statusInfo.text}`}>
                              <StatusIcon className="w-3 h-3" />
                              {booking.status}
                            </span>
                            <span className="text-sm font-bold text-charcoal">₦{(booking.totalAmount || 0).toLocaleString()}</span>
                            {booking.paymentLedger && (
                              <span className="text-[9px] text-charcoal/40 font-mono">Ref: {booking.paymentLedger.reference}</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            )}

            {activeSection === 'saved' && (
              <motion.div
                key="saved"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold text-charcoal">Saved Places</h3>
                  <button
                    onClick={handleAddSampleSavedPlace}
                    className="px-4 py-2 bg-gold text-charcoal hover:bg-gold-dark rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    + Add Place
                  </button>
                </div>
                {savedPlaces.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-charcoal/5 p-12 text-center">
                    <Heart className="w-12 h-12 text-charcoal/10 mx-auto mb-4" />
                    <p className="text-charcoal/40 text-sm">No saved places yet.</p>
                    <p className="text-charcoal/30 text-xs mt-1">Save beaches, restaurants, and attractions you want to visit.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedPlaces.map((place, idx) => (
                      <motion.div
                        key={place.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white rounded-2xl border border-charcoal/5 p-5 shadow-sm hover:shadow-md transition-all group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-2xl">{getPlaceTypeIcon(place.type)}</span>
                          <button
                            onClick={() => handleRemoveSavedPlace(place.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-charcoal/30 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <h4 className="font-bold text-charcoal text-sm mb-1">{place.title}</h4>
                        <div className="flex items-center gap-1 text-xs text-charcoal/50">
                          <MapPin className="w-3 h-3" />
                          <span>{place.location}</span>
                        </div>
                        <p className="text-[10px] text-charcoal/30 mt-2">
                          Saved {new Date(place.addedAt).toLocaleDateString()}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeSection === 'payments' && (
              <motion.div
                key="payments"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                <h3 className="font-serif text-xl font-bold text-charcoal">Transaction History</h3>
                <div className="bg-charcoal text-parchment rounded-2xl p-6 shadow-lg mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gold-light font-serif italic text-lg">Cozy Reserve</span>
                    <Gift className="w-5 h-5 text-gold-dark" />
                  </div>
                  <p className="text-3xl font-serif text-white font-bold">{points.toLocaleString()}</p>
                  <p className="text-[10px] tracking-widest text-parchment/50 mt-1 uppercase">Loyalty Points</p>
                  <div className="mt-4 pt-4 border-t border-parchment/10 flex justify-between text-xs">
                    <span className="text-parchment/60">Total Spent</span>
                    <span className="font-bold text-white">₦{totalSpent.toLocaleString()}</span>
                  </div>
                </div>

                {userTransactions.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-charcoal/5 p-12 text-center">
                    <CreditCard className="w-12 h-12 text-charcoal/10 mx-auto mb-4" />
                    <p className="text-charcoal/40 text-sm">No transactions yet.</p>
                    <p className="text-charcoal/30 text-xs mt-1">Your booking payments will appear here.</p>
                  </div>
                ) : (
                  userTransactions.map((tx: any, idx: number) => (
                    <motion.div
                      key={tx.id || idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white rounded-2xl border border-charcoal/5 p-5 flex items-center justify-between hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          tx.status === 'Processed' || tx.status === 'processed' ? 'bg-green-50' : 'bg-amber-50'
                        }`}>
                          <TrendingUp className={`w-5 h-5 ${
                            tx.status === 'Processed' || tx.status === 'processed' ? 'text-green-600' : 'text-amber-600'
                          }`} />
                        </div>
                        <div>
                          <p className="font-bold text-charcoal text-sm">{tx.description || tx.type}</p>
                          <p className="text-[10px] text-charcoal/40 font-mono">
                            {tx.reference} • {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-charcoal">₦{(tx.amount || 0).toLocaleString()}</p>
                        <span className={`text-[9px] font-bold uppercase ${
                          tx.status === 'Processed' || tx.status === 'processed' ? 'text-green-600' : 'text-amber-600'
                        }`}>
                          {tx.status}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}

            {activeSection === 'favorites' && (
              <motion.div
                key="favorites"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold text-charcoal">Favorite Apartments</h3>
                  <button
                    onClick={handleAddSampleFavorite}
                    className="px-4 py-2 bg-gold text-charcoal hover:bg-gold-dark rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    + Add Favorite
                  </button>
                </div>
                {favoriteListings.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-charcoal/5 p-12 text-center">
                    <Star className="w-12 h-12 text-charcoal/10 mx-auto mb-4" />
                    <p className="text-charcoal/40 text-sm">No favorite apartments yet.</p>
                    <p className="text-charcoal/30 text-xs mt-1">Click the heart icon on any property to save it as a favorite.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favoriteListings.map((listing, idx) => (
                      <motion.div
                        key={listing.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white rounded-2xl border border-charcoal/5 overflow-hidden shadow-sm hover:shadow-md transition-all group"
                      >
                        <div className="relative h-32 bg-gradient-to-br from-gold/20 to-charcoal/10 flex items-center justify-center">
                          <Home className="w-12 h-12 text-charcoal/20" />
                          <button
                            onClick={() => handleRemoveFavorite(listing.id)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-red-50 text-charcoal/40 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-charcoal text-sm mb-1">{listing.title}</h4>
                          <div className="flex items-center gap-1 text-xs text-charcoal/50 mb-2">
                            <MapPin className="w-3 h-3" />
                            <span>{listing.location}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gold-dark">₦{listing.nightlyRate.toLocaleString()}/night</span>
                            <div className="flex items-center gap-1 text-xs text-charcoal/50">
                              <Star className="w-3 h-3 text-gold fill-current" />
                              <span>{listing.rating}</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-charcoal/30 mt-2">
                            Added {new Date(listing.addedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white border border-charcoal/5 rounded-2xl overflow-hidden shadow-sm flex flex-col h-[450px]">
            <div className="bg-parchment/50 px-4 py-3 border-b border-charcoal/5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-bold text-charcoal">Amara AI Concierge</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl text-xs max-w-[85%] ${m.sender === 'user' ? 'bg-charcoal text-parchment' : 'bg-parchment text-charcoal'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
            <div className="p-3 border-t border-charcoal/5">
              <div className="flex gap-1 mb-2">
                {['Arrange Chef', 'Book Driver', 'Late Checkout'].map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-[9px] bg-charcoal/5 hover:bg-charcoal/10 text-charcoal/60 px-2 py-1 rounded-full transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Message concierge..."
                  className="flex-1 bg-transparent text-xs focus:outline-none"
                />
                <button onClick={() => handleSendMessage()} className="text-gold-dark">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
