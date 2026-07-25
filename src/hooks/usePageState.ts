import { useState, useEffect } from 'react';

interface PageState {
  activeTab: string;
  selectedListing?: string;
  timestamp: number;
}

export function usePageState() {
  const [pageState, setPageState] = useState<PageState>(() => {
    const saved = localStorage.getItem('cozy_lagos_page_state');
    return saved ? JSON.parse(saved) : { activeTab: 'home', timestamp: Date.now() };
  });

  useEffect(() => {
    localStorage.setItem('cozy_lagos_page_state', JSON.stringify(pageState));
  }, [pageState]);

  const updatePageState = (updates: Partial<PageState>) => {
    setPageState(prev => ({ ...prev, ...updates, timestamp: Date.now() }));
  };

  const clearPageState = () => {
    localStorage.removeItem('cozy_lagos_page_state');
    setPageState({ activeTab: 'home', timestamp: Date.now() });
  };

  return { pageState, updatePageState, clearPageState };
}
