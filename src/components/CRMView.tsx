import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare, Plus, Search, Filter, Clock, CheckCircle, XCircle, AlertCircle,
  User, Building, Calendar, DollarSign, Eye, Send, X, Tag, PriorityHigh
} from 'lucide-react';
import { useAuth } from '../auth';
import { useDatabase } from '../hooks/useDatabase';
import api from '../services/api';
import { ToastContainer, showToast } from './ui/Toast';

interface Ticket {
  _id: string;
  ticketId: string;
  title: string;
  description: string;
  bookingId?: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  userId: string;
  assignedTo?: string;
  responses: Array<{
    text: string;
    author: string;
    authorName: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface Booking {
  _id: string;
  id: string;
  listingTitle: string;
  guestName: string;
  guestEmail: string;
  totalAmount: number;
  status: string;
  paymentLedger?: {
    reference: string;
    totalAmount: number;
    platformCut: number;
    providerCut: number;
  };
  services?: string[];
  checkIn: string;
  checkOut: string;
}

export default function CRMView() {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [ticketsRes, bookingsRes] = await Promise.all([
        api.crm.getTickets(),
        api.bookings.getAll(),
      ]);
      if (ticketsRes.success) setTickets(ticketsRes.data || []);
      if (bookingsRes.success) setBookings(bookingsRes.data || []);
    } catch (error) {
      console.error('Failed to load CRM data:', error);
    }
    setIsLoading(false);
  };

  const handleCreateTicket = async (data: any) => {
    try {
      const res = await api.crm.createTicket(data);
      if (res.success) {
        setTickets([res.data, ...tickets]);
        setShowCreateTicket(false);
        showToast({ type: 'success', title: 'Ticket Created', message: `Ticket ${res.data.ticketId} created` });
      }
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to create ticket' });
    }
  };

  const handleUpdateTicket = async (id: string, updates: any) => {
    try {
      const res = await api.crm.updateTicket(id, updates);
      if (res.success) {
        setTickets(tickets.map(t => t._id === id ? { ...t, ...updates } : t));
        if (selectedTicket?._id === id) {
          setSelectedTicket({ ...selectedTicket, ...updates });
        }
        showToast({ type: 'success', title: 'Ticket Updated', message: 'Ticket status updated' });
      }
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to update ticket' });
    }
  };

  const handleAddResponse = async (ticketId: string, text: string) => {
    try {
      const res = await api.crm.updateTicket(ticketId, { response: { text } });
      if (res.success) {
        loadData();
        showToast({ type: 'success', title: 'Response Added', message: 'Response sent successfully' });
      }
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to add response' });
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getBookingById = (bookingId: string) => {
    return bookings.find(b => b._id === bookingId || b.id === bookingId);
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-blue-100 text-blue-700',
      medium: 'bg-amber-100 text-amber-700',
      high: 'bg-orange-100 text-orange-700',
      urgent: 'bg-red-100 text-red-700',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-blue-100 text-blue-700',
      in_progress: 'bg-amber-100 text-amber-700',
      resolved: 'bg-green-100 text-green-700',
      closed: 'bg-gray-100 text-gray-700',
    };
    return colors[status as keyof typeof colors] || colors.open;
  };

  return (
    <div className="flex-grow bg-parchment">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-20 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
              Support <span className="italic font-light text-gold-dark">Tickets</span>
            </h1>
            <p className="text-sm text-charcoal/60 mt-1">Manage customer support and booking inquiries</p>
          </div>
          <button
            onClick={() => setShowCreateTicket(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gold text-charcoal font-bold text-sm rounded-xl hover:bg-gold-dark hover:text-parchment transition-colors shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>New Ticket</span>
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-charcoal/5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-charcoal">{tickets.filter(t => t.status === 'open').length}</p>
            <p className="text-xs text-charcoal/50 mt-1">Open Tickets</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-charcoal/5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-charcoal">{tickets.filter(t => t.status === 'in_progress').length}</p>
            <p className="text-xs text-charcoal/50 mt-1">In Progress</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-charcoal/5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-3">
              <CheckCircle className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-charcoal">{tickets.filter(t => t.status === 'resolved').length}</p>
            <p className="text-xs text-charcoal/50 mt-1">Resolved</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-charcoal/5 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Tag className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-charcoal">{tickets.length}</p>
            <p className="text-xs text-charcoal/50 mt-1">Total Tickets</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-4" />
            <p className="text-charcoal/60">Loading tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-16 h-16 text-charcoal/20 mx-auto mb-4" />
            <p className="text-lg font-semibold text-charcoal mb-2">No tickets found</p>
            <p className="text-sm text-charcoal/50">Create a new ticket to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTickets.map((ticket) => {
              const booking = ticket.bookingId ? getBookingById(ticket.bookingId) : null;
              return (
                <div
                  key={ticket._id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="bg-white rounded-2xl p-5 border border-charcoal/5 shadow-sm hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-charcoal mb-2 line-clamp-2">{ticket.title}</h3>
                  <p className="text-xs text-charcoal/60 line-clamp-2 mb-3">{ticket.description}</p>
                  {booking && (
                    <div className="bg-charcoal/5 rounded-lg p-3 mb-3">
                      <p className="text-[10px] font-bold text-charcoal/60 uppercase mb-1">Related Booking</p>
                      <p className="text-xs font-semibold text-charcoal">{booking.listingTitle}</p>
                      <p className="text-[10px] text-charcoal/60">{booking.guestName} • ₦{booking.totalAmount?.toLocaleString()}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[10px] text-charcoal/50">
                    <span>{ticket.ticketId}</span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedTicket && (
          <TicketDetailModal
            ticket={selectedTicket}
            booking={selectedTicket.bookingId ? getBookingById(selectedTicket.bookingId) : undefined}
            onClose={() => setSelectedTicket(null)}
            onUpdate={handleUpdateTicket}
            onAddResponse={handleAddResponse}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateTicket && (
          <CreateTicketModal
            bookings={bookings}
            onClose={() => setShowCreateTicket(false)}
            onCreate={handleCreateTicket}
          />
        )}
      </AnimatePresence>

      <ToastContainer />
    </div>
  );
}

function TicketDetailModal({ ticket, booking, onClose, onUpdate, onAddResponse }: {
  ticket: Ticket;
  booking?: Booking;
  onClose: () => void;
  onUpdate: (id: string, updates: any) => void;
  onAddResponse: (ticketId: string, text: string) => void;
}) {
  const [responseText, setResponseText] = useState('');
  const [newStatus, setNewStatus] = useState(ticket.status);

  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (responseText.trim()) {
      onAddResponse(ticket._id, responseText.trim());
      setResponseText('');
    }
  };

  const handleStatusChange = (status: string) => {
    setNewStatus(status);
    onUpdate(ticket._id, { status });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-parchment rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-parchment border-b border-charcoal/10 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-charcoal">{ticket.title}</h2>
            <p className="text-xs text-charcoal/50">{ticket.ticketId}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors">
            <X className="w-5 h-5 text-charcoal/60" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <select
              value={newStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-1.5 bg-white border border-charcoal/10 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 focus:ring-gold/30"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
              ticket.priority === 'urgent' ? 'bg-red-100 text-red-700' :
              ticket.priority === 'high' ? 'bg-orange-100 text-orange-700' :
              ticket.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {ticket.priority.toUpperCase()} PRIORITY
            </span>
            <span className="text-[10px] text-charcoal/50">
              Created {new Date(ticket.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div>
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-widest mb-2">Description</h3>
            <p className="text-sm text-charcoal/70 leading-relaxed">{ticket.description}</p>
          </div>

          {booking && (
            <div className="bg-charcoal/5 rounded-xl p-4">
              <h3 className="text-xs font-bold text-charcoal uppercase tracking-widest mb-3">Related Booking</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-[10px] text-charcoal/50">Property</p>
                  <p className="font-semibold text-charcoal">{booking.listingTitle}</p>
                </div>
                <div>
                  <p className="text-[10px] text-charcoal/50">Guest</p>
                  <p className="font-semibold text-charcoal">{booking.guestName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-charcoal/50">Total Amount</p>
                  <p className="font-semibold text-gold-dark">₦{booking.totalAmount?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-charcoal/50">Status</p>
                  <p className="font-semibold text-charcoal">{booking.status}</p>
                </div>
                {booking.paymentLedger && (
                  <>
                    <div>
                      <p className="text-[10px] text-charcoal/50">Reference</p>
                      <p className="font-mono text-xs text-charcoal">{booking.paymentLedger.reference}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-charcoal/50">Platform Cut</p>
                      <p className="font-semibold text-charcoal">₦{booking.paymentLedger.platformCut?.toLocaleString()}</p>
                    </div>
                  </>
                )}
                {booking.services && booking.services.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-[10px] text-charcoal/50 mb-1">Services</p>
                    <div className="flex flex-wrap gap-1">
                      {booking.services.map((service, i) => (
                        <span key={i} className="text-[10px] bg-gold/10 text-gold-dark px-2 py-0.5 rounded">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-widest mb-3">
              Responses ({ticket.responses.length})
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {ticket.responses.length === 0 ? (
                <p className="text-sm text-charcoal/50 text-center py-4">No responses yet</p>
              ) : (
                ticket.responses.map((response, i) => (
                  <div key={i} className="bg-white rounded-lg p-3 border border-charcoal/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-charcoal">{response.authorName}</span>
                      <span className="text-[10px] text-charcoal/50">
                        {new Date(response.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-charcoal/70">{response.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <form onSubmit={handleSubmitResponse} className="space-y-3">
            <textarea
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Add a response..."
              rows={3}
              className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-gold text-charcoal font-bold text-sm rounded-xl hover:bg-gold-dark hover:text-parchment transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Response
            </button>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

function CreateTicketModal({ bookings, onClose, onCreate }: {
  bookings: Booking[];
  onClose: () => void;
  onCreate: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bookingId: '',
    category: 'general',
    priority: 'medium',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
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
          <h2 className="font-serif text-xl font-bold text-charcoal">Create Support Ticket</h2>
          <button onClick={onClose} className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors">
            <X className="w-5 h-5 text-charcoal/60" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-1.5 block">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-1.5 block">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-1.5 block">Related Booking (Optional)</label>
            <select
              value={formData.bookingId}
              onChange={(e) => setFormData({ ...formData, bookingId: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
            >
              <option value="">No booking</option>
              {bookings.map((booking) => (
                <option key={booking._id || booking.id} value={booking._id || booking.id}>
                  {booking.listingTitle} - {booking.guestName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-1.5 block">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
              >
                <option value="general">General</option>
                <option value="booking">Booking Issue</option>
                <option value="payment">Payment</option>
                <option value="service">Service Quality</option>
                <option value="technical">Technical</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-1.5 block">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-charcoal/5 text-charcoal font-bold text-sm rounded-xl hover:bg-charcoal/10 transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-3 bg-gold text-charcoal font-bold text-sm rounded-xl hover:bg-gold-dark hover:text-parchment transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Create Ticket
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
