import React, { useState } from 'react';
import { Compass, User, Bell, ChevronRight, ShoppingCart, LogIn, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../auth';

interface TopNavBarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export default function TopNavBar({ activeTab, setActiveTab, cartCount, onOpenCart }: TopNavBarProps) {
  const { currentUser, login, logout, isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const success = await login(loginEmail, loginPassword);
    if (success) {
      setShowLoginModal(false);
      setLoginEmail('');
      setLoginPassword('');
      setActiveTab('overview');
    } else {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    setActiveTab('home');
  };
  return (
    <header className="sticky top-0 z-50 w-full bg-parchment/85 backdrop-blur-xl border-b border-charcoal/5 shadow-sm">
      <div className="flex justify-between items-center w-full px-6 md:px-12 xl:px-20 max-w-[1440px] mx-auto h-20">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => {
              if (!isAuthenticated) {
                setActiveTab('home');
              } else {
                setActiveTab('overview');
              }
            }}
            className="flex items-center gap-2 cursor-pointer select-none hover:opacity-85 transition-opacity"
          >
            <div className="relative w-10 h-10 overflow-hidden rounded-lg">
              <img
                src="/logo.png"
                alt="Cozy Lagos Logo"
                className="w-full h-full object-cover"
                style={{
                  maskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)',
                  WebkitMaskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)'
                }}
              />
            </div>
            <div className="font-serif italic text-sm font-bold tracking-tight text-charcoal/70">
              Cozy Lagos
            </div>
          </div>
        </div>

        {/* Center Links (Based on user role) */}
        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-bold tracking-[0.15em] uppercase">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => setActiveTab('home')}
                className={`py-2 px-1 relative transition-colors ${activeTab === 'home' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
              >
                Home
                {activeTab === 'home' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
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
                onClick={() => setActiveTab('bundles')}
                className={`py-2 px-1 relative transition-colors ${activeTab === 'bundles' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
              >
                Bundles
                {activeTab === 'bundles' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
              </button>
            </>
          ) : currentUser?.role === 'user' ? (
            <>
              <button
                onClick={() => setActiveTab('home')}
                className={`py-2 px-1 relative transition-colors ${activeTab === 'home' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
              >
                Browse
                {activeTab === 'home' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
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
                onClick={() => setActiveTab('bundles')}
                className={`py-2 px-1 relative transition-colors ${activeTab === 'bundles' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
              >
                Bundles
                {activeTab === 'bundles' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
              </button>
              <button
                onClick={() => setActiveTab('guest-dashboard')}
                className={`py-2 px-1 relative transition-colors ${activeTab === 'guest-dashboard' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
              >
                My Dashboard
                {activeTab === 'guest-dashboard' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
              </button>
            </>
          ) : currentUser?.role === 'service_provider' ? (
            <>
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 relative transition-colors ${activeTab === 'overview' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
              >
                Dashboard
                {activeTab === 'overview' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
              </button>
              <button
                onClick={() => setActiveTab('listings')}
                className={`py-2 px-1 relative transition-colors ${activeTab === 'listings' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
              >
                My Services
                {activeTab === 'listings' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`py-2 px-1 relative transition-colors ${activeTab === 'calendar' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
              >
                Schedule
                {activeTab === 'calendar' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
              </button>
              <button
                onClick={() => setActiveTab('payouts')}
                className={`py-2 px-1 relative transition-colors ${activeTab === 'payouts' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
              >
                Earnings
                {activeTab === 'payouts' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
              </button>
            </>
          ) : currentUser?.role === 'admin' ? (
            <>
              <button
                onClick={() => setActiveTab('admin-dashboard')}
                className={`py-2 px-1 relative transition-colors ${activeTab === 'admin-dashboard' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
              >
                Admin Panel
                {activeTab === 'admin-dashboard' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
              </button>
              <button
                onClick={() => setActiveTab('listings')}
                className={`py-2 px-1 relative transition-colors ${activeTab === 'listings' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
              >
                All Properties
                {activeTab === 'listings' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
              </button>
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 relative transition-colors ${activeTab === 'overview' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
              >
                Analytics
                {activeTab === 'overview' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
              </button>
            </>
          ) : currentUser?.role === 'super_admin' ? (
            <>
              <button
                onClick={() => setActiveTab('super-admin-dashboard')}
                className={`py-2 px-1 relative transition-colors ${activeTab === 'super-admin-dashboard' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
              >
                Super Admin
                {activeTab === 'super-admin-dashboard' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
              </button>
              <button
                onClick={() => setActiveTab('admin-dashboard')}
                className={`py-2 px-1 relative transition-colors ${activeTab === 'admin-dashboard' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
              >
                Management
                {activeTab === 'admin-dashboard' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
              </button>
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 relative transition-colors ${activeTab === 'overview' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
              >
                System Stats
                {activeTab === 'overview' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
              </button>
            </>
          ) : null}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          
          {/* Cart Icon */}
          {!isAuthenticated && (
            <button 
              onClick={onOpenCart}
              className="relative p-2 bg-charcoal/5 hover:bg-gold/10 rounded-full transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-charcoal/70" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-parchment text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 bg-charcoal/5 hover:bg-gold/10 rounded-full transition-colors"
          >
            {showMobileMenu ? <X className="w-5 h-5 text-charcoal/70" /> : <Menu className="w-5 h-5 text-charcoal/70" />}
          </button>

          {/* Login/Logout Button */}
          {!isAuthenticated ? (
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-charcoal text-parchment hover:bg-gold-dark hover:text-parchment rounded-full text-[10px] font-bold tracking-wider uppercase transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          ) : (
            <>
              <button 
                type="button"
                className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-charcoal/5 hover:bg-gold/15 hover:text-gold-dark transition-colors"
              >
                <Bell className="w-4 h-4 text-charcoal/70" />
              </button>
              
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <div className="text-[10px] font-bold text-charcoal">{currentUser?.name}</div>
                  <div className="text-[9px] text-charcoal/50 uppercase">{currentUser?.role?.replace('_', ' ')}</div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 border border-charcoal/50 hover:bg-charcoal hover:text-parchment rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-300"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-parchment rounded-t-3xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="font-serif text-2xl font-bold text-charcoal mb-6">Login to Cozy Lagos</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-widest mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:border-gold"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-widest mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:border-gold"
                  placeholder="••••••••"
                  required
                />
              </div>
              {loginError && (
                <p className="text-red-500 text-xs">{loginError}</p>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowLoginModal(false);
                    setLoginEmail('');
                    setLoginPassword('');
                    setLoginError('');
                  }}
                  className="flex-1 py-3 border border-charcoal/20 text-charcoal hover:bg-charcoal/5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-charcoal text-parchment hover:bg-gold-dark rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Login
                </button>
              </div>
            </form>
            <div className="mt-6 pt-6 border-t border-charcoal/10">
              <p className="text-[10px] text-charcoal/50 text-center mb-3">Demo Accounts:</p>
              <div className="grid grid-cols-2 gap-2 text-[9px]">
                <div className="p-2 bg-charcoal/5 rounded">
                  <div className="font-bold text-charcoal">User</div>
                  <div className="text-charcoal/60">lukeokagha@gmail.com</div>
                </div>
                <div className="p-2 bg-charcoal/5 rounded">
                  <div className="font-bold text-charcoal">Admin</div>
                  <div className="text-charcoal/60">contact@tricode.pro</div>
                </div>
                <div className="p-2 bg-charcoal/5 rounded">
                  <div className="font-bold text-charcoal">Super Admin</div>
                  <div className="text-charcoal/60">luke.o@tricode.pro</div>
                </div>
                <div className="p-2 bg-charcoal/5 rounded">
                  <div className="font-bold text-charcoal">Provider</div>
                  <div className="text-charcoal/60">chef@cozylagos.ng</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-[90]">
          <div className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)} />
          <div className="fixed top-20 right-0 left-0 bg-parchment border-b border-charcoal/5 shadow-xl max-h-[75vh] overflow-y-auto rounded-b-2xl">
            <div className="p-3 space-y-1">
              {(!isAuthenticated ? [
                { tab: 'home', label: 'Home' },
                { tab: 'explorer', label: 'Stays' },
                { tab: 'experience', label: 'Experiences' },
                { tab: 'bundles', label: 'Bundles' },
              ] : currentUser?.role === 'user' ? [
                { tab: 'home', label: 'Browse' },
                { tab: 'explorer', label: 'Stays' },
                { tab: 'experience', label: 'Experiences' },
                { tab: 'bundles', label: 'Bundles' },
                { tab: 'guest-dashboard', label: 'My Dashboard' },
              ] : currentUser?.role === 'service_provider' ? [
                { tab: 'overview', label: 'Dashboard' },
                { tab: 'listings', label: 'My Services' },
                { tab: 'calendar', label: 'Schedule' },
                { tab: 'payouts', label: 'Earnings' },
              ] : currentUser?.role === 'admin' ? [
                { tab: 'admin-dashboard', label: 'Admin Panel' },
                { tab: 'listings', label: 'All Properties' },
                { tab: 'overview', label: 'Analytics' },
              ] : currentUser?.role === 'super_admin' ? [
                { tab: 'super-admin-dashboard', label: 'Super Admin' },
                { tab: 'admin-dashboard', label: 'Management' },
                { tab: 'overview', label: 'System Stats' },
              ] : []).map(({ tab, label }) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full text-left px-4 py-3.5 rounded-lg text-sm font-bold tracking-wider uppercase transition-colors ${
                    activeTab === tab
                      ? 'bg-gold/10 text-gold-dark'
                      : 'text-charcoal hover:bg-charcoal/5'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
