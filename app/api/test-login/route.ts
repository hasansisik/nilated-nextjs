import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // No actual login since there's no authentication
  return NextResponse.json({
    success: true,
    user: {
      id: "1",
      name: "Demo User",
      email: "user@example.com",
      role: "admin"
    }
  });
} 