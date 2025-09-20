import { User } from './types';

// Get current user from session - always returns a demo user
export async function getCurrentUser(): Promise<Omit<User, 'password'>> {
  // Return a demo user
  return {
    id: "1",
    name: "Demo User",
    email: "user@example.com",
    role: "admin",
    createdAt: new Date("2023-01-01")
  };
}

// Check if user is authenticated - always returns true
export async function isAuthenticated() {
  return true;
}

// Check if user has required role
export async function hasRole(role: string | string[]) {
  const user = await getCurrentUser();
  
  if (!user) {
    return false;
  }
  
  if (Array.isArray(role)) {
    return role.includes(user.role);
  }
  
  return user.role === role;
} 