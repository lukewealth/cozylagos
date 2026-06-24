import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar, MapPin, CreditCard, Bell, Send, Star, Clock, CheckCircle,
  XCircle, Heart, Eye, MessageCircle, Filter, ChevronRight, Sparkles,
  Gift, ShieldCheck, Utensils, Car, Camera, Anchor, TrendingUp, AlertCircle
} from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';
import { useAuth } from '../auth';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/Toast';

interface Message {
  sender: 'user' | 'concierge';
  text: string;
}

type UserSection = 'bookings' | 'saved' | 'payments' | 'favorites';

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
  const messageEndRef = useRef<HTMLDivElement>(null);

  const { data: bookings } = useDatabase('bookings');
  const { data: transactions } = useDatabase('transactions');

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

  const totalSpent = userTransactions.reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
  const pendingCount = userBookings.filter((b: any) => b.status === 'Pending' || b.status === 'pending').length;
  const confirmedCount = userBookings.filter((b: any) => b.status === 'Confirmed' || b.status === 'confirmed').length;

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
          { label: 'Pending', value: pendingCount, icon: Clock, color: 'text-amber-600' },
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
          { id: 'payments', label: 'Payments', icon: CreditCard },
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
                              {booking.providerAssignmentStatus && (
                                <div className={`mt-2 text-[9px] font-bold uppercase tracking-wider ${
                                  booking.providerAssignmentStatus === 'assigned' ? 'text-green-600' :
                                  booking.providerAssignmentStatus === 'in_progress' ? 'text-blue-600' :
                                  'text-amber-600'
                                }`}>
                                  Provider: {booking.providerAssignmentStatus.replace('_', ' ')}
                                  {booking.providerName && ` — ${booking.providerName}`}
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
                <h3 className="font-serif text-xl font-bold text-charcoal">Saved Places</h3>
                <div className="bg-white rounded-2xl border border-charcoal/5 p-12 text-center">
                  <Heart className="w-12 h-12 text-charcoal/10 mx-auto mb-4" />
                  <p className="text-charcoal/40 text-sm">Your saved places will appear here.</p>
                  <p className="text-charcoal/30 text-xs mt-1">Click the heart icon on any property to save it.</p>
                </div>
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
                <h3 className="font-serif text-xl font-bold text-charcoal">Payment History</h3>
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
                  </div>
                ) : (
                  userTransactions.map((tx: any, idx: number) => (
                    <div key={tx.id || idx} className="bg-white rounded-2xl border border-charcoal/5 p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-bold text-charcoal text-sm">{tx.description || tx.type}</p>
                          <p className="text-[10px] text-charcoal/40 font-mono">{tx.reference} • {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : ''}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-charcoal">₦{(tx.amount || 0).toLocaleString()}</p>
                        <span className={`text-[9px] font-bold uppercase ${tx.status === 'Processed' || tx.status === 'processed' ? 'text-green-600' : 'text-amber-600'}`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
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
                <h3 className="font-serif text-xl font-bold text-charcoal">Favorite Services</h3>
                <div className="bg-white rounded-2xl border border-charcoal/5 p-12 text-center">
                  <Star className="w-12 h-12 text-charcoal/10 mx-auto mb-4" />
                  <p className="text-charcoal/40 text-sm">Your favorite services will appear here.</p>
                  <p className="text-charcoal/30 text-xs mt-1">Rate and save services you love.</p>
                </div>
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
