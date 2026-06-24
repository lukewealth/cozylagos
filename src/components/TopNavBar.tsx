import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Bell, ChevronRight, ShoppingCart, LogIn, LogOut, Menu, X, Shield, Eye, EyeOff, Check, Settings } from 'lucide-react';
import { HomeIcon, MapIcon, HandRaisedIcon, CubeIcon, SparklesIcon, BriefcaseIcon, CalendarIcon, HeartIcon } from '@heroicons/react/24/outline';
import { Compass } from 'lucide-react';
import { useAuth, getDefaultDashboardTab } from '../auth';
import { PrivacyPolicyModal } from './PrivacyPolicy';
import Tooltip from './ui/Tooltip';

interface TopNavBarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  cartCount: number;
  onOpenCart: () => void;
}

const ROLE_OPTIONS = [
  { value: 'user', label: 'Guest', desc: 'Book stays & experiences', icon: '🏠' },
  { value: 'service_provider', label: 'Host', desc: 'List properties & services', icon: '' },
  { value: 'admin', label: 'Admin', desc: 'Manage platform', icon: '⚙️' },
];

export default function TopNavBar({ activeTab, setActiveTab, cartCount, onOpenCart }: TopNavBarProps) {
  const { currentUser, login, register, logout, isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [loginStep, setLoginStep] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated && currentUser) {
      const defaultTab = getDefaultDashboardTab(currentUser.role);
      if (activeTab === 'home' && currentUser.role !== 'guest') {
        setActiveTab(defaultTab);
      }
    }
  }, [isAuthenticated, currentUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!privacyAccepted) {
      setLoginError('Please accept the Privacy Policy to continue.');
      return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const success = await login(loginEmail, loginPassword);
    setIsLoading(false);
    if (success) {
      setShowLoginModal(false);
      setLoginEmail('');
      setLoginPassword('');
      setLoginError('');
      setPrivacyAccepted(false);
    } else {
      setLoginError('Invalid email or password. Please try again.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!privacyAccepted) {
      setLoginError('Please accept the Privacy Policy to continue.');
      return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const success = await register(loginEmail, loginName, loginPassword, loginRole as any);
    setIsLoading(false);
    if (success) {
      setShowLoginModal(false);
      setLoginEmail('');
      setLoginName('');
      setLoginPassword('');
      setLoginError('');
      setPrivacyAccepted(false);
      setActiveTab('home');
    } else {
      setLoginError('Email already registered. Please login instead.');
    }
  };

  const handleLogout = () => {
    logout();
    setActiveTab('home');
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
    setLoginStep('login');
    setLoginError('');
    setPrivacyAccepted(false);
  };

  return (
    <>
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

          {/* Center Links - Simplified Guest Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-[11px] font-bold tracking-[0.15em] uppercase">
            {!isAuthenticated || currentUser?.role === 'user' ? (
              <>
                <button 
                  onClick={() => setActiveTab('home')} 
                  className={`group py-2 px-1 relative transition-all duration-300 flex items-center gap-2 ${activeTab === 'home' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
                >
                  <HomeIcon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-125 ${activeTab === 'home' ? 'text-gold-dark' : ''}`} />
                  <span>Gems</span>
                  {activeTab === 'home' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
                </button>
                <button 
                  onClick={() => setActiveTab('explorer')} 
                  className={`group py-2 px-1 relative transition-all duration-300 flex items-center gap-2 ${activeTab === 'explorer' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
                >
                  <MapIcon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-125 ${activeTab === 'explorer' ? 'text-gold-dark' : ''}`} />
                  <span>Stay</span>
                  {activeTab === 'explorer' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
                </button>
                <button 
                  onClick={() => setActiveTab('explore-lagos')} 
                  className={`group py-2 px-1 relative transition-all duration-300 flex items-center gap-2 ${activeTab === 'explore-lagos' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
                >
                  <Compass className={`w-4 h-4 transition-transform duration-300 group-hover:scale-125 ${activeTab === 'explore-lagos' ? 'text-gold-dark' : ''}`} />
                  <span>Explore Lagos</span>
                  {activeTab === 'explore-lagos' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
                </button>
                <button 
                  onClick={() => setActiveTab('vip-services')} 
                  className={`group py-2 px-1 relative transition-all duration-300 flex items-center gap-2 ${activeTab === 'vip-services' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
                >
                  <HandRaisedIcon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-125 ${activeTab === 'vip-services' ? 'text-gold-dark' : ''}`} />
                  <span>Cozy</span>
                  {activeTab === 'vip-services' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
                </button>
                <button 
                  onClick={() => setActiveTab('bundles')} 
                  className={`group py-2 px-1 relative transition-all duration-300 flex items-center gap-2 ${activeTab === 'bundles' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
                >
                  <CubeIcon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-125 ${activeTab === 'bundles' ? 'text-gold-dark' : ''}`} />
                  <span>Bundles</span>
                  {activeTab === 'bundles' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
                </button>
                <button 
                  onClick={() => setActiveTab('events')} 
                  className={`group py-2 px-1 relative transition-all duration-300 flex items-center gap-2 ${activeTab === 'events' ? 'text-charcoal' : 'text-charcoal-light hover:text-charcoal'}`}
                >
                  <CalendarIcon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-125 ${activeTab === 'events' ? 'text-gold-dark' : ''}`} />
                  <span>Events</span>
                  {activeTab === 'events' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
                </button>
              </>
            ) : currentUser?.role === 'service_provider' ? (
              <span className="text-charcoal/40 text-[10px]">Use sidebar for navigation</span>
            ) : currentUser?.role === 'admin' || currentUser?.role === 'super_admin' ? (
              <span className="text-charcoal/40 text-[10px]">Use sidebar for navigation</span>
            ) : null}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {!isAuthenticated && (
              <Tooltip content="Shopping Cart" description={`${cartCount} items in cart`}>
                <button onClick={onOpenCart} className="relative p-2 bg-charcoal/5 hover:bg-gold/10 rounded-full transition-colors">
                  <ShoppingCart className="w-5 h-5 text-charcoal/70" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gold text-parchment text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>
              </Tooltip>
            )}

            <Tooltip content={showMobileMenu ? "Close Menu" : "Open Menu"}>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 bg-charcoal/5 hover:bg-gold/10 rounded-full transition-colors"
              >
                {showMobileMenu ? <X className="w-5 h-5 text-charcoal/70" /> : <Menu className="w-5 h-5 text-charcoal/70" />}
              </button>
            </Tooltip>

            {!isAuthenticated ? (
              <Tooltip content="Login" description="Access your account">
                <button
                  onClick={openLoginModal}
                  className="flex items-center gap-2 px-4 py-2 bg-charcoal text-parchment hover:bg-gold-dark rounded-full text-[10px] font-bold tracking-wider uppercase transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
              </Tooltip>
            ) : (
              <>
                <Tooltip content="Notifications" description="View your notifications">
                  <button
                    onClick={() => setActiveTab('notifications')}
                    className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-charcoal/5 hover:bg-gold/15 hover:text-gold-dark transition-colors relative"
                  >
                    <Bell className="w-4 h-4 text-charcoal/70" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  </button>
                </Tooltip>
                <Tooltip content="Account Settings" description="Manage your account">
                  <button
                    onClick={() => setActiveTab('account-settings')}
                    className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-charcoal/5 hover:bg-gold/15 hover:text-gold-dark transition-colors"
                  >
                    <Settings className="w-4 h-4 text-charcoal/70" />
                  </button>
                </Tooltip>
                <div className="flex items-center gap-2">
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] font-bold text-charcoal">{currentUser?.name}</div>
                    <div className="text-[9px] text-charcoal/50 uppercase">{currentUser?.role?.replace('_', ' ')}</div>
                  </div>
                  <Tooltip content="Logout" description="Sign out of your account">
                    <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 border border-charcoal/50 hover:bg-charcoal hover:text-parchment rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-300">
                      <LogOut className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </Tooltip>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {showMobileMenu && (
          <div className="lg:hidden fixed inset-0 z-[90]">
            <div className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)} />
            <div className="fixed top-20 right-0 left-0 bg-parchment border-b border-charcoal/5 shadow-xl max-h-[75vh] overflow-y-auto rounded-b-2xl">
              <div className="p-3 space-y-1">
                {(!isAuthenticated || currentUser?.role === 'user' ? [
                  { tab: 'home', label: 'Gems', icon: HomeIcon },
                  { tab: 'explorer', label: 'Stay', icon: MapIcon },
                  { tab: 'explore-lagos', label: 'Explore Lagos', icon: Compass },
                  { tab: 'vip-services', label: 'Cozy', icon: HandRaisedIcon },
                  { tab: 'bundles', label: 'Bundles', icon: CubeIcon },
                  { tab: 'events', label: 'Events', icon: CalendarIcon },
                  ...(isAuthenticated ? [
                    { tab: 'user-dashboard', label: 'My Dashboard', icon: User },
                    { tab: 'notifications', label: 'Notifications', icon: Bell },
                    { tab: 'account-settings', label: 'Settings', icon: Settings },
                  ] : []),
                ] : currentUser?.role === 'service_provider' ? [
                  { tab: 'overview', label: 'Dashboard', icon: HomeIcon },
                  { tab: 'listings', label: 'My Services', icon: HomeIcon },
                  { tab: 'calendar', label: 'Schedule', icon: CalendarIcon },
                  { tab: 'payouts', label: 'Earnings', icon: BriefcaseIcon },
                ] : currentUser?.role === 'admin' ? [
                  { tab: 'admin-dashboard', label: 'Admin Panel', icon: Shield },
                  { tab: 'listings', label: 'All Properties', icon: HomeIcon },
                  { tab: 'overview', label: 'Analytics', icon: BriefcaseIcon },
                ] : currentUser?.role === 'super_admin' ? [
                  { tab: 'super-admin-dashboard', label: 'Super Admin', icon: Shield },
                  { tab: 'admin-dashboard', label: 'Management', icon: Shield },
                  { tab: 'overview', label: 'System Stats', icon: BriefcaseIcon },
                ] : []).map(({ tab, label, icon: Icon }) => (
                  <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); setShowMobileMenu(false); }}
                    className={`w-full text-left px-4 py-3.5 rounded-lg text-sm font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-3 group ${
                      activeTab === tab ? 'bg-gold/10 text-gold-dark' : 'text-charcoal hover:bg-charcoal/5'
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-125 ${activeTab === tab ? 'text-gold-dark' : ''}`} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Login / Register Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-parchment rounded-t-3xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-charcoal">
                    {loginStep === 'login' ? 'Welcome Back' : 'Join Cozy Lagos'}
                  </h2>
                  <p className="text-xs text-charcoal/50 mt-1">
                    {loginStep === 'login' ? 'Login to your account' : 'Create your account'}
                  </p>
                </div>
                <button onClick={() => setShowLoginModal(false)} className="p-2 hover:bg-charcoal/5 rounded-full transition-colors">
                  <X className="w-5 h-5 text-charcoal/60" />
                </button>
              </div>

              {/* Step Toggle */}
              <div className="flex bg-charcoal/5 rounded-xl p-1 mb-6">
                <button
                  onClick={() => { setLoginStep('login'); setLoginError(''); }}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    loginStep === 'login' ? 'bg-charcoal text-parchment shadow-md' : 'text-charcoal/60'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => { setLoginStep('register'); setLoginError(''); }}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    loginStep === 'register' ? 'bg-charcoal text-parchment shadow-md' : 'text-charcoal/60'
                  }`}
                >
                  Register
                </button>
              </div>

              <form onSubmit={loginStep === 'login' ? handleLogin : handleRegister} className="space-y-4">
                {/* Name field (register only) */}
                {loginStep === 'register' && (
                  <div>
                    <label className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-widest mb-2">Full Name</label>
                    <input
                      type="text"
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:border-gold transition-colors"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-widest mb-2">Email</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:border-gold transition-colors"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-widest mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:border-gold transition-colors pr-12"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-charcoal/40 hover:text-charcoal transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Role Selection (register only) */}
                {loginStep === 'register' && (
                  <div>
                    <label className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-widest mb-2">I am a...</label>
                    <div className="grid grid-cols-3 gap-2">
                      {ROLE_OPTIONS.map((role) => (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => setLoginRole(role.value)}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            loginRole === role.value
                              ? 'border-gold bg-gold/5 shadow-md'
                              : 'border-charcoal/10 hover:border-charcoal/20'
                          }`}
                        >
                          <span className="text-lg block mb-1">{role.icon}</span>
                          <span className="text-[10px] font-bold text-charcoal block">{role.label}</span>
                          <span className="text-[8px] text-charcoal/50 block mt-0.5">{role.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Privacy Acceptance */}
                <label className="flex items-start gap-3 cursor-pointer p-3 bg-gold/5 border border-gold/10 rounded-xl" onClick={() => setPrivacyAccepted(!privacyAccepted)}>
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    privacyAccepted ? 'bg-gold border-gold' : 'border-charcoal/30'
                  }`}>
                    {privacyAccepted && <Check className="w-3 h-3 text-charcoal" />}
                  </div>
                  <span className="text-[11px] text-charcoal/70 leading-relaxed">
                    I agree to the <button type="button" onClick={(e) => { e.stopPropagation(); setShowPrivacy(true); }} className="text-gold-dark font-semibold underline">Privacy Policy</button> and <button type="button" onClick={(e) => { e.stopPropagation(); setShowPrivacy(true); }} className="text-gold-dark font-semibold underline">Terms of Service</button>
                  </span>
                </label>

                {loginError && (
                  <p className="text-red-500 text-xs bg-red-50 border border-red-100 p-2.5 rounded-lg">{loginError}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-charcoal text-parchment hover:bg-gold-dark rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-parchment/30 border-t-parchment rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    loginStep === 'login' ? 'Login' : 'Create Account'
                  )}
                </button>
              </form>

              {/* Demo Accounts */}
              {loginStep === 'login' && (
                <div className="mt-6 pt-6 border-t border-charcoal/10">
                  <p className="text-[10px] text-charcoal/50 text-center mb-3">Quick Demo Access:</p>
                  <div className="grid grid-cols-1 gap-2 text-[9px]">
                    {[
                      { role: 'Guest User', email: 'lukeokagha@gmail.com', desc: 'Browse & book stays' },
                      { role: 'Service Provider', email: 'chef@cozylagos.ng', desc: 'Manage services & earnings' },
                      { role: 'Admin', email: 'contact@tricode.pro', desc: 'Platform management' },
                      { role: 'Super Admin', email: 'luke.o@tricode.pro', desc: 'Full system control' },
                    ].map(({ role, email, desc }) => (
                      <button
                        key={email}
                        onClick={() => { setLoginEmail(email); }}
                        className="p-3 bg-charcoal/5 hover:bg-charcoal/10 rounded-lg text-left transition-colors flex justify-between items-center group"
                      >
                        <div>
                          <div className="font-bold text-charcoal flex items-center gap-2">
                            {role}
                            <span className="text-[8px] font-normal text-charcoal/50">({desc})</span>
                          </div>
                          <div className="text-charcoal/60 truncate">{email}</div>
                        </div>
                        <div className="text-[8px] text-charcoal/40 group-hover:text-gold-dark transition-colors">
                          Click to fill email
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-[9px] text-charcoal/40 text-center mt-3">
                    Enter your password after selecting a demo account
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {showPrivacy && (
          <PrivacyPolicyModal
            isOpen={showPrivacy}
            onClose={() => setShowPrivacy(false)}
            onAccept={() => { setPrivacyAccepted(true); setShowPrivacy(false); }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
