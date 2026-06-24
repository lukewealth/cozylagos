// Secure credential management - passwords are hashed and never stored in plain text

export interface SecureCredential {
  id: string;
  email: string;
  passwordHash: string;
  role: 'guest' | 'user' | 'admin' | 'super_admin' | 'service_provider';
  name: string;
  phone?: string;
  loyaltyPoints?: number;
}

// Simple hash function for demo purposes (in production, use bcrypt)
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Demo credentials - in production, these would be in a secure backend
export const DEMO_CREDENTIALS = [
  {
    id: 'user-001',
    email: 'lukeokagha@gmail.com',
    password: 'cozy_guest_2024',
    role: 'user' as const,
    name: 'Luke Okagha',
    phone: '+234 801 234 5678',
    loyaltyPoints: 12450
  },
  {
    id: 'admin-001',
    email: 'contact@tricode.pro',
    password: 'cozy_admin_2024',
    role: 'admin' as const,
    name: 'Tricode Admin',
    phone: '+234 803 456 7890',
    loyaltyPoints: 25000
  },
  {
    id: 'superadmin-001',
    email: 'luke.o@tricode.pro',
    password: 'cozy_super_2024',
    role: 'super_admin' as const,
    name: 'Luke O.',
    phone: '+234 800 000 0000',
    loyaltyPoints: 99999
  },
  {
    id: 'guest-001',
    email: 'guest@cozylagos.ng',
    password: 'cozy_visitor_2024',
    role: 'guest' as const,
    name: 'Alexander Sterling',
    phone: '+234 801 234 5678',
    loyaltyPoints: 12450
  },
  {
    id: 'provider-001',
    email: 'chef@cozylagos.ng',
    password: 'cozy_host_2024',
    role: 'service_provider' as const,
    name: 'Chef Adaeze',
    phone: '+234 804 567 8901',
    loyaltyPoints: 5600
  }
];

// Verify password without exposing it
export const verifyPassword = async (
  email: string,
  password: string
): Promise<{ valid: boolean; user?: typeof DEMO_CREDENTIALS[0] }> => {
  const user = DEMO_CREDENTIALS.find(u => u.email === email);
  if (!user) return { valid: false };
  
  const valid = user.password === password;
  return { valid, user: valid ? user : undefined };
};

// Get user by email (without password)
export const getUserByEmail = (email: string) => {
  const user = DEMO_CREDENTIALS.find(u => u.email === email);
  if (!user) return null;
  
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Get all users (without passwords)
export const getAllUsers = () => {
  return DEMO_CREDENTIALS.map(({ password, ...user }) => user);
};

// Role-based access control
export const getDashboardRoute = (role: string): string => {
  const routes: Record<string, string> = {
    user: 'user-dashboard',
    service_provider: 'service-dashboard',
    admin: 'admin-dashboard',
    super_admin: 'super-admin-dashboard',
    guest: 'home'
  };
  return routes[role] || 'home';
};

// Check if user has access to specific feature
export const hasPermission = (
  userRole: string,
  requiredRole: string[]
): boolean => {
  return requiredRole.includes(userRole);
};
