import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home, Plus, Edit3, Trash2, Search, Filter, X, Check,
  MapPin, DollarSign, Users, Bed, Bath, Image, Eye, EyeOff
} from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';
import { useAuth } from '../auth';
import { Listing } from '../types';
import { ToastContainer, showToast } from './ui/Toast';

export default function PropertyManagement() {
  const { currentUser } = useAuth();
  const { data: listings, addRecord, updateRecord, removeRecord } = useDatabase('listings');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filteredListings = (listings as any[]).filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || listing.category === categoryFilter;
    const matchesLocation = locationFilter === 'all' || listing.location === locationFilter;
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const handleCreateListing = async (listingData: any) => {
    try {
      const newListing = {
        ...listingData,
        id: `listing-${Date.now()}`,
        ownerId: currentUser?.id || 'admin',
        isActive: true,
        reviewsCount: 0,
        rating: 0,
        aiMatchPercent: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addRecord(newListing);
      setShowCreateModal(false);
      showToast({ type: 'success', title: 'Property Created', message: `${newListing.title} has been added` });
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to create property' });
    }
  };

  const handleUpdateListing = async (listingId: string, updates: any) => {
    try {
      await updateRecord(listingId, { ...updates, updatedAt: new Date().toISOString() });
      setEditingListing(null);
      showToast({ type: 'success', title: 'Property Updated', message: 'Changes saved successfully' });
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to update property' });
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    try {
      await removeRecord(listingId);
      setShowDeleteConfirm(null);
      showToast({ type: 'success', title: 'Property Removed', message: 'Property has been removed' });
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to remove property' });
    }
  };

  const handleToggleActive = async (listing: Listing) => {
    await handleUpdateListing(listing.id, { isActive: !listing.isActive });
    showToast({ 
      type: 'success', 
      title: listing.isActive ? 'Property Hidden' : 'Property Published',
      message: `${listing.title} is now ${listing.isActive ? 'hidden' : 'published'}` 
    });
  };

  const categories = ['all', 'Penthouse', 'Luxury Villa', 'Executive Studio', 'Serviced Apartment', 'Premium Package'];
  const locations = ['all', 'Ikoyi', 'Victoria Island', 'Banana Island', 'Lekki Phase 1'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Property Management</h2>
          <p className="text-sm text-charcoal/60 mt-1">Manage all properties and listings</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-charcoal font-bold text-xs tracking-wider uppercase rounded-lg hover:bg-gold-dark transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Property
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-charcoal/5">
          <p className="text-xs text-charcoal/60 uppercase tracking-wider">Total Properties</p>
          <p className="text-2xl font-bold text-charcoal mt-1">{listings.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-charcoal/5">
          <p className="text-xs text-charcoal/60 uppercase tracking-wider">Active</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {listings.filter((l: any) => l.isActive).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-charcoal/5">
          <p className="text-xs text-charcoal/60 uppercase tracking-wider">Inactive</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {listings.filter((l: any) => !l.isActive).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-charcoal/5">
          <p className="text-xs text-charcoal/60 uppercase tracking-wider">Avg Rating</p>
          <p className="text-2xl font-bold text-gold-dark mt-1">
            {listings.length > 0 
              ? (listings.reduce((sum: number, l: any) => sum + (l.rating || 0), 0) / listings.length).toFixed(1)
              : '0.0'
            }
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
          ))}
        </select>
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
        >
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc === 'all' ? 'All Locations' : loc}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing: any) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-charcoal/5 rounded-xl overflow-hidden hover:shadow-lg transition-all"
          >
            <div className="relative aspect-video overflow-hidden">
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/images/horizontal/CozyLagos.jpeg';
                }}
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <button
                  onClick={() => handleToggleActive(listing)}
                  className={`p-2 rounded-lg backdrop-blur-md transition-colors ${
                    listing.isActive 
                      ? 'bg-green-500/90 text-white hover:bg-green-600' 
                      : 'bg-red-500/90 text-white hover:bg-red-600'
                  }`}
                  title={listing.isActive ? 'Hide Property' : 'Publish Property'}
                >
                  {listing.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-serif text-lg font-bold text-charcoal line-clamp-1">{listing.title}</h3>
                <span className="px-2 py-0.5 bg-charcoal/5 text-charcoal/60 text-[10px] font-bold uppercase rounded-full">
                  {listing.category}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-charcoal/60">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{listing.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-charcoal/60">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>₦{listing.nightlyRate?.toLocaleString()} / night</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-charcoal/60">
                  <div className="flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5" />
                    <span>{listing.bedrooms} bed</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5" />
                    <span>{listing.bathrooms} bath</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>{listing.maxGuests} guests</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-charcoal/5">
                <button
                  onClick={() => setEditingListing(listing)}
                  className="flex-1 py-2 bg-charcoal/5 text-charcoal font-bold text-xs uppercase rounded-lg hover:bg-charcoal/10 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(listing.id)}
                  className="py-2 px-3 bg-red-50 text-red-500 font-bold text-xs uppercase rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-16">
          <Home className="w-16 h-16 text-charcoal/20 mx-auto mb-4" />
          <p className="text-lg font-semibold text-charcoal mb-2">No properties found</p>
          <p className="text-sm text-charcoal/50">Add your first property to get started</p>
        </div>
      )}

      <AnimatePresence>
        {showCreateModal && (
          <PropertyFormModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateListing}
          />
        )}
        {editingListing && (
          <PropertyFormModal
            listing={editingListing}
            onClose={() => setEditingListing(null)}
            onSubmit={(data) => handleUpdateListing(editingListing.id, data)}
          />
        )}
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
              <h3 className="font-serif text-xl font-bold text-charcoal mb-2">Delete Property?</h3>
              <p className="text-sm text-charcoal/60 mb-6">This action cannot be undone. The property will be permanently removed.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-charcoal/10 text-charcoal font-bold text-xs uppercase rounded-lg hover:bg-charcoal/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteListing(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white font-bold text-xs uppercase rounded-lg hover:bg-red-600 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer />
    </div>
  );
}

function PropertyFormModal({ listing, onClose, onSubmit }: {
  listing?: Listing;
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    title: listing?.title || '',
    description: listing?.description || '',
    category: listing?.category || 'Penthouse',
    location: listing?.location || 'Ikoyi',
    bedrooms: listing?.bedrooms || 2,
    bathrooms: listing?.bathrooms || 2,
    maxGuests: listing?.maxGuests || 4,
    nightlyRate: listing?.nightlyRate || 250000,
    weekendPremium: listing?.weekendPremium || 15,
    cleaningFee: listing?.cleaningFee || 15000,
    securityDeposit: listing?.securityDeposit || 80000,
    image: listing?.image || '',
    images: listing?.images || [],
    amenities: listing?.amenities || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.title.length < 5) newErrors.title = 'Title must be at least 5 characters';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.nightlyRate <= 0) newErrors.nightlyRate = 'Nightly rate must be greater than 0';
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
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
        className="bg-white rounded-xl p-6 max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl font-bold text-charcoal">
            {listing ? 'Edit Property' : 'Add New Property'}
          </h3>
          <button onClick={onClose} className="p-2 text-charcoal/40 hover:text-charcoal transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 ${
                errors.title ? 'border-red-500' : 'border-charcoal/10'
              }`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none ${
                errors.description ? 'border-red-500' : 'border-charcoal/10'
              }`}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="Penthouse">Penthouse</option>
                <option value="Luxury Villa">Luxury Villa</option>
                <option value="Executive Studio">Executive Studio</option>
                <option value="Serviced Apartment">Serviced Apartment</option>
                <option value="Premium Package">Premium Package</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Location</label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value as any })}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="Ikoyi">Ikoyi</option>
                <option value="Victoria Island">Victoria Island</option>
                <option value="Banana Island">Banana Island</option>
                <option value="Lekki Phase 1">Lekki Phase 1</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Bedrooms</label>
              <input
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Bathrooms</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Max Guests</label>
              <input
                type="number"
                min="1"
                value={formData.maxGuests}
                onChange={(e) => setFormData({ ...formData, maxGuests: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Nightly Rate (₦) *</label>
              <input
                type="number"
                min="0"
                value={formData.nightlyRate}
                onChange={(e) => setFormData({ ...formData, nightlyRate: parseInt(e.target.value) || 0 })}
                className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 ${
                  errors.nightlyRate ? 'border-red-500' : 'border-charcoal/10'
                }`}
              />
              {errors.nightlyRate && <p className="text-red-500 text-xs mt-1">{errors.nightlyRate}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Weekend Premium (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.weekendPremium}
                onChange={(e) => setFormData({ ...formData, weekendPremium: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Cleaning Fee (₦)</label>
              <input
                type="number"
                min="0"
                value={formData.cleaningFee}
                onChange={(e) => setFormData({ ...formData, cleaningFee: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Security Deposit (₦)</label>
              <input
                type="number"
                min="0"
                value={formData.securityDeposit}
                onChange={(e) => setFormData({ ...formData, securityDeposit: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Main Image URL *</label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 ${
                errors.image ? 'border-red-500' : 'border-charcoal/10'
              }`}
              placeholder="https://..."
            />
            {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
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
              {listing ? 'Update Property' : 'Add Property'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
