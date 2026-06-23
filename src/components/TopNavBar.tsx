import React from 'react';
import { Compass, User, Bell, ChevronRight, RefreshCw, ShieldCheck, ShoppingCart } from 'lucide-react';

interface TopNavBarProps {
  portal: 'guest' | 'user' | 'service_provider' | 'admin' | 'super_admin';
  setPortal: (portal: 'guest' | 'user' | 'service_provider' | 'admin' | 'super_admin') => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export default function TopNavBar({ portal, setPortal, activeTab, setActiveTab, cartCount, onOpenCart }: TopNavBarProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-parchment/85 backdrop-blur-xl border-b border-charcoal/5 shadow-sm">
      <div className="flex justify-between items-center w-full px-6 md:px-12 xl:px-20 max-w-[1440px] mx-auto h-20">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-4">
          <div 
            onClick={() => {
              if (portal === 'guest') {
                setActiveTab('home');
              } else {
                setActiveTab('overview');
              }
            }}
            className="flex items-center gap-3 cursor-pointer select-none hover:opacity-85 transition-opacity"
          >
            <img src="/logo.png" alt="Cozy Lagos Logo" className="h-10 w-auto" />
            <div className="font-serif italic text-2xl font-bold tracking-tight text-gold-dark">
              Cozy Lagos
            </div>
          </div>
          
          {/* Elite Host badge */}
          <div className="hidden sm:flex items-center gap-1.5 bg-gold/10 border border-gold/20 px-2.5 py-0.5 rounded-full text-[10px] text-gold-dark font-semibold tracking-wider uppercase">
            <ShieldCheck className="w-3 h-3" />
            <span>Lagos Elite Certified</span>
          </div>
        </div>

        {/* Center Links (Based on active Portal) */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold tracking-[0.15em] uppercase">
          {portal === 'guest' ? (
            <>
              <button 
                onClick={() => setActiveTab('home')}
                className={`py-2 px-1 relative transition-colors ${activeTab === 'home' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
              >
                Home
                {activeTab === 'home' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
              </button>
              <button 
                onClick={() => setActiveTab('lagos-cruise')}
                className={`py-2 px-1 relative transition-colors ${activeTab === 'lagos-cruise' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
              >
                Lagos Cruise
                {activeTab === 'lagos-cruise' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
              </button>
              <button 
                onClick={() => setActiveTab('explorer')}
                className={`py-2 px-1 relative transition-colors ${activeTab === 'explorer' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
              >
                Stays
                {activeTab === 'explorer' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
              </button>
               <button 
                 onClick={() => setActiveTab('experience')}
                 className={`py-2 px-1 relative transition-colors ${activeTab === 'experience' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
               >
                 Experiences
                 {activeTab === 'experience' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
               </button>
               <button 
                 onClick={() => setActiveTab('concierge-hub')}
                 className={`py-2 px-1 relative transition-colors ${activeTab === 'concierge-hub' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
               >
                 Concierge Hub
                 {activeTab === 'concierge-hub' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
               </button>
               <button 
                 onClick={() => setActiveTab('guest-dashboard')}
                 className={`py-2 px-1 relative transition-colors ${activeTab === 'guest-dashboard' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
               >
                 Dashboard
                 {activeTab === 'guest-dashboard' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
               </button>
             </>
           ) : (
            <>
              <button 
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 relative transition-colors ${activeTab === 'overview' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
              >
                Performance Overview
                {activeTab === 'overview' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
              </button>
              <button 
                onClick={() => setActiveTab('listings')}
                className={`py-2 px-1 relative transition-colors ${activeTab === 'listings' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
              >
                My Listings
                {activeTab === 'listings' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
              </button>
              <button 
                onClick={() => setActiveTab('calendar')}
                className={`py-2 px-1 relative transition-colors ${activeTab === 'calendar' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
              >
                Availability Calendar
                {activeTab === 'calendar' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
              </button>
              <button 
                onClick={() => setActiveTab('payouts')}
                className={`py-2 px-1 relative transition-colors ${activeTab === 'payouts' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
              >
                Payout Ledger
                {activeTab === 'payouts' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
              </button>
            </>
          )}
        </nav>

        {/* Right Side Portal Switcher and Actions */}
        <div className="flex items-center gap-4">
          
          {/* Cart Icon */}
          {portal === 'guest' && (
            <button 
              onClick={onOpenCart}
              className="relative p-2 bg-charcoal/5 hover:bg-gold/10 rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-charcoal/70" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-charcoal text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Quick toggle mode portal button */}
          <button
            onClick={() => {
              const roles: ('guest' | 'user' | 'service_provider' | 'admin' | 'super_admin')[] = ['guest', 'user', 'service_provider', 'admin', 'super_admin'];
              const currentIndex = roles.indexOf(portal);
              const nextIndex = (currentIndex + 1) % roles.length;
              const nextPortal = roles[nextIndex];
              setPortal(nextPortal);
              
              if (nextPortal === 'guest') {
                setActiveTab('home');
              } else if (nextPortal === 'user' || nextPortal === 'service_provider' || nextPortal === 'admin' || nextPortal === 'super_admin') {
                setActiveTab('overview');
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-charcoal text-parchment hover:bg-gold-dark hover:text-parchment rounded-full text-[10px] font-bold tracking-wider uppercase transition-colors shrink-0"
            title={`Current: ${portal}. Click to cycle roles.`}
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Role: {portal.replace('_', ' ')}</span>
            <span className="sm:hidden">{portal.substring(0, 4)}</span>
          </button>

          {/* User Icon */}
          <button 
            type="button"
            className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-charcoal/5 hover:bg-gold/15 hover:text-gold-dark transition-colors"
          >
            <Bell className="w-4 h-4 text-charcoal/70" />
          </button>
          
          <button 
            type="button"
            onClick={() => {
              if (portal === 'guest') {
                setActiveTab('guest-dashboard');
              } else {
                setActiveTab('overview');
              }
            }}
            className="flex items-center gap-2 border border-charcoal/50 px-4 py-2 hover:bg-charcoal hover:text-parchment rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-300"
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
}
