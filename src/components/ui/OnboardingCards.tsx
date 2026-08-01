import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { useOnboarding } from '../../context/OnboardingContext';
import { useAuth } from '../../auth';

export default function OnboardingCards() {
  const { isActive, currentStep, totalSteps, nextStep, prevStep, skipOnboarding } = useOnboarding();
  const { currentUser } = useAuth();

  const steps = getStepsForRole(currentUser?.role as any || 'guest');
  const currentStepData = steps[currentStep];

  if (!isActive || !currentStepData) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={skipOnboarding}
        />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={skipOnboarding}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-charcoal/5 flex items-center justify-center hover:bg-charcoal/10 transition-colors z-10"
          >
            <X className="w-4 h-4 text-charcoal/60" />
          </button>

          {/* Progress bar */}
          <div className="h-1 bg-charcoal/5">
            <motion.div
              className="h-full bg-gradient-to-r from-gold to-gold-dark"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Icon */}
            <motion.div
              key={currentStepData.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center mx-auto mb-6"
            >
              <StepIcon stepId={currentStepData.id} />
            </motion.div>

            {/* Title */}
            <motion.h2
              key={`title-${currentStepData.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="font-serif text-2xl font-bold text-charcoal text-center mb-3"
            >
              {currentStepData.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              key={`desc-${currentStepData.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-charcoal/60 text-sm text-center leading-relaxed mb-8"
            >
              {currentStepData.description}
            </motion.p>

            {/* Step indicators */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'w-8 bg-gold'
                      : index < currentStep
                      ? 'w-1.5 bg-gold/50'
                      : 'w-1.5 bg-charcoal/10'
                  }`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <button
                  onClick={prevStep}
                  className="flex-1 py-3 border border-charcoal/10 text-charcoal/60 text-sm font-semibold rounded-xl hover:bg-charcoal/5 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={nextStep}
                className="flex-[2] py-3 bg-charcoal text-parchment text-sm font-semibold rounded-xl hover:bg-gold-dark transition-colors flex items-center justify-center gap-2"
              >
                {currentStep === totalSteps - 1 ? (
                  <>
                    <Check className="w-4 h-4" />
                    Get Started
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Skip link */}
            <button
              onClick={skipOnboarding}
              className="w-full mt-4 py-2 text-charcoal/40 text-xs font-medium hover:text-charcoal/60 transition-colors"
            >
              Skip tutorial
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function StepIcon({ stepId }: { stepId: string }) {
  const iconClass = 'w-8 h-8 text-gold-dark';

  switch (stepId) {
    case 'guest-welcome':
    case 'user-dashboard':
    case 'sp-dashboard':
    case 'admin-overview':
      return <Sparkles className={iconClass} />;
    case 'guest-explore':
    case 'user-bookings':
    case 'sp-services':
    case 'admin-users':
      return <Shield className={iconClass} />;
    case 'guest-services':
    case 'user-favorites':
    case 'sp-bookings':
    case 'admin-providers':
      return <Zap className={iconClass} />;
    default:
      return <Sparkles className={iconClass} />;
  }
}

function getStepsForRole(role: string) {
  const steps = [
    // Guest
    { id: 'guest-welcome', title: 'Welcome to Cozy Lagos', description: 'Discover luxury accommodations, VIP services, and curated experiences in Lagos.', role: 'guest' },
    { id: 'guest-explore', title: 'Explore Properties', description: 'Browse our curated collection of luxury residences. Hover over any property to learn more.', role: 'guest' },
    { id: 'guest-services', title: 'VIP Services', description: 'Enhance your stay with premium services. From private chefs to yacht charters.', role: 'guest' },
    { id: 'guest-cart', title: 'Build Your Experience', description: 'Add properties, services, and experiences to your cart. Checkout as a guest or create an account.', role: 'guest' },
    { id: 'guest-signup', title: 'Join Cozy Lagos', description: 'Create an account to save favorites, track bookings, and unlock exclusive member benefits.', role: 'guest' },
    
    // User
    { id: 'user-dashboard', title: 'Your Dashboard', description: 'Welcome back! Here you can manage your bookings, favorites, and profile settings.', role: 'user' },
    { id: 'user-bookings', title: 'Track Your Bookings', description: 'View all your upcoming and past bookings. Track status and access booking details.', role: 'user' },
    { id: 'user-favorites', title: 'Save Favorites', description: 'Heart any property or experience to save it to your favorites for quick access later.', role: 'user' },
    { id: 'user-cart', title: 'Smart Cart', description: 'Your cart remembers everything. Add properties, services, and experiences, then checkout in one go.', role: 'user' },
    { id: 'user-profile', title: 'Profile Settings', description: 'Update your profile, payment methods, and notification preferences anytime.', role: 'user' },
    
    // Service Provider
    { id: 'sp-dashboard', title: 'Provider Dashboard', description: 'Manage your services, bookings, and earnings from one central hub.', role: 'service_provider' },
    { id: 'sp-services', title: 'Your Services', description: 'Create and manage your service offerings. Set availability, pricing, and descriptions.', role: 'service_provider' },
    { id: 'sp-bookings', title: 'Booking Requests', description: 'Review and accept booking requests from guests. Communicate directly through the platform.', role: 'service_provider' },
    { id: 'sp-earnings', title: 'Track Earnings', description: 'Monitor your revenue, view payout history, and track performance metrics.', role: 'service_provider' },
    { id: 'sp-analytics', title: 'Performance Analytics', description: 'View detailed analytics on bookings, guest satisfaction, and service performance.', role: 'service_provider' },
    
    // Admin
    { id: 'admin-overview', title: 'Admin Control Center', description: 'Full platform oversight. Manage users, providers, bookings, and system settings.', role: 'admin' },
    { id: 'admin-users', title: 'User Management', description: 'View and manage all platform users. Handle accounts, permissions, and support requests.', role: 'admin' },
    { id: 'admin-providers', title: 'Provider Oversight', description: 'Manage service providers, review applications, and monitor service quality.', role: 'admin' },
    { id: 'admin-bookings', title: 'All Bookings', description: 'Monitor all platform bookings. Handle disputes, process refunds, and ensure quality.', role: 'admin' },
    { id: 'admin-analytics', title: 'Platform Analytics', description: 'Comprehensive analytics on revenue, user growth, booking trends, and platform health.', role: 'admin' },
  ];

  return steps.filter(s => s.role === role);
}
