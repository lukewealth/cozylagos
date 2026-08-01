import React from 'react';
import { useAuth } from '../auth';
import { Shield, Lock, AlertCircle } from 'lucide-react';

type UserRole = 'guest' | 'user' | 'service_provider' | 'admin' | 'super_admin';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showAccessDenied?: boolean;
}

export function RoleGuard({ 
  allowedRoles, 
  children, 
  fallback = null,
  showAccessDenied = true 
}: RoleGuardProps) {
  const { currentUser, isAuthenticated } = useAuth();
  
  const userRole = currentUser?.role as UserRole || 'guest';
  const hasAccess = allowedRoles.includes(userRole);

  if (!hasAccess) {
    if (fallback) return <>{fallback}</>;
    
    if (showAccessDenied) {
      return (
        <div className="flex items-center justify-center min-h-[400px] p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="font-serif text-xl font-bold text-charcoal mb-2">
              Access Restricted
            </h3>
            <p className="text-charcoal/60 text-sm mb-4">
              This section is only available to {allowedRoles.map(r => r.replace('_', ' ')).join(' or ')} users.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal/5 rounded-full">
              <Shield className="w-4 h-4 text-charcoal/40" />
              <span className="text-xs font-medium text-charcoal/60">
                Current role: {userRole.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  }

  return <>{children}</>;
}

// Hook for role-based conditional rendering
export function useRoleAccess() {
  const { currentUser, isAuthenticated } = useAuth();
  const userRole = currentUser?.role as UserRole || 'guest';

  const hasRole = (role: UserRole | UserRole[]) => {
    if (Array.isArray(role)) {
      return role.includes(userRole);
    }
    return userRole === role;
  };

  const isGuest = userRole === 'guest';
  const isUser = userRole === 'user';
  const isServiceProvider = userRole === 'service_provider';
  const isAdmin = userRole === 'admin';
  const isSuperAdmin = userRole === 'super_admin';
  const isStaff = isAdmin || isSuperAdmin;

  return {
    userRole,
    hasRole,
    isGuest,
    isUser,
    isServiceProvider,
    isAdmin,
    isSuperAdmin,
    isStaff,
    isAuthenticated,
  };
}

// Component to show content only to specific roles
interface RoleOnlyProps {
  role: UserRole | UserRole[];
  children: React.ReactNode;
}

export function RoleOnly({ role, children }: RoleOnlyProps) {
  const { hasRole } = useRoleAccess();
  
  if (!hasRole(role)) return null;
  
  return <>{children}</>;
}

// Component to hide content from specific roles
interface RoleExcludeProps {
  role: UserRole | UserRole[];
  children: React.ReactNode;
}

export function RoleExclude({ role, children }: RoleExcludeProps) {
  const { hasRole } = useRoleAccess();
  
  if (hasRole(role)) return null;
  
  return <>{children}</>;
}

// Security badge component
interface SecurityBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
}

export function SecurityBadge({ role, size = 'md' }: SecurityBadgeProps) {
  const config = {
    guest: { color: 'bg-charcoal/10 text-charcoal/60', icon: Shield, label: 'Guest' },
    user: { color: 'bg-blue-50 text-blue-600', icon: Shield, label: 'Member' },
    service_provider: { color: 'bg-gold/10 text-gold-dark', icon: Shield, label: 'Provider' },
    admin: { color: 'bg-purple-50 text-purple-600', icon: Shield, label: 'Admin' },
    super_admin: { color: 'bg-red-50 text-red-600', icon: Shield, label: 'Super Admin' },
  };

  const { color, icon: Icon, label } = config[role];
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${color} ${sizeClasses[size]}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}
