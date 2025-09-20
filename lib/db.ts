import { User, UserRole } from './types';
import { v4 as uuidv4 } from 'uuid';

// In a real app, this would be a database connection
// For this example, we'll use in-memory storage
export let users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    // In a real app, this would be hashed
    password: 'admin123',
    role: 'admin',
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Editor User',
    email: 'editor@example.com',
    password: 'editor123',
    role: 'editor',
    createdAt: new Date(),
  },
];

// Session storage (in memory)
type SessionData = {
  [key: string]: {
    userId: string;
    expires: Date;
  };
};

let sessions: SessionData = {};

// User functions
export const findUserByEmail = (email: string) => {
  return users.find(user => user.email === email);
};

export const findUserById = (id: string) => {
  return users.find(user => user.id === id);
};

export const createUser = (
  name: string,
  email: string,
  password: string,
  role: UserRole = 'user'
) => {
  const existingUser = findUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  const newUser: User = {
    id: uuidv4(),
    name,
    email,
    password, // In a real app, this would be hashed
    role,
    createdAt: new Date(),
  };

  users.push(newUser);
  return { ...newUser, password: undefined };
};

// Session functions
export const createSession = (userId: string) => {
  const sessionId = uuidv4();
  const expires = new Date();
  expires.setDate(expires.getDate() + 7); // 7 days from now

  sessions[sessionId] = {
    userId,
    expires,
  };

  return { sessionId, expires };
};

export const getSession = (sessionId: string) => {
  const session = sessions[sessionId];
  
  if (!session) return null;
  if (new Date() > session.expires) {
    // Session expired
    delete sessions[sessionId];
    return null;
  }

  const user = findUserById(session.userId);
  if (!user) return null;

  return {
    user: { ...user, password: undefined },
    expires: session.expires,
  };
};

export const deleteSession = (sessionId: string) => {
  delete sessions[sessionId];
}; 