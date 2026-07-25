import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Bell, ChevronRight, ShoppingCart, LogIn, LogOut, Menu, X, Shield, Eye, EyeOff, Check, Settings } from 'lucide-react';
import { HomeIcon, MapIcon, HandRaisedIcon, CubeIcon, SparklesIcon, BriefcaseIcon, CalendarIcon, HeartIcon } from '@heroicons/react/24/outline';
import { Compass } from 'lucide-react';
import { useAuth, getDefaultDashboardTab } from '../auth';
import { PrivacyPolicyModal } from './PrivacyPolicy';
import Tooltip from './ui/Tooltip';
import TermsAcceptancePopup from './ui/TermsAcceptancePopup';

interface TopNavBarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  cartCount: number;
  onOpenCart: () => void;
}

const ROLE_OPTIONS = [
  { value: 'user', label: 'Guest', desc: 'Book stays & experiences', icon: '🏠' },
  { value: 'service_provider', label: 'Host', desc: 'List properties & services', icon: '' },
];

export default function TopNavBar({ activeTab, setActiveTab, cartCount, onOpenCart }: TopNavBarProps) {
  const { currentUser, login, register, loginWithGoogle, loginWithApple, logout, isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTermsPopup, setShowTermsPopup] = useState(false);
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
      setShowTermsPopup(true);
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
      setShowTermsPopup(true);
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

  const handleGoogleLogin = async () => {
    setLoginError('');
    setIsLoading(true);
    try {
      const success = await loginWithGoogle();
      if (success) {
        setShowLoginModal(false);
        setLoginError('');
        setPrivacyAccepted(false);
      } else {
        setLoginError('Google login failed. Please try again.');
      }
    } catch (error) {
      setLoginError('Google login failed. Please try again.');
    }
    setIsLoading(false);
  };

  const handleAppleLogin = async () => {
    setLoginError('');
    setIsLoading(true);
    try {
      const success = await loginWithApple();
      if (success) {
        setShowLoginModal(false);
        setLoginError('');
        setPrivacyAccepted(false);
      } else {
        setLoginError('Apple login failed. Please try again.');
      }
    } catch (error) {
      setLoginError('Apple login failed. Please try again.');
    }
    setIsLoading(false);
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
                } else if (currentUser?.role === 'admin' || currentUser?.role === 'super_admin') {
                  setActiveTab('admin-dashboard');
                } else if (currentUser?.role === 'service_provider') {
                  setActiveTab('service-dashboard');
                } else {
                  setActiveTab('user-dashboard');
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
              <button onClick={onOpenCart} className="relative p-2 bg-charcoal/5 hover:bg-gold/10 rounded-full transition-colors">
                <ShoppingCart className="w-5 h-5 text-charcoal/70" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-parchment text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 bg-charcoal/5 hover:bg-gold/10 rounded-full transition-colors"
            >
              {showMobileMenu ? <X className="w-5 h-5 text-charcoal/70" /> : <Menu className="w-5 h-5 text-charcoal/70" />}
            </button>

            {!isAuthenticated ? (
              <button
                onClick={openLoginModal}
                className="flex items-center gap-2 px-4 py-2 bg-charcoal text-parchment hover:bg-gold-dark rounded-full text-[10px] font-bold tracking-wider uppercase transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-charcoal/5 hover:bg-gold/15 hover:text-gold-dark transition-colors relative"
                >
                  <Bell className="w-4 h-4 text-charcoal/70" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <button
                  onClick={() => setActiveTab('account-settings')}
                  className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full bg-charcoal/5 hover:bg-gold/15 hover:text-gold-dark transition-colors"
                >
                  <Settings className="w-4 h-4 text-charcoal/70" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] font-bold text-charcoal">{currentUser?.name}</div>
                    <div className="text-[9px] text-charcoal/50 uppercase">{currentUser?.role?.replace('_', ' ')}</div>
                  </div>
                  <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 border border-charcoal/50 hover:bg-charcoal hover:text-parchment rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-300">
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
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
                  { tab: 'sp-cms', label: 'Service CMS', icon: BriefcaseIcon },
                  { tab: 'calendar', label: 'Schedule', icon: CalendarIcon },
                  { tab: 'payouts', label: 'Earnings', icon: BriefcaseIcon },
                ] : currentUser?.role === 'admin' ? [
                  { tab: 'admin-dashboard', label: 'Admin Panel', icon: Shield },
                  { tab: 'admin-cms', label: 'Content CMS', icon: BriefcaseIcon },
                  { tab: 'listings', label: 'All Properties', icon: HomeIcon },
                  { tab: 'overview', label: 'Analytics', icon: BriefcaseIcon },
                ] : currentUser?.role === 'super_admin' ? [
                  { tab: 'super-admin-dashboard', label: 'Super Admin', icon: Shield },
                  { tab: 'admin-cms', label: 'Content CMS', icon: BriefcaseIcon },
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
                    <div className="grid grid-cols-2 gap-2">
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

                {/* Terms Notice */}
                <p className="text-[10px] text-charcoal/50 text-center">
                  By continuing, you agree to our Terms & Privacy Policy
                </p>

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

              {/* Social Login */}
              {(loginStep === 'login' || loginStep === 'register') && (
                <>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex-1 h-px bg-charcoal/10" />
                    <span className="text-[10px] text-charcoal/50 uppercase tracking-wider">or continue with</span>
                    <div className="flex-1 h-px bg-charcoal/10" />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-charcoal/10 rounded-xl text-xs font-bold text-charcoal hover:bg-charcoal/5 transition-all disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </button>

                    <button
                      onClick={handleAppleLogin}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-xl text-xs font-bold hover:bg-charcoal transition-all disabled:opacity-50"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      Apple
                    </button>
                  </div>
                </>
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
            onAccept={() => { setPrivacyAccepted(true); setShowPrivacy(false); setShowTermsPopup(false); }}
          />
        )}
      </AnimatePresence>

      {/* Terms Acceptance Popup */}
      <TermsAcceptancePopup
        isOpen={showTermsPopup}
        onAccept={() => { setPrivacyAccepted(true); setShowTermsPopup(false); }}
        onViewMore={() => { setShowPrivacy(true); setShowTermsPopup(false); }}
      />
    </>
  );
}
