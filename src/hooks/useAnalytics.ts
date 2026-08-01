import { useEffect, useCallback } from 'react';
import { analytics as firebaseAnalytics } from '../lib/firebase';
import { logEvent } from 'firebase/analytics';

interface AnalyticsEvent {
  event: string;
  category: string;
  label?: string;
  value?: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

export function useAnalytics() {
  useEffect(() => {
    // Track page views
    const trackPageView = () => {
      const event: AnalyticsEvent = {
        event: 'page_view',
        category: 'navigation',
        label: window.location.pathname,
        timestamp: Date.now(),
      };
      
      // Send to Firebase Analytics
      if (firebaseAnalytics) {
        logEvent(firebaseAnalytics, 'page_view', {
          page_path: window.location.pathname,
          page_location: window.location.href,
          page_title: document.title,
        });
      }
      
      // Store in localStorage for later sync
      const analytics = JSON.parse(localStorage.getItem('cozy_lagos_analytics') || '[]');
      analytics.push(event);
      localStorage.setItem('cozy_lagos_analytics', JSON.stringify(analytics.slice(-100)));
    };

    trackPageView();

    // Track scroll depth
    let maxScrollDepth = 0;
    const trackScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        if (scrollPercent % 25 === 0) {
          trackEvent('scroll_depth', 'engagement', `${scrollPercent}%`, scrollPercent);
        }
      }
    };

    // Track user interactions
    const trackClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const event: AnalyticsEvent = {
        event: 'click',
        category: target.tagName.toLowerCase(),
        label: target.textContent?.substring(0, 50) || target.className,
        timestamp: Date.now(),
      };
      
      // Send to Firebase Analytics
      if (firebaseAnalytics) {
        logEvent(firebaseAnalytics, 'user_interaction', {
          interaction_type: 'click',
          element_type: target.tagName.toLowerCase(),
          element_text: target.textContent?.substring(0, 50),
          page_path: window.location.pathname,
        });
      }
      
      const analytics = JSON.parse(localStorage.getItem('cozy_lagos_analytics') || '[]');
      analytics.push(event);
      localStorage.setItem('cozy_lagos_analytics', JSON.stringify(analytics.slice(-100)));
    };

    // Track session duration
    const sessionStart = Date.now();
    const trackSessionEnd = () => {
      const duration = Math.round((Date.now() - sessionStart) / 1000);
      trackEvent('session_end', 'engagement', 'duration', duration);
    };

    window.addEventListener('scroll', trackScroll);
    document.addEventListener('click', trackClick);
    window.addEventListener('beforeunload', trackSessionEnd);

    return () => {
      window.removeEventListener('scroll', trackScroll);
      document.removeEventListener('click', trackClick);
      window.removeEventListener('beforeunload', trackSessionEnd);
    };
  }, []);

  const trackEvent = useCallback((event: string, category: string, label?: string, value?: number, metadata?: Record<string, any>) => {
    const analyticsEvent: AnalyticsEvent = {
      event,
      category,
      label,
      value,
      timestamp: Date.now(),
      metadata,
    };
    
    // Send to Firebase Analytics
    if (firebaseAnalytics) {
      const firebaseEventName = event.replace(/\s+/g, '_').toLowerCase();
      logEvent(firebaseAnalytics, firebaseEventName, {
        event_category: category,
        event_label: label,
        value: value,
        ...metadata,
      });
    }
    
    // Store in localStorage
    const analytics = JSON.parse(localStorage.getItem('cozy_lagos_analytics') || '[]');
    analytics.push(analyticsEvent);
    localStorage.setItem('cozy_lagos_analytics', JSON.stringify(analytics.slice(-100)));
  }, []);

  // Track specific user actions
  const trackBooking = useCallback((listingId: string, listingTitle: string, amount: number) => {
    trackEvent('booking_initiated', 'conversion', listingTitle, amount, { listing_id: listingId });
  }, [trackEvent]);

  const trackBookingComplete = useCallback((bookingId: string, amount: number) => {
    trackEvent('booking_completed', 'conversion', bookingId, amount);
  }, [trackEvent]);

  const trackAddToCart = useCallback((itemId: string, itemTitle: string, category: string) => {
    trackEvent('add_to_cart', 'engagement', itemTitle, undefined, { item_id: itemId, category });
  }, [trackEvent]);

  const trackSearch = useCallback((query: string, resultsCount: number) => {
    trackEvent('search', 'engagement', query, resultsCount);
  }, [trackEvent]);

  const trackLogin = useCallback((method: string) => {
    trackEvent('login', 'authentication', method);
  }, [trackEvent]);

  const trackSignup = useCallback((method: string) => {
    trackEvent('sign_up', 'authentication', method);
  }, [trackEvent]);

  const trackShare = useCallback((contentType: string, contentId: string) => {
    trackEvent('share', 'engagement', contentType, undefined, { content_id: contentId });
  }, [trackEvent]);

  return { 
    trackEvent,
    trackBooking,
    trackBookingComplete,
    trackAddToCart,
    trackSearch,
    trackLogin,
    trackSignup,
    trackShare,
  };
}
