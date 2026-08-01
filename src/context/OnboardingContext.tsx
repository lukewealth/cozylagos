import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../auth';

export type UserRole = 'guest' | 'user' | 'service_provider' | 'admin' | 'super_admin';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  targetElement?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  role: UserRole[];
  order: number;
}

interface OnboardingContextType {
  currentStep: number;
  isActive: boolean;
  isComplete: boolean;
  hasSeenOnboarding: boolean;
  startOnboarding: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
  getStepsForRole: (role: UserRole) => OnboardingStep[];
  totalSteps: number;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  // Guest Steps
  {
    id: 'guest-welcome',
    title: 'Welcome to Cozy Lagos',
    description: 'Discover luxury accommodations, VIP services, and curated experiences in Lagos. Let us show you around.',
    role: ['guest'],
    order: 1,
  },
  {
    id: 'guest-explore',
    title: 'Explore Properties',
    description: 'Browse our curated collection of luxury residences. Hover over any property to learn more.',
    targetElement: '.property-card',
    position: 'bottom',
    role: ['guest'],
    order: 2,
  },
  {
    id: 'guest-services',
    title: 'VIP Services',
    description: 'Enhance your stay with premium services. From private chefs to yacht charters.',
    targetElement: '.services-section',
    position: 'left',
    role: ['guest'],
    order: 3,
  },
  {
    id: 'guest-cart',
    title: 'Build Your Experience',
    description: 'Add properties, services, and experiences to your cart. Checkout as a guest or create an account.',
    targetElement: '.cart-button',
    position: 'left',
    role: ['guest'],
    order: 4,
  },
  {
    id: 'guest-signup',
    title: 'Join Cozy Lagos',
    description: 'Create an account to save favorites, track bookings, and unlock exclusive member benefits.',
    targetElement: '.signup-button',
    position: 'bottom',
    role: ['guest'],
    order: 5,
  },

  // User Steps
  {
    id: 'user-dashboard',
    title: 'Your Dashboard',
    description: 'Welcome back! Here you can manage your bookings, favorites, and profile settings.',
    role: ['user'],
    order: 1,
  },
  {
    id: 'user-bookings',
    title: 'Track Your Bookings',
    description: 'View all your upcoming and past bookings. Track status and access booking details.',
    targetElement: '.bookings-section',
    position: 'right',
    role: ['user'],
    order: 2,
  },
  {
    id: 'user-favorites',
    title: 'Save Favorites',
    description: 'Heart any property or experience to save it to your favorites for quick access later.',
    targetElement: '.favorite-button',
    position: 'left',
    role: ['user'],
    order: 3,
  },
  {
    id: 'user-cart',
    title: 'Smart Cart',
    description: 'Your cart remembers everything. Add properties, services, and experiences, then checkout in one go.',
    targetElement: '.cart-button',
    position: 'left',
    role: ['user'],
    order: 4,
  },
  {
    id: 'user-profile',
    title: 'Profile Settings',
    description: 'Update your profile, payment methods, and notification preferences anytime.',
    targetElement: '.profile-button',
    position: 'bottom',
    role: ['user'],
    order: 5,
  },

  // Service Provider Steps
  {
    id: 'sp-dashboard',
    title: 'Provider Dashboard',
    description: 'Manage your services, bookings, and earnings from one central hub.',
    role: ['service_provider'],
    order: 1,
  },
  {
    id: 'sp-services',
    title: 'Your Services',
    description: 'Create and manage your service offerings. Set availability, pricing, and descriptions.',
    targetElement: '.sp-services-section',
    position: 'right',
    role: ['service_provider'],
    order: 2,
  },
  {
    id: 'sp-bookings',
    title: 'Booking Requests',
    description: 'Review and accept booking requests from guests. Communicate directly through the platform.',
    targetElement: '.sp-bookings-section',
    position: 'right',
    role: ['service_provider'],
    order: 3,
  },
  {
    id: 'sp-earnings',
    title: 'Track Earnings',
    description: 'Monitor your revenue, view payout history, and track performance metrics.',
    targetElement: '.sp-earnings-section',
    position: 'right',
    role: ['service_provider'],
    order: 4,
  },
  {
    id: 'sp-analytics',
    title: 'Performance Analytics',
    description: 'View detailed analytics on bookings, guest satisfaction, and service performance.',
    targetElement: '.sp-analytics-section',
    position: 'right',
    role: ['service_provider'],
    order: 5,
  },

  // Admin Steps
  {
    id: 'admin-overview',
    title: 'Admin Control Center',
    description: 'Full platform oversight. Manage users, providers, bookings, and system settings.',
    role: ['admin', 'super_admin'],
    order: 1,
  },
  {
    id: 'admin-users',
    title: 'User Management',
    description: 'View and manage all platform users. Handle accounts, permissions, and support requests.',
    targetElement: '.admin-users-section',
    position: 'right',
    role: ['admin', 'super_admin'],
    order: 2,
  },
  {
    id: 'admin-providers',
    title: 'Provider Oversight',
    description: 'Manage service providers, review applications, and monitor service quality.',
    targetElement: '.admin-providers-section',
    position: 'right',
    role: ['admin', 'super_admin'],
    order: 3,
  },
  {
    id: 'admin-bookings',
    title: 'All Bookings',
    description: 'Monitor all platform bookings. Handle disputes, process refunds, and ensure quality.',
    targetElement: '.admin-bookings-section',
    position: 'right',
    role: ['admin', 'super_admin'],
    order: 4,
  },
  {
    id: 'admin-analytics',
    title: 'Platform Analytics',
    description: 'Comprehensive analytics on revenue, user growth, booking trends, and platform health.',
    targetElement: '.admin-analytics-section',
    position: 'right',
    role: ['admin', 'super_admin'],
    order: 5,
  },
];

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(`cozy_lagos_onboarding_seen_${currentUser?.role || 'guest'}`);
    if (seen) {
      setHasSeenOnboarding(true);
      setIsComplete(true);
    }
  }, [currentUser]);

  const getStepsForRole = useCallback((role: UserRole): OnboardingStep[] => {
    return ONBOARDING_STEPS
      .filter(step => step.role.includes(role))
      .sort((a, b) => a.order - b.order);
  }, []);

  const steps = getStepsForRole(currentUser?.role as UserRole || 'guest');
  const totalSteps = steps.length;

  const startOnboarding = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
    setIsComplete(false);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  }, [currentStep, totalSteps]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const skipOnboarding = useCallback(() => {
    setIsActive(false);
    setHasSeenOnboarding(true);
    localStorage.setItem(`cozy_lagos_onboarding_seen_${currentUser?.role || 'guest'}`, 'true');
  }, [currentUser]);

  const completeOnboarding = useCallback(() => {
    setIsActive(false);
    setIsComplete(true);
    setHasSeenOnboarding(true);
    localStorage.setItem(`cozy_lagos_onboarding_seen_${currentUser?.role || 'guest'}`, 'true');
  }, [currentUser]);

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        isActive,
        isComplete,
        hasSeenOnboarding,
        startOnboarding,
        nextStep,
        prevStep,
        skipOnboarding,
        completeOnboarding,
        getStepsForRole,
        totalSteps,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};
