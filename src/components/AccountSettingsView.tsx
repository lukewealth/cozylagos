import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Lock, Bell, Shield, Globe, Camera, Save, Check } from 'lucide-react';
import { useAuth } from '../auth';
import { useToast } from './Toast';

export default function AccountSettingsView() {
  const { currentUser, updateUser } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'preferences'>('profile');

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    bio: '',
    location: '',
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    emailBookings: true,
    emailPromotions: false,
    pushBookings: true,
    pushMessages: true,
    smsAlerts: false,
  });

  const [preferenceData, setPreferenceData] = useState({
    language: 'en',
    currency: 'NGN',
    timezone: 'Africa/Lagos',
    darkMode: false,
  });

  const handleProfileSave = () => {
    updateUser(profileData);
    addToast({ type: 'success', title: 'Profile Updated', message: 'Your profile has been saved.' });
  };

  const handleSecuritySave = () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      addToast({ type: 'error', title: 'Error', message: 'Passwords do not match.' });
      return;
    }
    if (securityData.newPassword.length < 8) {
      addToast({ type: 'error', title: 'Error', message: 'Password must be at least 8 characters.' });
      return;
    }
    addToast({ type: 'success', title: 'Password Updated', message: 'Your password has been changed.' });
    setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleNotificationSave = () => {
    localStorage.setItem('cozy_lagos_notification_prefs', JSON.stringify(notificationPrefs));
    addToast({ type: 'success', title: 'Preferences Saved', message: 'Notification settings updated.' });
  };

  const handlePreferenceSave = () => {
    localStorage.setItem('cozy_lagos_preferences', JSON.stringify(preferenceData));
    addToast({ type: 'success', title: 'Preferences Saved', message: 'Your preferences have been updated.' });
  };

  return (
    <div className="flex-grow w-full max-w-[1440px] mx-auto px-6 md:px-12 xl:px-20 py-12 animate-fade-in-up">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-gold-dark font-bold text-[10px] tracking-[0.25em] uppercase mb-1">
          <Shield className="w-4 h-4" />
          <span>Account Settings</span>
        </div>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-charcoal">
          Manage Your Account
        </h1>
        <p className="text-sm text-charcoal/60 mt-2">
          Update your profile, security settings, and preferences.
        </p>
      </header>

      <div className="flex gap-2 border-b border-charcoal/5 pb-0 mb-8">
        {([
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'security', label: 'Security', icon: Lock },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'preferences', label: 'Preferences', icon: Globe },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-gold-dark text-charcoal'
                : 'border-transparent text-charcoal/40 hover:text-charcoal/60'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="max-w-3xl">
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl border border-charcoal/5 p-6 shadow-sm">
              <div className="flex items-center gap-6 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center">
                    <User className="w-10 h-10 text-gold-dark" />
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-charcoal text-parchment rounded-full hover:bg-gold-dark transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-charcoal text-lg">{currentUser?.name}</h3>
                  <p className="text-sm text-charcoal/50 capitalize">{currentUser?.role?.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-widest mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-parchment border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-widest mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-parchment border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-widest mb-2">Phone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-parchment border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:border-gold transition-colors"
                    placeholder="+234 800 000 0000"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-widest mb-2">Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full px-4 py-3 bg-parchment border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:border-gold transition-colors"
                    placeholder="Lagos, Nigeria"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-widest mb-2">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-parchment border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:border-gold transition-colors resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              <button
                onClick={handleProfileSave}
                className="mt-6 px-6 py-3 bg-gold text-charcoal hover:bg-gold-dark rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'security' && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl border border-charcoal/5 p-6 shadow-sm">
              <h3 className="font-bold text-charcoal text-lg mb-6">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-widest mb-2">Current Password</label>
                  <input
                    type="password"
                    value={securityData.currentPassword}
                    onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-parchment border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:border-gold transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-widest mb-2">New Password</label>
                  <input
                    type="password"
                    value={securityData.newPassword}
                    onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-parchment border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:border-gold transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-widest mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={securityData.confirmPassword}
                    onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 bg-parchment border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:border-gold transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                onClick={handleSecuritySave}
                className="mt-6 px-6 py-3 bg-gold text-charcoal hover:bg-gold-dark rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Update Password
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-charcoal/5 p-6 shadow-sm">
              <h3 className="font-bold text-charcoal text-lg mb-4">Two-Factor Authentication</h3>
              <p className="text-sm text-charcoal/60 mb-4">
                Add an extra layer of security to your account by enabling two-factor authentication.
              </p>
              <button className="px-6 py-3 border border-charcoal/20 text-charcoal hover:bg-charcoal/5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors">
                Enable 2FA
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'notifications' && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl border border-charcoal/5 p-6 shadow-sm">
              <h3 className="font-bold text-charcoal text-lg mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { key: 'emailBookings', label: 'Email: Booking Confirmations', desc: 'Receive email notifications for booking updates' },
                  { key: 'emailPromotions', label: 'Email: Promotions & Offers', desc: 'Receive promotional emails and special offers' },
                  { key: 'pushBookings', label: 'Push: Booking Alerts', desc: 'Receive push notifications for booking status changes' },
                  { key: 'pushMessages', label: 'Push: Messages', desc: 'Receive push notifications for new messages' },
                  { key: 'smsAlerts', label: 'SMS: Critical Alerts', desc: 'Receive SMS for urgent booking issues' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-parchment rounded-xl">
                    <div>
                      <p className="font-bold text-charcoal text-sm">{label}</p>
                      <p className="text-xs text-charcoal/50 mt-1">{desc}</p>
                    </div>
                    <button
                      onClick={() => setNotificationPrefs({ ...notificationPrefs, [key]: !notificationPrefs[key as keyof typeof notificationPrefs] })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        notificationPrefs[key as keyof typeof notificationPrefs] ? 'bg-gold' : 'bg-charcoal/20'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                        notificationPrefs[key as keyof typeof notificationPrefs] ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleNotificationSave}
                className="mt-6 px-6 py-3 bg-gold text-charcoal hover:bg-gold-dark rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Save Preferences
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'preferences' && (
          <motion.div
            key="preferences"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl border border-charcoal/5 p-6 shadow-sm">
              <h3 className="font-bold text-charcoal text-lg mb-6">General Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-widest mb-2">Language</label>
                  <select
                    value={preferenceData.language}
                    onChange={(e) => setPreferenceData({ ...preferenceData, language: e.target.value })}
                    className="w-full px-4 py-3 bg-parchment border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:border-gold transition-colors"
                  >
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-widest mb-2">Currency</label>
                  <select
                    value={preferenceData.currency}
                    onChange={(e) => setPreferenceData({ ...preferenceData, currency: e.target.value })}
                    className="w-full px-4 py-3 bg-parchment border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:border-gold transition-colors"
                  >
                    <option value="NGN">Nigerian Naira (₦)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-charcoal/60 uppercase tracking-widest mb-2">Timezone</label>
                  <select
                    value={preferenceData.timezone}
                    onChange={(e) => setPreferenceData({ ...preferenceData, timezone: e.target.value })}
                    className="w-full px-4 py-3 bg-parchment border border-charcoal/10 rounded-xl text-sm focus:outline-none focus:border-gold transition-colors"
                  >
                    <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handlePreferenceSave}
                className="mt-6 px-6 py-3 bg-gold text-charcoal hover:bg-gold-dark rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Preferences
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
