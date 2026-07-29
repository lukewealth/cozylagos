import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Plus, Search, Filter, X, Check, Clock, AlertCircle, Send, User, Mail } from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';
import { useAuth } from '../auth';
import api from '../services/api';
import { ToastContainer, showToast } from './ui/Toast';
import { AdminCard, AdminButton, AdminStatCard, AdminBadge, AdminSearch, AdminEmptyState, AdminTabs, AdminModal } from './ui';

interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: string;
  updatedAt: string;
  responses: TicketResponse[];
}

interface TicketResponse {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  message: string;
  createdAt: string;
}

export default function AdminSupportManagement() {
  const { currentUser } = useAuth();
  const { data: tickets, addRecord, updateRecord } = useDatabase('tickets' as any);
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const filteredTickets = (tickets as any[] || []).filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeTab === 'all' || ticket.status === activeTab;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: tickets?.length || 0,
    open: (tickets as any[] || []).filter((t: any) => t.status === 'open').length,
    inProgress: (tickets as any[] || []).filter((t: any) => t.status === 'in_progress').length,
    resolved: (tickets as any[] || []).filter((t: any) => t.status === 'resolved').length,
    urgent: (tickets as any[] || []).filter((t: any) => t.priority === 'urgent').length,
  };

  const handleUpdateStatus = async (ticketId: string, status: SupportTicket['status']) => {
    try {
      await updateRecord(ticketId, { status, updatedAt: new Date().toISOString() });
      
      try {
        await api.crm.updateTicket(ticketId, { status });
      } catch (error) {
        console.error('API sync failed:', error);
      }
      
      showToast({ type: 'success', title: 'Status Updated', message: `Ticket status changed to ${status}` });
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to update ticket status' });
    }
  };

  const handleSendResponse = async () => {
    if (!selectedTicket || !responseMessage.trim()) return;

    try {
      const response: TicketResponse = {
        id: `resp-${Date.now()}`,
        senderId: currentUser?.id || 'admin',
        senderName: currentUser?.name || 'Admin',
        senderRole: 'admin',
        message: responseMessage,
        createdAt: new Date().toISOString(),
      };

      const updatedTicket = {
        ...selectedTicket,
        responses: [...(selectedTicket.responses || []), response],
        status: 'in_progress' as const,
        updatedAt: new Date().toISOString(),
      };

      await updateRecord(selectedTicket.id, updatedTicket);
      
      try {
        await api.crm.updateTicket(selectedTicket.id, { 
          responses: updatedTicket.responses,
          status: 'in_progress'
        });
      } catch (error) {
        console.error('API sync failed:', error);
      }
      
      setSelectedTicket(updatedTicket);
      setResponseMessage('');
      setShowResponseModal(false);
      showToast({ type: 'success', title: 'Response Sent', message: 'Your response has been sent to the user' });
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to send response' });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      open: 'info',
      in_progress: 'warning',
      resolved: 'success',
      closed: 'default'
    };
    return variants[status as keyof typeof variants] || 'default';
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: 'default',
      medium: 'info',
      high: 'warning',
      urgent: 'danger'
    };
    return variants[priority as keyof typeof variants] || 'default';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm sm:text-base md:text-lg font-serif font-bold text-charcoal">Support Management</h2>
          <p className="text-xs sm:text-sm text-charcoal/60 mt-1">Manage customer support tickets and responses</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <AdminStatCard
          title="Total Tickets"
          value={stats.total}
          icon={MessageSquare}
          iconColor="text-blue-600"
        />
        <AdminStatCard
          title="Open"
          value={stats.open}
          icon={AlertCircle}
          iconColor="text-blue-600"
        />
        <AdminStatCard
          title="In Progress"
          value={stats.inProgress}
          icon={Clock}
          iconColor="text-orange-600"
        />
        <AdminStatCard
          title="Resolved"
          value={stats.resolved}
          icon={Check}
          iconColor="text-green-600"
        />
        <AdminStatCard
          title="Urgent"
          value={stats.urgent}
          icon={AlertCircle}
          iconColor="text-red-600"
        />
      </div>

      <AdminTabs
        tabs={[
          { id: 'all', label: 'All' },
          { id: 'open', label: 'Open' },
          { id: 'in_progress', label: 'In Progress' },
          { id: 'resolved', label: 'Resolved' },
          { id: 'closed', label: 'Closed' }
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <AdminSearch
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search tickets..."
          />
        </div>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredTickets.map((ticket: any) => (
          <AdminCard
            key={ticket.id}
            className="hover:shadow-lg cursor-pointer"
            onClick={() => setSelectedTicket(ticket)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-serif text-lg font-bold text-charcoal min-w-0 truncate">{ticket.subject}</h3>
                  <AdminBadge variant={getPriorityBadge(ticket.priority)} size="sm">
                    {ticket.priority}
                  </AdminBadge>
                  <AdminBadge variant={getStatusBadge(ticket.status)} size="sm">
                    {ticket.status.replace('_', ' ')}
                  </AdminBadge>
                </div>
                <p className="text-sm text-charcoal/60 line-clamp-2">{ticket.message}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-charcoal/50">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {ticket.userName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {ticket.userEmail}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {ticket.responses && ticket.responses.length > 0 && (
              <div className="mt-3 pt-3 border-t border-charcoal/5">
                <p className="text-xs text-charcoal/50">
                  {ticket.responses.length} {ticket.responses.length === 1 ? 'response' : 'responses'}
                </p>
              </div>
            )}

            <div className="flex gap-2 mt-4 pt-4 border-t border-charcoal/5">
              <AdminButton
                variant="primary"
                size="sm"
                icon={Send}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTicket(ticket);
                  setShowResponseModal(true);
                }}
              >
                Respond
              </AdminButton>
              {ticket.status === 'open' && (
                <AdminButton
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateStatus(ticket.id, 'in_progress');
                  }}
                >
                  Start Working
                </AdminButton>
              )}
              {ticket.status === 'in_progress' && (
                <AdminButton
                  variant="success"
                  size="sm"
                  icon={Check}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpdateStatus(ticket.id, 'resolved');
                  }}
                >
                  Resolve
                </AdminButton>
              )}
            </div>
          </AdminCard>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <AdminEmptyState
          icon={MessageSquare}
          title="No support tickets found"
          description="Support tickets will appear here when users submit them"
        />
      )}

      <AdminModal
        isOpen={showResponseModal}
        onClose={() => {
          setShowResponseModal(false);
          setResponseMessage('');
        }}
        title="Send Response"
        size="md"
      >
        <div className="space-y-4">
          {selectedTicket && (
            <div className="bg-charcoal/5 rounded-lg p-4">
              <h4 className="font-bold text-charcoal mb-2">{selectedTicket.subject}</h4>
              <p className="text-sm text-charcoal/60">{selectedTicket.message}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-charcoal/50">
                <User className="w-3 h-3" />
                <span>{selectedTicket.userName}</span>
              </div>
            </div>
          )}

          {selectedTicket?.responses && selectedTicket.responses.length > 0 && (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {selectedTicket.responses.map((response: TicketResponse) => (
                <div
                  key={response.id}
                  className={`p-3 rounded-lg ${
                    response.senderRole === 'admin' 
                      ? 'bg-gold/10 border border-gold/20' 
                      : 'bg-charcoal/5'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-charcoal">{response.senderName}</span>
                    <AdminBadge variant={response.senderRole === 'admin' ? 'warning' : 'default'} size="sm">
                      {response.senderRole}
                    </AdminBadge>
                    <span className="text-xs text-charcoal/50">
                      {new Date(response.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-charcoal">{response.message}</p>
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">
              Your Response
            </label>
            <textarea
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              rows={4}
              placeholder="Type your response here..."
              className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <AdminButton
              variant="ghost"
              onClick={() => {
                setShowResponseModal(false);
                setResponseMessage('');
              }}
              className="flex-1"
            >
              Cancel
            </AdminButton>
            <AdminButton
              variant="primary"
              icon={Send}
              onClick={handleSendResponse}
              disabled={!responseMessage.trim()}
              className="flex-1"
            >
              Send Response
            </AdminButton>
          </div>
        </div>
      </AdminModal>

      <AdminModal
        isOpen={!!selectedTicket && !showResponseModal}
        onClose={() => setSelectedTicket(null)}
        title="Ticket Details"
        size="lg"
      >
        {selectedTicket && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <AdminBadge variant={getPriorityBadge(selectedTicket.priority)} size="md">
                {selectedTicket.priority}
              </AdminBadge>
              <AdminBadge variant={getStatusBadge(selectedTicket.status)} size="md">
                {selectedTicket.status.replace('_', ' ')}
              </AdminBadge>
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-charcoal mb-2">{selectedTicket.subject}</h3>
              <p className="text-sm text-charcoal/60">{selectedTicket.message}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-charcoal/50 uppercase tracking-wider mb-1">User</p>
                <p className="font-bold text-charcoal">{selectedTicket.userName}</p>
              </div>
              <div>
                <p className="text-xs text-charcoal/50 uppercase tracking-wider mb-1">Email</p>
                <p className="font-bold text-charcoal">{selectedTicket.userEmail}</p>
              </div>
              <div>
                <p className="text-xs text-charcoal/50 uppercase tracking-wider mb-1">Created</p>
                <p className="font-bold text-charcoal">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-charcoal/50 uppercase tracking-wider mb-1">Last Updated</p>
                <p className="font-bold text-charcoal">{new Date(selectedTicket.updatedAt).toLocaleString()}</p>
              </div>
            </div>

            {selectedTicket.responses && selectedTicket.responses.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold text-charcoal">Responses ({selectedTicket.responses.length})</h4>
                {selectedTicket.responses.map((response: TicketResponse) => (
                  <div
                    key={response.id}
                    className={`p-4 rounded-lg ${
                      response.senderRole === 'admin' 
                        ? 'bg-gold/10 border border-gold/20' 
                        : 'bg-charcoal/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-bold text-charcoal">{response.senderName}</span>
                      <AdminBadge variant={response.senderRole === 'admin' ? 'warning' : 'default'} size="sm">
                        {response.senderRole}
                      </AdminBadge>
                      <span className="text-xs text-charcoal/50">
                        {new Date(response.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-charcoal">{response.message}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-charcoal/10">
              <AdminButton
                variant="primary"
                icon={Send}
                onClick={() => setShowResponseModal(true)}
              >
                Send Response
              </AdminButton>
              {selectedTicket.status !== 'resolved' && (
                <AdminButton
                  variant="success"
                  icon={Check}
                  onClick={() => {
                    handleUpdateStatus(selectedTicket.id, 'resolved');
                    setSelectedTicket(null);
                  }}
                >
                  Mark Resolved
                </AdminButton>
              )}
              <AdminButton
                variant="ghost"
                onClick={() => setSelectedTicket(null)}
              >
                Close
              </AdminButton>
            </div>
          </div>
        )}
      </AdminModal>

      <ToastContainer />
    </div>
  );
}
