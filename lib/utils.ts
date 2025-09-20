import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { UserRole } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hasRole(user: any, requiredRole: UserRole | UserRole[]): boolean {
  if (!user || !user.role) {
    return false;
  }

  const userRole = user.role;
  
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole as UserRole);
  }
  
  return userRole === requiredRole;
}
