import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  DollarSign, Clock, CheckCircle, XCircle, AlertCircle,
  TrendingUp, Calendar, CreditCard, Building, Send,
  RefreshCw, Eye, FileText
} from 'lucide-react';
import { useAuth } from '../auth';
import { useDatabase } from '../hooks/useDatabase';
import api from '../services/api';
import { showToast } from './ui/Toast';
import UniversalModal from './ui/UniversalModal';

interface Withdrawal {
  _id: string;
  reference: string;
  amount: number;
  method: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  bankDetails?: any;
  notes?: string;
  adminNotes?: string;
  rejectionReason?: string;
  requestedAt: string;
  reviewedAt?: string;
  completedAt?: string;
}

interface WithdrawalRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  availableBalance: number;
}

export default function WithdrawalRequestModal({
  isOpen,
  onClose,
  onSuccess,
  availableBalance
}: WithdrawalRequestModalProps) {
  const { currentUser } = useAuth();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank_transfer');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum < 1000) {
      showToast({ type: 'error', title: 'Invalid Amount', message: 'Minimum withdrawal is ₦1,000' });
      return;
    }

    if (amountNum > availableBalance) {
      showToast({ type: 'error', title: 'Insufficient Balance', message: `Available balance: ₦${availableBalance.toLocaleString()}` });
      return;
    }

    if (method === 'bank_transfer' && (!bankName || !accountNumber || !accountName)) {
      showToast({ type: 'error', title: 'Missing Details', message: 'Please fill in all bank details' });
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/admin/withdrawals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          amount: amountNum,
          method,
          bankDetails: method === 'bank_transfer' ? {
            bankName,
            accountNumber,
            accountName
          } : null,
          notes
        })
      });

      const result = await response.json();

      if (result.success) {
        showToast({
          type: 'success',
          title: 'Withdrawal Requested',
          message: `₦${amountNum.toLocaleString()} withdrawal request submitted`
        });
        setAmount('');
        setBankName('');
        setAccountNumber('');
        setAccountName('');
        setNotes('');
        onSuccess?.();
        onClose();
      } else {
        showToast({ type: 'error', title: 'Error', message: result.message || 'Failed to submit request' });
      }
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Network error. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <UniversalModal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Withdrawal"
      size="md"
    >
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-charcoal/60">Available Balance</span>
            <span className="text-xl font-bold text-green-600">₦{availableBalance.toLocaleString()}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">
              Amount (₦) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="1000"
              max={availableBalance}
              required
              className="w-full px-4 py-3 border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
            <p className="text-xs text-charcoal/50 mt-1">Minimum: ₦1,000</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">
              Withdrawal Method <span className="text-red-500">*</span>
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-4 py-3 border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
            >
              <option value="bank_transfer">Bank Transfer</option>
              <option value="mobile_money">Mobile Money</option>
            </select>
          </div>

          {method === 'bank_transfer' && (
            <div className="space-y-3 p-4 bg-charcoal/5 rounded-xl">
              <h4 className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Bank Details</h4>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Bank Name"
                required
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Account Number"
                required
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="Account Name"
                required
                className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes..."
              rows={3}
              className="w-full px-4 py-3 border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 py-3 border border-charcoal/10 text-charcoal font-bold text-xs uppercase rounded-xl hover:bg-charcoal/5 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-[2] py-3 bg-gold text-charcoal font-bold text-xs uppercase rounded-xl hover:bg-gold-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </UniversalModal>
  );
}

export function WithdrawalHistory() {
  const { currentUser } = useAuth();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);

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

  const totalWithdrawn = withdrawals
    .filter(w => w.status === 'completed')
    .reduce((sum, w) => sum + w.amount, 0);

  const totalPending = withdrawals
    .filter(w => w.status === 'pending' || w.status === 'processing')
    .reduce((sum, w) => sum + w.amount, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-xl border border-charcoal/5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-charcoal/60 uppercase tracking-wider">Total Withdrawn</p>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-xl font-bold text-green-600">₦{totalWithdrawn.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-charcoal/5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-charcoal/60 uppercase tracking-wider">Pending</p>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-xl font-bold text-amber-600">₦{totalPending.toLocaleString()}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-charcoal/20 mx-auto mb-3 animate-spin" />
          <p className="text-sm text-charcoal/50">Loading withdrawal history...</p>
        </div>
      ) : withdrawals.length === 0 ? (
        <div className="text-center py-12">
          <DollarSign className="w-12 h-12 text-charcoal/20 mx-auto mb-3" />
          <p className="text-sm text-charcoal/50">No withdrawal requests yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {withdrawals.map((withdrawal) => {
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
                    <p className="text-xs font-mono text-charcoal/50">{withdrawal.reference}</p>
                    <p className="text-lg font-bold text-charcoal mt-1">₦{withdrawal.amount.toLocaleString()}</p>
                  </div>
                  <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${status.bg} ${status.text}`}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </span>
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
        onClose={() => setSelectedWithdrawal(null)}
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
              <div>
                <p className="text-xs text-charcoal/50 mb-1">Status</p>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusBadge(selectedWithdrawal.status).bg} ${getStatusBadge(selectedWithdrawal.status).text}`}>
                  {selectedWithdrawal.status}
                </span>
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
                <p className="text-xs text-charcoal/50 mb-1">Notes</p>
                <p className="text-sm text-charcoal">{selectedWithdrawal.notes}</p>
              </div>
            )}

            {selectedWithdrawal.adminNotes && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Admin Notes</p>
                <p className="text-sm text-charcoal">{selectedWithdrawal.adminNotes}</p>
              </div>
            )}

            {selectedWithdrawal.rejectionReason && (
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2">Rejection Reason</p>
                <p className="text-sm text-charcoal">{selectedWithdrawal.rejectionReason}</p>
              </div>
            )}

            {selectedWithdrawal.completedAt && (
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <p className="text-xs text-charcoal/50 mb-1">Completed</p>
                <p className="text-sm font-semibold text-green-700">{new Date(selectedWithdrawal.completedAt).toLocaleString()}</p>
              </div>
            )}
          </div>
        )}
      </UniversalModal>
    </div>
  );
}
