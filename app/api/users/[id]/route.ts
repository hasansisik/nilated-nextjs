import { getCurrentUser } from '@/lib/auth';
import { findUserById, users } from '@/lib/db';
import { NextResponse } from 'next/server';

// Delete user - accessible to all authenticated users
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    // Check if user exists
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Remove the user from our in-memory store
    users.splice(userIndex, 1);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while deleting user' },
      { status: 500 }
    );
  }
} 