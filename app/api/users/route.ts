import { getCurrentUser } from '@/lib/auth';
import { createUser, findUserByEmail, users } from '@/lib/db';
import { UserRole } from '@/lib/types';
import { NextResponse } from 'next/server';

// Get all users - accessible to all authenticated users
export async function GET() {
  try {
    // Return users without passwords
    const safeUsers = users.map(user => ({
      ...user,
      password: undefined
    }));
    
    return NextResponse.json({ success: true, users: safeUsers });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while getting users' },
      { status: 500 }
    );
  }
}

// Create a new user - accessible to all authenticated users
export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();
    
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }
    
    // Validate role
    const validRole = ['admin', 'editor', 'user'].includes(role) ? role as UserRole : 'user';
    
    try {
      const newUser = createUser(name, email, password, validRole);
      
      return NextResponse.json({
        success: true,
        user: { ...newUser, password: undefined }
      });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while creating user' },
      { status: 500 }
    );
  }
} 