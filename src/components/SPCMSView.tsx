import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Plus, Edit2, Trash2, Users, Star, MapPin, Clock, Check, X, Search,
  Package, Settings, Save, Upload, Briefcase, Phone, Mail, Award,
  ToggleLeft, ToggleRight, Calendar, DollarSign
} from 'lucide-react';
import { useCMSStore } from '../stores/cmsStore';
import { VIPService, StaffMember } from '../db/indexedDb';

export default function SPCMSView({ providerId = 'sp-default' }: { providerId?: string }) {
  const { vipServices, staff, init, addVIPService, updateVIPService, deleteVIPService, addStaff, updateStaff, deleteStaff } = useCMSStore();
  const [activeTab, setActiveTab] = useState<'services' | 'staff' | 'analytics'>('services');
  const [showAddService, setShowAddService] = useState(false);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [editingService, setEditingService] = useState<VIPService | null>(null);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    init();
  }, [init]);

  const myServices = vipServices.filter(s => s.providerId === providerId);
  const myStaff = staff.filter(s => s.providerId === providerId);

  const filteredServices = myServices.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    totalServices: myServices.length,
    activeServices: myServices.filter(s => s.available).length,
    totalStaff: myStaff.length,
    availableStaff: myStaff.filter(s => s.available).length,
  };

  return (
    <div className="flex-grow bg-parchment">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 xl:px-20 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
              Service Provider <span className="italic font-light text-gold-dark">Dashboard</span>
            </h1>
            <p className="text-sm text-charcoal/60 mt-1">Manage your services and staff</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddStaff(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-charcoal/5 text-charcoal font-bold text-sm rounded-xl hover:bg-charcoal/10 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Add Staff</span>
            </button>
            <button
              onClick={() => setShowAddService(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gold text-charcoal font-bold text-sm rounded-xl hover:bg-gold-dark hover:text-parchment transition-colors shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Package className="w-5 h-5" />} label="Total Services" value={stats.totalServices} color="blue" />
          <StatCard icon={<Check className="w-5 h-5" />} label="Active Services" value={stats.activeServices} color="green" />
          <StatCard icon={<Users className="w-5 h-5" />} label="Total Staff" value={stats.totalStaff} color="purple" />
          <StatCard icon={<Award className="w-5 h-5" />} label="Available Staff" value={stats.availableStaff} color="gold" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-charcoal/10">
          <TabButton active={activeTab === 'services'} onClick={() => setActiveTab('services')} icon={<Briefcase className="w-4 h-4" />}>My Services</TabButton>
          <TabButton active={activeTab === 'staff'} onClick={() => setActiveTab('staff')} icon={<Users className="w-4 h-4" />}>Staff</TabButton>
          <TabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<DollarSign className="w-4 h-4" />}>Analytics</TabButton>
        </div>

        {/* Content */}
        {activeTab === 'services' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onEdit={() => setEditingService(service)}
                  onDelete={() => deleteVIPService(service.id)}
                  onToggle={() => updateVIPService({ ...service, available: !service.available, updatedAt: new Date().toISOString() })}
                />
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-charcoal/20 mx-auto mb-4" />
                <p className="text-lg font-semibold text-charcoal mb-2">No services yet</p>
                <p className="text-sm text-charcoal/50">Add your first service to get started</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'staff' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myStaff.map((member) => (
                <StaffCard
                  key={member.id}
                  member={member}
                  onEdit={() => setEditingStaff(member)}
                  onDelete={() => deleteStaff(member.id)}
                  onToggle={() => updateStaff({ ...member, available: !member.available })}
                />
              ))}
            </div>

            {myStaff.length === 0 && (
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-charcoal/20 mx-auto mb-4" />
                <p className="text-lg font-semibold text-charcoal mb-2">No staff members</p>
                <p className="text-sm text-charcoal/50">Add your first staff member</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView services={myServices} staff={myStaff} />
        )}
      </div>

      {showAddService && (
        <AddServiceModal providerId={providerId} staff={myStaff} onClose={() => setShowAddService(false)} onAdd={addVIPService} />
      )}

      {editingService && (
        <EditServiceModal service={editingService} staff={myStaff} onClose={() => setEditingService(null)} onUpdate={updateVIPService} />
      )}

      {showAddStaff && (
        <AddStaffModal providerId={providerId} onClose={() => setShowAddStaff(false)} onAdd={addStaff} />
      )}

      {editingStaff && (
        <EditStaffModal member={editingStaff} onClose={() => setEditingStaff(null)} onUpdate={updateStaff} />
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
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

function ServiceCard({ service, onEdit, onDelete, onToggle }: { service: VIPService; onEdit: () => void; onDelete: () => void; onToggle: () => void }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-charcoal/5 shadow-sm hover:shadow-lg transition-all">
      <div className="relative h-40">
        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 right-3">
          <button
            onClick={onToggle}
            className={`p-2 rounded-full backdrop-blur-md transition-colors ${
              service.available ? 'bg-green-500/20 text-green-400' : 'bg-charcoal/20 text-white/60'
            }`}
          >
            {service.available ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
          </button>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-serif text-lg font-bold text-white mb-1">{service.title}</h3>
          <div className="flex items-center gap-2 text-white/80 text-xs">
            <MapPin className="w-3 h-3" />
            <span>{service.location}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-charcoal/60 line-clamp-2 mb-3">{service.description}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-gold-dark">
            ₦{service.price.toLocaleString()} <span className="text-[9px] text-charcoal/40 font-normal">/ {service.priceUnit.replace('per_', '')}</span>
          </span>
          <div className="flex items-center gap-1 text-xs text-charcoal/50">
            <Star className="w-3 h-3 fill-gold text-gold" />
            <span>{service.rating}</span>
          </div>
        </div>
        {service.staffAssigned && service.staffAssigned.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-charcoal/50 mb-3">
            <Users className="w-3 h-3" />
            <span>{service.staffAssigned.length} staff assigned</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button onClick={onEdit} className="flex-1 py-2 bg-charcoal/5 hover:bg-charcoal/10 rounded-lg text-xs font-bold text-charcoal/60 transition-colors flex items-center justify-center gap-1">
            <Edit2 className="w-3 h-3" />
            Edit
          </button>
          <button onClick={onDelete} className="py-2 px-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StaffCard({ member, onEdit, onDelete, onToggle }: { member: StaffMember; onEdit: () => void; onDelete: () => void; onToggle: () => void }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-charcoal/5 shadow-sm hover:shadow-lg transition-all">
      <div className="flex items-start gap-4 mb-4">
        <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-xl object-cover" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-serif text-lg font-bold text-charcoal">{member.name}</h3>
            <button
              onClick={onToggle}
              className={`p-1 rounded-full transition-colors ${
                member.available ? 'bg-green-50 text-green-600' : 'bg-charcoal/5 text-charcoal/40'
              }`}
            >
              {member.available ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-charcoal/60 mb-2">{member.role}</p>
          <div className="flex items-center gap-1 text-xs text-charcoal/50">
            <Star className="w-3 h-3 fill-gold text-gold" />
            <span>{member.rating} ({member.reviewsCount} reviews)</span>
          </div>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-charcoal/60">
          <Mail className="w-3 h-3" />
          <span>{member.email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-charcoal/60">
          <Phone className="w-3 h-3" />
          <span>{member.phone}</span>
        </div>
      </div>
      {member.specialties.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {member.specialties.slice(0, 3).map((s, i) => (
            <span key={i} className="text-[10px] font-medium text-charcoal/50 bg-charcoal/5 px-2 py-1 rounded-full">
              {s}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <button onClick={onEdit} className="flex-1 py-2 bg-charcoal/5 hover:bg-charcoal/10 rounded-lg text-xs font-bold text-charcoal/60 transition-colors flex items-center justify-center gap-1">
          <Edit2 className="w-3 h-3" />
          Edit
        </button>
        <button onClick={onDelete} className="py-2 px-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
          <Trash2 className="w-4 h-4 text-red-500" />
        </button>
      </div>
    </div>
  );
}

function AddServiceModal({ providerId, staff, onClose, onAdd }: { providerId: string; staff: StaffMember[]; onClose: () => void; onAdd: (s: VIPService) => Promise<void> }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'spa',
    price: 0,
    priceUnit: 'per_session',
    location: '',
    image: '',
    amenities: '',
    duration: '',
    selectedStaff: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const service: VIPService = {
      id: `service-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      price: formData.price,
      priceUnit: formData.priceUnit,
      location: formData.location,
      rating: 4.5,
      reviewsCount: 0,
      image: formData.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
      amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
      providerName: 'My Service',
      providerId,
      verified: false,
      available: true,
      duration: formData.duration,
      staffAssigned: formData.selectedStaff,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await onAdd(service);
    onClose();
  };

  const toggleStaff = (id: string) => {
    setFormData(prev => ({
      ...prev,
      selectedStaff: prev.selectedStaff.includes(id)
        ? prev.selectedStaff.filter(s => s !== id)
        : [...prev.selectedStaff, id]
    }));
  };

  return (
    <Modal onClose={onClose} title="Add New Service">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Service Title" value={formData.title} onChange={(v) => setFormData({ ...formData, title: v })} required />
        <FormField label="Description" value={formData.description} onChange={(v) => setFormData({ ...formData, description: v })} textarea required />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category" value={formData.category} onChange={(v) => setFormData({ ...formData, category: v })} select options={['spa', 'barber', 'shopping', 'sports', 'gym', 'laundry', 'chef', 'photography']} />
          <FormField label="Location" value={formData.location} onChange={(v) => setFormData({ ...formData, location: v })} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-1.5 block">Price (₦)</label>
            <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30" required />
          </div>
          <FormField label="Price Unit" value={formData.priceUnit} onChange={(v) => setFormData({ ...formData, priceUnit: v })} select options={['per_session', 'per_hour', 'per_day', 'per_item', 'flat']} />
        </div>
        <FormField label="Duration" value={formData.duration} onChange={(v) => setFormData({ ...formData, duration: v })} placeholder="e.g., 90 mins" />
        <FormField label="Image URL" value={formData.image} onChange={(v) => setFormData({ ...formData, image: v })} placeholder="https://..." />
        <FormField label="Amenities (comma-separated)" value={formData.amenities} onChange={(v) => setFormData({ ...formData, amenities: v })} placeholder="e.g., Hot Stones, Aromatherapy" />
        
        {staff.length > 0 && (
          <div>
            <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2 block">Assign Staff</label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {staff.map((member) => (
                <label key={member.id} className="flex items-center gap-3 p-2 bg-white border border-charcoal/5 rounded-lg cursor-pointer hover:bg-charcoal/5">
                  <input
                    type="checkbox"
                    checked={formData.selectedStaff.includes(member.id)}
                    onChange={() => toggleStaff(member.id)}
                    className="w-4 h-4 rounded border-charcoal/20 text-gold focus:ring-gold"
                  />
                  <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-charcoal">{member.name}</p>
                    <p className="text-xs text-charcoal/50">{member.role}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 pt-4">
          <button type="button" onClick={onClose} className="flex-1 py-3 bg-charcoal/5 text-charcoal font-bold text-sm rounded-xl hover:bg-charcoal/10 transition-colors">
            Cancel
          </button>
          <button type="submit" className="flex-1 py-3 bg-gold text-charcoal font-bold text-sm rounded-xl hover:bg-gold-dark hover:text-parchment transition-colors flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />
            Add Service
          </button>
        </div>
      </form>
    </Modal>
  );
}

function EditServiceModal({ service, staff, onClose, onUpdate }: { service: VIPService; staff: StaffMember[]; onClose: () => void; onUpdate: (s: VIPService) => Promise<void> }) {
  const [formData, setFormData] = useState(service);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate({ ...formData, updatedAt: new Date().toISOString() });
    onClose();
  };

  return (
    <Modal onClose={onClose} title="Edit Service">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Service Title" value={formData.title} onChange={(v) => setFormData({ ...formData, title: v })} required />
        <FormField label="Description" value={formData.description} onChange={(v) => setFormData({ ...formData, description: v })} textarea required />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category" value={formData.category} onChange={(v) => setFormData({ ...formData, category: v })} select options={['spa', 'barber', 'shopping', 'sports', 'gym', 'laundry', 'chef', 'photography']} />
          <FormField label="Location" value={formData.location} onChange={(v) => setFormData({ ...formData, location: v })} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-1.5 block">Price (₦)</label>
            <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30" required />
          </div>
          <FormField label="Price Unit" value={formData.priceUnit} onChange={(v) => setFormData({ ...formData, priceUnit: v })} select options={['per_session', 'per_hour', 'per_day', 'per_item', 'flat']} />
        </div>
        <FormField label="Duration" value={formData.duration || ''} onChange={(v) => setFormData({ ...formData, duration: v })} />
        <FormField label="Image URL" value={formData.image} onChange={(v) => setFormData({ ...formData, image: v })} />
        <div>
          <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-1.5 block">Amenities (comma-separated)</label>
          <input type="text" value={formData.amenities.join(', ')} onChange={(e) => setFormData({ ...formData, amenities: e.target.value.split(',').map(a => a.trim()) })} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30" />
        </div>
        <div className="flex items-center gap-3 pt-4">
          <button type="button" onClick={onClose} className="flex-1 py-3 bg-charcoal/5 text-charcoal font-bold text-sm rounded-xl hover:bg-charcoal/10 transition-colors">
            Cancel
          </button>
          <button type="submit" className="flex-1 py-3 bg-gold text-charcoal font-bold text-sm rounded-xl hover:bg-gold-dark hover:text-parchment transition-colors flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />
            Update Service
          </button>
        </div>
      </form>
    </Modal>
  );
}

function AddStaffModal({ providerId, onClose, onAdd }: { providerId: string; onClose: () => void; onAdd: (s: StaffMember) => Promise<void> }) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    avatar: '',
    specialties: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const member: StaffMember = {
      id: `staff-${Date.now()}`,
      name: formData.name,
      role: formData.role,
      email: formData.email,
      phone: formData.phone,
      avatar: formData.avatar || 'https://images.unsplash.com/photo-1472099645785-56584f4e9e94?w=400&q=80',
      providerId,
      specialties: formData.specialties.split(',').map(s => s.trim()).filter(Boolean),
      rating: 4.5,
      reviewsCount: 0,
      available: true,
      createdAt: new Date().toISOString(),
    };
    await onAdd(member);
    onClose();
  };

  return (
    <Modal onClose={onClose} title="Add Staff Member">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Full Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} required />
        <FormField label="Role" value={formData.role} onChange={(v) => setFormData({ ...formData, role: v })} placeholder="e.g., Massage Therapist" required />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} type="email" required />
          <FormField label="Phone" value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} type="tel" required />
        </div>
        <FormField label="Avatar URL" value={formData.avatar} onChange={(v) => setFormData({ ...formData, avatar: v })} placeholder="https://..." />
        <FormField label="Specialties (comma-separated)" value={formData.specialties} onChange={(v) => setFormData({ ...formData, specialties: v })} placeholder="e.g., Deep Tissue, Swedish Massage" />
        <div className="flex items-center gap-3 pt-4">
          <button type="button" onClick={onClose} className="flex-1 py-3 bg-charcoal/5 text-charcoal font-bold text-sm rounded-xl hover:bg-charcoal/10 transition-colors">
            Cancel
          </button>
          <button type="submit" className="flex-1 py-3 bg-gold text-charcoal font-bold text-sm rounded-xl hover:bg-gold-dark hover:text-parchment transition-colors flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />
            Add Staff
          </button>
        </div>
      </form>
    </Modal>
  );
}

function EditStaffModal({ member, onClose, onUpdate }: { member: StaffMember; onClose: () => void; onUpdate: (s: StaffMember) => Promise<void> }) {
  const [formData, setFormData] = useState(member);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(formData);
    onClose();
  };

  return (
    <Modal onClose={onClose} title="Edit Staff Member">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Full Name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} required />
        <FormField label="Role" value={formData.role} onChange={(v) => setFormData({ ...formData, role: v })} required />
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Email" value={formData.email} onChange={(v) => setFormData({ ...formData, email: v })} type="email" required />
          <FormField label="Phone" value={formData.phone} onChange={(v) => setFormData({ ...formData, phone: v })} type="tel" required />
        </div>
        <FormField label="Avatar URL" value={formData.avatar} onChange={(v) => setFormData({ ...formData, avatar: v })} />
        <div>
          <label className="text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-1.5 block">Specialties (comma-separated)</label>
          <input type="text" value={formData.specialties.join(', ')} onChange={(e) => setFormData({ ...formData, specialties: e.target.value.split(',').map(s => s.trim()) })} className="w-full px-3 py-2 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/30" />
        </div>
        <div className="flex items-center gap-3 pt-4">
          <button type="button" onClick={onClose} className="flex-1 py-3 bg-charcoal/5 text-charcoal font-bold text-sm rounded-xl hover:bg-charcoal/10 transition-colors">
            Cancel
          </button>
          <button type="submit" className="flex-1 py-3 bg-gold text-charcoal font-bold text-sm rounded-xl hover:bg-gold-dark hover:text-parchment transition-colors flex items-center justify-center gap-2">
            <Save className="w-4 h-4" />
            Update Staff
          </button>
        </div>
      </form>
    </Modal>
  );
}

function AnalyticsView({ services, staff }: { services: VIPService[]; staff: StaffMember[] }) {
  const categoryStats = services.reduce((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalRevenue = services.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-charcoal/5">
        <h3 className="font-serif text-lg font-bold text-charcoal mb-4">Service Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-charcoal/50 mb-1">Total Services</p>
            <p className="text-2xl font-bold text-charcoal">{services.length}</p>
          </div>
          <div>
            <p className="text-xs text-charcoal/50 mb-1">Active Services</p>
            <p className="text-2xl font-bold text-green-600">{services.filter(s => s.available).length}</p>
          </div>
          <div>
            <p className="text-xs text-charcoal/50 mb-1">Total Staff</p>
            <p className="text-2xl font-bold text-charcoal">{staff.length}</p>
          </div>
          <div>
            <p className="text-xs text-charcoal/50 mb-1">Available Staff</p>
            <p className="text-2xl font-bold text-green-600">{staff.filter(s => s.available).length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-charcoal/5">
        <h3 className="font-serif text-lg font-bold text-charcoal mb-4">Services by Category</h3>
        <div className="space-y-3">
          {Object.entries(categoryStats).map(([category, count]) => (
            <div key={category} className="flex items-center justify-between">
              <span className="text-sm text-charcoal capitalize">{category}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-charcoal/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gold rounded-full" style={{ width: `${(count / services.length) * 100}%` }} />
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
