import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Save, Trash2, Plus, Info, DollarSign, MapPin, Image } from 'lucide-react';
import { Listing } from '../types';

interface ListingEditorViewProps {
  listing: Listing;
  onCancel: () => void;
  onSave: (updatedListing: Listing) => void;
}

export default function ListingEditorView({ listing, onCancel, onSave }: ListingEditorViewProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Listing>({ ...listing });

  const handleChange = (field: keyof Listing, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSave(formData);
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-y-auto">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-charcoal" />
          </button>
          <div>
            <h2 className="font-serif text-xl font-bold text-charcoal">Edit Residence</h2>
            <p className="text-xs text-charcoal/40 font-medium uppercase tracking-widest">Property Management Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onCancel}
            className="px-5 py-2 text-xs font-bold text-charcoal/60 uppercase tracking-widest hover:text-charcoal"
          >
            Discard
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-charcoal text-parchment font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-gold-dark transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto w-full p-6 md:p-12 space-y-12">
        
        {/* 1. Basic Information */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold-dark">
              <Info className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-charcoal">Identity & Description</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-charcoal/40 uppercase tracking-widest">Residence Title</label>
              <input 
                type="text"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-gold/20 transition-all font-medium"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-charcoal/40 uppercase tracking-widest">Category</label>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-gold/20 transition-all font-medium"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value as any)}
              >
                <option value="Penthouse">Penthouse</option>
                <option value="Luxury Villa">Luxury Villa</option>
                <option value="Executive Studio">Executive Studio</option>
                <option value="Serviced Apartment">Serviced Apartment</option>
                <option value="Premium Package">Premium Package</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-charcoal/40 uppercase tracking-widest">Detailed Description</label>
            <textarea 
              rows={5}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-gold/20 transition-all text-sm leading-relaxed"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>
        </section>

        {/* 2. Location & Capacity */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold-dark">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-charcoal">Location & Capacity</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-charcoal/40 uppercase tracking-widest">Location Enclave</label>
              <select 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-gold/20 transition-all font-medium"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value as any)}
              >
                <option value="Ikoyi">Ikoyi</option>
                <option value="Victoria Island">Victoria Island</option>
                <option value="Banana Island">Banana Island</option>
                <option value="Lekki Phase 1">Lekki Phase 1</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-charcoal/40 uppercase tracking-widest">Bedrooms</label>
              <input 
                type="number"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-gold/20 transition-all font-medium"
                value={formData.bedrooms}
                onChange={(e) => handleChange('bedrooms', Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-charcoal/40 uppercase tracking-widest">Bathrooms</label>
              <input 
                type="number"
                step="0.5"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-gold/20 transition-all font-medium"
                value={formData.bathrooms}
                onChange={(e) => handleChange('bathrooms', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-charcoal/40 uppercase tracking-widest">Max Guests</label>
              <input 
                type="number"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-gold/20 transition-all font-medium"
                value={formData.maxGuests}
                onChange={(e) => handleChange('maxGuests', Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-charcoal/40 uppercase tracking-widest">Square Footage</label>
              <input 
                type="number"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-gold/20 transition-all font-medium"
                value={formData.squareFootage}
                onChange={(e) => handleChange('squareFootage', Number(e.target.value))}
              />
            </div>
          </div>
        </section>

        {/* 3. Pricing */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold-dark">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-charcoal">Financial Structure</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-charcoal/40 uppercase tracking-widest">Nightly Rate (₦)</label>
              <input 
                type="number"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-gold/20 transition-all font-medium"
                value={formData.nightlyRate}
                onChange={(e) => handleChange('nightlyRate', Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-charcoal/40 uppercase tracking-widest">Weekend Premium (%)</label>
              <input 
                type="number"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-gold/20 transition-all font-medium"
                value={formData.weekendPremium}
                onChange={(e) => handleChange('weekendPremium', Number(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-charcoal/40 uppercase tracking-widest">Cleaning Fee (₦)</label>
              <input 
                type="number"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-gold/20 transition-all font-medium"
                value={formData.cleaningFee}
                onChange={(e) => handleChange('cleaningFee', Number(e.target.value))}
              />
            </div>
          </div>
        </section>

        {/* 4. Media Assets */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold-dark">
                <Image className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-charcoal">Visual Assets</h3>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group">
                <img src={img} alt="Listing" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => handleChange('images', formData.images.filter((_, i) => i !== idx))}
                    className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <button 
              onClick={() => handleChange('images', [...formData.images, "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=1000"])}
              className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-charcoal/40 hover:border-gold hover:text-gold transition-all group"
            >
              <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest">Add Photo</span>
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}
