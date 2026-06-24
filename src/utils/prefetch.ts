import { preload } from 'react-dom';

export const prefetchDashboard = (dashboard: 'user' | 'service' | 'admin' | 'super-admin') => {
  if (typeof window === 'undefined') return;

  const moduleMap = {
    'user': () => import('../portals/UserDashboard'),
    'service': () => import('../portals/ServiceProviderDashboard'),
    'admin': () => import('../portals/AdminDashboard'),
    'super-admin': () => import('../portals/SuperAdminDashboard'),
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      moduleMap[dashboard]();
    });
  } else {
    setTimeout(() => {
      moduleMap[dashboard]();
    }, 200);
  }
};

export const prefetchOnHover = (dashboard: 'user' | 'service' | 'admin' | 'super-admin') => {
  return {
    onMouseEnter: () => prefetchDashboard(dashboard),
    onFocus: () => prefetchDashboard(dashboard),
  };
};
