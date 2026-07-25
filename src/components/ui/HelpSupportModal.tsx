import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, Send, Clock, CheckCircle, AlertCircle, HelpCircle, FileText, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../auth';
import { showToast } from '../../components/ui/Toast';

interface Ticket {
  id: string;
  ticketId: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: string;
  updatedAt: string;
  responses?: Array<{
    text: string;
    author: string;
    authorName: string;
    createdAt: string;
  }>;
}

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpSupportModal({ isOpen, onClose }: HelpSupportModalProps) {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'tickets' | 'new' | 'faq'>('tickets');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'general',
    priority: 'medium' as const,
  });

  useEffect(() => {
    if (isOpen) {
      fetchTickets();
    }
  }, [isOpen]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const result = await api.crm.getTickets({ userId: currentUser?.id });
      if (result.success && result.data) {
        setTickets(result.data as Ticket[]);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.title || !newTicket.description) return;

    try {
      const result = await api.crm.createTicket({
        title: newTicket.title,
        description: newTicket.description,
        category: newTicket.category,
        priority: newTicket.priority,
        userId: currentUser?.id,
      });

      if (result.success) {
        showToast({ type: 'success', title: 'Ticket Created', message: 'Your support ticket has been submitted' });
        setNewTicket({ title: '', description: '', category: 'general', priority: 'medium' });
        setActiveTab('tickets');
        fetchTickets();
      }
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to create ticket' });
    }
  };

  const handleReply = async (ticketId: string) => {
    if (!replyText.trim()) return;

    try {
      await api.crm.updateTicket(ticketId, {
        response: {
          text: replyText,
          author: currentUser?.id,
          authorName: currentUser?.name || 'User',
        },
      });

      setReplyText('');
      fetchTickets();
      showToast({ type: 'success', title: 'Reply Sent', message: 'Your reply has been added' });
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to send reply' });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Open' };
      case 'in_progress': return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'In Progress' };
      case 'resolved': return { bg: 'bg-green-100', text: 'text-green-700', label: 'Resolved' };
      case 'closed': return { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Closed' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-600', label: status };
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent': return { bg: 'bg-red-100', text: 'text-red-700' };
      case 'high': return { bg: 'bg-orange-100', text: 'text-orange-700' };
      case 'medium': return { bg: 'bg-blue-100', text: 'text-blue-700' };
      case 'low': return { bg: 'bg-slate-100', text: 'text-slate-600' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-600' };
    }
  };

  const faqs = [
    { q: 'How do I add a new service?', a: 'Go to "My Services" and click "Create Service". Fill in the details and submit.' },
    { q: 'How do I assign staff to a booking?', a: 'In the booking requests section, click "Assign Staff" and select from available staff.' },
    { q: 'How do I track my earnings?', a: 'Navigate to the "Earnings" section to view your financial reports and transaction history.' },
    { q: 'How do I update my availability?', a: 'Go to "Schedule" to manage your calendar and availability settings.' },
    { q: 'How do I contact admin support?', a: 'Use this help center to create a support ticket. Our team will respond within 24 hours.' },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-5 border-b border-outline-variant/10 flex items-center justify-between bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-on-surface">Help & Support</h2>
                <p className="text-xs text-secondary">Get assistance from our admin team</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-container transition-colors">
              <X className="w-5 h-5 text-secondary" />
            </button>
          </div>

          <div className="flex border-b border-outline-variant/10">
            {[
              { id: 'tickets', label: 'My Tickets', icon: FileText },
              { id: 'new', label: 'New Ticket', icon: MessageSquare },
              { id: 'faq', label: 'FAQ', icon: HelpCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all relative ${
                    activeTab === tab.id ? 'text-primary' : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="helpTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'tickets' && (
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3"
                    />
                    <p className="text-secondary text-sm">Loading tickets...</p>
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-secondary/30 mx-auto mb-3" />
                    <p className="text-secondary text-sm">No support tickets yet</p>
                    <button
                      onClick={() => setActiveTab('new')}
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                    >
                      Create Your First Ticket
                    </button>
                  </div>
                ) : (
                  tickets.map((ticket) => {
                    const statusBadge = getStatusBadge(ticket.status);
                    const priorityBadge = getPriorityBadge(ticket.priority);
                    const isExpanded = expandedTicket === ticket.id;

                    return (
                      <motion.div
                        key={ticket.id}
                        layout
                        className="bg-surface-container-lowest border border-outline-variant/10 rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)}
                          className="w-full p-4 flex items-start justify-between gap-4 text-left hover:bg-surface-container-low/50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-[10px] font-mono text-secondary">{ticket.ticketId}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${statusBadge.bg} ${statusBadge.text}`}>
                                {statusBadge.label}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${priorityBadge.bg} ${priorityBadge.text}`}>
                                {ticket.priority}
                              </span>
                            </div>
                            <h4 className="font-semibold text-on-surface truncate">{ticket.title}</h4>
                            <p className="text-xs text-secondary mt-1 line-clamp-1">{ticket.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-[10px] text-secondary">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(ticket.createdAt).toLocaleDateString()}
                              </span>
                              <span className="capitalize">{ticket.category}</span>
                              {ticket.responses && ticket.responses.length > 0 && (
                                <span className="text-primary">{ticket.responses.length} replies</span>
                              )}
                            </div>
                          </div>
                          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                            <ChevronDown className="w-4 h-4 text-secondary" />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 border-t border-outline-variant/10 pt-4">
                                <div className="bg-surface-container-low rounded-lg p-4 mb-4">
                                  <p className="text-sm text-on-surface whitespace-pre-wrap">{ticket.description}</p>
                                </div>

                                {ticket.responses && ticket.responses.length > 0 && (
                                  <div className="space-y-3 mb-4">
                                    <p className="text-xs font-bold text-secondary uppercase tracking-wider">Responses</p>
                                    {ticket.responses.map((response, idx) => (
                                      <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="bg-primary/5 border border-primary/10 rounded-lg p-3"
                                      >
                                        <div className="flex items-center gap-2 mb-1">
                                          <span className="text-xs font-bold text-primary">{response.authorName}</span>
                                          <span className="text-[10px] text-secondary">
                                            {new Date(response.createdAt).toLocaleString()}
                                          </span>
                                        </div>
                                        <p className="text-sm text-on-surface">{response.text}</p>
                                      </motion.div>
                                    ))}
                                  </div>
                                )}

                                {ticket.status !== 'closed' && (
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                      placeholder="Add a reply..."
                                      className="flex-1 px-3 py-2 border border-outline-variant/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    />
                                    <button
                                      onClick={() => handleReply(ticket.id)}
                                      disabled={!replyText.trim()}
                                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                    >
                                      <Send className="w-3.5 h-3.5" />
                                      Reply
                                    </button>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === 'new' && (
              <form onSubmit={handleSubmitTicket} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                    placeholder="Brief description of your issue"
                    className="w-full px-4 py-3 border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Category</label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                      className="w-full px-4 py-3 border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Issue</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="account">Account Settings</option>
                      <option value="booking">Booking Issue</option>
                      <option value="service">Service Problem</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Priority</label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as any })}
                      className="w-full px-4 py-3 border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    required
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    placeholder="Provide detailed information about your issue or question..."
                    rows={6}
                    className="w-full px-4 py-3 border border-outline-variant/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('tickets')}
                    className="flex-1 px-4 py-3 border border-outline-variant/20 text-on-surface font-semibold text-sm rounded-xl hover:bg-surface-container transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-3 bg-primary text-white font-semibold text-sm rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit Ticket
                  </motion.button>
                </div>
              </form>
            )}

            {activeTab === 'faq' && (
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-4"
                  >
                    <h4 className="font-semibold text-on-surface text-sm mb-2 flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      {faq.q}
                    </h4>
                    <p className="text-sm text-secondary ml-6">{faq.a}</p>
                  </motion.div>
                ))}

                <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-xl">
                  <h4 className="font-semibold text-on-surface text-sm mb-3">Need more help?</h4>
                  <div className="space-y-2 text-sm text-secondary">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <span>support@cozylagos.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>+234 800 COZY LAGOS</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
