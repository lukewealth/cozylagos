import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Upload, Plus, Image as ImageIcon, DollarSign, Clock, MapPin, Tag, Users, Check } from 'lucide-react';
import { useAuth } from '../../auth';
import { generateId } from '../../db';
import { showToast } from '../../components/ui/Toast';

interface ServiceData {
  id?: string;
  title: string;
  description: string;
  category: string;
  price: number;
  priceUnit: 'per_hour' | 'per_session' | 'per_day';
  image: string;
  images: string[];
  amenities: string[];
  duration: string;
  maxGuests: number;
  location: string;
  isActive: boolean;
}

interface ServiceCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (service: ServiceData) => void;
  initialData?: Partial<ServiceData>;
  mode?: 'create' | 'edit';
}

const CATEGORIES = [
  { id: 'transport', label: 'Transport', icon: '🚗' },
  { id: 'culinary', label: 'Culinary', icon: '👨‍🍳' },
  { id: 'security', label: 'Security', icon: '🛡️' },
  { id: 'wellness', label: 'Wellness', icon: '🧖' },
  { id: 'media', label: 'Media & Photography', icon: '📸' },
  { id: 'concierge', label: 'Concierge', icon: '🔑' },
  { id: 'events', label: 'Events', icon: '🎉' },
  { id: 'marine', label: 'Marine & Yacht', icon: '⛵' },
  { id: 'aviation', label: 'Aviation', icon: '✈️' },
  { id: 'other', label: 'Other', icon: '✨' },
];

const AMENITY_SUGGESTIONS = [
  'VIP Protocol', 'Airport Pickup', 'Multilingual Staff', '24/7 Support',
  'Insurance Included', 'Equipment Provided', 'Customizable', 'Group Discount',
  'Premium Vehicles', 'Professional Guide', 'Refreshments', 'WiFi',
];

export default function ServiceCreateModal({ isOpen, onClose, onSubmit, initialData, mode = 'create' }: ServiceCreateModalProps) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState<ServiceData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || 'transport',
    price: initialData?.price || 0,
    priceUnit: initialData?.priceUnit || 'per_session',
    image: initialData?.image || '',
    images: initialData?.images || [],
    amenities: initialData?.amenities || [],
    duration: initialData?.duration || '',
    maxGuests: initialData?.maxGuests || 1,
    location: initialData?.location || '',
    isActive: initialData?.isActive ?? true,
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [newImage, setNewImage] = useState('');
  const [step, setStep] = useState(1);

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData({ ...formData, amenities: [...formData.amenities, newAmenity.trim()] });
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setFormData({ ...formData, amenities: formData.amenities.filter(a => a !== amenity) });
  };

  const handleAddImage = () => {
    if (newImage.trim()) {
      const updatedImages = [...formData.images, newImage.trim()];
      setFormData({
        ...formData,
        images: updatedImages,
        image: formData.image || newImage.trim(),
      });
      setNewImage('');
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: updatedImages,
      image: formData.image === formData.images[index] ? (updatedImages[0] || '') : formData.image,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || formData.price <= 0) {
      showToast({ type: 'error', title: 'Validation Error', message: 'Please fill in all required fields' });
      return;
    }

    const serviceData: ServiceData = {
      ...formData,
      id: initialData?.id || generateId(),
    };

    onSubmit(serviceData);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-outline-variant/10 flex items-center justify-between bg-gradient-to-r from-primary/5 to-primary/10">
          <div>
            <h2 className="font-serif text-xl font-bold text-on-surface">
              {mode === 'edit' ? 'Edit Service' : 'Create New Service'}
            </h2>
            <p className="text-xs text-secondary mt-1">
              {mode === 'edit' ? 'Update your service details' : 'Add a new service offering to your portfolio'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-container transition-colors">
            <X className="w-5 h-5 text-secondary" />
          </button>
        </div>

        <div className="px-6 py-3 border-b border-outline-variant/10 flex gap-2">
          {[
            { step: 1, label: 'Basic Info' },
            { step: 2, label: 'Details' },
            { step: 3, label: 'Media' },
          ].map((s) => (
            <button
              key={s.step}
              onClick={() => setStep(s.step)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                step === s.step
                  ? 'bg-primary text-white'
                  : step > s.step
                  ? 'bg-green-100 text-green-700'
                  : 'bg-surface-container text-secondary'
              }`}
            >
              {step > s.step ? <Check className="w-4 h-4" /> : <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">{s.step}</span>}
              {s.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., VIP Airport Transfer"
                  className="w-full px-4 py-3 border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                  Category *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: cat.id })}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        formData.category === cat.id
                          ? 'border-primary bg-primary/5'
                          : 'border-outline-variant/10 hover:border-primary/30'
                      }`}
                    >
                      <span className="text-xl mb-1 block">{cat.icon}</span>
                      <span className="text-[10px] font-bold uppercase">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what makes this service special..."
                  rows={4}
                  className="w-full px-4 py-3 border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-all"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Next: Details
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                    <DollarSign className="w-3 h-3 inline" /> Price (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                    <Clock className="w-3 h-3 inline" /> Price Unit
                  </label>
                  <select
                    value={formData.priceUnit}
                    onChange={(e) => setFormData({ ...formData, priceUnit: e.target.value as any })}
                    className="w-full px-4 py-3 border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="per_session">Per Session</option>
                    <option value="per_hour">Per Hour</option>
                    <option value="per_day">Per Day</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                    <Clock className="w-3 h-3 inline" /> Duration
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 2 hours"
                    className="w-full px-4 py-3 border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                    <Users className="w-3 h-3 inline" /> Max Guests
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.maxGuests}
                    onChange={(e) => setFormData({ ...formData, maxGuests: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                  <MapPin className="w-3 h-3 inline" /> Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Victoria Island, Lagos"
                  className="w-full px-4 py-3 border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                  <Tag className="w-3 h-3 inline" /> Amenities / Features
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(amenity)}
                        className="hover:text-error transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="Add amenity..."
                    className="flex-1 px-3 py-2 border border-outline-variant/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    type="button"
                    onClick={handleAddAmenity}
                    className="px-4 py-2 bg-surface-container text-on-surface font-semibold text-xs rounded-lg hover:bg-surface-container-high transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {AMENITY_SUGGESTIONS.filter(a => !formData.amenities.includes(a)).slice(0, 6).map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setFormData({ ...formData, amenities: [...formData.amenities, suggestion] })}
                      className="px-2 py-1 bg-surface-container-low text-secondary rounded text-[10px] hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      + {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-2.5 border border-outline-variant/20 text-on-surface font-semibold text-sm rounded-xl hover:bg-surface-container transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Next: Media
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-5"
            >
              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                  <ImageIcon className="w-3 h-3 inline" /> Service Images
                </label>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-surface-container group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary text-white text-[9px] font-bold rounded">
                          PRIMARY
                        </span>
                      )}
                    </div>
                  ))}
                  <div className="aspect-video rounded-xl border-2 border-dashed border-outline-variant/20 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-secondary/50" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="Paste image URL..."
                    className="flex-1 px-3 py-2 border border-outline-variant/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-2 bg-surface-container text-on-surface font-semibold text-xs rounded-lg hover:bg-surface-container-high transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-surface-container-low rounded-xl">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded text-primary focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-on-surface cursor-pointer">
                  Publish service immediately
                </label>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 border border-outline-variant/20 text-on-surface font-semibold text-sm rounded-xl hover:bg-surface-container transition-colors"
                >
                  Back
                </button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-2.5 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  {mode === 'edit' ? 'Update Service' : 'Create Service'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
}
