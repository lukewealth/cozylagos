import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users, Plus, Edit3, Trash2, Search, Filter, X, Check,
  Mail, Phone, Shield, Star, Calendar, Ban, Unlock
} from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';
import { useAuth } from '../auth';
import { ToastContainer, showToast } from './ui/Toast';
import { AdminCard, AdminButton, AdminStatCard, AdminBadge, AdminSearch, AdminEmptyState } from './ui';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'guest' | 'user' | 'admin' | 'service_provider' | 'super_admin';
  status: 'active' | 'inactive' | 'suspended';
  phone?: string;
  avatar?: string;
  verified: boolean;
  loyaltyPoints: number;
  createdAt: string;
  lastLogin: string;
}

export default function UserManagement() {
  const { currentUser } = useAuth();
  const { data: users, addRecord, updateRecord, removeRecord } = useDatabase('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filteredUsers = (users as any[]).filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = async (userData: any) => {
    try {
      const newUser = {
        ...userData,
        id: `user-${Date.now()}`,
        verified: false,
        loyaltyPoints: 0,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      await addRecord(newUser);
      setShowCreateModal(false);
      showToast({ type: 'success', title: 'User Created', message: `${newUser.name} has been added` });
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to create user' });
    }
  };

  const handleUpdateUser = async (userId: string, updates: any) => {
    try {
      await updateRecord(userId, updates);
      setEditingUser(null);
      showToast({ type: 'success', title: 'User Updated', message: 'Changes saved successfully' });
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to update user' });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await removeRecord(userId);
      setShowDeleteConfirm(null);
      showToast({ type: 'success', title: 'User Removed', message: 'User has been removed' });
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to remove user' });
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    await handleUpdateUser(user.id, { status: newStatus });
    showToast({ 
      type: 'success', 
      title: newStatus === 'active' ? 'User Activated' : 'User Suspended',
      message: `${user.name} has been ${newStatus}` 
    });
  };

  const roles = ['all', 'guest', 'user', 'admin', 'service_provider', 'super_admin'];
  const statuses = ['all', 'active', 'inactive', 'suspended'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">User Management</h2>
          <p className="text-sm text-charcoal/60 mt-1">Manage all users across the platform</p>
        </div>
        <AdminButton
          variant="primary"
          icon={Plus}
          onClick={() => setShowCreateModal(true)}
        >
          Add User
        </AdminButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdminStatCard
          title="Total Users"
          value={users.length}
          icon={Users}
          iconColor="text-blue-600"
        />
        <AdminStatCard
          title="Active"
          value={users.filter((u: any) => u.status === 'active').length}
          icon={Check}
          iconColor="text-green-600"
        />
        <AdminStatCard
          title="Suspended"
          value={users.filter((u: any) => u.status === 'suspended').length}
          icon={Ban}
          iconColor="text-red-600"
        />
        <AdminStatCard
          title="Verified"
          value={users.filter((u: any) => u.verified).length}
          icon={Shield}
          iconColor="text-gold-dark"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <AdminSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search users..."
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
        >
          {roles.map(role => (
            <option key={role} value={role}>
              {role === 'all' ? 'All Roles' : role.replace('_', ' ').charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
        >
          {statuses.map(status => (
            <option key={status} value={status}>
              {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-charcoal/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal/10">
                <th className="text-left py-3 px-4 text-xs font-bold text-charcoal/60 uppercase tracking-wider">User</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-charcoal/60 uppercase tracking-wider">Role</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-charcoal/60 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-charcoal/60 uppercase tracking-wider">Verified</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-charcoal/60 uppercase tracking-wider">Loyalty Points</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-charcoal/60 uppercase tracking-wider">Last Login</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-charcoal/60 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user: any) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-charcoal/5 hover:bg-charcoal/5 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-gold-dark">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-charcoal text-sm">{user.name}</p>
                        <p className="text-xs text-charcoal/60">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <AdminBadge
                      variant={
                        user.role === 'super_admin' ? 'danger' :
                        user.role === 'admin' ? 'warning' :
                        user.role === 'service_provider' ? 'info' :
                        'default'
                      }
                      size="sm"
                    >
                      {user.role.replace('_', ' ')}
                    </AdminBadge>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`flex items-center gap-1 text-xs font-bold ${
                      user.status === 'active' ? 'text-green-600' :
                      user.status === 'suspended' ? 'text-red-600' :
                      'text-charcoal/40'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        user.status === 'active' ? 'bg-green-500' :
                        user.status === 'suspended' ? 'bg-red-500' :
                        'bg-charcoal/20'
                      }`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {user.verified ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-charcoal/30" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-right text-sm font-bold text-gold-dark">
                    {user.loyaltyPoints?.toLocaleString() || 0}
                  </td>
                  <td className="py-3 px-4 text-xs text-charcoal/60">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="p-2 text-charcoal/40 hover:text-gold-dark transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`p-2 transition-colors ${
                          user.status === 'active' 
                            ? 'text-orange-500 hover:text-orange-600' 
                            : 'text-green-500 hover:text-green-600'
                        }`}
                        title={user.status === 'active' ? 'Suspend' : 'Activate'}
                      >
                        {user.status === 'active' ? <Ban className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(user.id)}
                        className="p-2 text-charcoal/40 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-charcoal/20 mx-auto mb-4" />
            <p className="text-lg font-semibold text-charcoal mb-2">No users found</p>
            <p className="text-sm text-charcoal/50">Adjust your filters or add a new user</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <UserFormModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateUser}
          />
        )}
        {editingUser && (
          <UserFormModal
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSubmit={(data) => handleUpdateUser(editingUser.id, data)}
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
              <h3 className="font-serif text-xl font-bold text-charcoal mb-2">Delete User?</h3>
              <p className="text-sm text-charcoal/60 mb-6">This action cannot be undone. All user data will be permanently deleted.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-charcoal/10 text-charcoal font-bold text-xs uppercase rounded-lg hover:bg-charcoal/5 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(showDeleteConfirm)}
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

function UserFormModal({ user, onClose, onSubmit }: {
  user?: User;
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    role: user?.role || 'user',
    status: user?.status || 'active',
    verified: user?.verified || false,
    loyaltyPoints: user?.loyaltyPoints || 0,
  });

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
            {user ? 'Edit User' : 'Add New User'}
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
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="guest">Guest</option>
                <option value="user">User</option>
                <option value="service_provider">Service Provider</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
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
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Loyalty Points</label>
              <input
                type="number"
                value={formData.loyaltyPoints}
                onChange={(e) => setFormData({ ...formData, loyaltyPoints: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.verified}
                  onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                  className="w-4 h-4 rounded border-charcoal/20 text-gold focus:ring-gold/50"
                />
                <span className="text-sm text-charcoal">Verified</span>
              </label>
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
              {user ? 'Update User' : 'Add User'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
