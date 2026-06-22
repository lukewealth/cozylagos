import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Bed, DollarSign, Plus, Calendar, ListFilter, ClipboardCheck, EyeOff, Wrench, ShieldAlert, BadgeCheck } from 'lucide-react';
import { Listing, Booking, Transaction } from '../types';

interface OwnerDashboardProps {
  listings: Listing[];
  bookings: Booking[];
  transactions: Transaction[];
  onAddListingClick: () => void;
  onUpdateListingsStatus: (id: string, active: boolean) => void;
}

export default function OwnerDashboardView({
  listings,
  bookings,
  transactions,
  onAddListingClick,
  onUpdateListingsStatus
}: OwnerDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'listings' | 'calendar' | 'payouts'>('overview');
  const [blockedDates, setBlockedDates] = useState<string[]>(["2024-10-08", "2024-10-09"]);
  const [payoutSuccess, setPayoutSuccess] = useState<boolean>(false);

  // Month mock days for October 2024 (exact date from mockups)
  const calendarDays = useMemo(() => {
    const days = [];
    // Start offset is Tuesday (October 1st, 2024)
    // Add grayed out September days (29, 30)
    days.push({ dayNum: "29", dateStr: "2024-09-29", isCurrentMonth: false });
    days.push({ dayNum: "30", dateStr: "2024-09-30", isCurrentMonth: false });

    // October 1 - 31
    for (let i = 1; i <= 31; i++) {
      const dateStr = `2024-10-${i.toString().padStart(2, '0')}`;
      let bookedLabel = "";
      let bookedType: "J. Doe" | "Blocked" | "Pending" | "None" = "None";

      if (i >= 3 && i <= 5) {
        bookedLabel = i === 5 ? "J. Doe Checkout" : "J. Doe";
        bookedType = "J. Doe";
      } else if (blockedDates.includes(dateStr)) {
        bookedLabel = "Blocked";
        bookedType = "Blocked";
      } else if (i === 15 || i === 16) {
        bookedLabel = "Pending";
        bookedType = "Pending";
      }

      days.push({
        dayNum: i.toString(),
        dateStr,
        isCurrentMonth: true,
        bookedLabel,
        bookedType
      });
    }

    // November fill-in days
    for (let i = 1; i <= 9; i++) {
       days.push({ dayNum: i.toString(), dateStr: `2024-11-${i}`, isCurrentMonth: false });
    }

    return days;
  }, [blockedDates]);

  // Chart data
  const chartData = [
    { name: 'Jan', Revenue: 15 },
    { name: 'Feb', Revenue: 21 },
    { name: 'Mar', Revenue: 18 },
    { name: 'Apr', Revenue: 28 },
    { name: 'May', Revenue: 34 },
    { name: 'Jun', Revenue: 42 }
  ];

  const handleDayCellClick = (dateStr: string) => {
    setBlockedDates(prev => 
      prev.includes(dateStr) ? prev.filter(d => d !== dateStr) : [...prev, dateStr]
    );
  };

  const handleWithdrawalRequest = () => {
    setPayoutSuccess(true);
    setTimeout(() => setPayoutSuccess(false), 6000);
  };

  return (
    <div className="flex-grow flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden text-left bg-parchment animate-fade-in-up">
      
      {/* 1. LEFT CONTEXTUAL LISTINGS SIDEBAR (width 64) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-charcoal/5 p-6 shrink-0 h-full justify-between">
        <div className="space-y-8">
          <div>
            <span className="text-gold-dark font-bold text-[9px] tracking-[0.25em] uppercase block mb-1">Owner Area</span>
            <h3 className="font-serif text-[18px] font-bold text-charcoal">Emeka Anene</h3>
            <p className="text-[10px] text-charcoal/40 font-mono mt-0.5">ESTABLISHED 2024</p>
          </div>

          <nav className="flex flex-col gap-2 font-bold text-xs uppercase tracking-wider">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeSubTab === 'overview' 
                  ? 'bg-gold/10 text-gold-dark' 
                  : 'text-charcoal-light hover:bg-gold/5'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveSubTab('listings')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeSubTab === 'listings' 
                  ? 'bg-gold/10 text-gold-dark' 
                  : 'text-charcoal-light hover:bg-gold/5'
              }`}
            >
              <Bed className="w-4 h-4" />
              <span>Properties</span>
            </button>

            <button
              onClick={() => setActiveSubTab('calendar')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeSubTab === 'calendar' 
                  ? 'bg-gold/10 text-gold-dark' 
                  : 'text-charcoal-light hover:bg-gold/5'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Calendar Grid</span>
            </button>

            <button
              onClick={() => setActiveSubTab('payouts')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeSubTab === 'payouts' 
                  ? 'bg-gold/10 text-gold-dark' 
                  : 'text-charcoal-light hover:bg-gold/5'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Payout Ledger</span>
            </button>
          </nav>
        </div>

        <button 
          onClick={onAddListingClick}
          className="w-full bg-gold hover:bg-charcoal text-charcoal hover:text-parchment font-bold text-[10px] tracking-widest uppercase py-3.5 rounded-xl transition-colors flex justify-center items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Home</span>
        </button>
      </aside>

      {/* 2. DEEP SUB-VIEW DISPLAY SLOT */}
      <section className="flex-grow h-full overflow-y-auto p-6 md:p-10 xl:p-12">
        <div className="max-w-[1140px] mx-auto space-y-10">

          {/* PORTAL NAV FOR RESPONSIVE PHONES */}
          <div className="md:hidden flex overflow-x-auto gap-3 pb-2 border-b border-charcoal/5">
            {['overview', 'listings', 'calendar', 'payouts'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab as any)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  activeSubTab === tab ? 'bg-gold text-charcoal' : 'bg-white text-charcoal-light'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ============================================================== */}
          {/* TAB A: OVERVIEW SYSTEM */}
          {activeSubTab === 'overview' && (
            <div className="space-y-10 animate-fade-in-up">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
                <div>
                  <h1 className="font-serif text-3.5xl md:text-5xl font-bold text-charcoal">Welcome Back, Emeka</h1>
                  <p className="text-sm text-charcoal-light mt-1">Lekki &amp; Ikoyi premium pipeline is performing optimally.</p>
                </div>
                <button
                  onClick={onAddListingClick}
                  className="sm:hidden w-full bg-gold text-charcoal font-bold text-[10px] tracking-widest uppercase py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Onboard Listing</span>
                </button>
              </div>

              {/* Analytics bento */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-white border border-charcoal/5 p-6 rounded-2.5xl flex flex-col justify-between h-40 shadow-sm relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">MTD Rental revenue</span>
                    <TrendingUp className="w-5 h-5 text-gold-dark" />
                  </div>
                  <div>
                    <h3 className="font-serif text-3xl font-bold text-charcoal">₦4,250,000</h3>
                    <span className="text-xs text-green-600 font-semibold">+12% vs last month</span>
                  </div>
                </div>

                <div className="bg-white border border-charcoal/5 p-6 rounded-2.5xl flex flex-col justify-between h-40 shadow-sm relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">Occupancy rate</span>
                    <ClipboardCheck className="w-5 h-5 text-gold-dark" />
                  </div>
                  <div>
                    <h3 className="font-serif text-3xl font-bold text-charcoal">84%</h3>
                    <span className="text-xs text-green-600 font-semibold">+5.2% average occupancy</span>
                  </div>
                </div>

                <div className="bg-white border border-charcoal/5 p-6 rounded-2.5xl flex flex-col justify-between h-40 shadow-sm relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">Average Daily Rate</span>
                    <DollarSign className="w-5 h-5 text-gold-dark" />
                  </div>
                  <div>
                    <h3 className="font-serif text-3xl font-bold text-charcoal">₦185,000</h3>
                    <span className="text-xs text-charcoal/50">Steady across enclaves</span>
                  </div>
                </div>

              </div>

              {/* Chart & bookings grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Recharts card (8/12th) */}
                <div className="lg:col-span-8 bg-white border border-charcoal/5 p-6 rounded-3xl shadow-sm flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif text-lg font-bold text-charcoal">Property Performance (M NGN)</h3>
                    <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">H1 2026 Earnings</span>
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <XAxis dataKey="name" stroke="#1A1C1C" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#1A1C1C" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ fill: 'rgba(212,175,55,0.05)' }} contentStyle={{ backgroundColor: '#FAF9F8', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px' }} />
                        <Bar dataKey="Revenue" fill="#D4AF37" radius={[4, 4, 0, 0]} barSize={28} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Right task manager card (4/12th) */}
                <div className="lg:col-span-4 bg-white border border-charcoal/5 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
                  <div className="space-y-4">
                    <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-charcoal border-b border-charcoal/5 pb-2">
                      Operations Dashboard
                    </h4>
                    
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-3.5 text-xs text-charcoal-light">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-400 shrink-0" />
                        <span>AC Cleaning schedule Bourdillon &bull; Today 3 PM</span>
                      </div>
                      <div className="flex items-center gap-3.5 text-xs text-charcoal-light">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                        <span>Generator diesel check-off completed &bull; Ikoyi</span>
                      </div>
                      <div className="flex items-center gap-3.5 text-xs text-charcoal-light font-bold text-gold-dark">
                        <span className="w-2.5 h-2.5 rounded-full bg-gold shrink-0 animate-ping" />
                        <span>₦1.8M Expected bank payout clearances</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-charcoal/5">
                    <button 
                      onClick={() => setActiveSubTab('calendar')}
                      className="w-full py-3 bg-charcoal hover:bg-gold-dark text-parchment font-bold text-[9px] tracking-widest uppercase rounded-xl transition-all"
                    >
                      Audit Availability Blocks
                    </button>
                  </div>
                </div>

              </div>

              {/* Table Segment: Recent Bookings list */}
              <div className="bg-white border border-charcoal/5 p-6 rounded-3xl shadow-sm">
                <h3 className="font-serif text-lg font-bold text-charcoal mb-6">Recent Bookings Ledger</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-charcoal/10 text-[9px] font-bold text-charcoal/40 uppercase tracking-widest">
                        <th className="pb-3 text-left">GUEST PROFILE</th>
                        <th className="pb-3">RESIDENCE</th>
                        <th className="pb-3 text-center">STAY TARGETS</th>
                        <th className="pb-3 text-right">PAYOUT VALUE</th>
                        <th className="pb-3 text-right">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs text-charcoal-light font-medium divide-y divide-charcoal/5">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-parchment/30 transition-colors">
                          <td className="py-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-gold/5">
                              {b.guestAvatar ? (
                                <img src={b.guestAvatar} alt={b.guestName} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-gold-dark">U</div>
                              )}
                            </div>
                            <div>
                              <span className="block font-bold text-charcoal">{b.guestName}</span>
                              <span className="text-[10px] text-charcoal/40 font-mono tracking-wider">{b.guestEmail}</span>
                            </div>
                          </td>
                          <td>{b.listingTitle}</td>
                          <td className="text-center font-mono text-[11px]">{b.checkIn} to {b.checkOut}</td>
                          <td className="text-right font-serif text-charcoal font-bold">₦{b.totalAmount.toLocaleString()}</td>
                          <td className="text-right">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                              b.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-gold/5 text-gold-dark border border-gold/10'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB B: MY PROPERTIES LISTINGS */}
          {activeSubTab === 'listings' && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="flex justify-between items-center pb-4 border-b border-charcoal/5">
                <div>
                  <h1 className="font-serif text-3xl font-bold text-charcoal">Residences Index ({listings.length})</h1>
                  <p className="text-sm text-charcoal-light mt-1">Review active enclaves, check-outs, or toggle listing visibilities.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((stay) => (
                  <article key={stay.id} className="bg-white border border-charcoal/5 rounded-2.5xl overflow-hidden shadow-sm flex flex-col justify-between">
                    <div className="relative aspect-[16/10] bg-charcoal w-full">
                      <img src={stay.image} alt={stay.title} className="w-full h-full object-cover" />
                      
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full font-bold text-[9px] tracking-widest uppercase backdrop-blur-md ${
                          stay.isActive 
                            ? 'bg-emerald-500/90 text-white' 
                            : 'bg-charcoal/80 text-parchment/60'
                        }`}>
                          {stay.isActive ? "ACTIVE PORTAL" : "HIDDEN PORTAL"}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-serif text-lg font-bold text-charcoal line-clamp-1">{stay.title}</h4>
                        <span className="font-serif text-sm font-bold text-gold-dark inline-block shrink-0">
                          ₦{(stay.nightlyRate / 1000).toFixed(0)}k/nt
                        </span>
                      </div>
                      
                      <p className="text-xs text-charcoal-light line-clamp-2">{stay.description}</p>

                      <div className="flex items-center gap-4 text-xs font-semibold text-charcoal-light pt-2">
                        <span>{stay.bedrooms} Suite units</span>
                        <span>&larr;</span>
                        <span>Match {stay.aiMatchPercent}%</span>
                      </div>
                    </div>

                    {/* Toggle action button */}
                    <div className="p-6 border-t border-charcoal/5 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => onUpdateListingsStatus(stay.id, !stay.isActive)}
                        className={`py-2 px-3 text-[9px] font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-1.5 border transition-all ${
                          stay.isActive 
                            ? 'border-charcoal/20 text-charcoal hover:bg-red-50 hover:text-red-700' 
                            : 'bg-gold/10 border-gold/20 text-gold-dark hover:scale-105'
                        }`}
                      >
                        {stay.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                        <span>{stay.isActive ? "HIDE STAY" : "SHOW STAY"}</span>
                      </button>

                      <button
                        onClick={() => setActiveSubTab('calendar')}
                        className="py-2 px-3 border border-charcoal/10 hover:border-charcoal text-charcoal hover:bg-parchment/30 text-[9px] font-bold uppercase tracking-widest rounded-lg transition-colors"
                      >
                        Avails Calendar
                      </button>
                    </div>

                  </article>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB C: INTERACTIVE AVAILABILITY CALENDAR */}
          {activeSubTab === 'calendar' && (
            <div className="space-y-6 animate-fade-in-up">
              
              <div className="border-b border-charcoal/5 pb-4">
                <span className="text-gold-dark font-bold text-[9px] tracking-[0.3em] uppercase block mb-1">
                  Owner Suite
                </span>
                <h2 className="font-serif text-3xl font-semibold text-charcoal">Availability Board</h2>
                <p className="text-sm text-charcoal-light mt-1">
                  October 2024 &bull; Switch dates availability index. Tap on a day to Toggle Owner Block / Free.
                </p>
              </div>

              {/* Legend checklist */}
              <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-wider text-charcoal-light">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-gold/15 rounded-md border border-gold-dark/30 inline-block" />
                  <span>J. Doe Booking (Oct 3 - Oct 5)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-gold/75 rounded-md inline-block" />
                  <span>Sarah Smith Pending Request</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-100 border border-red-200 rounded-md inline-block" />
                  <span>System Blocks (E.g. Oct 8-9 maintenance)</span>
                </div>
              </div>

              {/* Month board body */}
              <div className="bg-white border border-charcoal/5 rounded-3xl p-6 shadow-sm">
                
                {/* Headers */}
                <div className="grid grid-cols-7 gap-3 mb-4 text-center text-[10px] font-bold tracking-widest text-charcoal/40 uppercase">
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                </div>

                {/* Days Grid cells */}
                <div className="grid grid-cols-7 gap-3">
                  {calendarDays.map((day, idx) => {
                    const isBlocked = blockedDates.includes(day.dateStr);

                    return (
                      <div
                        key={idx}
                        onClick={() => day.isCurrentMonth && handleDayCellClick(day.dateStr)}
                        className={`aspect-square p-2.5 rounded-xl border flex flex-col justify-between transition-all select-none ${
                          day.isCurrentMonth 
                            ? 'cursor-pointer hover:border-gold-dark' 
                            : 'opacity-30 bg-parchment/60 pointer-events-none'
                        } ${
                          day.bookedType === 'J. Doe' ? 'bg-gold/15 border-gold-dark/20' : 
                          day.bookedType === 'Pending' ? 'bg-gold/30 border-gold shadow-[0_0_10px_rgba(212,175,55,0.25)]' :
                          isBlocked ? 'bg-red-50 border-red-100 text-red-700' : 'bg-parchment/20 border-charcoal/5'
                        }`}
                      >
                        <span className={`text-xs font-mono font-bold ${
                          isBlocked ? 'text-red-700' : 'text-charcoal'
                        }`}>
                          {day.dayNum}
                        </span>

                        {day.bookedLabel && (
                          <div className={`text-[8px] font-bold uppercase tracking-wider py-0.5 px-1.5 rounded truncate ${
                            day.bookedType === 'J. Doe' ? 'bg-white text-gold-dark' :
                            day.bookedType === 'Pending' ? 'bg-charcoal text-parchment' :
                            'bg-red-600 text-white'
                          }`} title={day.bookedLabel}>
                            {day.bookedLabel}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* Maintenance info footer popup */}
              <div className="bg-red-50 border border-red-100 p-5 rounded-2xl flex items-start gap-4">
                <Wrench className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-sm font-bold text-red-800">Scheduled HVAC Maintenance Alert</h4>
                  <p className="text-xs text-red-700 mt-1 max-w-xl">
                    AC maintenance is booked for October 8 &amp; 9. This corresponds to the blocked calendar cells shown above. Ensure access keys are cleared.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB D: FINANCIAL PAYOUTS & EARNINGS */}
          {activeSubTab === 'payouts' && (
            <div className="space-y-10 animate-fade-in-up">
              
              <div className="border-b border-charcoal/5 pb-4">
                <span className="text-gold-dark font-bold text-[9px] tracking-[0.3em] uppercase block mb-1">
                  Secured Wallet
                </span>
                <h2 className="font-serif text-3xl font-semibold text-charcoal">Payouts &amp; Revenues ledger</h2>
                <p className="text-sm text-charcoal-light mt-1">Monitor processed booking balances, requested bank payouts, and active ledgers.</p>
              </div>

              {/* Financial balances */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-charcoal text-parchment p-6 rounded-2.5xl flex flex-col justify-between h-44 shadow-lg gold-inner-glow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold-dark/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-parchment/40 uppercase tracking-widest">Available Wallet balance</span>
                    <DollarSign className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-serif text-3xl font-bold text-white">₦12,450,000</h3>
                    <span className="text-[10px] text-gold-light mt-1 font-semibold block">Cleared &bull; Instant GTBank Withdrawal</span>
                  </div>
                </div>

                <div className="bg-white border border-charcoal/5 p-6 rounded-2.5xl flex flex-col justify-between h-44 shadow-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest">Total gross earnings</span>
                    <TrendingUp className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-serif text-3xl font-bold text-charcoal">₦48,200,000</h3>
                    <span className="text-xs text-charcoal/50">Cumulative MTD index</span>
                  </div>
                </div>

                <div className="bg-white border text-charcoal border-charcoal/5 border-l-4 border-l-gold-dark p-6 rounded-2.5xl flex flex-col justify-between h-44 shadow-sm">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-charcoal/40 uppercase tracking-widest font-bold">Pending clear escrow</span>
                    <ShieldAlert className="w-5 h-5 text-gold-dark" />
                  </div>
                  <div>
                    <h3 className="font-serif text-3xl font-bold text-charcoal">₦1,850,000</h3>
                    <span className="text-xs text-charcoal/50">Expected clear: 2-3 business days</span>
                  </div>
                </div>

              </div>

              {/* Intervene modal banner */}
              {payoutSuccess ? (
                <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2.5xl text-emerald-800 flex items-start gap-4 animate-fade-in-up">
                  <BadgeCheck className="w-6 h-6 shrink-0 mt-0.5 text-emerald-600" />
                  <div>
                    <h4 className="font-serif text-sm font-bold">Bank Withdrawal Initiated!</h4>
                    <p className="text-xs mt-1">
                      Cleared sum has been successfully queued for transfers back to your GTBank routing account ending in <strong>**3492</strong>. A standard confirmation slip has been sent to emeka.anene@lagos-elite.ng.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-start">
                  <button 
                    onClick={handleWithdrawalRequest}
                    className="px-8 py-4 bg-gold hover:bg-gold-dark hover:scale-103 font-bold text-xs tracking-widest uppercase rounded-xl transition-all shadow-md text-charcoal"
                  >
                    Withdraw Cleared Balance to GTBank
                  </button>
                </div>
              )}

              {/* Transactions Ledger sheet */}
              <div className="bg-white border border-charcoal/5 rounded-3xl p-6 shadow-sm text-left">
                <h3 className="font-serif text-lg font-bold text-charcoal mb-6">Recent Transactions History</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-charcoal/10 text-[9px] font-bold text-charcoal/40 uppercase tracking-widest">
                        <th className="pb-3 text-left">TRANS. DATE</th>
                        <th className="pb-3">PAYOUT REFERENCE</th>
                        <th className="pb-3 text-center">TRANSACTION TYPE</th>
                        <th className="pb-3 text-right">TOTAL AMOUNT</th>
                        <th className="pb-3 text-right">BANK STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs text-charcoal-light font-medium divide-y divide-charcoal/5">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-parchment/30 transition-colors">
                          <td className="py-4 font-mono text-charcoal">{tx.date}</td>
                          <td>
                            <span className="block font-bold text-charcoal">{tx.reference}</span>
                            <span className="text-[10px] text-charcoal/40">{tx.description}</span>
                          </td>
                          <td className="text-center">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                              tx.type === 'Payout' ? 'bg-orange-50 text-orange-800' : 'bg-emerald-50 text-emerald-800'
                            }`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className={`text-right font-serif font-bold ${
                            tx.amount < 0 ? 'text-charcoal' : 'text-emerald-700'
                          }`}>
                            {tx.amount < 0 ? '-' : '+'}₦{Math.abs(tx.amount).toLocaleString()}
                          </td>
                          <td className="text-right">
                            <span className="px-2.5 py-1 bg-parchment text-charcoal font-semibold text-[10px] tracking-wider rounded border border-charcoal/10">
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>
      </section>

    </div>
  );
}
