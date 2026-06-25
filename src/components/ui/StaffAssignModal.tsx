import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserCheck, Star, Clock, ChevronRight } from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  status: string;
  initials: string;
  certifications: string[];
  specializations: string[];
  rating: number;
  availabilityFrom?: string;
  currentAssignment?: string;
}

interface StaffAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (staffId: string) => void | Promise<void>;
  staff: StaffMember[];
  bookingInfo?: {
    title: string;
    guestName: string;
    date: string;
  };
  isLoading?: boolean;
}

export default function StaffAssignModal({
  isOpen,
  onClose,
  onAssign,
  staff,
  bookingInfo,
  isLoading: externalLoading,
}: StaffAssignModalProps) {
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const loading = externalLoading ?? isProcessing;

  const availableStaff = staff.filter(s => s.status !== 'off_duty');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on_duty': return { bg: 'bg-green-100', text: 'text-green-700', label: 'ON-DUTY' };
      case 'available': return { bg: 'bg-primary-container/20', text: 'text-primary', label: 'AVAILABLE' };
      default: return { bg: 'bg-surface-container', text: 'text-secondary', label: status.toUpperCase() };
    }
  };

  const handleAssign = async () => {
    if (!selectedStaffId) return;
    setIsProcessing(true);
    try {
      await onAssign(selectedStaffId);
      setSelectedStaffId(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-parchment rounded-2xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-charcoal">Assign Staff</h3>
              </div>
              {!loading && (
                <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-container transition-colors">
                  <X className="w-4 h-4 text-secondary" />
                </button>
              )}
            </div>

            {bookingInfo && (
              <div className="bg-white rounded-xl p-4 mb-4 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Task</span>
                  <span className="font-bold">{bookingInfo.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Guest</span>
                  <span className="font-bold">{bookingInfo.guestName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal/60">Date</span>
                  <span className="font-bold">{bookingInfo.date}</span>
                </div>
              </div>
            )}

            <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-3">
              Available Staff ({availableStaff.length})
            </p>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {availableStaff.map(member => {
                const badge = getStatusBadge(member.status);
                const isSelected = selectedStaffId === member.id;
                return (
                  <motion.button
                    key={member.id}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedStaffId(member.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left border ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-transparent hover:bg-surface-container'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      {member.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-on-surface truncate">{member.name}</p>
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 text-primary fill-current" />
                          <span className="text-[10px] font-bold">{member.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[10px] text-secondary capitalize">{member.role}</p>
                        {member.currentAssignment && (
                          <>
                            <span className="text-[8px] text-secondary">•</span>
                            <p className="text-[10px] text-primary truncate">{member.currentAssignment}</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>
                      {isSelected && <ChevronRight className="w-4 h-4 text-primary" />}
                    </div>
                  </motion.button>
                );
              })}
              {availableStaff.length === 0 && (
                <div className="p-8 text-center">
                  <Clock className="w-8 h-8 text-secondary/30 mx-auto mb-2" />
                  <p className="text-sm text-secondary">No staff available right now.</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 mt-4 border-t border-outline-variant/10">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-3 text-charcoal/60 font-bold text-xs uppercase tracking-widest hover:text-charcoal transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={!selectedStaffId || loading}
                className="flex-[2] py-3 bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    Assign Staff
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
