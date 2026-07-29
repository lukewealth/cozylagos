import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckSquare, Square, Plus, Users, Calendar, Clock, AlertCircle, Check,
  X, Edit2, Trash2, Filter, Search, Package, Wrench, Car, Utensils, Camera
} from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';
import UniversalModal from './ui/UniversalModal';
import { dbGetAll, dbPut, dbDelete, generateId } from '../db';

interface SPTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  checklist: ChecklistItem[];
  dueDate: string;
  assetId?: string;
  assetName?: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface Asset {
  id: string;
  name: string;
  category: string;
  status: string;
  assetCode: string;
}

export default function SPTaskManagement({ providerId }: { providerId: string }) {
  const { data: allUsers } = useDatabase('users');
  const staff = allUsers.filter(u => u.role === 'admin' || u.role === 'service_provider' || u.role === 'super_admin');
  const { data: servicesData } = useDatabase('services');
  const assets = servicesData.map(s => ({ ...s, name: s.title, assetCode: s.id }));
  const [tasks, setTasks] = useState<SPTask[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<SPTask | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const dbTasks = await dbGetAll('tasks');
      setTasks(dbTasks as SPTask[]);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: Omit<SPTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: SPTask = {
      ...taskData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    try {
      await dbPut('tasks', newTask);
      await loadTasks();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<SPTask>) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTask = {
      ...task,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    try {
      await dbPut('tasks', updatedTask);
      await loadTasks();
      setEditingTask(null);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await dbDelete('tasks', taskId);
      await loadTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleToggleChecklistItem = async (taskId: string, itemId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedChecklist = task.checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    const completedCount = updatedChecklist.filter(i => i.completed).length;
    const newStatus = completedCount === updatedChecklist.length && updatedChecklist.length > 0
      ? 'completed'
      : completedCount > 0 ? 'in_progress' : 'pending';

    const updatedTask = {
      ...task,
      checklist: updatedChecklist,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    try {
      await dbPut('tasks', updatedTask);
      await loadTasks();
    } catch (error) {
      console.error('Failed to toggle checklist item:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.assignedToName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = ['all', 'maintenance', 'cleaning', 'delivery', 'setup', 'inspection', 'other'];

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    assetsInUse: new Set(tasks.filter(t => t.assetId && t.status !== 'completed').map(t => t.assetId)).size,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Task Management</h2>
          <p className="text-sm text-charcoal/60 mt-1">Manage staff tasks and asset assignments</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-charcoal font-bold text-xs tracking-wider uppercase rounded-lg hover:bg-gold-dark transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-charcoal/5">
          <p className="text-xs text-charcoal/60 uppercase tracking-wider">Total</p>
          <p className="text-2xl font-bold text-charcoal mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-charcoal/5">
          <p className="text-xs text-charcoal/60 uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-charcoal/5">
          <p className="text-xs text-charcoal/60 uppercase tracking-wider">In Progress</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-charcoal/5">
          <p className="text-xs text-charcoal/60 uppercase tracking-wider">Completed</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-charcoal/5">
          <p className="text-xs text-charcoal/60 uppercase tracking-wider">Assets In Use</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{stats.assetsInUse}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
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

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-sm text-charcoal/60">Loading tasks...</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {filteredTasks.map(task => (
              <SPTaskCard
                key={task.id}
                task={task}
                onToggleChecklist={handleToggleChecklistItem}
                onEdit={() => setEditingTask(task)}
                onDelete={() => handleDeleteTask(task.id)}
              />
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-16">
              <CheckSquare className="w-16 h-16 text-charcoal/20 mx-auto mb-4" />
              <p className="text-lg font-semibold text-charcoal mb-2">No tasks found</p>
              <p className="text-sm text-charcoal/50">Create a task to get started</p>
            </div>
          )}
        </>
      )}

      <AnimatePresence>
        {showCreateModal && (
          <SPTaskFormModal
            staff={staff}
            assets={assets}
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateTask}
          />
        )}
        {editingTask && (
          <SPTaskFormModal
            staff={staff}
            assets={assets}
            task={editingTask}
            onClose={() => setEditingTask(null)}
            onSubmit={(data) => handleUpdateTask(editingTask.id, data)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SPTaskCard({ task, onToggleChecklist, onEdit, onDelete }: React.PropsWithChildren<{
  key?: React.Key;
  task: SPTask;
  onToggleChecklist: (taskId: string, itemId: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}>) {
  const priorityColors = {
    low: 'bg-slate-100 text-slate-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
  };

  const statusColors = {
    pending: 'bg-slate-100 text-slate-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-slate-100 text-slate-500',
  };

  const completedCount = task.checklist.filter(i => i.completed).length;
  const progress = task.checklist.length > 0 ? (completedCount / task.checklist.length) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-charcoal/5 rounded-xl p-5 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-serif text-lg font-bold text-charcoal">{task.title}</h3>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColors[task.status]}`}>
              {task.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-sm text-charcoal/60 mb-2">{task.description}</p>
          <div className="flex items-center gap-4 text-xs text-charcoal/50">
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{task.assignedToName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
            {task.assetName && (
              <div className="flex items-center gap-1">
                <Package className="w-3.5 h-3.5" />
                <span>{task.assetName}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="p-2 text-charcoal/40 hover:text-gold-dark transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-2 text-charcoal/40 hover:text-red-500 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {task.checklist.length > 0 && (
        <div className="mt-4 pt-4 border-t border-charcoal/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">
              Checklist ({completedCount}/{task.checklist.length})
            </span>
            <span className="text-xs text-charcoal/50">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-charcoal/5 rounded-full h-1.5 mb-3">
            <div
              className="bg-gold h-1.5 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="space-y-2">
            {task.checklist.map(item => (
              <label key={item.id} className="flex items-center gap-2 cursor-pointer group">
                <button
                  onClick={() => onToggleChecklist(task.id, item.id)}
                  className="flex-shrink-0"
                >
                  {item.completed ? (
                    <CheckSquare className="w-4 h-4 text-gold-dark" />
                  ) : (
                    <Square className="w-4 h-4 text-charcoal/30 group-hover:text-charcoal/50" />
                  )}
                </button>
                <span className={`text-sm ${item.completed ? 'line-through text-charcoal/40' : 'text-charcoal'}`}>
                  {item.text}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function SPTaskFormModal({ staff, assets, task, onClose, onSubmit }: {
  staff: any[];
  assets: any[];
  task?: SPTask;
  onClose: () => void;
  onSubmit: (data: Omit<SPTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
}) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    assignedTo: task?.assignedTo || '',
    assignedToName: task?.assignedToName || '',
    priority: task?.priority || 'medium' as const,
    status: task?.status || 'pending' as const,
    checklist: task?.checklist || [],
    dueDate: task?.dueDate || new Date().toISOString().split('T')[0],
    assetId: task?.assetId || '',
    assetName: task?.assetName || '',
    category: task?.category || 'maintenance',
  });

  const [newChecklistItem, setNewChecklistItem] = useState('');

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setFormData({
        ...formData,
        checklist: [...formData.checklist, { id: `item-${Date.now()}`, text: newChecklistItem, completed: false }],
      });
      setNewChecklistItem('');
    }
  };

  const handleRemoveChecklistItem = (itemId: string) => {
    setFormData({
      ...formData,
      checklist: formData.checklist.filter(item => item.id !== itemId),
    });
  };

  const handleStaffSelect = (staffId: string) => {
    const staffMember = staff.find(s => s.id === staffId);
    if (staffMember) {
      setFormData({
        ...formData,
        assignedTo: staffId,
        assignedToName: staffMember.name,
      });
    }
  };

  const handleAssetSelect = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    if (asset) {
      setFormData({
        ...formData,
        assetId: assetId,
        assetName: asset.name,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <UniversalModal
      isOpen={true}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
      size="lg"
      variant="auto"
    >
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Assign To</label>
              <select
                value={formData.assignedTo}
                onChange={(e) => handleStaffSelect(e.target.value)}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                required
              >
                <option value="">Select staff member</option>
                {staff.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="maintenance">Maintenance</option>
                <option value="cleaning">Cleaning</option>
                <option value="delivery">Delivery</option>
                <option value="setup">Setup</option>
                <option value="inspection">Inspection</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Asset (Optional)</label>
              <select
                value={formData.assetId}
                onChange={(e) => handleAssetSelect(e.target.value)}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="">No asset</option>
                {assets.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.assetCode})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Due Date</label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Checklist</label>
            <div className="space-y-2 mb-2">
              {formData.checklist.map(item => (
                <div key={item.id} className="flex items-center gap-2">
                  <span className="flex-1 text-sm text-charcoal">{item.text}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklistItem(item.id)}
                    className="p-1 text-charcoal/40 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                placeholder="Add checklist item..."
                className="flex-1 px-3 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
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
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
    </UniversalModal>
  );
}
