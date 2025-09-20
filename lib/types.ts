export type UserRole = 'admin' | 'editor' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // This would be hashed in a real application
  role: UserRole;
  createdAt: Date;
}

export interface Session {
  user: Omit<User, 'password'>;
  expires: Date;
} 