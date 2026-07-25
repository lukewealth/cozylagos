import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Plus, Edit3, Trash2, Search, Filter, X, Check,
  Mail, Phone, Calendar, Shield, Star, Briefcase, Clock
} from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';
import { useAuth } from '../auth';
import api from '../services/api';
import { ToastContainer, showToast } from './ui/Toast';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: 'active' | 'inactive' | 'on_leave';
  specialties: string[];
  rating: number;
  bookingsCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function StaffManagement() {
  const { currentUser } = useAuth();
  const { data: staff, addRecord, updateRecord, removeRecord } = useDatabase('staff');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filteredStaff = (staff as any[]).filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateStaff = async (staffData: any) => {
    try {
      const newStaff = {
        ...staffData,
        id: `staff-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        providerId: currentUser?.id,
      };
      
      await addRecord(newStaff);
      
      // Sync to API
      try {
        await api.staff.create(newStaff);
      } catch (error) {
        console.error('API sync failed:', error);
      }
      
      setShowCreateModal(false);
      showToast({ type: 'success', title: 'Staff Created', message: `${newStaff.name} has been added` });
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to create staff member' });
    }
  };

  const handleUpdateStaff = async (staffId: string, updates: any) => {
    try {
      const updated = { ...updates, updatedAt: new Date().toISOString() };
      await updateRecord(staffId, updated);
      
      try {
        await api.staff.update(updated);
      } catch (error) {
        console.error('API sync failed:', error);
      }
      
      setEditingStaff(null);
      showToast({ type: 'success', title: 'Staff Updated', message: 'Changes saved successfully' });
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to update staff member' });
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    try {
      await removeRecord(staffId);
      
      try {
        await api.staff.delete(staffId);
      } catch (error) {
        console.error('API sync failed:', error);
      }
      
      setShowDeleteConfirm(null);
      showToast({ type: 'success', title: 'Staff Removed', message: 'Staff member has been removed' });
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to remove staff member' });
    }
  };

  const roles = ['all', 'driver', 'chef', 'security', 'concierge', 'cleaning', 'maintenance'];
  const statuses = ['all', 'active', 'inactive', 'on_leave'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Staff Management</h2>
          <p className="text-sm text-charcoal/60 mt-1">Manage your team members and their roles</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-charcoal font-bold text-xs tracking-wider uppercase rounded-lg hover:bg-gold-dark transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Staff
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-charcoal/5">
          <p className="text-xs text-charcoal/60 uppercase tracking-wider">Total Staff</p>
          <p className="text-2xl font-bold text-charcoal mt-1">{staff.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-charcoal/5">
          <p className="text-xs text-charcoal/60 uppercase tracking-wider">Active</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {staff.filter((s: any) => s.status === 'active').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-charcoal/5">
          <p className="text-xs text-charcoal/60 uppercase tracking-wider">On Leave</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">
            {staff.filter((s: any) => s.status === 'on_leave').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-charcoal/5">
          <p className="text-xs text-charcoal/60 uppercase tracking-wider">Avg Rating</p>
          <p className="text-2xl font-bold text-gold-dark mt-1">
            {staff.length > 0 
              ? (staff.reduce((sum: number, s: any) => sum + (s.rating || 0), 0) / staff.length).toFixed(1)
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
            placeholder="Search staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
        >
          {roles.map(role => (
            <option key={role} value={role}>{role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
        >
          {statuses.map(status => (
            <option key={status} value={status}>{status === 'all' ? 'All Status' : status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map((member: any) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-charcoal/5 rounded-xl p-5 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-gold-dark">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-charcoal">{member.name}</h3>
                  <p className="text-xs text-charcoal/60">{member.role}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                member.status === 'active' ? 'bg-green-100 text-green-700' :
                member.status === 'on_leave' ? 'bg-orange-100 text-orange-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {member.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-charcoal/60">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{member.email}</span>
              </div>
              {member.phone && (
                <div className="flex items-center gap-2 text-xs text-charcoal/60">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{member.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-charcoal/60">
                <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                <span>{member.rating || 0} rating</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-charcoal/60">
                <Briefcase className="w-3.5 h-3.5" />
                <span>{member.bookingsCount || 0} bookings</span>
              </div>
            </div>

            {member.specialties && member.specialties.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {member.specialties.slice(0, 3).map((spec: string, i: number) => (
                  <span key={i} className="text-[9px] font-medium text-charcoal/50 bg-charcoal/5 px-2 py-0.5 rounded-full">
                    {spec}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-3 border-t border-charcoal/5">
              <button
                onClick={() => setEditingStaff(member)}
                className="flex-1 py-2 bg-charcoal/5 text-charcoal font-bold text-xs uppercase rounded-lg hover:bg-charcoal/10 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(member.id)}
                className="py-2 px-3 bg-red-50 text-red-500 font-bold text-xs uppercase rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredStaff.length === 0 && (
        <div className="text-center py-16">
          <Users className="w-16 h-16 text-charcoal/20 mx-auto mb-4" />
          <p className="text-lg font-semibold text-charcoal mb-2">No staff members found</p>
          <p className="text-sm text-charcoal/50">Add your first staff member to get started</p>
        </div>
      )}

      <AnimatePresence>
        {showCreateModal && (
          <StaffFormModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateStaff}
          />
        )}
        {editingStaff && (
          <StaffFormModal
            staff={editingStaff}
            onClose={() => setEditingStaff(null)}
            onSubmit={(data) => handleUpdateStaff(editingStaff.id, data)}
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
              <h3 className="font-serif text-xl font-bold text-charcoal mb-2">Remove Staff Member?</h3>
              <p className="text-sm text-charcoal/60 mb-6">This action cannot be undone. All associated data will be lost.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-charcoal/10 text-charcoal font-bold text-xs uppercase rounded-lg hover:bg-charcoal/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteStaff(showDeleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white font-bold text-xs uppercase rounded-lg hover:bg-red-600 transition-all"
                >
                  Remove
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

function StaffFormModal({ staff, onClose, onSubmit }: {
  staff?: StaffMember;
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: staff?.name || '',
    email: staff?.email || '',
    phone: staff?.phone || '',
    role: staff?.role || 'driver',
    status: staff?.status || 'active',
    specialties: staff?.specialties || [],
    rating: staff?.rating || 0,
    bookingsCount: staff?.bookingsCount || 0,
  });

  const [newSpecialty, setNewSpecialty] = useState('');

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty)) {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, newSpecialty],
      });
      setNewSpecialty('');
    }
  };

  const handleRemoveSpecialty = (spec: string) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.filter(s => s !== spec),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
            {staff ? 'Edit Staff Member' : 'Add New Staff Member'}
          </h3>
          <button onClick={onClose} className="p-2 text-charcoal/40 hover:text-charcoal transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="driver">Driver</option>
                <option value="chef">Chef</option>
                <option value="security">Security</option>
                <option value="concierge">Concierge</option>
                <option value="cleaning">Cleaning</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Specialties</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {formData.specialties.map((spec, i) => (
                <span key={i} className="flex items-center gap-1 text-[10px] font-medium text-charcoal/50 bg-charcoal/5 px-2 py-1 rounded-full">
                  {spec}
                  <button type="button" onClick={() => handleRemoveSpecialty(spec)} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="Add specialty..."
                className="flex-1 px-3 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
              <button
                type="button"
                onClick={handleAddSpecialty}
                className="px-4 py-2 bg-charcoal/5 text-charcoal font-bold text-xs uppercase rounded-lg hover:bg-charcoal/10 transition-colors"
              >
                Add
              </button>
            </div>
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
              {staff ? 'Update Staff' : 'Add Staff'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
