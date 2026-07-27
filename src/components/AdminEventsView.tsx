import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Ticket, Plus, Edit3, Trash2, Search, Filter, TrendingUp, Eye, X } from 'lucide-react';
import { LagosEvent } from '../types';
import api from '../services/api';
import { AdminCard, AdminButton, AdminStatCard, AdminBadge, AdminSearch, AdminEmptyState } from './ui';

interface AdminEventsProps {
  onClose?: () => void;
}

export default function AdminEvents({ onClose }: AdminEventsProps) {
  const [events, setEvents] = useState<LagosEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<LagosEvent | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const result = await api.events.getAll();
      if (result.success && result.data) {
        setEvents(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    try {
      const result = await api.events.delete(eventId);
      if (result.success) {
        setEvents(events.filter(e => e.id !== eventId));
        setShowDeleteConfirm(null);
      }
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const handleToggleTrending = async (event: LagosEvent) => {
    try {
      const result = await api.events.update({
        id: event.id,
        isTrending: !event.isTrending,
      });
      if (result.success) {
        setEvents(events.map(e => e.id === event.id ? { ...e, isTrending: !e.isTrending } : e));
      }
    } catch (error) {
      console.error('Failed to toggle trending:', error);
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'concert', 'festival', 'exhibition', 'conference', 'nightlife', 'weekly'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Events Management</h2>
          <p className="text-sm text-charcoal/60 mt-1">Create and manage Lagos events</p>
        </div>
        <AdminButton
          variant="primary"
          icon={Plus}
          onClick={() => setShowCreateModal(true)}
        >
          Create Event
        </AdminButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdminStatCard
          title="Total Events"
          value={events.length}
          icon={Calendar}
          iconColor="text-blue-600"
        />
        <AdminStatCard
          title="Trending"
          value={events.filter(e => e.isTrending).length}
          icon={TrendingUp}
          iconColor="text-orange-600"
        />
        <AdminStatCard
          title="Active"
          value={events.filter(e => e.isActive !== false).length}
          icon={Eye}
          iconColor="text-green-600"
        />
        <AdminStatCard
          title="Categories"
          value={new Set(events.map(e => e.category)).size}
          icon={Filter}
          iconColor="text-purple-600"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <AdminSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search events..."
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
          <AdminCard
            key={event.id}
            className="overflow-hidden hover:shadow-lg"
          >
            <div className="relative aspect-video overflow-hidden -mx-6 -mt-6 mb-4">
              <img
                src={event.image || event.images?.[0] || '/assets/bundles/eventherobackground.png'}
                alt={event.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/bundles/eventherobackground.png';
                }}
              />
              {event.isTrending && (
                <AdminBadge variant="warning" size="sm" className="absolute top-3 left-3">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </AdminBadge>
              )}
              <div className="absolute top-3 right-3">
                <AdminButton
                  variant="ghost"
                  size="sm"
                  icon={TrendingUp}
                  onClick={() => handleToggleTrending(event)}
                  className={event.isTrending ? 'text-orange-500' : 'text-charcoal/40'}
                />
              </div>
            </div>

            <div className="flex items-start justify-between mb-2">
              <h3 className="font-serif text-lg font-bold text-charcoal line-clamp-1">{event.title}</h3>
              <AdminBadge variant="info" size="sm">
                {event.category}
              </AdminBadge>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-charcoal/60">
                <Calendar className="w-3.5 h-3.5" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-charcoal/60">
                <MapPin className="w-3.5 h-3.5" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-charcoal/60">
                <Ticket className="w-3.5 h-3.5" />
                <span>{event.price}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-charcoal/5">
              <div className="text-xs text-charcoal/50">
                <span className="font-semibold text-charcoal">{event.ticketsSold || 0}</span> sold
                {event.ticketsAvailable > 0 && (
                  <span className="ml-2">
                    <span className="font-semibold text-charcoal">{event.ticketsAvailable}</span> available
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <AdminButton
                  variant="ghost"
                  size="sm"
                  icon={Edit3}
                  onClick={() => setEditingEvent(event)}
                />
                <AdminButton
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  onClick={() => setShowDeleteConfirm(event.id)}
                />
              </div>
            </div>
          </AdminCard>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <AdminEmptyState
          icon={Calendar}
          title="No events found"
          description="Create your first event to get started"
          action={{
            label: 'Create Event',
            onClick: () => setShowCreateModal(true)
          }}
        />
      )}

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-serif text-xl font-bold text-charcoal mb-2">Delete Event?</h3>
              <p className="text-sm text-charcoal/60 mb-6">This action cannot be undone. All ticket sales data will be lost.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-charcoal/10 text-charcoal font-bold text-xs uppercase rounded-lg hover:bg-charcoal/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white font-bold text-xs uppercase rounded-lg hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {(showCreateModal || editingEvent) && (
        <EventFormModal
          event={editingEvent}
          onClose={() => {
            setShowCreateModal(false);
            setEditingEvent(null);
          }}
          onSave={() => {
            setShowCreateModal(false);
            setEditingEvent(null);
            fetchEvents();
          }}
        />
      )}
    </div>
  );
}

function EventFormModal({ event, onClose, onSave }: { event: LagosEvent | null; onClose: () => void; onSave: () => void }) {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    category: event?.category || 'concert',
    date: event?.date || '',
    location: event?.location || '',
    price: event?.price || '',
    pricePerTicket: event?.pricePerTicket || 0,
    ticketsAvailable: event?.ticketsAvailable || 0,
    image: event?.image || '',
    images: event?.images || [],
    highlights: event?.highlights || [],
    tags: event?.tags || [],
    isTrending: event?.isTrending || false,
    isActive: event?.isActive !== false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (event) {
        const result = await api.events.update({ id: event.id, ...formData });
        if (result.success) onSave();
      } else {
        const result = await api.events.create(formData);
        if (result.success) onSave();
      }
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-2xl w-full my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl font-bold text-charcoal">
            {event ? 'Edit Event' : 'Create New Event'}
          </h3>
          <button onClick={onClose} className="p-2 text-charcoal/40 hover:text-charcoal transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="concert">Concert</option>
                <option value="festival">Festival</option>
                <option value="exhibition">Exhibition</option>
                <option value="conference">Conference</option>
                <option value="nightlife">Nightlife</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Date</label>
              <input
                type="text"
                required
                placeholder="YYYY-MM-DD or Every Saturday"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Location</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Price Display</label>
              <input
                type="text"
                required
                placeholder="₦25,000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Price per Ticket</label>
              <input
                type="number"
                value={formData.pricePerTicket}
                onChange={(e) => setFormData({ ...formData, pricePerTicket: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Tickets Available</label>
              <input
                type="number"
                value={formData.ticketsAvailable}
                onChange={(e) => setFormData({ ...formData, ticketsAvailable: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isTrending}
                onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                className="w-4 h-4 rounded border-charcoal/20 text-gold focus:ring-gold/50"
              />
              <span className="text-sm text-charcoal">Mark as Trending</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-charcoal/20 text-gold focus:ring-gold/50"
              />
              <span className="text-sm text-charcoal">Active</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-charcoal/10 text-charcoal font-bold text-xs uppercase rounded-lg hover:bg-charcoal/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gold text-charcoal font-bold text-xs uppercase rounded-lg hover:bg-gold-dark transition-all"
            >
              {event ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
