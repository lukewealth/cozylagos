import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp, Plus, Edit2, Trash2, Eye, Star, MapPin, Calendar,
  Search, Filter, X, Check, Image, DollarSign, Tag, BarChart3,
  Sparkles, Crown, Award, Users, Package, Settings, Save, Upload
} from 'lucide-react';
import { useCMSStore } from '../stores/cmsStore';
import { TrendingGem } from '../db/indexedDb';

export default function AdminCMSView() {
  const { trendingGems, announcements, init, addTrendingGem, updateTrendingGem, deleteTrendingGem, toggleTrending, addAnnouncement, deleteAnnouncement } = useCMSStore();
  const [activeTab, setActiveTab] = useState<'gems' | 'announcements' | 'analytics'>('gems');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGem, setEditingGem] = useState<TrendingGem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    init();
  }, [init]);

  const filteredGems = trendingGems.filter(gem =>
    gem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    gem.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalGems: trendingGems.length,
    trending: trendingGems.filter(g => g.isTrending).length,
    totalViews: trendingGems.reduce((sum, g) => sum + g.views, 0),
    totalBookings: trendingGems.reduce((sum, g) => sum + g.bookings, 0),
  };

  return (
    <div className="flex-grow bg-parchment">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-20 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
              Admin <span className="italic font-light text-gold-dark">CMS</span>
            </h1>
            <p className="text-sm text-charcoal/60 mt-1">Manage trending gems and announcements</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gold text-charcoal font-bold text-sm rounded-xl hover:bg-gold-dark hover:text-parchment transition-colors shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add Gem</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Package className="w-5 h-5" />} label="Total Gems" value={stats.totalGems} color="blue" />
          <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Trending" value={stats.trending} color="green" />
          <StatCard icon={<Eye className="w-5 h-5" />} label="Total Views" value={stats.totalViews.toLocaleString()} color="purple" />
          <StatCard icon={<Award className="w-5 h-5" />} label="Bookings" value={stats.totalBookings.toLocaleString()} color="gold" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-charcoal/10">
          <TabButton active={activeTab === 'gems'} onClick={() => setActiveTab('gems')} icon={<Sparkles className="w-4 h-4" />}>Trending Gems</TabButton>
          <TabButton active={activeTab === 'announcements'} onClick={() => setActiveTab('announcements')} icon={<Crown className="w-4 h-4" />}>Announcements</TabButton>
          <TabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<BarChart3 className="w-4 h-4" />}>Analytics</TabButton>
        </div>

        {/* Content */}
        {activeTab === 'gems' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                <input
                  type="text"
                  placeholder="Search gems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGems.map((gem) => (
                <GemCard
                  key={gem.id}
                  gem={gem}
                  onEdit={() => setEditingGem(gem)}
                  onDelete={() => deleteTrendingGem(gem.id)}
                  onToggleTrending={() => toggleTrending(gem.id)}
                />
              ))}
            </div>

            {filteredGems.length === 0 && (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-charcoal/20 mx-auto mb-4" />
                <p className="text-lg font-semibold text-charcoal mb-2">No gems found</p>
                <p className="text-sm text-charcoal/50">Add your first trending gem to get started</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'announcements' && (
          <AnnouncementsView announcements={announcements} onAdd={addAnnouncement} onDelete={deleteAnnouncement} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView gems={trendingGems} />
        )}
      </div>

      {showAddModal && (
        <AddGemModal onClose={() => setShowAddModal(false)} onAdd={addTrendingGem} />
      )}

      {editingGem && (
        <EditGemModal gem={editingGem} onClose={() => setEditingGem(null)} onUpdate={updateTrendingGem} />
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    gold: 'bg-gold/10 text-gold-dark',
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-charcoal/5 shadow-sm">
      <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-charcoal">{value}</p>
      <p className="text-xs text-charcoal/50 mt-1">{label}</p>
    </div>
  );
}

function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 ${
        active
          ? 'border-gold text-gold-dark'
          : 'border-transparent text-charcoal/60 hover:text-charcoal'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function GemCard({ gem, onEdit, onDelete, onToggleTrending }: { gem: TrendingGem; onEdit: () => void; onDelete: () => void; onToggleTrending: () => void }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-charcoal/5 shadow-sm hover:shadow-lg transition-all">
      <div className="relative h-48">
        <img src={gem.image} alt={gem.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {gem.isTrending && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-gold/90 backdrop-blur-md rounded-full text-[10px] font-bold text-charcoal flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            TRENDING
          </div>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-serif text-lg font-bold text-white mb-1">{gem.title}</h3>
          <div className="flex items-center gap-2 text-white/80 text-xs">
            <MapPin className="w-3 h-3" />
            <span>{gem.location}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-charcoal/60 line-clamp-2 mb-3">{gem.description}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-gold-dark">{gem.price}</span>
          <div className="flex items-center gap-1 text-xs text-charcoal/50">
            <Star className="w-3 h-3 fill-gold text-gold" />
            <span>{gem.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-charcoal/50 mb-4">
          <Eye className="w-3 h-3" />
          <span>{gem.views.toLocaleString()} views</span>
          <span className="mx-1">•</span>
          <Award className="w-3 h-3" />
          <span>{gem.bookings} bookings</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTrending}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
              gem.isTrending
                ? 'bg-gold/10 text-gold-dark hover:bg-gold/20'
                : 'bg-charcoal/5 text-charcoal/60 hover:bg-charcoal/10'
            }`}
          >
            {gem.isTrending ? 'Unmark Trending' : 'Mark Trending'}
          </button>
          <button onClick={onEdit} className="p-2 bg-charcoal/5 hover:bg-charcoal/10 rounded-lg transition-colors">
            <Edit2 className="w-4 h-4 text-charcoal/60" />
          </button>
          <button onClick={onDelete} className="p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AddGemModal({ onClose, onAdd }: { onClose: () => void; onAdd: (gem: TrendingGem) => Promise<void> }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'apartment' as const,
    image: '',
    price: '',
    location: '',
    rating: 4.5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const gem: TrendingGem = {
      id: `gem-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      image: formData.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      price: formData.price,
      location: formData.location,
      rating: formData.rating,
      isTrending: true,
      views: 0,
      bookings: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin',
    };
    await onAdd(gem);
    onClose();
  };

  return (
    <Modal onClose={onClose} title="Add Trending Gem">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Title" value={formData.title} onChange={(v) => setFormData({ ...formData, title: v })} required />
        <FormField label="Description" value={formData.description} onChange={(v) => setFormData({ ...formData, description: v })} textarea required />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category" value={formData.category} onChange={(v) => setFormData({ ...formData, category: v as any })} select options={['apartment', 'experience', 'service', 'bundle']} />
          <FormField label="Price" value={formData.price} onChange={(v) => setFormData({ ...formData, price: v })} placeholder="e.g., ₦250,000/night" required />
        </div>
        <FormField label="Location" value={formData.location} onChange={(v) => setFormData({ ...formData, location: v })} required />
        <FormField label="Image URL" value={formData.image} onChange={(v) => setFormData({ ...formData, image: v })} placeholder="https://..." />
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Rating</label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
            className="flex-1 px-3 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
          />
        </div>
        <div className="flex items-center gap-3 pt-4">
          <button type="button" onClick={onClose} className="flex-1 py-3 bg-charcoal/5 text-charcoal font-bold text-sm rounded-xl hover:bg-charcoal/10 transition-colors">
            Cancel
          </button>
          <button type="submit" className="flex-1 py-3 bg-gold text-charcoal font-bold text-sm rounded-xl hover:bg-gold-dark hover:text-parchment transition-colors flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />
            Add Gem
          </button>
        </div>
      </form>
    </Modal>
  );
}

function EditGemModal({ gem, onClose, onUpdate }: { gem: TrendingGem; onClose: () => void; onUpdate: (gem: TrendingGem) => Promise<void> }) {
  const [formData, setFormData] = useState(gem);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate({ ...formData, updatedAt: new Date().toISOString() });
    onClose();
  };

  return (
    <Modal onClose={onClose} title="Edit Gem">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Title" value={formData.title} onChange={(v) => setFormData({ ...formData, title: v })} required />
        <FormField label="Description" value={formData.description} onChange={(v) => setFormData({ ...formData, description: v })} textarea required />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category" value={formData.category} onChange={(v) => setFormData({ ...formData, category: v as any })} select options={['apartment', 'experience', 'service', 'bundle']} />
          <FormField label="Price" value={formData.price} onChange={(v) => setFormData({ ...formData, price: v })} required />
        </div>
        <FormField label="Location" value={formData.location} onChange={(v) => setFormData({ ...formData, location: v })} required />
        <FormField label="Image URL" value={formData.image} onChange={(v) => setFormData({ ...formData, image: v })} />
        <div className="flex items-center gap-3 pt-4">
          <button type="button" onClick={onClose} className="flex-1 py-3 bg-charcoal/5 text-charcoal font-bold text-sm rounded-xl hover:bg-charcoal/10 transition-colors">
            Cancel
          </button>
          <button type="submit" className="flex-1 py-3 bg-gold text-charcoal font-bold text-sm rounded-xl hover:bg-gold-dark hover:text-parchment transition-colors flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />
            Update Gem
          </button>
        </div>
      </form>
    </Modal>
  );
}

function AnnouncementsView({ announcements, onAdd, onDelete }: { announcements: Announcement[]; onAdd: (a: Announcement) => Promise<void>; onDelete: (id: string) => Promise<void> }) {
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ title: '', message: '', type: 'info' as const, targetAudience: 'all' as const });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const announcement: Announcement = {
      id: `ann-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
      createdBy: 'admin',
    };
    await onAdd(announcement);
    setFormData({ title: '', message: '', type: 'info', targetAudience: 'all' });
    setShowAdd(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl font-bold text-charcoal">Announcements</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2 bg-gold text-charcoal font-bold text-sm rounded-xl hover:bg-gold-dark hover:text-parchment transition-colors">
          <Plus className="w-4 h-4" />
          New Announcement
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 border border-charcoal/5 mb-6">
          <div className="space-y-4">
            <FormField label="Title" value={formData.title} onChange={(v) => setFormData({ ...formData, title: v })} required />
            <FormField label="Message" value={formData.message} onChange={(v) => setFormData({ ...formData, message: v })} textarea required />
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Type" value={formData.type} onChange={(v) => setFormData({ ...formData, type: v as any })} select options={['info', 'warning', 'success', 'promotion']} />
              <FormField label="Audience" value={formData.targetAudience} onChange={(v) => setFormData({ ...formData, targetAudience: v as any })} select options={['all', 'admin', 'sp', 'users']} />
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2.5 bg-charcoal/5 text-charcoal font-bold text-sm rounded-xl hover:bg-charcoal/10 transition-colors">
                Cancel
              </button>
              <button type="submit" className="flex-1 py-2.5 bg-gold text-charcoal font-bold text-sm rounded-xl hover:bg-gold-dark hover:text-parchment transition-colors">
                Post Announcement
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {announcements.map((ann) => (
          <div key={ann.id} className="bg-white rounded-xl p-4 border border-charcoal/5 flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              ann.type === 'success' ? 'bg-green-50 text-green-600' :
              ann.type === 'warning' ? 'bg-yellow-50 text-yellow-600' :
              ann.type === 'promotion' ? 'bg-gold/10 text-gold-dark' :
              'bg-blue-50 text-blue-600'
            }`}>
              <Crown className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-charcoal">{ann.title}</h3>
                <span className="px-2 py-0.5 bg-charcoal/5 rounded-full text-[9px] font-bold text-charcoal/50 uppercase">{ann.targetAudience}</span>
              </div>
              <p className="text-sm text-charcoal/60 mb-2">{ann.message}</p>
              <p className="text-xs text-charcoal/40">{new Date(ann.createdAt).toLocaleDateString()}</p>
            </div>
            <button onClick={() => onDelete(ann.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ))}
      </div>

      {announcements.length === 0 && (
        <div className="text-center py-16">
          <Crown className="w-16 h-16 text-charcoal/20 mx-auto mb-4" />
          <p className="text-lg font-semibold text-charcoal mb-2">No announcements</p>
          <p className="text-sm text-charcoal/50">Create your first announcement</p>
        </div>
      )}
    </div>
  );
}

function AnalyticsView({ gems }: { gems: TrendingGem[] }) {
  const topGems = [...gems].sort((a, b) => b.views - a.views).slice(0, 5);
  const categoryStats = gems.reduce((acc, gem) => {
    acc[gem.category] = (acc[gem.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-charcoal/5">
        <h3 className="font-serif text-lg font-bold text-charcoal mb-4">Top Performing Gems</h3>
        <div className="space-y-3">
          {topGems.map((gem, i) => (
            <div key={gem.id} className="flex items-center gap-4">
              <span className="w-6 h-6 rounded-full bg-gold/10 text-gold-dark text-xs font-bold flex items-center justify-center">{i + 1}</span>
              <img src={gem.image} alt={gem.title} className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-charcoal">{gem.title}</p>
                <p className="text-xs text-charcoal/50">{gem.location}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-charcoal">{gem.views.toLocaleString()}</p>
                <p className="text-xs text-charcoal/50">views</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-charcoal/5">
        <h3 className="font-serif text-lg font-bold text-charcoal mb-4">Gems by Category</h3>
        <div className="space-y-3">
          {Object.entries(categoryStats).map(([category, count]) => (
            <div key={category} className="flex items-center justify-between">
              <span className="text-sm text-charcoal capitalize">{category}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-charcoal/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gold rounded-full" style={{ width: `${(count / gems.length) * 100}%` }} />
                </div>
                <span className="text-sm font-bold text-charcoal w-8 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Modal({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-parchment rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-parchment border-b border-charcoal/10 px-6 py-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-charcoal">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors">
            <X className="w-5 h-5 text-charcoal/60" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
}

function FormField({ label, value, onChange, type = 'text', placeholder, required, textarea, select, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  textarea?: boolean;
  select?: boolean;
  options?: string[];
}) {
  const inputClass = "w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30";
  
  return (
    <div>
      <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-1.5 block">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} rows={3} className={inputClass} />
      ) : select ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
          {options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className={inputClass} />
      )}
    </div>
  );
}
