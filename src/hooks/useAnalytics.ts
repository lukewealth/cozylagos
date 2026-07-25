import { useEffect } from 'react';

interface AnalyticsEvent {
  event: string;
  category: string;
  label?: string;
  value?: number;
  timestamp: number;
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
      
      // Store in localStorage for later sync
      const analytics = JSON.parse(localStorage.getItem('cozy_lagos_analytics') || '[]');
      analytics.push(event);
      localStorage.setItem('cozy_lagos_analytics', JSON.stringify(analytics));
    };

    trackPageView();

    // Track user interactions
    const trackClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const event: AnalyticsEvent = {
        event: 'click',
        category: target.tagName.toLowerCase(),
        label: target.textContent?.substring(0, 50) || target.className,
        timestamp: Date.now(),
      };
      
      const analytics = JSON.parse(localStorage.getItem('cozy_lagos_analytics') || '[]');
      analytics.push(event);
      
      // Keep only last 100 events
      if (analytics.length > 100) {
        analytics.shift();
      }
      
      localStorage.setItem('cozy_lagos_analytics', JSON.stringify(analytics));
    };

    document.addEventListener('click', trackClick);

    return () => {
      document.removeEventListener('click', trackClick);
    };
  }, []);

  const trackEvent = (event: string, category: string, label?: string, value?: number) => {
    const analyticsEvent: AnalyticsEvent = {
      event,
      category,
      label,
      value,
      timestamp: Date.now(),
    };
    
    const analytics = JSON.parse(localStorage.getItem('cozy_lagos_analytics') || '[]');
    analytics.push(analyticsEvent);
    localStorage.setItem('cozy_lagos_analytics', JSON.stringify(analytics));
  };

  return { trackEvent };
}
