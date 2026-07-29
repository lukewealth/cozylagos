import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User, Mail, Phone, Lock, Camera, Save, X,
  Shield, Bell, Moon, Sun, Globe, CreditCard,
  CheckCircle, AlertCircle, RefreshCw
} from 'lucide-react';
import { useAuth } from '../auth';
import { useDatabase } from '../hooks/useDatabase';
import { showToast } from './ui/Toast';
import UniversalModal from './ui/UniversalModal';
import { ThemeToggle, useTheme } from './ThemeToggle';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  preferences?: {
    notifications?: boolean;
    newsletter?: boolean;
    theme?: 'light' | 'dark';
    language?: string;
  };
}

export default function UserSettings() {
  const { currentUser, updateProfile, sendPasswordReset, resendVerificationEmail } = useAuth();
  const { updateRecord } = useDatabase('users');
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profile, setProfile] = useState<UserProfile>({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    avatar: currentUser?.avatar || '',
    bio: currentUser?.bio || '',
    location: currentUser?.location || '',
    preferences: {
      notifications: true,
      newsletter: true,
      theme: theme,
      language: 'en'
    }
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile(profile);
      await updateRecord(currentUser?.id || '', profile);
      showToast({ type: 'success', title: 'Profile Updated', message: 'Your profile has been updated successfully' });
      setIsEditing(false);
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast({ type: 'error', title: 'Error', message: 'Passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showToast({ type: 'error', title: 'Error', message: 'Password must be at least 8 characters' });
      return;
    }

    setIsSaving(true);
    try {
      await sendPasswordReset(currentUser?.email || '');
      showToast({ type: 'success', title: 'Password Reset', message: 'Password reset email sent' });
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to reset password' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await resendVerificationEmail();
      showToast({ type: 'success', title: 'Email Sent', message: 'Verification email sent successfully' });
    } catch (error) {
      showToast({ type: 'error', title: 'Error', message: 'Failed to send verification email' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <div className="bg-white rounded-2xl border border-charcoal/5 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-serif font-bold text-charcoal">Profile Settings</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gold text-charcoal font-bold text-xs uppercase rounded-lg hover:bg-gold-dark transition-all"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-charcoal/10 text-charcoal font-bold text-xs uppercase rounded-lg hover:bg-charcoal/5 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-4 py-2 bg-gold text-charcoal font-bold text-xs uppercase rounded-lg hover:bg-gold-dark transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-gold-dark" />
              )}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 p-2 bg-gold rounded-full hover:bg-gold-dark transition-colors">
                <Camera className="w-4 h-4 text-charcoal" />
              </button>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-charcoal">{profile.name}</h3>
            <p className="text-sm text-charcoal/60">{profile.email}</p>
            {!currentUser?.emailVerified && (
              <button
                onClick={handleResendVerification}
                className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3" />
                Verify Email
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:bg-charcoal/5"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm bg-charcoal/5"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={profile.phone || ''}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:bg-charcoal/5"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">
              Location
            </label>
            <input
              type="text"
              value={profile.location || ''}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:bg-charcoal/5"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">
            Bio
          </label>
          <textarea
            value={profile.bio || ''}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            disabled={!isEditing}
            rows={3}
            className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 disabled:bg-charcoal/5 resize-none"
          />
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-2xl border border-charcoal/5 p-6">
        <h2 className="text-lg font-serif font-bold text-charcoal mb-4">Security</h2>
        <div className="space-y-3">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full flex items-center justify-between p-4 border border-charcoal/10 rounded-xl hover:bg-charcoal/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-charcoal/60" />
              <div className="text-left">
                <p className="font-bold text-sm text-charcoal">Change Password</p>
                <p className="text-xs text-charcoal/60">Update your password</p>
              </div>
            </div>
            <span className="text-xs text-charcoal/40">→</span>
          </button>
          <div className="flex items-center justify-between p-4 border border-charcoal/10 rounded-xl">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-charcoal/60" />
              <div className="text-left">
                <p className="font-bold text-sm text-charcoal">Two-Factor Authentication</p>
                <p className="text-xs text-charcoal/60">Add an extra layer of security</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">Coming Soon</span>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="bg-white rounded-2xl border border-charcoal/5 p-6">
        <h2 className="text-lg font-serif font-bold text-charcoal mb-4">Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'light' ? <Sun className="w-5 h-5 text-charcoal/60" /> : <Moon className="w-5 h-5 text-charcoal/60" />}
              <div>
                <p className="font-bold text-sm text-charcoal">Theme</p>
                <p className="text-xs text-charcoal/60">Choose your preferred theme</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-charcoal/60" />
              <div>
                <p className="font-bold text-sm text-charcoal">Notifications</p>
                <p className="text-xs text-charcoal/60">Receive push notifications</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profile.preferences?.notifications}
                onChange={(e) => setProfile({
                  ...profile,
                  preferences: { ...profile.preferences, notifications: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-charcoal/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-charcoal/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-charcoal/60" />
              <div>
                <p className="font-bold text-sm text-charcoal">Newsletter</p>
                <p className="text-xs text-charcoal/60">Receive email updates</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profile.preferences?.newsletter}
                onChange={(e) => setProfile({
                  ...profile,
                  preferences: { ...profile.preferences, newsletter: e.target.checked }
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-charcoal/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-charcoal/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      <UniversalModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }}
        title="Change Password"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">
              New Password
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              placeholder="Enter new password"
              className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-charcoal/60 uppercase tracking-wider mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              placeholder="Confirm new password"
              className="w-full px-4 py-2 border border-charcoal/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
              }}
              disabled={isSaving}
              className="flex-1 py-3 border border-charcoal/10 text-charcoal font-bold text-xs uppercase rounded-lg hover:bg-charcoal/5 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordReset}
              disabled={isSaving || !passwordData.newPassword || !passwordData.confirmPassword}
              className="flex-[2] py-3 bg-gold text-charcoal font-bold text-xs uppercase rounded-lg hover:bg-gold-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Reset Password
                </>
              )}
            </button>
          </div>
        </div>
      </UniversalModal>
    </div>
  );
}
