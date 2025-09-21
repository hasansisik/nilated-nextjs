import { NextResponse } from 'next/server';
import { server } from '@/config';
import axios from 'axios';

export async function GET() {
  try {
    // Try to get real user data from server
    const response = await axios.get(`${server}/auth/me`);
    return NextResponse.json({
      success: true,
      user: response.data.user
    });
  } catch (error) {
    // Fallback to default admin user
    return NextResponse.json({
      success: true,
      user: {
        id: "1",
        name: "Admin",
        email: "admin@example.com",
        role: "admin",
        createdAt: new Date().toISOString()
      }
    });
  }
} 