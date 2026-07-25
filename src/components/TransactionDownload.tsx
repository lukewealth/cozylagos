import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Download, FileText, Calendar, Filter, Search, DollarSign,
  TrendingUp, TrendingDown, CheckCircle, Clock, XCircle
} from 'lucide-react';
import { useDatabase } from '../hooks/useDatabase';
import { useAuth } from '../auth';

interface Transaction {
  id: string;
  date: string;
  reference: string;
  type: 'booking_revenue' | 'payout' | 'refund' | 'redemption';
  amount: number;
  status: 'pending' | 'processed';
  description: string;
  userId: string;
  bookingId?: string;
  createdAt: string;
}

export default function TransactionDownload() {
  const { currentUser } = useAuth();
  const { data: transactions } = useDatabase('transactions');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = (transactions as any[]).filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    
    let matchesDate = true;
    if (dateRange.start) {
      matchesDate = matchesDate && new Date(tx.date) >= new Date(dateRange.start);
    }
    if (dateRange.end) {
      matchesDate = matchesDate && new Date(tx.date) <= new Date(dateRange.end);
    }

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const totalRevenue = filteredTransactions
    .filter(tx => tx.type === 'booking_revenue')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalPayouts = filteredTransactions
    .filter(tx => tx.type === 'payout')
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const totalRefunds = filteredTransactions
    .filter(tx => tx.type === 'refund')
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const handleDownloadCSV = () => {
    const headers = ['Date', 'Reference', 'Type', 'Amount', 'Status', 'Description', 'User ID'];
    const rows = filteredTransactions.map(tx => [
      tx.date,
      tx.reference,
      tx.type,
      tx.amount.toString(),
      tx.status,
      tx.description,
      tx.userId,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    // Create a simple HTML report for PDF
    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Transaction Report - ${new Date().toLocaleDateString()}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; }
          .summary { display: flex; gap: 20px; margin: 20px 0; }
          .summary-item { padding: 15px; background: #f5f5f5; border-radius: 8px; flex: 1; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #f9f9f9; font-weight: bold; }
          .amount-positive { color: green; }
          .amount-negative { color: red; }
        </style>
      </head>
      <body>
        <h1>Transaction Report</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <p>Date Range: ${dateRange.start || 'All'} to ${dateRange.end || 'All'}</p>
        
        <div class="summary">
          <div class="summary-item">
            <h3>Total Revenue</h3>
            <p class="amount-positive">₦${totalRevenue.toLocaleString()}</p>
          </div>
          <div class="summary-item">
            <h3>Total Payouts</h3>
            <p class="amount-negative">₦${totalPayouts.toLocaleString()}</p>
          </div>
          <div class="summary-item">
            <h3>Total Refunds</h3>
            <p class="amount-negative">₦${totalRefunds.toLocaleString()}</p>
          </div>
          <div class="summary-item">
            <h3>Net Amount</h3>
            <p>₦${(totalRevenue - totalPayouts - totalRefunds).toLocaleString()}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Reference</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            ${filteredTransactions.map(tx => `
              <tr>
                <td>${tx.date}</td>
                <td>${tx.reference}</td>
                <td>${tx.type}</td>
                <td class="${tx.amount >= 0 ? 'amount-positive' : 'amount-negative'}">
                  ₦${Math.abs(tx.amount).toLocaleString()}
                </td>
                <td>${tx.status}</td>
                <td>${tx.description}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transaction_report_${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const types = ['all', 'booking_revenue', 'payout', 'refund', 'redemption'];
  const statuses = ['all', 'pending', 'processed'];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold text-charcoal">Transaction Reports</h2>
          <p className="text-sm text-charcoal/60 mt-1">Download and manage financial transactions</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-4 py-2 bg-charcoal text-parchment font-bold text-xs tracking-wider uppercase rounded-lg hover:bg-gold-dark transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-charcoal font-bold text-xs tracking-wider uppercase rounded-lg hover:bg-gold-dark transition-all"
          >
            <FileText className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-charcoal/5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-charcoal/60 uppercase tracking-wider">Total Revenue</p>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">₦{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-charcoal/5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-charcoal/60 uppercase tracking-wider">Total Payouts</p>
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600">₦{totalPayouts.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-charcoal/5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-charcoal/60 uppercase tracking-wider">Total Refunds</p>
            <XCircle className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-orange-600">₦{totalRefunds.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-charcoal/5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-charcoal/60 uppercase tracking-wider">Net Amount</p>
            <DollarSign className="w-5 h-5 text-gold-dark" />
          </div>
          <p className="text-2xl font-bold text-gold-dark">
            ₦{(totalRevenue - totalPayouts - totalRefunds).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-charcoal/5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
          >
            {types.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type.replace('_', ' ').charAt(0).toUpperCase() + type.slice(1)}
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
          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="flex-1 px-3 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              placeholder="Start date"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="flex-1 px-3 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              placeholder="End date"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal/10">
                <th className="text-left py-3 px-4 text-xs font-bold text-charcoal/60 uppercase tracking-wider">Date</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-charcoal/60 uppercase tracking-wider">Reference</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-charcoal/60 uppercase tracking-wider">Type</th>
                <th className="text-right py-3 px-4 text-xs font-bold text-charcoal/60 uppercase tracking-wider">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-charcoal/60 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-bold text-charcoal/60 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx: any) => (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-charcoal/5 hover:bg-charcoal/5 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-charcoal">{tx.date}</td>
                  <td className="py-3 px-4 text-sm font-mono text-charcoal/80">{tx.reference}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      tx.type === 'booking_revenue' ? 'bg-green-100 text-green-700' :
                      tx.type === 'payout' ? 'bg-blue-100 text-blue-700' :
                      tx.type === 'refund' ? 'bg-orange-100 text-orange-700' :
                      'bg-charcoal/5 text-charcoal/70'
                    }`}>
                      {tx.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className={`py-3 px-4 text-sm font-bold text-right ${
                    tx.amount >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ₦{Math.abs(tx.amount).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`flex items-center gap-1 text-xs font-bold ${
                      tx.status === 'processed' ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {tx.status === 'processed' ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-charcoal/60">{tx.description}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-charcoal/20 mx-auto mb-4" />
            <p className="text-lg font-semibold text-charcoal mb-2">No transactions found</p>
            <p className="text-sm text-charcoal/50">Adjust your filters or date range</p>
          </div>
        )}
      </div>
    </div>
  );
}
