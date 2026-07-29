import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  DollarSign, Clock, CheckCircle, XCircle, AlertCircle,
  TrendingUp, Calendar, CreditCard, Building, Send,
  RefreshCw, Eye, FileText, Search, Filter, Download
} from 'lucide-react';
import { useAuth } from '../auth';
import api from '../services/api';
import { showToast } from './ui/Toast';
import UniversalModal from './ui/UniversalModal';
import { AdminCard, AdminButton, AdminBadge, AdminSearch, AdminEmptyState } from './ui';

interface Withdrawal {
  _id: string;
  reference: string;
  providerId: string;
  providerName: string;
  providerEmail: string;
  amount: number;
  method: string;
  bankDetails?: any;
  notes?: string;
  adminNotes?: string;
  rejectionReason?: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  requestedAt: string;
  reviewedAt?: string;
  completedAt?: string;
}

export default function AdminWithdrawalManagement() {
  const { currentUser } = useAuth();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'complete' | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/withdrawals', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setWithdrawals(result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async () => {
    if (!selectedWithdrawal || !actionType) return;

    setIsProcessing(true);
    try {
      const updateData: any = {
        id: selectedWithdrawal._id,
        status: actionType === 'approve' ? 'processing' : actionType === 'complete' ? 'completed' : 'rejected'
      };

      if (adminNotes) updateData.adminNotes = adminNotes;
      if (rejectionReason) updateData.rejectionReason = rejectionReason;

      const response = await fetch('/api/admin/withdrawals', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();

      if (result.success) {
        showToast({
          type: 'success',
          title: 'Success',
          message: `Withdrawal ${actionType === 'approve' ? 'approved' : actionType === 'complete' ? 'marked as completed' : 'rejected'} successfully`
        });
        setShowActionModal(false);
        setSelectedWithdrawal(null);
        setActionType(null);
        setAdminNotes('');
        setRejectionReason('');
        fetchWithdrawals();
      } else {
        showToast({ type: 'error', title: 'Error', message: result.message || 'Failed to update withdrawal' });
      }
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Network error. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock, label: 'PENDING' };
      case 'processing':
        return { bg: 'bg-blue-100', text: 'text-blue-700', icon: RefreshCw, label: 'PROCESSING' };
      case 'completed':
        return { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'COMPLETED' };
      case 'rejected':
        return { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'REJECTED' };
      default:
        return { bg: 'bg-charcoal/5', text: 'text-charcoal/60', icon: Clock, label: status.toUpperCase() };
    }
  };

  const filteredWithdrawals = withdrawals.filter(w => {
    const matchesSearch = w.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         w.providerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         w.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: withdrawals.length,
    pending: withdrawals.filter(w => w.status === 'pending').length,
    processing: withdrawals.filter(w => w.status === 'processing').length,
    completed: withdrawals.filter(w => w.status === 'completed').length,
    rejected: withdrawals.filter(w => w.status === 'rejected').length,
    totalAmount: withdrawals.reduce((sum, w) => sum + w.amount, 0),
    pendingAmount: withdrawals.filter(w => w.status === 'pending' || w.status === 'processing').reduce((sum, w) => sum + w.amount, 0),
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base md:text-lg font-serif font-bold text-charcoal">Withdrawal Requests</h2>
          <p className="text-xs sm:text-sm text-charcoal/60 mt-1">Manage service provider withdrawal requests</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-charcoal/5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] sm:text-xs text-charcoal/60 uppercase tracking-wider">Total Requests</p>
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
          <p className="text-lg sm:text-2xl font-bold text-charcoal">{stats.total}</p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-charcoal/5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] sm:text-xs text-charcoal/60 uppercase tracking-wider">Pending</p>
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
          </div>
          <p className="text-lg sm:text-2xl font-bold text-amber-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-charcoal/5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] sm:text-xs text-charcoal/60 uppercase tracking-wider">Completed</p>
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
          </div>
          <p className="text-lg sm:text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-charcoal/5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] sm:text-xs text-charcoal/60 uppercase tracking-wider">Pending Amount</p>
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-gold-dark" />
          </div>
          <p className="text-lg sm:text-2xl font-bold text-gold-dark break-all">₦{stats.pendingAmount.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <AdminSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name, email, or reference..."
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-charcoal/20 mx-auto mb-3 animate-spin" />
          <p className="text-sm text-charcoal/50">Loading withdrawals...</p>
        </div>
      ) : filteredWithdrawals.length === 0 ? (
        <AdminEmptyState
          icon={DollarSign}
          title="No withdrawal requests"
          description="Withdrawal requests from service providers will appear here"
        />
      ) : (
        <div className="space-y-3">
          {filteredWithdrawals.map((withdrawal) => {
            const status = getStatusBadge(withdrawal.status);
            const StatusIcon = status.icon;
            return (
              <motion.div
                key={withdrawal._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-4 rounded-xl border border-charcoal/5 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedWithdrawal(withdrawal)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-charcoal">{withdrawal.providerName}</p>
                    <p className="text-xs text-charcoal/60">{withdrawal.providerEmail}</p>
                    <p className="text-xs font-mono text-charcoal/50 mt-1">{withdrawal.reference}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-charcoal">₦{withdrawal.amount.toLocaleString()}</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${status.bg} ${status.text}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-charcoal/50">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(withdrawal.requestedAt).toLocaleDateString()}</span>
                  <span className="mx-1">•</span>
                  <CreditCard className="w-3 h-3" />
                  <span className="capitalize">{withdrawal.method.replace('_', ' ')}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <UniversalModal
        isOpen={!!selectedWithdrawal}
        onClose={() => {
          setSelectedWithdrawal(null);
          setShowActionModal(false);
          setActionType(null);
          setAdminNotes('');
          setRejectionReason('');
        }}
        title="Withdrawal Details"
        size="md"
      >
        {selectedWithdrawal && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-gold/10 to-amber-50 p-4 rounded-xl">
              <p className="text-xs text-charcoal/60 mb-1">Amount</p>
              <p className="text-2xl font-bold text-charcoal">₦{selectedWithdrawal.amount.toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-charcoal/50 mb-1">Provider</p>
                <p className="text-sm font-bold text-charcoal">{selectedWithdrawal.providerName}</p>
                <p className="text-xs text-charcoal/60">{selectedWithdrawal.providerEmail}</p>
              </div>
              <div>
                <p className="text-xs text-charcoal/50 mb-1">Reference</p>
                <p className="text-sm font-mono text-charcoal">{selectedWithdrawal.reference}</p>
              </div>
              <div>
                <p className="text-xs text-charcoal/50 mb-1">Method</p>
                <p className="text-sm text-charcoal capitalize">{selectedWithdrawal.method.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-xs text-charcoal/50 mb-1">Requested</p>
                <p className="text-sm text-charcoal">{new Date(selectedWithdrawal.requestedAt).toLocaleString()}</p>
              </div>
            </div>

            {selectedWithdrawal.bankDetails && (
              <div className="bg-charcoal/5 p-4 rounded-xl">
                <p className="text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">Bank Details</p>
                <div className="space-y-1 text-sm">
                  <p><span className="text-charcoal/50">Bank:</span> {selectedWithdrawal.bankDetails.bankName}</p>
                  <p><span className="text-charcoal/50">Account:</span> {selectedWithdrawal.bankDetails.accountNumber}</p>
                  <p><span className="text-charcoal/50">Name:</span> {selectedWithdrawal.bankDetails.accountName}</p>
                </div>
              </div>
            )}

            {selectedWithdrawal.notes && (
              <div>
                <p className="text-xs text-charcoal/50 mb-1">Provider Notes</p>
                <p className="text-sm text-charcoal">{selectedWithdrawal.notes}</p>
              </div>
            )}

            {(selectedWithdrawal.status === 'pending' || selectedWithdrawal.status === 'processing') && (
              <div className="flex gap-2 pt-4">
                {selectedWithdrawal.status === 'pending' && (
                  <button
                    onClick={() => {
                      setActionType('approve');
                      setShowActionModal(true);
                    }}
                    className="flex-1 py-3 bg-green-600 text-white font-bold text-xs uppercase rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                )}
                {selectedWithdrawal.status === 'processing' && (
                  <button
                    onClick={() => {
                      setActionType('complete');
                      setShowActionModal(true);
                    }}
                    className="flex-1 py-3 bg-blue-600 text-white font-bold text-xs uppercase rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Complete
                  </button>
                )}
                <button
                  onClick={() => {
                    setActionType('reject');
                    setShowActionModal(true);
                  }}
                  className="flex-1 py-3 bg-red-600 text-white font-bold text-xs uppercase rounded-xl hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            )}
          </div>
        )}
      </UniversalModal>

      <UniversalModal
        isOpen={showActionModal}
        onClose={() => {
          setShowActionModal(false);
          setActionType(null);
          setAdminNotes('');
          setRejectionReason('');
        }}
        title={actionType === 'approve' ? 'Approve Withdrawal' : actionType === 'complete' ? 'Complete Withdrawal' : 'Reject Withdrawal'}
        size="sm"
      >
        <div className="space-y-4">
          {actionType === 'reject' ? (
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection..."
                rows={4}
                className="w-full px-4 py-3 border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">
                Admin Notes (Optional)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add any notes..."
                rows={4}
                className="w-full px-4 py-3 border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setShowActionModal(false);
                setActionType(null);
                setAdminNotes('');
                setRejectionReason('');
              }}
              disabled={isProcessing}
              className="flex-1 py-3 border border-charcoal/10 text-charcoal font-bold text-xs uppercase rounded-xl hover:bg-charcoal/5 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAction}
              disabled={isProcessing || (actionType === 'reject' && !rejectionReason.trim())}
              className={`flex-[2] py-3 font-bold text-xs uppercase rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${
                actionType === 'reject'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : actionType === 'complete'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {actionType === 'approve' && <CheckCircle className="w-4 h-4" />}
                  {actionType === 'complete' && <CheckCircle className="w-4 h-4" />}
                  {actionType === 'reject' && <XCircle className="w-4 h-4" />}
                  {actionType === 'approve' ? 'Approve' : actionType === 'complete' ? 'Complete' : 'Reject'}
                </>
              )}
            </button>
          </div>
        </div>
      </UniversalModal>
    </div>
  );
}
