import { NextResponse } from 'next/server';

export async function GET() {
  // Return a demo user without authentication
  return NextResponse.json({
    success: true,
    user: {
      id: "1",
      name: "Demo User",
      email: "user@example.com",
      role: "admin",
      createdAt: "2023-01-01T00:00:00.000Z"
    }
  });
} 